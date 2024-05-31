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

    await invoicePage.formPage.close();
    console.log("Filled out form page.");
});

Then('Open Invoice instance', async function()
{
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    await agendasPage.AgendasTabManager("K vyřízení");
    await (await agendasPage.FindAgendaByInstanceId(invoicePage.instanceId, 15)).click();
    const newPage = await agendasPage.agendasPage.context().waitForEvent('page', { timeout: 50000 }); // Čeká na nový tab s vlastním timeoutem

    await newPage.waitForLoadState('networkidle', { timeout: 50000 });
    invoicePage.formPage = newPage;
    console.log("Page loaded.");
});

Then('{string} Invoice request as approver', async function(action: string)
{
    await invoicePage.CompleteActionAsApprover(action);
    await invoicePage.formPage.close();
    console.log("Page closed.");
});

Then('{string} Invoice request as accountant', async function(action: string)
{
    await invoicePage.CompleteActionAsAccountant(action);
    await invoicePage.formPage.close();
    console.log("Page closed.");
});

Then('Check if Invoice is {string}', async function(action: string)
{
   if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    await agendasPage.AgendasTabManager("Uzavřené");

    var rowLocator = (await agendasPage.FindAgendaByInstanceId(invoicePage.instanceId, 30)).locator('..').locator('..').locator('..');
    await agendasPage.CheckAgendaState(rowLocator, action);
});

Then('End test', async function()
{
    agendasPage = null;
    loginPage = null;
    invoicePage = null;
    debugPage = null;
});
