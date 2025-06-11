import { createBdd } from 'playwright-bdd';
const { Then } = createBdd();

const assert = require('assert');

Then('an error message should be displayed', async ({ page }) => {
  await page.waitForSelector('#videoList');
  const text = await page.locator('#videoList').innerText();
  assert.ok(text.includes('Error loading file'), 'Error message not found');
});
