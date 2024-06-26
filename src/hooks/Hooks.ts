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


// Vytvoření globálního loggeru
const logger = createLogger(Options());
const { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(60 * 1000); // Nastaví defaultní timeout na 60 sekund pro všechny kroky

let page: Page;
let signpointPage: SignPointPage;
let loginPage: LoginPage;
let agendasPage: AgendasPage;
let testPage: TestPage;
let smartSafeManagerPage: SmartSageManagerPage;
let signedFilesPage: SignedFilesPage;
let allFilesPage: AllFilesPage;

//page.setDefaultTimeout(30000);
const fs = require("fs-extra");
let browser: Browser
let context: BrowserContext;

BeforeAll(async function() 
{   
    // Get env
    GetEnviroment();
    // Set browser with basic options
    browser = await InvokeBrowser(); 
}); 

Before(async function ({ pickle }) {
    const scenarioName = `${pickle.name}_${pickle.id}`;

    // Setup context
    context = await browser.newContext({
        viewport: null,

        recordVideo: {
            dir: "test-results/videos",
        },
    });

    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true, snapshots: true
    });

    const page = await context.newPage();
    this.logger = createLogger(Options(pickle.name));
    this.logger = logger;
    this.page = page;
    // Inicializace POM
    testPage = new TestPage(page);
    loginPage = new LoginPage(page);
    smartSafeManagerPage = new SmartSageManagerPage(page);
    agendasPage = new AgendasPage(page);
    signedFilesPage = new SignedFilesPage(page);
    signpointPage = new SignPointPage(page);
    allFilesPage = new AllFilesPage(page, logger);
    this.testPage = testPage;
    this.loginPage = loginPage;
    this.smartSafeManagerPage = smartSafeManagerPage;
    this.agendasPage = agendasPage;
    this.signedFilesPage = signedFilesPage;
    this.signpointPage = signpointPage;
    this.allFilesPage = allFilesPage;

    await page.goto(process.env.BASEURL);
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




