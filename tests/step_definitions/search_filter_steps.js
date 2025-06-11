import { createBdd } from 'playwright-bdd';
const { When, Then } = createBdd();

const assert = require('assert');

When('the user searches for {string}', async ({ page }, term) => {
  const searchBar = page.locator('#searchBar');
  await searchBar.fill(term);
  await page.waitForTimeout(500);
});

When('the user filters by level {string}', async ({ page }, level) => {
  await page.selectOption('#levelFilter', level);
  await page.waitForTimeout(500);
});

When('the user filters by sound quality {string}', async ({ page }, quality) => {
  await page.selectOption('#soundQualityFilter', quality);
  await page.waitForTimeout(500);
});

When('the user filters by guide {string}', async ({ page }, guide) => {
  await page.selectOption('#guideFilter', guide);
  await page.waitForTimeout(500);
});

Then(/^exactly (\d+) video(?:s)? should be displayed$/, async ({ page }, expected) => {
  await page.waitForSelector('#videoList .video-card');
  const count = await page.locator('#videoList .video-card').count();
  assert.strictEqual(count, Number(expected));
});

When('the user clears all filters', async ({ page }) => {
  await page.click('#clearFiltersButton');
  await page.waitForSelector('#videoList .video-card');
});
