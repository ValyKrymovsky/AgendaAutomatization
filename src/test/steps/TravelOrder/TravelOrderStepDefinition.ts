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


Then('Open Purchase request page', async function ()
{
    if (!agendasPage) agendasPage = new AgendasPage(this.page);
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    var form = await agendasPage.OpenFormPage("Nákupní požadavek");
    travelOrderPage = new TravelOrderPage(form.formPage);
    travelOrderPage.instanceId = form.instanceId;
});

Then('Fill out Purchase request {string}', async function(fillOption: string)
{
    if (fillOption === "all")
        await travelOrderPage.FillAllFields();

    await travelOrderPage.formPage.close();
    console.log("Filled out form page.");
});

Then('Open Purchase request instance', async function()
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


Then('Check if Purchase request is {string}', async function(action: string)
{
   if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    await agendasPage.AgendasTabManager("Uzavřené");

    var rowLocator = (await agendasPage.FindAgendaByInstanceId(travelOrderPage.instanceId, 30)).locator('..').locator('..').locator('..');
    await agendasPage.CheckAgendaState(rowLocator, action);
});

Then('End Purchase request test', async function()
{
    agendasPage = null;
    loginPage = null;
    travelOrderPage = null;
    debugPage = null;
});
