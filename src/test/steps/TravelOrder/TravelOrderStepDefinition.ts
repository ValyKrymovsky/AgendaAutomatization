import { Given, Then, When } from "@cucumber/cucumber"
import { Fixtures } from "../../../hooks/PagesFixtures";
import LoginPage from "../../../pages/Login/LoginPage";
import { expect } from "@playwright/test";
import { randomBytes } from "crypto";
import AgendasPage from "../../../pages/Agendas/AgendasPage";
import TravelOrderPage from "../../../pages/TravelOrder/TravelOrderPage";
import { Page } from "puppeteer";

let loginPage: LoginPage;
let travelOrderPage: TravelOrderPage;
let debugPage: Page
let agendasPage: AgendasPage;


Then('Open Travel order page', async function ()
{
    if (!agendasPage) agendasPage = new AgendasPage(this.page);
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    var form = await agendasPage.OpenFormPage("Cestovní příkaz");
    travelOrderPage = new TravelOrderPage(form.formPage);
    travelOrderPage.instanceId = form.instanceId;
});

Then('Fill out Travel order', async function()
{
    await travelOrderPage.FillAllFields();

    await travelOrderPage.formPage.close();
    console.log("Filled out form page.");
});

Then('{string} Travel order as approver', async function(action: string)
{
    await travelOrderPage.CompleteActionAsApprover(action);
    await travelOrderPage.formPage.close();
    console.log("Page closed.");
});

Then('{string} Travel order as approver second time', async function(action: string)
{
    await travelOrderPage.CompleteActionAsApprover2(action);
    await travelOrderPage.formPage.close();
    console.log("Page closed.");
});

Then('{string} Travel order as accountant', async function(action: string)
{
    await travelOrderPage.CompleteActionAsAccountant(action);
    await travelOrderPage.formPage.close();
    console.log("Page closed.");
});

Then('{string} Travel order as biller', async function(action: string)
{
    await travelOrderPage.CompleteActionAsBiller(action);
    await travelOrderPage.formPage.close();
    console.log("Page closed.");
});

Then('Open Travel order instance', async function()
{
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    await agendasPage.AgendasTabManager("K vyřízení");
    await (await agendasPage.FindAgendaByInstanceId(travelOrderPage.instanceId, 15)).click();
    const newPage = await agendasPage.agendasPage.context().waitForEvent('page', { timeout: 50000 }); // Čeká na nový tab s vlastním timeoutem

    await newPage.waitForLoadState('networkidle', { timeout: 50000 });
    travelOrderPage.formPage = newPage;
    console.log("Page loaded.");
});


Then('Check if Travel order is {string}', async function(action: string)
{
   if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    await agendasPage.AgendasTabManager("Uzavřené");

    var rowLocator = (await agendasPage.FindAgendaByInstanceId(travelOrderPage.instanceId, 30)).locator('..').locator('..').locator('..');
    await agendasPage.CheckAgendaState(rowLocator, action);
});

Then('End Travel order test', async function()
{
    agendasPage = null;
    loginPage = null;
    travelOrderPage = null;
    debugPage = null;
});
