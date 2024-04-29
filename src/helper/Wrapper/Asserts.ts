import { expect, Page } from "@playwright/test";

export default class Assert {

    constructor(private page: Page) { }

    async AssertTitle(title: string) {
        await expect(this.page).toHaveTitle(title);
    }

    async AssertTitleContains(title: string) {
        const pageTitle = await this.page.title();
        expect(pageTitle).toContain(title);
    }

    async AssertURL(url: string) {
        await expect(this.page).toHaveURL(url);
    }

    async AssertURLContains(title: string) {
        const pageURL = this.page.url();
        expect(pageURL).toContain(title);
    }

}