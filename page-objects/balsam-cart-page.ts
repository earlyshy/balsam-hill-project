import { Page, Locator, expect } from '@playwright/test';
import { BalsamBasePage } from './balsam-base-page';


export class BalsamCartPage extends BalsamBasePage{
    readonly parentLocator: Locator;
    readonly productCartName: Locator;
    readonly productCartTotal: Locator;
    readonly cartBadge: Locator;


    constructor(page: Page){
        super(page);
        this.parentLocator = this.page.locator('.justify-content-between ');
        this.productCartName = this.parentLocator.locator('.cartProductDetailItem_product_details_content_wrapper__LXVR4 .cart-order-entry-product-name');
        this.productCartTotal = this.parentLocator.locator('.cartProductDetailItem_total__G4uBm span.cartProductDetailItem_new_price__3YLJa');
        this.cartBadge = this.page.locator('li.headerIcons_cart-icon__gn08h span.headerIcons_custom-badge__Gv9jW');
    }


    async assertCartPageIsLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/\/cart$/);
    }

    async getProductCartName(): Promise<string> {
        return await this.getCartProductTextContent(this.productCartName, 'Product title not found');
    }
    
    async getProductCartPrice(): Promise<string> {
        return await this.getCartProductTextContent(this.productCartTotal, 'Product total not found');
    }

    async getCartProductTextContent(locator: Locator, errorMessage: string): Promise<string> {
        const textContent = await locator.textContent();
        if (!textContent) {
            throw new Error(errorMessage);
        }
        return textContent.trim();
    }

    async deleteCartItem(productName: string): Promise<void> {
        const deleteButton = this.page.locator(`button[aria-label*="Remove ${productName}"]`);
        await expect(deleteButton).toBeVisible();
        await deleteButton.click();

    }
    async assertRemovalConfirmationDialogWith(productName: string): Promise<void> {
        const confirmationMessage = this.page.locator(`.cartProductDetailItem_product-name__KpwtZ a[aria-label^="View ${productName}"] span`);
        const expectedText = `${productName} has been removed.`;

        await expect(confirmationMessage).toBeVisible();
        await expect(confirmationMessage).toHaveText(expectedText);
    }

    // async validateCartCount(expectedCount: string): Promise<string> {
    //     return await this.getCartProductTextContent(this.cartBadge, 'Cart count not found');
    // }
    async validateCartCount(expectedCount: string): Promise<void> {
        const actualCount = await this.getCartProductTextContent(this.cartBadge, 'Cart count not found');
        if (actualCount.trim() !== expectedCount) {
            throw new Error(`Cart count mismatch: expected "${expectedCount}" but found "${actualCount.trim()}"`);
        }
        console.log(`Cart count validated: ${actualCount.trim()}`);
    }


}