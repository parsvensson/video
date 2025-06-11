import { createBdd } from 'playwright-bdd';
const { Given, When, Then } = createBdd();

const assert = require('assert');

Given('the watch history is cleared', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.removeItem('watchedHistory');
    localStorage.removeItem('watchedDates');
  });
});

When('the user clicks the watch button for the first video', async ({ page }) => {
  await page.evaluate(() => {
    window.__openCalled = false;
    const original = window.open;
    window.open = function(...args) {
      window.__openCalled = true;
      return original.apply(this, args);
    };
  });
  const button = page.locator('#videoList .video-card .watch-button').first();
  await button.click();
  await page.waitForFunction(() => window.__openCalled === true);
});

Then('watch history should contain {int} entry', async ({ page }, expected) => {
  const history = await page.evaluate(() => JSON.parse(localStorage.getItem('watchedHistory') || '[]'));
  assert.strictEqual(history.length, expected);
  const opened = await page.evaluate(() => window.__openCalled);
  assert.strictEqual(opened, true);
});
