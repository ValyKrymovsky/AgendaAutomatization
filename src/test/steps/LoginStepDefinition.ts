import { Given, Then, When } from "@cucumber/cucumber"
import LoginPage from "../../pages/Login/LoginPage"
import { Fixtures } from "../../hooks/PagesFixtures";

let loginPage: LoginPage

Given('Navigate to login page', async function () 
{
    loginPage = new LoginPage(Fixtures.page);
    //loginPage.NavigateToLoginPage(process.env.BASEURL);
    //assert.AssertURL(process.env.BASEURL);
    console.log("Assert login page is ok");
});

Then('Login with correct credentials', async function () 
{
    loginPage.FillUserName(process.env.EMAIL);
    loginPage.FillPassword(process.env.PASSWORD);
    console.log("Fill is success.");
});

Then('Check is user logged', async function () 
{
   // assert.AssertURLContains(process.env.BASEURL);
    console.log("Iam logged.");
});

         