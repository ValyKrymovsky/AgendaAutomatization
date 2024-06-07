import { Page, expect, Browser } from "@playwright/test";
import { Fixtures } from "../../hooks/PagesFixtures";
import { Keyboard, Locator } from "puppeteer";
import { Options } from "../../helper/Util/Logger";
import { Request } from "node-fetch";
import methods from "@cucumber/cucumber/lib/time";

export default class InvoicePage {
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
        const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

        // wf_dat0 || Došla dne
        await this.formPage.locator("#wf_dat0").fill(formattedDate);
        // wf_dat1 || Splatnost
        await this.formPage.locator("#wf_dat1").fill(formattedDate);
        // wf_num0 || Částka s DPH
        var num = await this.GetRandomInt(99999);
        await this.formPage.locator("#wf_num0").fill(num.toString());
        // wf_ilb1 || Způsob platby
        await this.formPage.locator("#wf_ilb1").click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "Složenkou", exact: true}).click();
        // wf_txt0 || Variabilní symbol
        await this.formPage.locator("#wf_txt0").fill((await this.GetRandomInt(9999)).toString());
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

        await this.UploadFile();

        // wf_btn12 || Tlačítko odeslat
        await this.formPage.locator("#wf_btn12").click();
        await this.WaitForErrorPopup();
        
    }

    async FillRequiredFields()
    {
        const date = new Date();
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

        // wf_dat0 || Došla dne
        await this.formPage.locator("#wf_dat0").fill(formattedDate);
        // wf_dat1 || Splatnost
        await this.formPage.locator("#wf_dat1").fill(formattedDate);
        // wf_num0 || Částka s DPH
        var num = await this.GetRandomInt(99999);
        await this.formPage.locator("#wf_num0").fill(num.toString());
        // wf_ilb1 || Způsob platby
        await this.formPage.locator("#wf_ilb1").click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "Složenkou", exact: true}).click();
        // wf_txt0 || Variabilní symbol
        await this.formPage.locator("#wf_txt0").fill((this.GetRandomInt(9999)).toString());
        // wf_dat2 || Dodávka převzata dne
        await this.formPage.locator("#wf_dat2").fill(formattedDate);
        // wf_txt1 || Popis dodávky
        await this.formPage.locator("#wf_txt1").fill("Test popisek");

        // wf_txt3 || IČ
        await this.formPage.locator("#wf_txt3").fill("63078236");
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

        // wf_txt13 || Zpráva pro účetní
        await this.formPage.locator("#wf_txt13").fill("Random zpráva pro účetní.");

        // wf_btn12 || Tlačítko odeslat
        await this.formPage.locator("#wf_btn12").click();
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
                await this.formPage.locator("#wf_btn10").click();
                await this.WaitForErrorPopup();
                break;

            case "Return":
                await this.formPage.locator("#wf_txt0").fill("Odůvodění: vráceno...");
                await this.formPage.locator("#wf_btn11").click();
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
                await this.formPage.locator("#wf_txt6").fill("test evidenční číslo");
                await this.formPage.locator("#wf_btn24").click();
                await this.WaitForErrorPopup();
                break;
            
            case "Deny":
                await this.formPage.locator("#wf_btn28").click();
                await this.WaitForErrorPopup();
                break;

            case "Return":
                await this.formPage.locator("#wf_btn27").click();
                await this.WaitForNotePopup();
                await this.WaitForErrorPopup();
                break;

            case "Save":
                await this.formPage.locator("#wf_btn25").click();
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
            await this.formPage.screenshot({path: `test-results/error-screenshots/Invoice/error_${logDate}.png`, fullPage: true});
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
            const dt = new DataTransfer();
            // Convert the buffer to a hex array
            const file = new File([data.toString('hex')], 'files/4.pdf', { type: 'application/pdf' });
            dt.items.add(file);
            return dt;
        }, buffer);

        // Now dispatch
        await this.formPage.dispatchEvent('#wf_btm0_attachment', 'drop', { dataTransfer });
    }
} 