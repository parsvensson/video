import { createBdd } from 'playwright-bdd';
const { When } = createBdd();

async function revealElement(page, locator) {
  if (await locator.isVisible().catch(() => false)) return;
  const buttons = page.locator('#videoList .expand-details-button');
  const count = await buttons.count();
  for (let i = 0; i < count; i++) {
    await buttons.nth(i).click();
    if (await locator.isVisible().catch(() => false)) break;
  }
}

When('the user clicks the tag {string}', async ({ page }, tag) => {
  const tagLocator = page.locator('.clickable-tag', { hasText: tag }).first();
  await revealElement(page, tagLocator);
  await tagLocator.click();
  await page.waitForSelector('#videoList .video-card');
});

When('the user clicks the guide {string}', async ({ page }, guide) => {
  const guideLocator = page.locator('.clickable-guide', { hasText: guide }).first();
  await revealElement(page, guideLocator);
  await guideLocator.click();
  await page.waitForSelector('#videoList .video-card');
});
