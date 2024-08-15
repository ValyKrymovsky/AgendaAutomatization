import { Page, expect, Browser } from "@playwright/test";
import { Fixtures } from "../../hooks/PagesFixtures";
import { Keyboard, Locator } from "puppeteer";
import { Options } from "../../helper/Util/Logger";
import { Request } from "node-fetch";
import methods from "@cucumber/cucumber/lib/time";
import { setTimeout } from "timers/promises";

export default class PurchaseRequestPage {
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

        // wf_ilb0 || Nákladové středisko
        for (let i = 0; i < 10; i++)
        {
            if (i > 0)
            {
                console.log("Not first attempt!");
                console.log("Clicking on wf_txt0.");
                await this.formPage.locator("#wf_txt0").click();
                console.log("Clicking on wf_ilb0 for the " + i + ". time.");
                await this.formPage.locator("#wf_ilb0SelectBoxIt").click();
            }
            else
            {
                console.log("Clicking on wf_ilb0 for the first time.");
                await this.formPage.locator("#wf_ilb0").click();
            }
            
            await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
            console.log("No network traffic.");
            await setTimeout(3000);
            if (await this.formPage.getByRole("option", {name: "Položka 1", exact: true}).isVisible({timeout: 10000}))
            {
                console.log("Option is visible, attempting click on option.");
                await this.formPage.getByRole("option", {name: "Položka 1", exact: true}).click();
                break;
            }

            console.log("Option is not visible. Waiting for 6s.");
            await setTimeout(3000);
        }

        // wf_ilb1 || Oblast zboží
        for (let i = 0; i < 10; i++)
        {
            if (i > 0)
            {
                console.log("Not first attempt!");
                console.log("Clicking on wf_txt0.");
                await this.formPage.locator("#wf_txt0").click();
                console.log("Clicking on wf_ilb1 for the " + i + ". time.");
                await this.formPage.locator("#wf_ilb1SelectBoxIt").click();
            }
            else
            {
                console.log("Clicking on wf_ilb1 for the first time.");
                await this.formPage.locator("#wf_ilb1").click();
            }
            
            await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
            console.log("No network traffic.");
            await setTimeout(3000);
            if (await this.formPage.getByRole("option", {name: "Položka 1", exact: true}).isVisible({timeout: 10000}))
            {
                console.log("Option is visible, attempting click on option.");
                await this.formPage.getByRole("option", {name: " Položka 1", exact: true}).click();
                break;
            }

            console.log("Option is not visible. Waiting for 6s.");
            await setTimeout(3000);
        }

        // wf_ilb2 || Měna
        for (let i = 0; i < 10; i++)
        {
            if (i > 0)
            {
                console.log("Not first attempt!");
                console.log("Clicking on wf_txt0.");
                await this.formPage.locator("#wf_txt0").click();
                console.log("Clicking on wf_ilb2 for the " + i + ". time.");
                await this.formPage.locator("#wf_ilb2SelectBoxIt").click();
            }
            else
            {
                console.log("Clicking on wf_ilb2 for the first time.");
                await this.formPage.locator("#wf_ilb2").click();
            }
            
            await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
            console.log("No network traffic.");
            await setTimeout(3000);
            if (await this.formPage.getByRole("option", {name: "Kč", exact: true}).isVisible({timeout: 10000}))
            {
                console.log("Option is visible, attempting click on option.");
                await this.formPage.getByRole("option", {name: "Kč", exact: true}).click();
                break;
            }

            console.log("Option is not visible. Waiting for 6s.");
            await setTimeout(3000);
        }

        // wf_txt13 || Název zboží
        await this.formPage.locator("#wf_txt13").fill("Test název zboží");

        // wf_txt4 || Ičo
        await this.formPage.locator("#wf_txt4").fill("25128442");
        await this.formPage.locator("#wf_btn3").click();

        // wf_num2 || Množství
        await this.formPage.locator("#wf_num2").fill(this.GetRandomInt(999).toString());

        // wf_ilb5 || Sazba DPH
        for (let i = 0; i < 10; i++)
            {
                if (i > 0)
                {
                    console.log("Not first attempt!");
                    console.log("Clicking on wf_txt0.");
                    await this.formPage.locator("#wf_txt0").click();
                    console.log("Clicking on wf_ilb5 for the " + i + ". time.");
                    await this.formPage.locator("#wf_ilb5SelectBoxIt").click();
                }
                else
                {
                    console.log("Clicking on wf_ilb5 for the first time.");
                    await this.formPage.locator("#wf_ilb5").click();
                }
                
                await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
                console.log("No network traffic.");
                await setTimeout(3000);
                if (await this.formPage.getByRole("option", {name: "21%", exact: true}).isVisible({timeout: 10000}))
                {
                    console.log("Option is visible, attempting click on option.");
                    await this.formPage.getByRole("option", {name: "21%", exact: true}).click();
                    break;
                }
    
                console.log("Option is not visible. Waiting for 6s.");
                await setTimeout(3000);
        }

        // wf_num3 || Cena za položku bez DPH
        await this.formPage.locator("#wf_num3").fill(this.GetRandomInt(999).toString());

        // wf_txt14 || Odkaz
        await this.formPage.locator("#wf_txt14").fill("Test odkaz");

        // wf_txt16 || Komentář
        await this.formPage.locator("#wf_txt16").fill("Test komentář...");

        //await this.UploadFile();
        await this.UploadFile();

        // wf_btn7 || Button pro odeslání
        await this.formPage.locator("#wf_btn9").click();
        await this.WaitForErrorPopup();
    }

    async FillRequiredFields()
    {
        // wf_ilb0 || Nákladové středisko
        await this.formPage.locator("#wf_ilb0").click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "Položka 1", exact: true}).click();

        // wf_ilb1 || Oblast zboží
        await this.formPage.locator("#wf_ilb1").click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "HQ", exact: true}).click();

        // wf_ilb2 || Měna
        await this.formPage.locator("#wf_ilb2").click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "$", exact: true}).click();

        // wf_txt4 || Název zboží
        await this.formPage.locator("#wf_txt4").fill("Test název zboží");

        // wf_txt5 || Dodavatel
        await this.formPage.locator("#wf_txt5").fill("Test dodavatel");

        // wf_num0 || Množství
        await this.formPage.locator("#wf_num0").fill(this.GetRandomInt(999).toString());

        // wf_ilb3 || Sazba DPH
        await this.formPage.locator("#wf_ilb3").click();
        await this.formPage.waitForLoadState('networkidle', { timeout: 50000 });
        await this.formPage.getByRole("option", {name: "21%", exact: true}).click();

        // wf_num1 || Cena za položku bez DPH
        await this.formPage.locator("#wf_num1").fill(this.GetRandomInt(999).toString());

        // wf_btn7 || Button pro odeslání
        await this.formPage.locator("#wf_btn7").click();
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

    async CompleteActionAsCenterManager(action: string)
    {
        console.log("Called CompleteActionAsApprover function.");
        switch(action)
        {
            case "Approve":
                await this.formPage.locator("#wf_btn12").click();
                await this.WaitForErrorPopup();
                break;

            case "Deny":
                await this.formPage.locator("#wf_txt1").fill("Odůvodnění: zamítnuto...");
                await this.formPage.locator("#wf_btn14").click();
                await this.WaitForDenyPopup();
                await this.WaitForErrorPopup();
                break;

            case "Return":
                await this.formPage.locator("#wf_txt1").fill("Odůvodnění: vráceno...");
                await this.formPage.locator("#wf_btn13").click();
                await this.WaitForNotePopup();
                await this.WaitForErrorPopup();
                break;
        }
    }

    async CompleteActionAsPurchaseManager(action: string)
    {
        console.log("Called CompleteActionAsAccountant function.");
        switch(action)
        {
            case "Approve":
                await this.formPage.locator("#wf_btn11").click();
                await this.WaitForErrorPopup();
                break;

            case "Deny":
                await this.formPage.locator("#wf_btn12").click();
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
            await this.formPage.locator('#wf_Dlg_Message:visible').waitFor({state: "visible", timeout: 50000}); // Přizpůsobte timeout podle potřeby
            console.log("Message box is visible");
            const errorMessage = await this.formPage.textContent('#wf_Dlg_Message td:nth-child(2)');
            console.log(`Message: ${errorMessage}`);

            // Ověříme, že dialog obsahuje očekávanou chybovou zprávu
            if (errorMessage.includes("není správně vyplněn")) {
                // Zavřeme dialog kliknutím na tlačítko zavřít
                
                await this.formPage.screenshot({path: `test-results/error-screenshots/PurchaseRequest/error_${logDate}.png`, fullPage: true});
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
            await this.formPage.screenshot({path: `test-results/error-screenshots/PurchaseRequest/error_${logDate}.png`, fullPage: true});
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
            await this.formPage.screenshot({path: `test-results/error-screenshots/PurchaseRequest/error_${logDate}.png`, fullPage: true});
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
            await this.formPage.screenshot({path: `test-results/error-screenshots/PurchaseRequest/error_${logDate}.png`, fullPage: true});
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