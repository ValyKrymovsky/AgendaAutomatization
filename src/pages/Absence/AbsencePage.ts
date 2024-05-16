import { Page, expect, Browser } from "@playwright/test";
import { Fixtures } from "../../hooks/PagesFixtures";
import { Keyboard, Locator } from "puppeteer";
import { Options } from "../../helper/Util/Logger";
import { Request } from "node-fetch";
import methods from "@cucumber/cucumber/lib/time";

export default class AbsencePage {
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

    async FillAllFields()
    {
        const date = new Date();
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

        // wf_ilb1 || Důvod nepřítomnosti
        await this.formPage.locator("#wf_ilb1").click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "Lékař", exact: true}).click();

        // wf_dat0 || Dotum od
        await this.formPage.locator("#wf_dat0").fill(formattedDate);

        // wf_dat1 || Dotum do
        await this.formPage.locator("#wf_dat1").fill(formattedDate);

        // wf_txt0 || Komentář
        await this.formPage.locator("#wf_txt0").fill("Test komentář...");

        // wf_btn3 ||Tlačítko odeslat
        await this.formPage.locator("#wf_btn3").click();
        await this.WaitForErrorPopup();
    }

    async FillRequiredFields()
    {
        const date = new Date();
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

        // wf_ilb1 || Důvod nepřítomnosti
        await this.formPage.locator("#wf_ilb1").click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "Lékař", exact: true}).click();

        // wf_dat0 || Dotum od
        await this.formPage.locator("#wf_dat0").fill(formattedDate);

        // wf_dat1 || Dotum do
        await this.formPage.locator("#wf_dat1").fill(formattedDate);

        // wf_btn3 ||Tlačítko odeslat
        await this.formPage.locator("#wf_btn3").click();
        await this.WaitForErrorPopup();
    }

    async FillOutSpecificField(field: string, value: string)
    {
        const fieldLocator = this.formPage.locator(`#${field}`);
        await fieldLocator.clear();
        await fieldLocator.fill(value);

        // wf_btn12 || Tlačítko odeslat
        await this.formPage.locator("#wf_btn12").click();

        await this.WaitForErrorPopup();
    }

    async CompleteActionAsApprover(action: string)
    {
        console.log("Called CompleteActionAsApprover function.");
        switch(action)
        {
            case "Approve":
                await this.formPage.locator("#wf_btn3").click();
                await this.WaitForErrorPopup();
                break;

            case "Deny":
                await this.formPage.locator("#wf_txt0").fill("Odůvodění: zamítnuto...");
                await this.formPage.locator("#wf_btn5").click();
                await this.WaitForNotePopup();
                await this.WaitForErrorPopup();
                break;

            case "Return":
                await this.formPage.locator("#wf_txt0").fill("Odůvodění: vráceno...");
                await this.formPage.locator("#wf_btn4").click();
                await this.WaitForNotePopup();
                await this.WaitForErrorPopup();
                break;
        }
    }

    async CompleteActionAsAccountant(action: string)
    {
        console.log("Called CompleteActionAsAccountant function.");
        switch(action)
        {
            case "Approve":
                await this.formPage.locator("#wf_btn4").click();
                await this.WaitForErrorPopup();
                break;

            case "Deny":
                await this.formPage.locator("#wf_btn5").click();
                await this.WaitForDenyPopup();
                await this.WaitForErrorPopup();
                break;
        }
    }

    async WaitForErrorPopup()
    {
        const date = new Date();
        const logDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

        try {
            // Očekáváme, že se zobrazí dialog s chybou a najdeme jeho text
            await this.formPage.waitForSelector('#wf_Dlg_Message:visible', { timeout: 50000 }); // Přizpůsobte timeout podle potřeby
            console.log("Message box is visible");
            const errorMessage = await this.formPage.textContent('#wf_Dlg_Message td:nth-child(2)');
            console.log(`Message: ${errorMessage}`);

            // Ověříme, že dialog obsahuje očekávanou chybovou zprávu
            if (errorMessage.includes("není správně vyplněn")) {
                // Zavřeme dialog kliknutím na tlačítko zavřít
                
                await this.formPage.screenshot({path: `test-results/error-screenshots/Absence/error_${logDate}.png`, fullPage: true});
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
            await this.formPage.screenshot({path: `test-results/error-screenshots/Absence/error_${logDate}.png`, fullPage: true});
            throw new Error("An unexpected error occurred or the error dialog did not appear as expected:" + error.message);
        }
    }

    async WaitForNotePopup()
    {
        const date = new Date();
        const logDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

        try {
            // Očekáváme, že se zobrazí dialog s chybou a najdeme jeho text
            const popupLocator = this.formPage.locator("#wf_Dlg_Message:visible");
            await popupLocator.waitFor({ timeout: 10000 });
            console.log("Message box is visible");
            
            await expect(popupLocator.getByRole('heading', { name: "Zadejte poznámku:" })).toBeVisible();
            console.log('Message box is the right one.');

            await popupLocator.locator("#wf_NoteArea").fill("Odůvodnění: vráceno..");
            console.log("Filled message box.");

            await popupLocator.locator('button.btn.btn-primary').click();
            console.log("Sent message box");
        }
        catch (error) {
            // Pokud dialog s chybou není nalezen nebo obsahuje neočekávanou zprávu
            console.error("An unexpected error occurred, error message:", error.message);
            await this.formPage.screenshot({path: `test-results/error-screenshots/Absence/error_${logDate}.png`, fullPage: true});
            throw new Error("An unexpected error occurred, error message:" + error.message);
        }
    }

    async WaitForDenyPopup()
    {
        const date = new Date();
        const logDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

        try {
            // Očekáváme, že se zobrazí dialog s chybou a najdeme jeho text
            const popupLocator = this.formPage.locator("#wf_Dlg_Message:visible");
            await popupLocator.waitFor({ timeout: 10000 });
            console.log("Message box is visible");

            await popupLocator.locator('button.btn.btn-primary').click();
            console.log("Yes i want to deny request!");

            await expect(popupLocator.getByRole('heading', { name: "Zadejte poznámku:" })).toBeVisible();
            console.log('Message box is the right one.');

            await popupLocator.locator("#wf_NoteArea").fill("Odůvodnění: zamítnuto..");
            console.log("Filled message box.");

            await popupLocator.locator('button.btn.btn-primary').click();
            console.log("Sent message box");
        }
        catch (error) {
            // Pokud dialog s chybou není nalezen nebo obsahuje neočekávanou zprávu
            console.error("An unexpected error occurred, error message:", error.message);
            await this.formPage.screenshot({path: `test-results/error-screenshots/Absence/error_${logDate}.png`, fullPage: true});
            throw new Error("An unexpected error occurred, error message:" + error.message);
        }
    }

    getRandomInt(max)
    {
        return Math.floor(Math.random() * max);
    }
} 