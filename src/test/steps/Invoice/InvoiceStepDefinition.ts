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
    await invoicePage.formPage.waitForEvent('close');
    console.log("Page closed.");
});

Then('{string} Invoice request as accountant', async function(action: string)
{
    await invoicePage.CompleteActionAsAccountant(action);
    await invoicePage.formPage.waitForEvent('close');
    console.log("Page closed.");
});

Then('Check if Invoice is {string}', async function(action: string)
{
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    await agendasPage.AgendasTabManager("Uzavřené");
    console.log(invoicePage.instanceId);
    var agendaInstanceLocator = await agendasPage.FindAgendaByInstanceId(invoicePage.instanceId, 30);
    var instanceStateLocator = await agendaInstanceLocator.getByText(action);
    if (instanceStateLocator)
        console.log(`Agenda je správně ve stavu ${action}.`);
    else
        console.error("Agenda nebyla správně ukončena. Buďto se něco pokazilo, nebo byl uveden malý počet pokusů na nalezení agendy.");

    agendasPage = null;
});

Then('Change {string} field to {string} and send', async function(fieldId: string, value: string)
{
    await invoicePage.FillOutSpecificField(fieldId, value);
});
