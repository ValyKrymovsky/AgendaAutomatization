import { Page, expect, Browser } from "@playwright/test";
import { Fixtures } from "../../hooks/PagesFixtures";
import { Locator } from "puppeteer";
import { Options } from "../../helper/Util/Logger";
import { Request } from "node-fetch";

export default class HomeOfficePage {
    browser: Browser;
    formPage: Page;
    instanceId: string;

    constructor(private page: Page)
    {
        this.formPage = page;
        this.browser = this.browser;

        const { setDefaultTimeout} = require('@cucumber/cucumber');
        setDefaultTimeout(60 * 1000);
    }

    async FillOutAllFields()
    {
        const date = new Date();
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        console.log(date);
        console.log(formattedDate);
        // Datum od || wf_dat2
        await this.formPage.locator("#wf_dat2").fill(formattedDate);

        // Datum do || wf_dat3
        await this.formPage.locator("#wf_dat3").fill(formattedDate);

        // Čas od || wf_tim0
        await this.formPage.locator("#wf_tim0").fill("8:00");

        // Čas nepřítomnosti od || wf_tim1
        await this.formPage.locator("#wf_tim1").fill("12:00");

        // Čas nepřítomnosti do || wf_tim2
        await this.formPage.locator("#wf_tim2").fill("12:30");

        // Čas do || wf_tim3
        await this.formPage.locator("#wf_tim3").fill("16:30");

        // Zdůvodnění || wf_txt0
        await this.formPage.locator("#wf_txt0").fill("Test zdůvodnění");

        // wf_btn5 || Tlačítko odeslat
        await this.formPage.locator("#wf_btn5").click();

        await this.WaitForErrorMessage();
    }

    async FillOutSpecificField(field: string, value: string)
    {
        const fieldLocator = this.formPage.locator(`#${field}`);
        await fieldLocator.clear();
        await fieldLocator.fill(value);

        // wf_btn5 || Tlačítko odeslat
        await this.formPage.locator("#wf_btn5").click();

        await this.WaitForErrorMessage();
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
                
                await this.formPage.screenshot({path: `test-results/error-screenshots/HO/error_${logDate}.png`, fullPage: true});
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
            await this.formPage.screenshot({path: `test-results/error-screenshots/HO/error_${logDate}.png`, fullPage: true});
            throw new Error("An unexpected error occurred or the error dialog did not appear as expected:" + error.message);
        }
    }

    async CompleteAction(action: string)
    {
        console.log("Called CompleteAction function.");
        switch(action)
        {
            case "Approve":
                await this.formPage.locator("#wf_rad0").check();
                break;
            
            case "Deny":
                await this.formPage.locator("#wf_rad1").check();
                await this.formPage.locator("#wf_txt0").fill("Odůvodění: zamítnuto...");
                break;

            case "Return":
                await this.formPage.locator("#wf_rad2").check();
                await this.formPage.locator("#wf_txt0").fill("Odůvodění: vráceno...");
                break;
        }

        // wf_btn5 || Tlačítko odeslat
        await this.formPage.locator("#wf_btn5").click();

        await this.WaitForErrorMessage();
    }

    async getRandomInt(max)
    {
        return Math.floor(Math.random() * max);
    }

}