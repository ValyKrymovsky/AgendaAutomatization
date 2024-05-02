import { Page, expect, Browser } from "@playwright/test";
import { Fixtures } from "../../hooks/PagesFixtures";
import { Locator } from "puppeteer";
import { Options } from "../../helper/Util/Logger";
import { Request } from "node-fetch";

export default class InvoicePage {
    browser: Browser;
    formPage: Page;
    instanceId: String;

    constructor(private page: Page)
    {
        this.page = page;
        this.browser = this.browser;

        const { setDefaultTimeout} = require('@cucumber/cucumber');
        setDefaultTimeout(60 * 1000);
    }

    async FillAllFields()
    {
        // wf_dat0 || Došla dne
        await this.formPage.locator("#wf_dat0").fill("12-12-2021");
        // wf_dat1 || Splatnost
        await this.formPage.locator("#wf_dat1").fill("12-12-2021");
        // wf_num0 || Částka s DPH
        var num = await this.getRandomInt(99999);
        await this.formPage.locator("#wf_num0").fill(num.toString());
        // wf_ilb1 || Způsob platby
        await this.formPage.locator("#wf_ilb1").click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "Složenkou", exact: true}).click();
        // wf_txt0 || Variabilní symbol
        await this.formPage.locator("#wf_txt0").fill((await this.getRandomInt(9999)).toString());
        // wf_dat2 || Dodávka převzata dne
        await this.formPage.locator("#wf_dat2").fill("12-12-2021");
        // wf_txt1 || Popis dodávky
        await this.formPage.locator("#wf_txt1").fill("Test popisek");

        // wf_txt3 || IČ
        await this.formPage.locator("#wf_txt3").fill("25128442");
        // wf_btn3 || Tlačítko ARES
        await this.formPage.locator("#wf_btn3").click();

        // wf_ilb5 || Středisko
        await this.formPage.locator("#wf_ilb5").click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "Nákupní", exact: true}).click();
        // wf_num3 || Částka s DPH
        await this.formPage.locator("#wf_num3").fill(num.toString());

        // wf_acl1 || Schvalovatel
        await this.formPage.locator("#wf_acl1").fill("a");
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByText("Admin, Valy").click();

        // wf_btm0_attachment || Tlačítko pro vložení příloh
        await this.formPage.locator("#wf_btm0_attachment").click();

        await this.formPage.evaluate(() => console.debug("Test debug"));
        
        const prompt = require('prompt-sync')({ sigint: true });
        const answer = prompt('Stiskněte [Enter] pro pokračování testu...');
        console.log(`Enter` + answer);

        // wf_btn12 || Tlačítko odeslat
        await this.formPage.locator("#wf_btn12").click();
        
    }

    async FillRequiredFields()
    {

    }

    async getRandomInt(max) 
    {
        return Math.floor(Math.random() * max);
    }
}