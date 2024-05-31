import { Page, Response } from "@playwright/test";
import { GetEnviroment } from "../../helper/Env/env";
import { Fixtures } from "../../hooks/PagesFixtures";

export default class LoginPage 
{
    constructor(private page: Page) 
    {
        this.page = page;
    }

    
    private Elements = 
    {
        goToLoginPage: "https://testsofa.602.cz/",
        firstNextBtn: "Další",
        secondNextBtn: "Další",
        //firstNextBtn: "Next",
        //secondNextBtn: "Next",
        userNameLocator: "#UserName",
        userPasswordLocator: "#Password",
    }
   
    async NavigateToLoginPage(loginpage: string)
    {       
        await this.page.goto(loginpage);
        console.log("Iam in login page.");           
    }

    async FillUserName(userName: string)
    {
        await this.page.locator(this.Elements.userNameLocator).fill(userName);
        await this.page.getByRole('button', { name: this.Elements.firstNextBtn }).click();
        await this.page.waitForLoadState('networkidle', { timeout: 10000 });
        console.log("Clik on next after fill email.");  
    }

    async FillPassword(userPassword: string)
    {
        await this.page.locator(this.Elements.userPasswordLocator).fill(userPassword);
        await this.page.getByRole('button', { name: this.Elements.secondNextBtn }).click();
        await this.page.waitForLoadState('networkidle', { timeout: 10000 });
        console.log("Click on next after fill password.");  
    }
}