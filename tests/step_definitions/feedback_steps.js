import { createBdd } from 'playwright-bdd';
const { When, Then, Given } = createBdd();

const assert = require('assert');

Given('target difficulty is set to {int}', async ({ page }, val) => {
  await page.evaluate(v => localStorage.setItem('targetDifficulty', String(v)), val);
});

When('the user clicks {string} on the first video', async ({ page }, label) => {
  const map = {
    'Too Hard': '.too-hard-button',
    'Too Easy': '.too-easy-button',
    'Right Level': '.right-level-button'
  };
  const selector = `#videoList .video-card ${map[label]}`;
  const current = await page.evaluate(() => localStorage.getItem('targetDifficulty'));
  await page.locator(selector).first().click();
  await page.waitForFunction(
    prev => localStorage.getItem('targetDifficulty') !== prev,
    current
  );
});

Then('the target difficulty should be {int}', async ({ page }, expected) => {
  const value = await page.evaluate(() => localStorage.getItem('targetDifficulty'));
  assert.strictEqual(Number(value), expected);
});
