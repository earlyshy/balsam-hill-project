import { test, expect } from '@playwright/test';
import { BalsamHomePage } from '../page-objects/balsam-home-page';

test.describe('Balsam Hill Assessment', () => {
  let balsamHomePage: BalsamHomePage;

  test.beforeEach(async ({ page }) => {
    balsamHomePage = new BalsamHomePage(page);
    await balsamHomePage.navigate();
  });

  test('Search for Christmas Tree and select product', async () => {
    const searchTerm = 'Christmas Tree';
    const productDataPath = './test-data/products.json';

    // Search the product
    await balsamHomePage.searchForProduct(searchTerm);

    // Click the product title using JSON product index and key
    await balsamHomePage.clickProductTitle(searchTerm, productDataPath);

    // Verify product detail header visible
    await expect(balsamHomePage.page.locator('[data-product-form-target="productDetails"] h1')).toBeVisible();
  });
});
