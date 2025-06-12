import { createBdd } from 'playwright-bdd';
const { When, Then, Given } = createBdd();

const assert = require('assert');
const fs = require('fs');
let downloadedPath;

When('the user exports the application state', async ({ page }) => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#exportStateButton')
  ]);
  downloadedPath = await download.path();
});

Then('a state file should be downloaded containing the watched video', async () => {
  assert.ok(downloadedPath && fs.existsSync(downloadedPath), 'No download path');
  const content = fs.readFileSync(downloadedPath, 'utf-8');
  const data = JSON.parse(content);
  assert.ok(Array.isArray(data.localStorage.watchedHistory) && data.localStorage.watchedHistory.length === 1);
});

When('the user reloads the page and clears all data', async ({ page }) => {
  await page.evaluate(() => {
    indexedDB.deleteDatabase('VideoBrowserDB');
    localStorage.clear();
  });
  await page.reload();
});

When('the user imports the previously exported state', async ({ page }) => {
  const input = page.locator('#importStateInput');
  await Promise.all([
    page.waitForNavigation(),
    input.setInputFiles(downloadedPath)
  ]);
});

Then('the imported watch history should contain {int} entry', async ({ page }, expected) => {
  const history = await page.evaluate(() => JSON.parse(localStorage.getItem('watchedHistory') || '[]'));
  assert.strictEqual(history.length, expected);
});
