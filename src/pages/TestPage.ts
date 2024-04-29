import { Page, expect, Browser } from "@playwright/test";

export default class SignPointPage {
    browser: Browser;

    //signPointPanelSelector: string = 'Žádost o podpis dokumentů s uložením do SmartSafe';
    newPage: any; // Přidáváme proměnnou pro uchování referenci na nový tab
    constructor(private page: Page) {
        this.page = page;
        this.browser = this.browser;

        const { setDefaultTimeout } = require('@cucumber/cucumber');
        setDefaultTimeout(60 * 1000); // Nastaví defaultní timeout na 60 sekund pro všechny kroky

    }


    private Elements =
        {
            signButton: "Podepsat",
            userNameText: "//*[text()='Jméno uživatele:']",
            personalNumberText: "Osobní číslo:",
            signPointPanelSelector: 'SignPoint',
            inputFileButton: '#wf_btm0_attachment',
            filePath: "D:/Repositories/MyRepositories/PlaywrightAutomation/PlaywrightBDD/files/download.pdf"

        }


        

        async goToAgendasHromadnyPodpis() {
            
        }
    
}

