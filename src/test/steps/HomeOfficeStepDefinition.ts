import { Given, Then, When } from "@cucumber/cucumber"
import { Fixtures } from "../../hooks/PagesFixtures";
import LoginPage from "../../pages/Login/LoginPage";
import { expect } from "@playwright/test";
import { randomBytes } from "crypto";
import AgendasPage from "../../pages/Agendas/AgendasPage";
import HomeOfficePage from "../../pages/HomeOffice/HomeOfficePage";
import { Page } from "puppeteer";


let loginPage: LoginPage;
let homeOfficePage: HomeOfficePage;
let debugPage: Page
let agendasPage: AgendasPage;

Given('Login', async function ()
{
    loginPage = new LoginPage(this.page);
    await loginPage.NavigateToLoginPage(process.env.BASEURL);
    await loginPage.FillUserName(process.env.EMAIL);
    await loginPage.FillPassword(process.env.PASSWORD);
    agendasPage = new AgendasPage(this.page);
});

Then('Open HO page', async function ()
{
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    var form = await agendasPage.OpenFormPage("Home office");
    homeOfficePage = new HomeOfficePage(form.formPage);
    homeOfficePage.instanceId = form.instanceId;
});

Then('Send HO', async function()
{
    await homeOfficePage.FillOutAllFields();
    await homeOfficePage.formPage.waitForEvent('close');
    console.log("Filled out form page.");
});

Then('Switch to user:{string}, id:{string}', async function (userName: string, userId: string)
{
    const currentUserLocator = await agendasPage.agendasPage.locator(`//div[@class = 'ms-Persona-primaryText primaryText-201']`);
    const locatorText = await currentUserLocator.innerText();
    const currentUserName = locatorText.substring(0, locatorText.length - 1);
    console.log(currentUserName);
    if (currentUserName === userName)
        console.log("Already logged in as the specified user!");
    else
    {
        console.log(`Switching to user: ${userName}`);
        await agendasPage.SwitchToUserById(userId);
        console.log("Finished user switch process");
    }
});

Then('Open HO instance', async function()
{
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    await agendasPage.AgendasTabManager("K vyřízení");
    const [newPage] = await Promise.all([
        agendasPage.agendasPage.context().waitForEvent('page', { timeout: 50000 }), // Čeká na nový tab s vlastním timeoutem
        (await agendasPage.FindAgendaByInstanceId(homeOfficePage.instanceId, 15)).click(),
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

Then('Check if {string}', async function(action: string)
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
});

Then('Change {string} field to {string} and send', async function(fieldId: string, value: string)
{
    await homeOfficePage.FillOutSpecificField(fieldId, value);
});
