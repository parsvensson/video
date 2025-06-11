import { createBdd } from 'playwright-bdd';
const { When, Then } = createBdd();

const assert = require('assert');

When('the user goes to the next page', async ({ page }) => {
  await page.click('#nextPage');
  await page.waitForTimeout(500);
});

When('the user goes to the previous page', async ({ page }) => {
  await page.click('#prevPage');
  await page.waitForTimeout(500);
});

Then('the page indicator should show {string}', async ({ page }, expected) => {
  await page.waitForSelector('#pageInfo');
  const text = await page.locator('#pageInfo').textContent();
  assert.strictEqual(text.trim(), expected);
});
