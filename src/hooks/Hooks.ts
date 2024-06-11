import { BeforeAll, AfterAll, After, Before, BeforeStep, AfterStep, Status } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "@playwright/test";
import { InvokeBrowser } from "../helper/Browsers/BrowserManager";
import { GetEnviroment } from "../helper/Env/env";
import { createLogger, loggers } from "winston";
import { Logger } from "winston";
import { Options } from "../helper/Util/Logger";
import SignPointPage from "../pages/SignPoint/SignPointPage";
import LoginPage from "../pages/Login/LoginPage";
import TestPage from "../pages/TestPage";
import AgendasPage from "../pages/Agendas/AgendasPage";
import SmartSageManagerPage, { LinkNames } from "../pages/SmartSafe/SmartSageManagerPage";
import SignedFilesPage from "../pages/SmartSafe/SignedFilePage";
import AllFilesPage from "../pages/SmartSafe/AllFilesPage";     
import HomeOfficePage from "../pages/HomeOffice/HomeOfficePage";
import InvoicePage from "../pages/Invoice/InvoicePage";
import AbsencePage from "../pages/Absence/AbsencePage";
import ContractPage from "../pages/Contract/ContractPage";
import PurchaseRequestPage from "../pages/PurchaseRequest/PurchaseRequestPage";


// Vytvoření globálního loggeru
const logger = createLogger(Options());
const { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(60 * 1000); // Nastaví defaultní timeout na 60 sekund pro všechny kroky

let page: Page;
let signpointPage: SignPointPage;
let loginPage: LoginPage;
let agendasPage: AgendasPage;
let testPage: TestPage;
let homeOfficePage: HomeOfficePage;
let invoicePage: InvoicePage;
let absencePage: AbsencePage
let contractPage: ContractPage;
let purchaseRequestPage: PurchaseRequestPage;
let smartSafeManagerPage: SmartSageManagerPage;
let signedFilesPage: SignedFilesPage;
let allFilesPage: AllFilesPage;

//page.setDefaultTimeout(30000);
const fs = require("fs-extra");
let browser: Browser
let context: BrowserContext;

BeforeAll(async function() 
{   
    console.log("start of BeforeAll.");
    // Get env
    GetEnviroment();
    console.log("Got environment.");
    // Set browser with basic options
    browser = await InvokeBrowser(); 
    console.log("Invoked browser.");
}); 

Before(async function ({ pickle }) {
    const scenarioName = `${pickle.name}_${pickle.id}`;
    console.log(`Scenario name: ${scenarioName}`);

    // Setup context
    context = await browser.newContext({
        viewport: null,

        recordVideo: {
            dir: "test-results/videos",
        },
        
    });
    console.log("Created browser context.");
    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true, snapshots: true
    });
    console.log("Started tracing.");
    console.log(context.backgroundPages().length)
    const page = await context.newPage();
    console.log(context.backgroundPages().length)
    console.log("Created new page.");
    this.logger = createLogger(Options(pickle.name));
    console.log("Created logger.");
    this.logger = logger;
    this.page = page;
    // Inicializace POM
    testPage = new TestPage(page);
    loginPage = new LoginPage(page);
    smartSafeManagerPage = new SmartSageManagerPage(page);
    agendasPage = new AgendasPage(page);
    homeOfficePage = new HomeOfficePage(page);
    invoicePage = new InvoicePage(page);
    absencePage = new AbsencePage(page);
    contractPage = new ContractPage(page);
    purchaseRequestPage = new PurchaseRequestPage(page);
    signedFilesPage = new SignedFilesPage(page);
    signpointPage = new SignPointPage(page);
    allFilesPage = new AllFilesPage(page, logger);
    this.testPage = testPage;
    this.loginPage = loginPage;
    this.smartSafeManagerPage = smartSafeManagerPage;
    this.agendasPage = agendasPage;
    this.homeOfficePage = homeOfficePage;
    this.invociePage = invoicePage;
    this.signedFilesPage = signedFilesPage;
    this.signpointPage = signpointPage;
    this.allFilesPage = allFilesPage;
    this.absencePage = absencePage;
    this.contractPage = contractPage;
    this.purchaseRequestPage = purchaseRequestPage;

    console.log("Created and asigned all pages.");

    await page.goto(process.env.BASEURL);

    console.log("Redirected to sofa login page.");
    //this.logger = createLogger(Options(scenarioName));
});


After(async function ({ pickle, result }) {
        const scenarioName = `${pickle.name}_${pickle.id}`;
        const tracePath = `./test-results/trace/${pickle.id}.zip`;
        let videoPath: string;
        let img: Buffer;

        if (result.status !== Status.PASSED) 
        {
             // Pro selhané testy uchováme screenshot a video
             const screenshotBuffer = await this.page.screenshot();
             const videoBuffer = fs.readFileSync(await this.page.video().path());
             this.attach(screenshotBuffer, 'image/png');
             this.attach(videoBuffer, 'video/webm');
        }

        this.logger.info(`Scenario finished: ${scenarioName} with status ${result.status}`);
        await context.tracing.stop({ path: tracePath });
        await this.page.close();
        await context.close();
    });
    

AfterAll(async function () {

    await browser.close();
});




