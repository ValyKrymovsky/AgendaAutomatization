import { Given, Then, When } from "@cucumber/cucumber"
import { Fixtures } from "../../../hooks/PagesFixtures";
import LoginPage from "../../../pages/Login/LoginPage";
import { expect } from "@playwright/test";
import { randomBytes } from "crypto";
import AgendasPage from "../../../pages/Agendas/AgendasPage";
import ContractPage from "../../../pages/Contract/ContractPage";
import { Page } from "puppeteer";

let loginPage: LoginPage;
let contractPage: ContractPage;
let debugPage: Page
let agendasPage: AgendasPage;


Then('Open Contract page', async function ()
{
    if (!agendasPage) agendasPage = new AgendasPage(this.page);
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    var form = await agendasPage.OpenFormPage("Smlouva");
    contractPage = new ContractPage(form.formPage);
    contractPage.instanceId = form.instanceId;
});

Then('Fill out Contract {string}', async function(fillOption: string)
{
    if (fillOption === "all")
        await contractPage.FillAllFields();
    else if (fillOption === "required")
        await contractPage.FillRequiredFields();

    await contractPage.formPage.waitForEvent('close');
    console.log("Filled out form page.");
});

Then('Open Contract instance', async function()
{
    if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    await agendasPage.AgendasTabManager("K vyřízení");
    await (await agendasPage.FindAgendaByInstanceId(contractPage.instanceId, 15)).click();
    const newPage = await agendasPage.agendasPage.context().waitForEvent('page', { timeout: 50000 }); // Čeká na nový tab s vlastním timeoutem

    await newPage.waitForLoadState('networkidle', { timeout: 50000 });
    contractPage.formPage = newPage;
    console.log("Page loaded.");
});

Then('{string} Contract as approver', async function(action: string)
{
    await contractPage.CompleteActionAsApprover(action);
    await contractPage.formPage.waitForEvent('close');
    console.log("Page closed.");
});

Then('{string} Contract as owner', async function(action: string)
{
    await contractPage.CompleteActionAsOwner(action);
    await contractPage.formPage.waitForEvent('close');
    console.log("Page closed.");
});

Then('{string} Contract', async function(action: string)
{
    await contractPage.CompleteEvidence(action);
    await contractPage.formPage.waitForEvent('close');
    console.log("Page closed.");
});

Then('Check if Contract is {string}', async function(action: string)
{
   if (!agendasPage.IsInAgendasPage())
        await agendasPage.GoToAgendasPage();

    await agendasPage.AgendasTabManager("Uzavřené");

    var rowLocator = (await agendasPage.FindAgendaByInstanceId(contractPage.instanceId, 30)).locator('..').locator('..').locator('..');
    await agendasPage.CheckAgendaState(rowLocator, action);
});

Then('Send returned Contract', async function()
{
    await contractPage.ResendAfterReturn();
});

Then('End Contract test', async function()
{
    agendasPage = null;
    loginPage = null;
    contractPage = null;
    debugPage = null;
});
