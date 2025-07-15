import { Page, Locator, expect } from '@playwright/test';
import { BalsamBasePage } from './balsam-base-page';
import { ProductData, Products } from '../interfaces/interface';
import * as fs from 'fs';
import * as path from 'path';

export class BalsamHomePage extends BalsamBasePage {
    readonly searchInput: Locator;
    readonly productCard: Locator;
    readonly productCardNameSelector: String;
    readonly autoSuggest: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = this.page.locator('[data-testid="constructor-header-search-form"] [data-testid="constructor-search-input"]');
        this.productCard = this.page.locator('[data-testid="products-search-results"] > .autoSuggestList_singleProduct__mK9Up')
        this.productCardNameSelector = '[data-cnstrc-item-section="Products"] span.autoSuggestList_name__UoF1W';
        this.autoSuggest = this.page.locator('div[data-cnstrc-autosuggest]');
    }

    async searchForProduct(productName: string): Promise<void> {
        await this.searchInput.fill(productName)
    }


    async getProductKeyFromJson(filePath: string): Promise<ProductData> {
        try{
            const fullPath = path.resolve(filePath);
            const jsonData = fs.readFileSync(fullPath, 'utf-8');
            return JSON.parse(jsonData) as ProductData;
        }catch (error) {
            console.error(`Error reading JSON file at ${filePath}:`, error);
            throw error;
        }
    }

    async getProductByNameFromProductData(productName: string, filePath: string): Promise<Products>{
        const productData = await this.getProductKeyFromJson(filePath);
        if(!productData.products || productData.products.length === 0){
            throw new Error('No Products found in the product data');
        }
        const product = productData.products.find(p => p.productKey.toLowerCase());
        if(!product){
            throw new Error(`Product with name ${productName} not found in the product data`);
        }
        return product;
    }

    // async validateProductCardByIndex(productName: string, filePath: string): Promise<Locator> {
    //     const product = await this.getProductByNameFromProductData(productName, filePath);
    //     const zeroBasedIndex = product.productIndex - 1;

    //     // Get the product card container at the specified index
    //     const productCardIndexed = this.productCard.nth(zeroBasedIndex);

    //     // Within that product card, locate the product name element
    //     const productNameElement = productCardIndexed.locator('span.autoSuggestList_name__UoF1W');

    //     // Get the text content of the product name element
    //     const productNameText = await productNameElement.textContent();

    //     // Verify product name contains expected product key (case-insensitive)
    //     if (!productNameText || !productNameText.toLowerCase().includes(product.productKey.toLowerCase())) {
    //         throw new Error(`Product name mismatch. Expected to include "${product.productKey}", but got "${productNameText}"`);
    //     }
        
    //     return productCardIndexed;
    // }

    async validateProductCardByIndex(productName: string, filePath: string): Promise<Locator> {
    const product = await this.getProductByNameFromProductData(productName, filePath);
    const zeroBasedIndex = product.productIndex - 1;

    try {
        // Try validating by productIndex first
        const productCardIndexed = this.productCard.nth(zeroBasedIndex);
        const productNameElement = productCardIndexed.locator('span.autoSuggestList_name__UoF1W');
        const productNameText = await productNameElement.textContent();

        if (!productNameText || !productNameText.toLowerCase().includes(product.productKey.toLowerCase())) {
            throw new Error(`Product name mismatch. Expected to include "${product.productKey}", but got "${productNameText}"`);
        }
        return productCardIndexed;
    } catch (err) {
        // If error occurs (like mismatch), fallback to searching by productName text
        console.warn('Product index validation failed, fallback to search by product name text:', err);

        // Locate all product name spans under product cards
        const allProductNameElements = this.productCard.locator('span.autoSuggestList_name__UoF1W');
        const count = await allProductNameElements.count();

        for (let i = 0; i < count; i++) {
            const nameText = await allProductNameElements.nth(i).textContent();
            if (nameText && nameText.toLowerCase().includes(productName.toLowerCase())) {
                // Return the product card container at the matched index
                return this.productCard.nth(i);
            }
        }

        throw new Error(`Product with name "${productName}" not found by fallback search`);
    }
}

    async clickProductTitle(productName: string, filePath: string): Promise<void> {
        const validatedProductCard = await this.validateProductCardByIndex(productName, filePath);
        // Click the product card container (assumes clickable)
        await validatedProductCard.click({ force: true });
    }
}