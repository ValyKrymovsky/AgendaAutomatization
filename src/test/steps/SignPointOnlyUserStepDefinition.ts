import { Given, Then, When } from "@cucumber/cucumber"
import { Fixtures } from "../../hooks/PagesFixtures";
import SignPointPage from "../../pages/SignPoint/SignPointPage";
import LoginPage from "../../pages/Login/LoginPage";
import { expect } from "@playwright/test";
import { randomBytes } from "crypto";
import AgendasPage from "../../pages/Agendas/AgendasPage";

let signpointPage: SignPointPage;
let loginPage: LoginPage;
let agendasPage: AgendasPage;
let globalRandomString = '';
const filePath = "C:/Users/HP/Downloads/document.pdf"
const signpoint = "https://testsofa.602.cz/Process/StartNewProcess?ProcessAgendaIdent=5ebe1ec1-73b5-4458-bd57-ab5c30372841&userIdent=fc225f1f-97cf-4877-884f-aa4d9f705707"

Given('Succes Login', async function () {
    loginPage = new LoginPage(this.page);
    await loginPage.NavigateToLoginPage(process.env.BASEURL);
    await loginPage.FillUserName(process.env.EMAIL);
    await loginPage.FillPassword(process.env.PASSWORD);
});

Given('SignPoint page open', async function () {
    const crypto = require('crypto');
    globalRandomString = crypto.randomBytes(8).toString('hex');
    this.globalRandomString = globalRandomString; // Store it in the World context
    console.log(`Random string generated: ${globalRandomString}`);
    const { setDefaultTimeout } = require('@cucumber/cucumber');

    setDefaultTimeout(160 * 1000); // Nastaví defaultní timeout na x sekund pro všechny kroky

    signpointPage = new SignPointPage(this.page);
    await signpointPage.GoToAgendas();
    console.log("Iam in agendas page.");
    await signpointPage.NavigateToSignPoint();
    console.log("Iam in signpoint page.");
});

Then('Try sign and chcek warning', async function () {
    console.log("trying click on sign.");
    await signpointPage.TrySign();
    console.log("Try sign and close dialog.");
});

Then('Fill SignPoint and check data', async function () {
    await signpointPage.FillSignPoint(this.globalRandomString);
    console.log("File uploaded.");

    console.log("All fill.");
});

Then('Sign SignPoint with cert', async function () {
    await signpointPage.CheckSignFrame();
    console.log("Document is signed.");
});

Then('Send to archive', async function () {
    await signpointPage.SendToArchive();
    console.log("Sended.");
});

Then('Go on closed and verify SP', async function () {
    agendasPage = new AgendasPage(this.page);
    await agendasPage.AgendasTabManager('Uzavřené');
    await agendasPage.FindAgendaByDescription('6694133479bc6723');
    console.log("SP in closed veryfi ok.");
});
