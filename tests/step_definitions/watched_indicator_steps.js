import { createBdd } from 'playwright-bdd';
const { Given, When, Then } = createBdd();

const assert = require('assert');
const path = require('path');

const { getBaseUrl } = require('../../js/utils/testBaseUrl');

// Mapping of test video titles to their IDs in watched_indicator_videos.json
const videoIds = {
  'Introduction to AI': 'intro_ai',
  'Advanced Machine Learning': 'adv_ml',
  'Neural Networks Explained': 'nn_explained'
};

const testFile = 'watched_indicator_videos.json';

Given('I have previously watched the video {string}', async ({ page }, title) => {
  const id = videoIds[title];
  assert.ok(id, `Unknown test video title: ${title}`);
  await page.addInitScript((vid) => {
    const history = JSON.parse(localStorage.getItem('watchedHistory') || '[]');
    if (!history.includes(vid)) history.push(vid);
    const dates = JSON.parse(localStorage.getItem('watchedDates') || '{}');
    dates[vid] = new Date().toISOString();
    localStorage.setItem('watchedHistory', JSON.stringify(history));
    localStorage.setItem('watchedDates', JSON.stringify(dates));
  }, id);
});

Given('I have not watched the video {string}', async ({ page }, title) => {
  await page.addInitScript(() => {
    localStorage.removeItem('watchedHistory');
    localStorage.removeItem('watchedDates');
  });
  // If the page is already loaded, also clear immediately
  if (page.url() !== 'about:blank') {
    await page.evaluate(() => {
      localStorage.removeItem('watchedHistory');
      localStorage.removeItem('watchedDates');
    });
  }
});

When('I am on the main page', async ({ page }) => {
  await page.goto(getBaseUrl());
  await page.waitForSelector('#fileInput', { state: 'visible', timeout: 5000 });
  const fileInput = await page.locator('#fileInput');
  await fileInput.setInputFiles(testFile);
  await page.waitForSelector('#videoList .video-card', { state: 'visible', timeout: 5000 });
});

Given('the video {string} exists in the loaded data', async ({ page }, title) => {
  const card = page.locator('#videoList .video-card', { hasText: title });
  const count = await card.count();
  assert.ok(count > 0, `Video card with title "${title}" not found`);
});

When('I click the "Watch on YouTube" button for the video titled {string}', async ({ page }, title) => {
  // Prevent actual navigation
  await page.evaluate(() => {
    window.open = () => ({ closed: false, close() {}, focus() {}, blur() {} });
  });
  const card = page.locator('#videoList .video-card', { hasText: title });
  const button = card.locator('.watch-button');
  await button.click();
  await card.locator('.watched-indicator').waitFor({ state: 'visible' });
});

Then('I should see a "Watched" indicator on the video card for {string}', async ({ page }, title) => {
  const card = page.locator('#videoList .video-card', { hasText: title });
  const indicator = card.locator('.watched-indicator');
  await indicator.waitFor({ state: 'visible', timeout: 3000 });
  const text = await indicator.textContent();
  assert.strictEqual(text.trim(), 'Watched');
});

Then('I should not see a "Watched" indicator on the video card for {string}', async ({ page }, title) => {
  const card = page.locator('#videoList .video-card', { hasText: title });
  const count = await card.locator('.watched-indicator').count();
  assert.strictEqual(count, 0, 'Watched indicator should not be present');
});
