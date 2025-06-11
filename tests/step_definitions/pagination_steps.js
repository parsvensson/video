import { createBdd } from 'playwright-bdd';
const { When, Then } = createBdd();

const assert = require('assert');

When('the user goes to the next page', async ({ page }) => {
  const pageInfo = page.locator('#pageInfo');
  const prev = await pageInfo.textContent();
  await page.click('#nextPage');
  await page.waitForFunction(
    previous => document.getElementById('pageInfo').textContent.trim() !== previous.trim(),
    prev
  );
});

When('the user goes to the previous page', async ({ page }) => {
  const pageInfo = page.locator('#pageInfo');
  const prev = await pageInfo.textContent();
  await page.click('#prevPage');
  await page.waitForFunction(
    previous => document.getElementById('pageInfo').textContent.trim() !== previous.trim(),
    prev
  );
});

Then('the page indicator should show {string}', async ({ page }, expected) => {
  await page.waitForSelector('#pageInfo');
  const text = await page.locator('#pageInfo').textContent();
  assert.strictEqual(text.trim(), expected);
});
