import { Page } from '@playwright/test';
import { GLOBAL } from '../config/global.config';

export class BalsamBasePage {
    readonly page: Page;

    constructor(page: Page){
        this.page = page;
    }

    async navigate(): Promise<this>{
        await this.page.goto(GLOBAL.BASE_URL);
        await this.waitForPageLoad();
        return this;
    }

    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');

    }
}