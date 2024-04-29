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

    async GoToAgendasPage()
    {
        let responseReceived = false;

        // Posluchač pro zachycení odpovědí po navigaci
        this.page.on('response', response => {
            if (response.url() === 'https://presofa.602.cz/InProgress/Agendas?viewId=agendas' && response.status() === 200) {
                console.log('Response status for Agendas page is 200');
                responseReceived = true;
            }
        });
        //await this.page.goto("https://testsofas.602.cz/fas/formservice/filler.debug?SetDbg=Admin602&Level=5&Comm=true");
        await this.page.goto("https://presofa.602.cz/InProgress/Agendas?viewId=agendas");

        // Počkejte na načtení stránky
        await this.page.waitForLoadState('networkidle');

        // Zkontrolujte, zda byla přijata odpověď s kódem 200
        if (!responseReceived) {
            throw new Error('Agendas page did not load successfully or response status was not 200.');
        } 
    }

    async OpenFormPage()
    {
        try {
            const [newPage] = await Promise.all([
                this.page.context().waitForEvent('page', { timeout: 50000 }), // Čeká na nový tab s vlastním timeoutem
                this.page.click(`text=${"Faktura"}`),
            ]);
            
            console.log("Page opened.");
            
            // Počká na specifický stav načítání stránky, 'networkidle' indikuje, že síťová aktivita je minimální
            await newPage.waitForLoadState('networkidle', { timeout: 50000 }); // Zvýšený timeout pro načítání
            this.formPage = newPage;
            console.log("Page loaded.");

            this.instanceId = (await this.formPage.locator("#SOFAInstanceIdent").getAttribute("value")).toString();
            console.log(this.instanceId);

            const prompt = require('prompt-sync')({ sigint: true });
            const answer = prompt('Stiskněte [Enter] pro pokračování testu...');
            console.log(`Enter` + answer);
        }
        catch (error) {
            // Zachytí a zpracuje výjimku (např. TimeoutException)
            console.error("An error occurred during navigation:", error.message);
            // Zde můžete přidat logiku pro opětovný pokus nebo alternativní postup
        }
    }

    async FillOutForm()
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

    async getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
}