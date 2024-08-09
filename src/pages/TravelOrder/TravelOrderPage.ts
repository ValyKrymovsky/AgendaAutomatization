import { Page, expect, Browser } from "@playwright/test";
import { Fixtures } from "../../hooks/PagesFixtures";
import { Keyboard, Locator } from "puppeteer";
import { Options } from "../../helper/Util/Logger";
import { Request } from "node-fetch";
import methods from "@cucumber/cucumber/lib/time";

export default class TravelOrderPage {
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

        //
        // Počátek cesty //
        //
        // wf_txt0 || Místo
        await this.formPage.locator('#wf_txt0').fill("Test místo začátku cesty..");

        // wf_dat0 || Datum
        await this.formPage.locator("#wf_dat0").fill(formattedDate);

        // wf_tim0 || Čas
        await this.formPage.locator("#wf_tim0").fill("8:00");

        //
        // Konec cesty //
        //
        // wf_txt1 || Místo
        await this.formPage.locator('#wf_txt1').fill("Test místo konce cesty..");

        // wf_dat1 || Datum
        await this.formPage.locator("#wf_dat1").fill(formattedDate);

        // wf_tim1 || Čas
        await this.formPage.locator("#wf_tim1").fill("17:00");

        //
        // Konec cesty //
        //
        // wf_txt2 || Jednání
        await this.formPage.locator('#wf_txt2').fill("Test jednání..");

        // wf_txt3 || Účel cesty
        await this.formPage.locator('#wf_txt3').fill("Test účel cesty..");

        // wf_txt4 || Komentář
        await this.formPage.locator('#wf_txt4').fill("Test komentář..");

        // wf_chb2 || Dopravní prostředek
        await this.formPage.locator('#wf_chb2').click();

        // wf_acl1 || Spolucestujicí jméno a příjmení
        await this.formPage.locator("#wf_acl1").fill("a");
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByText("Admin, Valy").click();


        // wf_btn8 || Odeslat button
        await this.formPage.locator('#wf_btn5').click();
        await this.WaitForErrorPopup();
    }

    async ResendAfterReturn()
    {
        // wf_txt16 || Komentář
        await this.formPage.locator('#wf_txt16').fill("Test komentář po vracení..");
        console.log("Komentář done"); 

        // wf_btn8 || Odeslat button
        await this.formPage.locator('#wf_btn8').click();
        await this.WaitForErrorPopup();
    }

    async CompleteActionAsApprover(action: string)
    {
        console.log("Called CompleteActionAsApprover function.");
        switch(action)
        {
            case "Approve":
                await this.formPage.locator("#wf_btn9").click();
                await this.WaitForErrorPopup();
                break;

            case "Return":
                await this.formPage.locator("#wf_txt0").fill("Odůvodnění: vráceno...");
                await this.formPage.locator("#wf_btn10").click();
                await this.WaitForNotePopup();
                await this.WaitForErrorPopup();
                break;

            case "Deny":
                await this.formPage.locator("#wf_txt0").fill("Odůvodnění: vráceno...");
                await this.formPage.locator("#wf_btn11").click();
                await this.WaitForDenyPopup();
                await this.WaitForErrorPopup();
                break;
        }
    }

    async CompleteActionAsApprover2(action: string)
    {
        console.log("Called CompleteActionAsApprover2 function.");
        switch(action)
        {
            case "Approve":
                await this.formPage.locator("#wf_btn8").click();
                await this.WaitForErrorPopup();
                break;

            case "Return":
                await this.formPage.locator("#wf_txt0").fill("Odůvodnění: vráceno...");
                await this.formPage.locator("#wf_btn9").click();
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
            case "Complete":
                await this.formPage.locator("#wf_btn15").click();
                await this.WaitForErrorPopup();
                break;

            case "Return":
                await this.formPage.locator("#wf_txt0").fill("Odůvodnění: vráceno...");
                await this.formPage.locator("#wf_btn17").click();
                await this.WaitForNotePopup();
                await this.WaitForErrorPopup();
                break;
        }
    }

    async CompleteActionAsBiller(action: string)
    {
        console.log("Called CompleteActionAsBiller function.");

        switch(action)
        {
            case "Bill":
                await this.formPage.locator("#wf_btn40").click();

                await this.formPage.locator("#wf_tim0").fill("8:00");
                await this.formPage.locator("#wf_tim1").fill("9:00");

                await this.formPage.locator("#wf_ilb0").click();
                await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
                await this.formPage.getByRole("option", {name: "Autobus", exact: true}).click();

                await this.formPage.locator("#wf_txt3").fill("Test důvod cesty 1..");

                await this.formPage.locator("#wf_tim3").fill("8:00");
                await this.formPage.locator("#wf_tim4").fill("9:00");

                await this.formPage.locator("#wf_ilb7").click();
                await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
                await this.formPage.getByRole("option", {name: "Vlak", exact: true}).click();

                await this.formPage.locator("#wf_txt3").fill("Test důvod cesty 2..");

                await this.formPage.locator("#wf_num10").fill("123");
                await this.formPage.locator("#wf_num12").fill("456");

                await this.formPage.locator("#wf_txt6").fill("Test komentář..");

                await this.formPage.locator("#wf_btn55").click();
                await this.WaitForErrorPopup();
                break;

            case "Don't bill":
                await this.formPage.locator("#wf_btn41").click();
                await this.WaitForNotePopup();
                await this.WaitForErrorPopup();
                break;
        }
    }

    async CompleteEvidence(action: string)
    {
        console.log("Called CompleteEvidence function.");
        switch(action)
        {
            case "Archive":
                await this.formPage.locator("#wf_btn15").click();
                await this.WaitForErrorPopup();
                break;

            case "Record":
                await this.formPage.locator("#wf_btn16").click();
                await this.WaitForErrorPopup();
                break;
        }
    }

    async WaitForErrorPopup()
    {
        const date = new Date();
        const logDate = `${date.getFullYear()}_${date.getMonth()+1}_${date.getDate()}-${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;

        try {
            // Očekáváme, že se zobrazí dialog s chybou a najdeme jeho text
            await this.formPage.locator('#wf_Dlg_Message:visible').waitFor({state: "visible", timeout: 50000}); // Přizpůsobte timeout podle potřeby
            console.log("Message box is visible");
            const errorMessage = await this.formPage.textContent('#wf_Dlg_Message td:nth-child(2)');
            console.log(`Message: ${errorMessage}`);

            // Ověříme, že dialog obsahuje očekávanou chybovou zprávu
            if (errorMessage.includes("není správně vyplněn")) {
                // Zavřeme dialog kliknutím na tlačítko zavřít
                
                await this.formPage.screenshot({path: `test-results/error-screenshots/Contract/error_${logDate}.png`, fullPage: true});
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
            await this.formPage.screenshot({path: `test-results/error-screenshots/Contract/error_${logDate}.png`, fullPage: true});
            throw new Error("An unexpected error occurred or the error dialog did not appear as expected:" + error.message);
        }
    }

    async WaitForNotePopup()
    {
        const date = new Date();
        const logDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

        try {
            // Očekáváme, že se zobrazí dialog s chybou a najdeme jeho text
            const popupLocator = this.formPage.locator("#wf_Dlg_Message");
            await popupLocator.waitFor({ state: 'visible', timeout: 50000});
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
            await this.formPage.screenshot({path: `test-results/error-screenshots/Contract/error_${logDate}.png`, fullPage: true});
            throw new Error("An unexpected error occurred, error message:" + error.message);
        }
    }

    async WaitForDenyPopup()
    {
        const date = new Date();
        const logDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

        try {
            // Očekáváme, že se zobrazí dialog s chybou a najdeme jeho text
            const popupLocator = this.formPage.locator("#wf_Dlg_Message");
            await popupLocator.waitFor({ state: 'visible', timeout: 50000});
            console.log("Message box is visible");

            await popupLocator.locator('button.btn.btn-primary').click();
            console.log("Yes i want to deny request!");
        }
        catch (error) {
            // Pokud dialog s chybou není nalezen nebo obsahuje neočekávanou zprávu
            console.error("An unexpected error occurred, error message:", error.message);
            await this.formPage.screenshot({path: `test-results/error-screenshots/Contract/error_${logDate}.png`, fullPage: true});
            throw new Error("An unexpected error occurred, error message:" + error.message);
        }
    }

    GetRandomInt(max)
    {
        return Math.floor(Math.random() * max);
    }

    async UploadFile()
    {
        const fs = require("fs");
        // Read your file into a buffer.
        const buffer = fs.readFileSync('files/4.pdf');

        // Create the DataTransfer and File
        const dataTransfer = await this.formPage.evaluateHandle((data) => {
            console.log(data);
            const dt = new DataTransfer();
            // Convert the buffer to a hex array
            const file = new File([data.toString('hex')], 'files/4.pdf', { type: 'application/pdf' });
            console.log(file);
            dt.items.add(file);
            return dt;
        }, buffer);

        // Now dispatch
        await this.formPage.dispatchEvent('#wf_btm0_attachment', 'drop', { dataTransfer });
    }

    async UploadFile2()
    {
        await this.formPage.locator('#wf_btm0_attachment').click();

        const prompt = require('prompt-sync')({ sigint: true });
        const answer = prompt('Stiskněte [Enter] pro pokračování testu...');
    }
} 