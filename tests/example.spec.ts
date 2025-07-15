import { test, expect } from '@playwright/test';
import { BalsamHomePage } from '../page-objects/balsam-home-page';
import { BalsamProductPage } from '../page-objects/balsam-product-page';
import { BalsamCartPage } from '../page-objects/balsam-cart-page';

test.describe('Balsam Hill Assessment', () => {
  let balsamHomePage: BalsamHomePage;
  let balsamProductPage: BalsamProductPage;
  let balsamCartPage: BalsamCartPage;

  test.beforeEach(async ({ page }) => {
    balsamHomePage = new BalsamHomePage(page);
    balsamProductPage = new BalsamProductPage(page);
    balsamCartPage = new BalsamCartPage(page);
    await balsamHomePage.navigate();
  });

  test('Search for Christmas Tree and select product', async () => {
    const searchTerm = 'Christmas Tree';
    const productDataPath = './test-data/products.json';

    // Search and select product
    await balsamHomePage.searchForProduct(searchTerm);
    await balsamHomePage.clickProductTitle(searchTerm, productDataPath);

    // Validate product details loaded on product page
    await balsamProductPage.assertProductDetailsIsLoaded();

    // Interact with product page (select height tab, add to cart)
    await balsamProductPage.clickHeightTab();
    
    // Get product info from product page
    const productPrice = await balsamProductPage.getProductPrice();

    await balsamProductPage.clickAddToCartButton();

    // Wait for modal and proceed to cart
    await balsamProductPage.clickViewCartButton();

    // Assert cart page is loaded before fetching cart details
    await balsamCartPage.assertCartPageIsLoaded();

    // Get product info from cart page
    const cartProductName = await balsamCartPage.getProductCartName();
    const cartProductPrice = await balsamCartPage.getProductCartPrice();

    // Validate product title and price consistency between product and cart pages
    expect(cartProductPrice).toBe(productPrice);

    //validate cart badge count
    await balsamCartPage.validateCartCount('1');
    await balsamCartPage.deleteCartItem(cartProductName);
    await balsamCartPage.assertRemovalConfirmationDialogWith(cartProductName);
  });
});
