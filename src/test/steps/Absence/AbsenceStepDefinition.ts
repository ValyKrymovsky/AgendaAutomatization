import { Given, Then, When, setDefaultTimeout } from "@cucumber/cucumber"
import { Fixtures } from "../../../hooks/PagesFixtures";
import LoginPage from "../../../pages/Login/LoginPage";
import { expect } from "@playwright/test";
import { randomBytes } from "crypto";
import AgendasPage from "../../../pages/Agendas/AgendasPage";
import AbsencePage from "../../../pages/Absence/AbsencePage";
import { Page } from "puppeteer";
import { setTimeout } from "timers/promises";

let loginPage: LoginPage;
let absencePage: AbsencePage;
let debugPage: Page
let agendasPage: AgendasPage;


Then('Open Absence page', async function ()
{
    if (!agendasPage) agendasPage = new AgendasPage(this.page);
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    var form = await agendasPage.OpenFormPage("Nepřítomnost");
    absencePage = new AbsencePage(form.formPage);
    absencePage.instanceId = form.instanceId;
});

Then('Fill out Absence {string}', async function(fillOption: string)
{
    if (fillOption === "all")
        await absencePage.FillAllFields();
    else if (fillOption === "required")
        await absencePage.FillRequiredFields();

    await absencePage.formPage.waitForEvent('close');
    console.log("Filled out form page.");
});

Then('Open Absence instance', async function()
{
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    await agendasPage.AgendasTabManager("K vyřízení");
    await (await agendasPage.FindAgendaByInstanceId(absencePage.instanceId, 15)).click();
    const newPage = await agendasPage.agendasPage.context().waitForEvent('page', { timeout: 50000 }); // Čeká na nový tab s vlastním timeoutem

    await newPage.waitForLoadState('networkidle', { timeout: 50000 });
    absencePage.formPage = newPage;
    console.log("Page loaded.");
});

Then('{string} Absence request as approver', async function(action: string)
{
    await absencePage.CompleteActionAsApprover(action);
    await absencePage.formPage.waitForEvent('close');
    console.log("Page closed.");
});

Then('{string} Absence request as accountant', async function(action: string)
{
    await absencePage.CompleteActionAsAccountant(action);
    await absencePage.formPage.waitForEvent('close');
    console.log("Page closed.");
});

Then('Check if Absence is {string}', async function(action: string)
{
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    await agendasPage.AgendasTabManager("Uzavřené");
    console.log(absencePage.instanceId);
    var agendaInstanceLocator = (await agendasPage.FindAgendaByInstanceId(absencePage.instanceId, 30)).locator('..').locator('..').locator('..');
    /*

    for (let i = 0; i < (await agendaInstanceLocator.allInnerTexts()).length; i++)
    {
        console.log((await agendaInstanceLocator.allInnerTexts())[i] + "\n");
    }
    */
    var instanceStateLocator = await agendaInstanceLocator.getByTitle(action);
    console.log(await instanceStateLocator.innerText());
    if (instanceStateLocator != null)
        console.log(`Agenda je správně ve stavu ${action}.`);
    else
        console.error("Agenda nebyla správně ukončena. Buďto se něco pokazilo, nebo byl uveden malý počet pokusů na nalezení agendy.");

    agendasPage = null;
});

Then('Change {string} field to {string} and send', async function(fieldId: string, value: string)
{
    await absencePage.FillOutSpecificField(fieldId, value);
});

Then('Wait for {int} seconds', { timeout: 600 * 1000 }, async function(waitTime)
{
    const originalTimeout = 
    await setTimeout(waitTime * 1000);
});
