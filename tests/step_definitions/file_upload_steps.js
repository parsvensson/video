
import { createBdd } from 'playwright-bdd';
const { Given, When, Then } = createBdd();

const assert = require('assert');
const pathModule = require('path');

const { getBaseUrl } = require('../../js/utils/testBaseUrl');

Given('the user is on the application\'s main page', async ({ page }) => {
  // Navigate to the local file URL
  await page.goto(getBaseUrl());
  await page.waitForSelector('#fileInput', { timeout: 500 }); 
  const title = await page.title();
  assert.strictEqual(title, 'VideoBrowser - Your Personal Video Navigator');
});

When('the user selects the {string} file for upload', async ({ page }, fileName) => {
  const filePath = pathModule.join(__dirname, '..', '..', fileName); 
  const fileInput = await page.locator('#fileInput');
  await fileInput.setInputFiles(filePath);
});

Then('the video data from {string} should be loaded', async ({ page }, fileName) => {
  // Wait for the videoList container to have at least one child element, which should be a video card.
  await page.waitForSelector('#videoList > *', { timeout: 12000 });
});

Then('a list of videos should be displayed on the page', async ({ page }) => {
  await page.waitForSelector('#videoList .video-card', { timeout: 5000 });
  const videoCards = await page.locator('#videoList .video-card').count();
  assert.ok(videoCards > 0, 'No video cards were displayed on the page.');
});
