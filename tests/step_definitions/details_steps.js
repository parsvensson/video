import { createBdd } from 'playwright-bdd';
const { When, Then } = createBdd();

const assert = require('assert');

When('the user toggles details on the first video', async ({ page }) => {
  const button = page.locator('#videoList .video-card .expand-details-button').first();
  await button.click();
});

Then('the video details should be visible', async ({ page }) => {
  const details = page.locator('#videoList .video-card .video-details-extra').first();
  await details.waitFor({ state: 'visible' });
  const visible = await details.isVisible();
  assert.strictEqual(visible, true);
});

Then('the video details should be hidden', async ({ page }) => {
  const details = page.locator('#videoList .video-card .video-details-extra').first();
  const visible = await details.isVisible();
  assert.strictEqual(visible, false);
});
