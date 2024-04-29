/*
import { setWorldConstructor } from "@cucumber/cucumber";
import LoginPage from "../../pages/Login/LoginPage";
import { Page } from "@playwright/test";

// Přidávej další stránky nebo vlastnosti, které chceš sdílet
interface CustomWorld 
{
    loginPage: LoginPage;
    
}

class MyWorld implements CustomWorld 
{
    loginPage: LoginPage;


    // Inicializujte další stránky nebo vlastnosti zde
    constructor(private page: Page) 
    {
        this.page = page;
        this.loginPage = new LoginPage(page);
        
    }
}

setWorldConstructor(MyWorld);
*/