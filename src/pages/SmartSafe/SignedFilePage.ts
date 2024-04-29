import { Page, expect, Browser } from "@playwright/test";
import { StreamTransportInstance } from "winston/lib/winston/transports";

const SmartSafeMeta = require('../../helper/Util/TestData/SmartSafeMeta.json');

export default class SignedFilesPage 
{
    browser: Browser;

    constructor(private page: Page) 
    {
        this.page = page;
        this.browser = this.browser;

        const { setDefaultTimeout } = require('@cucumber/cucumber');
        setDefaultTimeout(60 * 1000); // Nastaví defaultní timeout na 60 sekund pro všechny kroky
    }


    async FindFileByDescription(description: string, 
                                category: string, 
                                completeName: string, 
                                initials: string,
                                fileDes: string,
                                handleBy: string,
                                startTime: string,
                                eNumber: string,
                                createTime: string,
                                docSize: string,
                                procState: string,
                                signState: string,
                                attempt = 0): Promise<boolean> 
    {
         // #region Deklarace konstant
         const authorAgenda = SmartSafeMeta.dataAutomationKey.authorAgenda;
         const categoryKey = SmartSafeMeta.dataAutomationKey.meta_signBookFileCategory;
         const lockedBy = SmartSafeMeta.dataAutomationKey.lockedBy;
         const meta_closedBy = SmartSafeMeta.dataAutomationKey.meta_closedBy;
         const meta_docName = SmartSafeMeta.dataAutomationKey.meta_docName;
         const meta_docDescription = SmartSafeMeta.dataAutomationKey.meta_docDescription;
         const name = SmartSafeMeta.dataAutomationKey.name;
         const size = SmartSafeMeta.dataAutomationKey.size;
         const meta_fileDescription = SmartSafeMeta.dataAutomationKey.meta_fileDescription;
         const meta_handledBy = SmartSafeMeta.dataAutomationKey.meta_handledBy;
         const meta_startTime = SmartSafeMeta.dataAutomationKey.meta_startTime;
         const evidenceNumber = SmartSafeMeta.dataAutomationKey.evidenceNumber;
         const creationTime = SmartSafeMeta.dataAutomationKey.creationTime;
         const processingState = SmartSafeMeta.dataAutomationKey.processingState;
         const signingState = SmartSafeMeta.dataAutomationKey.signingState;
         const maxAttempts = 10; // Maximální počet pokusů o nalezení popisu
         // #endregion
 
         if (attempt >= maxAttempts) 
         {
             console.log('Maximální počet pokusů byl dosažen.');
             return false;
         }
         const rows = await this.page.locator('.ms-List-cell');
         const rowCount = await rows.count();
         console.log(`Počet řádků: ${rowCount}`);


        for (let i = 0; i < rowCount; i++) 
        {
            const row = rows.nth(i);
            const descriptionTextContent = await row.locator(`div[data-automation-key="${meta_docName}"]`).textContent();
            if (descriptionTextContent?.trim() === description)
            {
                // Pokud se popis shoduje, provedeme potřebné akce
                console.log(`Nalezen popis na řádku ${i}`);

                // Pokud se popis shoduje, ověřte další informace v řádku
                // category
                const categoryLocator = await row.locator(`div[data-automation-key="${categoryKey}"] span`).textContent();
                console.log(`Kategorie: Očekávaná - ${category}, Získaná - ${categoryLocator}`);
                await expect(row.locator(`div[data-automation-key="${categoryKey}"] span`)).toHaveText(category, { timeout: 10000} );
                // closed by full name
                const fullNameLocator = await row.locator(`div[data-automation-key="${meta_closedBy}"] span`).textContent();
                console.log(`Kategorie: Očekávaná - ${completeName}, Získaná - ${fullNameLocator}`);
                await expect(row.first().locator(`div[data-automation-key="${meta_closedBy}"] .ms-TooltipHost`)).toContainText(completeName);
                // closed by initials (icon)
                const inicialsNameLocator = await row.locator(`div[data-automation-key="${meta_closedBy}"] span`).textContent();
                console.log(`Kategorie: Očekávaná - ${initials}, Získaná - ${inicialsNameLocator}`);
                await expect(row.locator(`div[data-automation-key="${meta_closedBy}"] .ms-Persona-initials span`)).toHaveText(initials);
                // file description
                const fileDescriptionLocator = await row.locator(`div[data-automation-key="${meta_fileDescription}"] span`).textContent();
                console.log(`Kategorie: Očekávaná - ${fileDes}, Získaná - ${fileDescriptionLocator}`);
                await expect(row.locator(`div[data-automation-key="${meta_fileDescription}"] span`)).toHaveText(fileDes, { timeout: 10000} );

                /*
                // Asertace textu v každém relevantním elementu
                await expect(rows.nth(i).locator(`div[data-automation-key="${meta_docName}"]`)).toContainText(description);
                await expect(rows.nth(i).locator(`div[data-automation-key="${categoryKey}"] span`)).toHaveText(category);
                const lockedByLocator = rows.nth(i).locator(`div[data-automation-key="${lockedBy}"] span`);
                await expect(lockedByLocator).toHaveText('Nezamčeno');
                await expect(rows.nth(i).locator(`div[data-automation-key="${closedBy}"] .ms-Persona-primaryText`)).toHaveText(completeName);
                await expect(rows.nth(i).locator(`div[data-automation-key="${closedBy}"] .ms-Persona-initials span`)).toHaveText(initials);
                await expect(rows.nth(i).locator(`div[data-automation-key="${size}"] span`)).toHaveText(docSize);
                await expect(rows.nth(i).locator(`div[data-automation-key="${name}"] a[title$=".pdf"]`)).toHaveText(fileDes);
                await expect(rows.nth(i).locator(`div[data-automation-key="${meta_handledBy}"]`)).toContainText(handleBy);
                await expect(rows.nth(i).locator(`div[data-automation-key="${meta_startTime}"] span`)).toHaveText(startTime);
                await expect(rows.nth(i).locator(`div[data-automation-key="${evidenceNumber}"]`)).toContainText(eNumber);
                await expect(rows.nth(i).locator(`div[data-automation-key="${creationTime}"]`)).toContainText(createTime);
                await expect(rows.nth(i).locator(`div[data-automation-key="${processingState}"]`)).toContainText(procState);
                await expect(rows.nth(i).locator(`div[data-automation-key="${signingState}"]`)).toContainText(signState);
                */
                
                // Klikněte na první odkaz v řádku, pokud všechny asertace projdou
                const agendaFormLinkLocator = row.locator(`div[data-automation-key="${authorAgenda}"] a:first-of-type`);
                await agendaFormLinkLocator.click();
                return true;
            }
        }
            // Popis nebyl nalezen v žádném řádku, zkusíme znovu, pokud nebyl dosažen maximální počet pokusů
            console.log('Popisek nebyl nalezen, obnovuji stránku...');
            if (attempt < maxAttempts) {
                await this.page.reload();
                await this.page.waitForLoadState('networkidle'); // Čekáme, až se stránka plně načte
                return this.FindFileByDescription(description, 
                                              category,
                                              completeName,
                                              initials,
                                              fileDes,
                                              handleBy,
                                              startTime,
                                              eNumber,
                                              createTime,
                                              docSize,
                                              procState,
                                              signState,
                                              attempt + 1); // Rekurzivně zkoušíme znovu
                }
                return false;
    }  
}

