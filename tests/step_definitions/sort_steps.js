import { createBdd } from 'playwright-bdd';
const { When, Then } = createBdd();

const assert = require('assert');

When('the user sorts by {string}', async ({ page }, sortValue) => {
  await page.selectOption('#sortOptions', sortValue);
  await page.waitForSelector('#videoList .video-card h3');
});

Then('the first video title should be {string}', async ({ page }, expectedTitle) => {
  await page.waitForSelector('#videoList .video-card h3');
  const title = await page.locator('#videoList .video-card h3').first().textContent();
  assert.strictEqual(title.trim(), expectedTitle);
});
