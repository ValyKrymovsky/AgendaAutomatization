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

Given('Login', async function ()
{
    loginPage = new LoginPage(this.page);
    await loginPage.NavigateToLoginPage(process.env.BASEURL);
    await loginPage.FillUserName(process.env.EMAIL);
    await loginPage.FillPassword(process.env.PASSWORD);
});

Then('Open invoice page', async function ()
{
    invoicePage = new InvoicePage(this.page);
    await invoicePage.GoToAgendasPage();
    console.log("I'm in agendas page.");
    await invoicePage.OpenFormPage();
    console.log("I'm in invoice form page.");
});


Then('Fill out form', async function()
{
    await invoicePage.FillOutForm();
    console.log("Filled out form page.");
});
