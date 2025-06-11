
// Helper to get the Playwright page object from the test context
export function getPage(context) {
  // playwright-bdd passes the test context as 'this' to step definitions
  // In arrow functions, 'this' is not bound, so use context if provided
  // In regular functions, 'this.page' is available
  if (context && context.page) return context.page;
  if (this && this.page) return this.page;
  throw new Error('Unable to get Playwright page object.');
}
import { createBdd } from 'playwright-bdd';
const { Given, When, Then, Step, BeforeAll, AfterAll } = createBdd();

const assert = require('assert');



const { getBaseUrl } = require('../../js/utils/testBaseUrl');

Given('I have loaded the videos page', async ({ page }) => {
  await page.goto(getBaseUrl());
  await page.waitForSelector('body');
});



Then('I should see {string} in the footer', async ({ page }, expectedText) => {
  const footer = await page.locator('footer');
  const footerText = await footer.textContent();
  assert.ok(footerText.includes(expectedText), `Footer text "${footerText}" does not include "${expectedText}"`);
});


