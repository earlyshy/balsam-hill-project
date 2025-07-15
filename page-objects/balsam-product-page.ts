import { Page, Locator, expect } from '@playwright/test';
import { BalsamBasePage } from './balsam-base-page';


export class BalsamProductPage extends BalsamBasePage {
    readonly productTitle: Locator;
    readonly ratingValue: Locator;
    readonly reviewCount: Locator;
    readonly heightTab: Locator;
    readonly addToCartButton: Locator;
    readonly productModal: Locator;
    readonly viewCartButton: Locator;
    readonly productBuyBox: Locator;
    readonly productPrice: Locator;
    constructor(page: Page){
        super(page);
        this.productTitle = this.page.locator('h1.heading-text-2')
        this.ratingValue = this.page.locator('[data-testid="rating_summary_pdp"] [itemprop="ratingValue"]');
        this.reviewCount = this.page.locator('[data-testid="rating_summary_pdp"] .bv_numReviews_text');
        this.heightTab = this.page.locator('[data-testid="productDetailFilterAccordionContainer-body-0"] [data-testid="div-pdgf-div-Height-2"]');

        this.productModal = this.page.locator('.modalContainer_modal-body__jiOSN.modal-body');
        this.viewCartButton = this.page.locator('[data-testid="pdc-add-to-cart-modal-btn-viewcart"]');

        this.productBuyBox = this.page.locator('.productDetailContainer_product-btn-conatiner___AAO0 ');
        this.productPrice = this.page.locator('.text-break.text-end.productPrice_old-new-price__a0Rwo span.productPrice_new-price__EUt8P');

        this.addToCartButton = this.productBuyBox.locator('[data-testid="pdc-btn-addtocart"][data-cnstrc-btn="add_to_cart"]');


    }

    async assertProductTitle(): Promise<void>{
        await expect(this.productTitle).toBeVisible();
    }

    async assertRatings(): Promise<void>{
        await expect(this.ratingValue).toBeVisible();
    }

    async assertReviewCount(): Promise<void>{
        await expect(this.reviewCount).toBeVisible();
    }

    async assertProductDetailsIsLoaded(): Promise<void> {
        await this.assertProductTitle();
        await this.assertRatings();
        await this.assertReviewCount();
    }

    async clickHeightTab(): Promise<void> {
        await expect(this.heightTab).toBeVisible();
        await this.heightTab.click();
    }

    async clickAddToCartButton(): Promise<void> {
        await this.addToCartButton.scrollIntoViewIfNeeded();
        await expect(this.addToCartButton).toBeVisible();
        await this.addToCartButton.click();
    }

    async assertProductModalIsVisible(): Promise<void> {
        await expect(this.productModal).toBeVisible();
    }

    async clickViewCartButton(): Promise<void> {
        await this.assertProductModalIsVisible();
        await expect(this.viewCartButton).toBeVisible();
        await this.viewCartButton.click({force: true});
        await expect(this.page).toHaveURL(/\/cart$/);
    }

    async getProductPrice(): Promise<string> {
        return await this.getProductTextContent(this.productPrice, 'Product Price not found');
    }

    async getProductTitle(): Promise<string>{
        return await this.getProductTextContent(this.productTitle, 'Product title not found');
    }

    async getProductTextContent(locator: Locator, errorMessage: string): Promise<string> {
        const textContent = await locator.textContent();
        if (!textContent) {
            throw new Error(errorMessage);
        }
        return textContent.trim();
    }
}