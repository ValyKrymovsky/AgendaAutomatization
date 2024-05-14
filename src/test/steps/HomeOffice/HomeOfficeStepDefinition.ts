import { Given, Then, When } from "@cucumber/cucumber"
import { Fixtures } from "../../../hooks/PagesFixtures";
import LoginPage from "../../../pages/Login/LoginPage";
import { expect } from "@playwright/test";
import { randomBytes } from "crypto";
import AgendasPage from "../../../pages/Agendas/AgendasPage";
import HomeOfficePage from "../../../pages/HomeOffice/HomeOfficePage";
import { Page } from "puppeteer";


let loginPage: LoginPage;
let homeOfficePage: HomeOfficePage;
let debugPage: Page
let agendasPage: AgendasPage;


Then('Open HO page', async function ()
{
    if (!agendasPage) agendasPage = new AgendasPage(this.page);
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    var form = await agendasPage.OpenFormPage("Home office");
    homeOfficePage = new HomeOfficePage(form.formPage);
    homeOfficePage.instanceId = form.instanceId;
});

Then('Fill out HO {string}', async function(fillOption: string)
{
    if (fillOption === "all")
        await homeOfficePage.FillAllFields();
    else if (fillOption === "required")
        await homeOfficePage.FillRequiredFields();

    await homeOfficePage.formPage.waitForEvent('close');
    console.log("Filled out form page.");
});

Then('Open HO instance', async function()
{
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    await agendasPage.AgendasTabManager("K vyřízení");
    const [newPage] = await Promise.all([
        agendasPage.agendasPage.context().waitForEvent('page', { timeout: 50000 }), // Čeká na nový tab s vlastním timeoutem
        await (await agendasPage.FindAgendaByInstanceId(homeOfficePage.instanceId, 15)).click(),
    ]);
    await newPage.waitForLoadState('networkidle', { timeout: 50000 });
    homeOfficePage.formPage = newPage;
    console.log("Page loaded.");
});

Then('{string} HO request', async function(action: string)
{
    await homeOfficePage.CompleteAction(action);
    await homeOfficePage.formPage.waitForEvent('close');
    console.log("Page closed.");
});

Then('Check if HO is {string}', async function(action: string)
{
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    await agendasPage.AgendasTabManager("Uzavřené");
    var agendaInstanceLocator = await agendasPage.FindAgendaByInstanceId(homeOfficePage.instanceId, 30);
    var instanceStateLocator = await agendaInstanceLocator.getByText(action);
    if (instanceStateLocator)
        console.log(`Agenda je správně ve stavu ${action}.`);
    else
        console.error("Agenda nebyla správně ukončena. Buďto se něco pokazilo, nebo byl uveden malý počet pokusů na nalezení agendy.");

    agendasPage = null;
});

Then('Change {string} field to {string} and send', async function(fieldId: string, value: string)
{
    await homeOfficePage.FillOutSpecificField(fieldId, value);
});
