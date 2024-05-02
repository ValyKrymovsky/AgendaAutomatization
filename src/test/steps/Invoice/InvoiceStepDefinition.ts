import { Given, Then, When } from "@cucumber/cucumber"
import { Fixtures } from "../../../hooks/PagesFixtures";
import LoginPage from "../../../pages/Login/LoginPage";
import { expect } from "@playwright/test";
import { randomBytes } from "crypto";
import AgendasPage from "../../../pages/Agendas/AgendasPage";
import InvoicePage from "../../../pages/Invoice/InvoicePage";
import { Page } from "puppeteer";

let loginPage: LoginPage;
let invoicePage: InvoicePage;
let debugPage: Page
let agendasPage: AgendasPage;


Then('Open invoice page', async function ()
{
    if (!agendasPage) agendasPage = new AgendasPage(this.page);
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    var form = await agendasPage.OpenFormPage("Faktura");
    invoicePage = new InvoicePage(form.formPage);
    invoicePage.instanceId = form.instanceId;
});

Then('Fill out Invoice {string}', async function(fillOption: string)
{
    if (fillOption === "all")
        await invoicePage.FillAllFields();
    else if (fillOption === "required")
        await invoicePage.FillRequiredFields();

    await invoicePage.formPage.waitForEvent('close');
    console.log("Filled out form page.");
});
