import { Given, Then, When } from "@cucumber/cucumber"
import { Fixtures } from "../../../hooks/PagesFixtures";
import LoginPage from "../../../pages/Login/LoginPage";
import { expect } from "@playwright/test";
import AgendasPage from "../../../pages/Agendas/AgendasPage";
import { Page } from "puppeteer";
import { setTimeout } from "timers/promises";


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

Then('Wait for {int} seconds', { timeout: 600 * 1000 }, async function(waitTime)
{
    const originalTimeout = 
    await setTimeout(waitTime * 1000);
});