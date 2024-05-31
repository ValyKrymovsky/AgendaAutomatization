import { Page, expect, Browser } from "@playwright/test";
import { Fixtures } from "../../hooks/PagesFixtures";
import { Keyboard, Locator } from "puppeteer";
import { Options } from "../../helper/Util/Logger";
import { Request } from "node-fetch";
import methods from "@cucumber/cucumber/lib/time";

export default class ContractPage {
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

        // wf_txt1 || Předmět smlouvy
        await this.formPage.locator('#wf_txt1').fill("Test předmět smlouvy..");

        // wf_txt2 || Popis smlouvy
        await this.formPage.locator('#wf_txt2').fill("Test popis smlouvy..");

        // wf_txt4 || Číslo smlouvy ext
        await this.formPage.locator('#wf_txt4').fill(this.GetRandomInt(999999).toString());

        // wf_ilb0 || Druh smlouvy
        await this.formPage.locator("#wf_ilb0").click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "Dodavatelská", exact: true}).click();

        // wf_num0 || Částka bez DPH
        await this.formPage.locator('#wf_num0').fill(this.GetRandomInt(999).toString());

        // wf_dat0 || Předpokládané uzavření
        await this.formPage.locator("#wf_dat0").fill(formattedDate);

        // wf_ilb1 || Doba trvání
        await this.formPage.locator("#wf_ilb1").click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "Určitá", exact: true}).click();

        // wf_acl0 || Vlastník
        await this.formPage.locator("#wf_acl0").fill("a");
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByText("Admin, Valy").click();

        // wf_dat1 || Platnost od
        await this.formPage.locator("#wf_dat1").fill(formattedDate);

        // wf_dat2 || Platnost do
        await this.formPage.locator("#wf_dat2").fill(formattedDate);

        // wf_txt7 || IČ
        await this.formPage.locator('#wf_txt7').fill("63078236");
        await this.formPage.locator('#wf_btn3').click();
        console.log("IČ done");

        // await this.UploadFile();
        await this.UploadFile2();
        console.log("File upload done");

        await this.formPage.locator('#wf_ilb6').click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "Smlouva", exact: true}).click();

        // wf_txt16 || Komentář
        await this.formPage.locator('#wf_txt16').fill("Test komentář..");
        console.log("Komentář done");

        // wf_acl2 || Výběr schvalovatele
        await this.formPage.locator("#wf_acl2").click();
        await this.formPage.locator("#wf_acl2").fill("v");
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByText("Development 2, Lukáš").click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });

        // wf_txt18 || Komentář schvalovatele
        await this.formPage.locator('#wf_txt18').fill("Test komentář schvalovatele..");

        // wf_btn8 || Odeslat button
        await this.formPage.locator('#wf_btn8').click();
        await this.WaitForErrorPopup();
    }

    async FillRequiredFields()
    {
        const date = new Date();
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

        // wf_txt1 || Předmět smlouvy
        await this.formPage.locator('#wf_txt1').fill("Test předmět smlouvy..");

        // wf_txt2 || Popis smlouvy
        await this.formPage.locator('#wf_txt2').fill("Test popis smlouvy..");

        // wf_ilb0 || Druh smlouvy
        await this.formPage.locator("#wf_ilb0").click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "Dodavatelská", exact: true}).click();

        // wf_num0 || Částka bez DPH
        await this.formPage.locator('#wf_num0').fill(this.GetRandomInt(999).toString());

        // wf_dat0 || Předpokládané uzavření
        await this.formPage.locator("#wf_dat0").fill(formattedDate);

        // wf_ilb1 || Doba trvání
        await this.formPage.locator("#wf_ilb1").click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "Určitá", exact: true}).click();

        // wf_acl0 || Vlastník
        await this.formPage.locator("#wf_acl0").fill("a");
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByText("Admin, Valy").click();

        // wf_dat1 || Platnost od
        await this.formPage.locator("#wf_dat1").fill(formattedDate);

        // wf_dat2 || Platnost do
        await this.formPage.locator("#wf_dat2").fill(formattedDate);

        // wf_txt7 || IČ
        await this.formPage.locator('#wf_txt7').fill("63078236");
        await this.formPage.locator('#wf_btn3').click();
        console.log("IČ done");

        // await this.UploadFile();
        await this.UploadFile2();
        console.log("File upload done");

        await this.formPage.locator('#wf_ilb6').click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "Smlouva", exact: true}).click();

        // wf_btn8 || Odeslat button
        await this.formPage.locator('#wf_btn8').click();
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

    async CompleteActionAsOwner(action: string)
    {
        console.log("Called CompleteActionAsOwner function.");
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