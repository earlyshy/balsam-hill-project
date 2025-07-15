import { Page, Locator, expect } from '@playwright/test';
import { BalsamBasePage } from './balsam-base-page';


export class BalsamCartPage extends BalsamBasePage{
    readonly parentLocator: Locator;
    readonly productCartName: Locator;
    readonly productCartTotal: Locator;


    constructor(page: Page){
        super(page);
        this.parentLocator = this.page.locator('.justify-content-between ');
        this.productCartName = this.parentLocator.locator('.cartProductDetailItem_product_details_content_wrapper__LXVR4 .cart-order-entry-product-name');
        this.productCartTotal = this.parentLocator.locator('.cartProductDetailItem_total__G4uBm span.cartProductDetailItem_new_price__3YLJa');
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
}