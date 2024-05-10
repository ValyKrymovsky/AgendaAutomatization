import { Page, expect, Browser } from "@playwright/test";
import { Fixtures } from "../../hooks/PagesFixtures";
import { Keyboard, Locator } from "puppeteer";
import { Options } from "../../helper/Util/Logger";
import { Request } from "node-fetch";
import methods from "@cucumber/cucumber/lib/time";

export default class InvoicePage {
    browser: Browser;
    formPage: Page;
    instanceId: String;

    constructor(private page: Page)
    {
        this.formPage = page;
        this.browser = this.browser;

        const { setDefaultTimeout} = require('@cucumber/cucumber');
        setDefaultTimeout(60 * 1000);
    }

    async FillAllFields()
    {
        const date = new Date();
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

        // wf_dat0 || Došla dne
        await this.formPage.locator("#wf_dat0").fill(formattedDate);
        // wf_dat1 || Splatnost
        await this.formPage.locator("#wf_dat1").fill(formattedDate);
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
        await this.formPage.locator("#wf_dat2").fill(formattedDate);
        // wf_txt1 || Popis dodávky
        await this.formPage.locator("#wf_txt1").fill("Test popisek");

        // wf_txt3 || IČ
        await this.formPage.locator("#wf_txt3").fill("25128442");
        // wf_btn3 || Tlačítko ARES
        await this.formPage.locator("#wf_btn3").click();

        // wf_ilb5 || Středisko
        await this.formPage.locator("#wf_ilb5").click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "Položka 1", exact: true}).click();
        // wf_num3 || Částka s DPH
        await this.formPage.locator("#wf_num3").fill(num.toString());

        // wf_acl1 || Schvalovatel
        await this.formPage.locator("#wf_acl1").fill("a");
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByText("Admin, Valy").click();
        
        const fs = require("fs");
        // Read your file into a buffer.
        const buffer = fs.readFileSync('files/4.pdf');

        // Create the DataTransfer and File
        const dataTransfer = await this.formPage.evaluateHandle((data) => {
            const dt = new DataTransfer();
            // Convert the buffer to a hex array
            const file = new File([data.toString('hex')], 'files/4.pdf', { type: 'application/pdf' });
            dt.items.add(file);
            return dt;
        }, buffer);

        // Now dispatch
        await this.formPage.dispatchEvent('#wf_btm0_attachment', 'drop', { dataTransfer });

        // wf_btn12 || Tlačítko odeslat
        this.formPage.locator("#wf_btn12").click();
        this.WaitForErrorMessage();
        
    }

    async FillRequiredFields()
    {

    }

    async WaitForErrorMessage()
    {
        const date = new Date();
        const logDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

        try {
            // Očekáváme, že se zobrazí dialog s chybou a najdeme jeho text
            await this.formPage.waitForSelector('#wf_Dlg_Message:visible', { timeout: 10000 }); // Přizpůsobte timeout podle potřeby
            console.log("Message box is visible");
            const errorMessage = await this.formPage.textContent('#wf_Dlg_Message td:nth-child(2)');
            console.log(`Message: ${errorMessage}`);

            // Ověříme, že dialog obsahuje očekávanou chybovou zprávu
            if (errorMessage.includes("není správně vyplněn")) {
                // Zavřeme dialog kliknutím na tlačítko zavřít
                
                await this.formPage.screenshot({path: `test-results/error-screenshots/Invoice/error_${logDate}.png`, fullPage: true});
                await this.formPage.locator('#wf_Dlg_Message').getByRole('button', { name: '×' }).click();
                console.log("Error dialog dismissed.");
            }
            else if (errorMessage.includes("byl odeslán"))
                return;
            else {
                throw new Error("Unexpected error message in the dialog.");
            }
        }
        catch (error) {
            // Pokud dialog s chybou není nalezen nebo obsahuje neočekávanou zprávu
            console.error("An unexpected error occurred or the error dialog did not appear as expected:", error.message);
            await this.formPage.screenshot({path: `test-results/error-screenshots/Invoice/error_${logDate}.png`, fullPage: true});
            throw new Error("An unexpected error occurred or the error dialog did not appear as expected:" + error.message);
        }
    }

    async getRandomInt(max) 
    {
        return Math.floor(Math.random() * max);
    }
}