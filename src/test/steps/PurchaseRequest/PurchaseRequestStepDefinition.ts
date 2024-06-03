import { Given, Then, When } from "@cucumber/cucumber"
import { Fixtures } from "../../../hooks/PagesFixtures";
import LoginPage from "../../../pages/Login/LoginPage";
import { expect } from "@playwright/test";
import { randomBytes } from "crypto";
import AgendasPage from "../../../pages/Agendas/AgendasPage";
import PurchaseRequest from "../../../pages/PurchaseRequest/PurchaseRequestPage";
import { Page } from "puppeteer";

let loginPage: LoginPage;
let purchaseRequest: PurchaseRequest;
let debugPage: Page
let agendasPage: AgendasPage;


Then('Open Purchase request page', async function ()
{
    if (!agendasPage) agendasPage = new AgendasPage(this.page);
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    var form = await agendasPage.OpenFormPage("Nákupní požadavek");
    purchaseRequest = new PurchaseRequest(form.formPage);
    purchaseRequest.instanceId = form.instanceId;
});

Then('Fill out Purchase request {string}', async function(fillOption: string)
{
    if (fillOption === "all")
        await purchaseRequest.FillAllFields();
    else if (fillOption === "required")
        await purchaseRequest.FillRequiredFields();

    await purchaseRequest.formPage.close();
    console.log("Filled out form page.");
});

Then('Open Purchase request instance', async function()
{
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    await agendasPage.AgendasTabManager("K vyřízení");
    await (await agendasPage.FindAgendaByInstanceId(purchaseRequest.instanceId, 15)).click();
    const newPage = await agendasPage.agendasPage.context().waitForEvent('page', { timeout: 50000 }); // Čeká na nový tab s vlastním timeoutem

    await newPage.waitForLoadState('networkidle', { timeout: 50000 });
    purchaseRequest.formPage = newPage;
    console.log("Page loaded.");
});

Then('{string} Purchase request as center manager', async function(action: string)
{
    await purchaseRequest.CompleteActionAsCenterManager(action);
    await purchaseRequest.formPage.close();
    console.log("Page closed.");
});

Then('{string} Purchase request as purchase manager', async function(action: string)
{
    await purchaseRequest.CompleteActionAsPurchaseManager(action);
    await purchaseRequest.formPage.close();
    console.log("Page closed.");
});

Then('Check if Purchase request is {string}', async function(action: string)
{
   if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    await agendasPage.AgendasTabManager("Uzavřené");

    var rowLocator = (await agendasPage.FindAgendaByInstanceId(purchaseRequest.instanceId, 30)).locator('..').locator('..').locator('..');
    await agendasPage.CheckAgendaState(rowLocator, action);
});

Then('End Purchase request test', async function()
{
    agendasPage = null;
    loginPage = null;
    purchaseRequest = null;
    debugPage = null;
});
