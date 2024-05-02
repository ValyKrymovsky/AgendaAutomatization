import { Given, Then, When } from "@cucumber/cucumber"
import { Fixtures } from "../../../hooks/PagesFixtures";
import LoginPage from "../../../pages/Login/LoginPage";
import { expect } from "@playwright/test";
import AgendasPage from "../../../pages/Agendas/AgendasPage";
import { Page } from "puppeteer";


let loginPage: LoginPage;
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
