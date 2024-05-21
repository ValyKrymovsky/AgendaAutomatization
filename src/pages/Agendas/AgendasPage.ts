import { Page, expect, Browser, Locator } from "@playwright/test";
import { setTimeout } from "timers/promises";

export default class AgendasPage
{
    browser: Browser;

    //signPointPanelSelector: string = 'Žádost o podpis dokumentů s uložením do SmartSafe';
    agendasPage: Page;
    formPage: Page; // Přidáváme proměnnou pro uchování referenci na nový tab
    constructor(private page: Page) 
    {
        this.agendasPage = page;
        this.browser = this.browser;
    }

    private Elements =
    {         
    }

    async AgendasTabManager(tabAgendas: string)
    {
        switch (tabAgendas) 
        {
            case 'K vyřízení':
                await this.agendasPage.getByRole('link', { name: 'K vyřízení' }).click();
                break;
            case 'V procesu':
                await this.agendasPage.getByRole('link', { name: 'V procesu' }).click();
                break;
            case 'Uzavřené':
                await this.agendasPage.getByRole('link', { name: 'Uzavřené' }).click();
                break;
            case 'Zadat':
                await this.agendasPage.getByRole('link', { name: 'Zadat' }).click();
                break;
            case 'Přehledy':
                await this.agendasPage.getByRole('link', { name: 'Přehledy' }).click();
                break;
            default:
                console.log(`Tab '${tabAgendas}' nebyl nalezen.`);
                break;
        }

        await this.agendasPage.waitForLoadState('networkidle', { timeout: 50000 });
    }

    async FindAgendaByDescription(description: string, attempt = 0): Promise<boolean> 
    {
        const maxAttempts = 10; // Maximální počet pokusů o nalezení popisu
        const waitBeforeRetry = 10000; // Čekání 60 sekund před opětovným prohledáním
        if (attempt >= maxAttempts) 
        {
            console.log('Maximální počet pokusů byl dosažen.');
            return false;
        }
    
        const rows = this.agendasPage.locator('.ms-List-cell');
        const rowCount = await rows.count();
        console.log(`Počet řádků: ${rowCount}`);

        const today = new Date().toLocaleDateString('cs-CZ');
    
        for (let i = 0; i < rowCount; i++) 
        {
            const descriptionLocator = rows.nth(i).locator(`div[role="gridcell"][data-automation-key="description"]:has-text("${description}")`);   
            const isDescriptionPresent = await descriptionLocator.count() > 0;
            console.log(`Řádek ${i}: isDescriptionPresent=${isDescriptionPresent}`);  
    
            if (isDescriptionPresent) 
            {
                const stateLocator = rows.nth(i).locator('div[role="gridcell"][data-automation-key="state"] >> text=Schváleno archivováno');
                console.log(stateLocator);
                const agendaNameLocator = rows.nth(i).locator('div[role="gridcell"][data-automation-key="agendaName"] >> text=SignPoint');
                console.log(agendaNameLocator);
                const modifiedTimeLocator = rows.nth(i).locator(`div[data-automation-key="modifiedTime"]:has-text("13. 3. 2024,")`);
                console.log(modifiedTimeLocator + today);
                const createdByLocator = rows.nth(i).locator('div[role="gridcell"][data-automation-key="createdBy"] >> text=Michal Jančula');
                console.log(createdByLocator);
                const rowWithDescription = rows.nth(i).locator(`div[role="gridcell"][data-automation-key="description"]:has-text("${description}")`);
              
                console.log(isDescriptionPresent);
                const isStateCorrect = await stateLocator.count() > 0;
                console.log(isStateCorrect);
                const isAgendaNameCorrect = await agendaNameLocator.count() > 0;
                console.log(isAgendaNameCorrect);
                const isModifiedToday = await modifiedTimeLocator.count() > 0;
                console.log(isModifiedToday);
                const isCreatedByCorrect = await createdByLocator.count() > 0;
                console.log(isCreatedByCorrect);

                if (isStateCorrect && isAgendaNameCorrect && isCreatedByCorrect) 
                {
                    // Ujistěte se, že prvek "Zobrazit akce" je skutečně přístupný a viditelný.
                    const actionButtonLocator = descriptionLocator.locator('xpath=//ancestor::div[contains(@class,"ms-List-cell")]//button[@title="Zobrazit akce"]');
                    await rowWithDescription.hover(); // Hover před tím, než bude prvek viditelný.
                    await actionButtonLocator.waitFor({ state: 'visible' }); // Čekáme, až bude tlačítko viditelné.
                    await actionButtonLocator.click(); // Klikneme na tlačítko.
                    // Klikne na tlačítko "Zobrazit vazby".
                    const viewBindingsButton = this.agendasPage.locator('.ms-ContextualMenu-itemText').filter({ hasText: 'Zobrazit vazby' });
                    await viewBindingsButton.click();
    
                    console.log(`Nalezeno: ${description} na řádku ${i}`);
                    return true;
                }
            }
        }
    
        console.log('Popisek nebyl nalezen, obnovuji stránku...');
        await this.agendasPage.waitForTimeout(waitBeforeRetry); // Statické čekání před obnovením
        await this.agendasPage.reload();
        await this.agendasPage.waitForLoadState('networkidle'); // Čekáme, až se stránka plně načte
        return this.FindAgendaByDescription(description, attempt + 1); // Rekurzivně zkoušíme znovu
    }

    async FindAgendaByInstanceId(instanceIdent: string, maxAttempts: number)
    {
        var attempt = 0;

        while(attempt < maxAttempts)
        {
            const userLocator = await this.agendasPage.locator(`//a[contains (@href, '${instanceIdent}')]`);
            if (await userLocator.isVisible())
            {
                return userLocator;
            } 
            else
            {
                attempt++;
                await setTimeout(2000);
                await (await this.agendasPage.reload()).finished();
                await this.agendasPage.waitForLoadState('networkidle', { timeout: 80000 });
            }
        }
        
        await this.agendasPage.screenshot({path: `test-results/error-screenshots/error_AgendaNotFound.png`, fullPage: true});
        throw Error(`Agenda instance with id: ${instanceIdent} was not found within ${maxAttempts} attempts!`);
    }

    async CheckAgendaState(rowLocator: Locator, state: string)
    {
        var stateText = await rowLocator.locator(`//div[@aria-colindex = "2" and @aria-readonly = "true"]`).textContent();
        stateText = stateText.slice(1);
        
        if (stateText === state)
            console.log(`Agenda je správně ve stavu ${state}.`);
        else
            throw new Error(`Agenda není ve správném stavu. Požadovaný stav: ${state}, aktuální stav: ${stateText}.`)
            
    }

    async SwitchToUserById(userIdent: string)
    {
        await this.agendasPage.locator("#userInfo").click();
        const userLocator = await this.agendasPage.locator(`//a[contains (@href, '${userIdent}')]`);
        if (userLocator)
            await userLocator.click();
        else
            throw Error(`User with id: ${userIdent} was not found!`)

        await this.agendasPage.waitForLoadState('networkidle', {timeout: 30000});
    }

    async ClickInDialogOnDoc() 
    {
        // Počkejte, až se dialog plně načte
        await this.agendasPage.waitForSelector('.ms-Dialog-main', { state: 'visible' });
      
        // Najděte odkaz na dokument, který neobsahuje "_dolozka.pdf"
        const documentLink = this.agendasPage.locator('.ms-DetailsRow-cell[data-automation-key="entityName"] a').filter({
          hasText: 'Ground_signed.pdf',
          has: this.agendasPage.locator('text=/.*_dolozka\\.pdf$/').first()
        });
      
        // Klikněte na odkaz a počkejte na otevření nového tabu
        const [newPage] = await Promise.all([
          this.agendasPage.context().waitForEvent('page'),
          documentLink.click({ force: true }) // Použijte force: true pokud je odkaz skrytý
        ]);
      
        // Počkejte na načtení nové stránky v novém tabu
        await newPage.waitForLoadState('networkidle');
    }

    async GoToAgendasPage()
    {
        let responseReceived = false;

        // Posluchač pro zachycení odpovědí po navigaci
        this.agendasPage.on('response', response => {
            if (response.url() === 'https://presofa.602.cz/InProgress/Agendas?viewId=agendas' && response.status() === 200) {
                console.log('Response status for Agendas page is 200');
                responseReceived = true;
            }
        });
        // Zapnutí debugu
        //await this.agendasPage.goto("https://testsofas.602.cz/fas/formservice/filler.debug?SetDbg=Admin602&Level=5&Comm=true");

        await this.agendasPage.goto("https://presofa.602.cz/InProgress/Agendas?viewId=agendas");

        // Počkejte na načtení stránky
        await this.agendasPage.waitForLoadState('networkidle');

        // Zkontrolujte, zda byla přijata odpověď s kódem 200
        if (!responseReceived) {
            throw new Error('Agendas page did not load successfully or response status was not 200.');
        } 
    }

    IsInAgendasPage()
    {
        if (this.agendasPage.url() === 'https://presofa.602.cz/InProgress/Agendas?viewId=agendas')
            return true;

        return false;
    }
        
    async OpenFormPage(agendaName: string)
    {
        try {
            const [newPage] = await Promise.all([
                this.agendasPage.context().waitForEvent('page', { timeout: 50000 }), // Čeká na nový tab s vlastním timeoutem
                this.agendasPage.click(`text="${agendaName}"`),
            ]);
            
            console.log("Page opened.");
            
            // Počká na specifický stav načítání stránky, 'networkidle' indikuje, že síťová aktivita je minimální
            await newPage.waitForLoadState('networkidle', { timeout: 50000 }); // Zvýšený timeout pro načítání
            this.formPage = newPage;
            console.log("Page loaded.");

            // Získání instance id z formuláře
            var instanceId = (await this.formPage.locator("#SOFAInstanceIdent").getAttribute("value")).toString();
            console.log(`Instance id: ${instanceId}`);

            return {
                formPage: this.formPage,
                instanceId: instanceId
            };

            // Stop point testu, stisknout Enter pro pokračování
            /*
            const prompt = require('prompt-sync')({ sigint: true });
            const answer = prompt('Stiskněte [Enter] pro pokračování testu...');
            console.log(`Enter` + answer);
            */
        }
        catch (error) {
            // Zachytí a zpracuje výjimku (např. TimeoutException)
            console.error("An error occurred during navigation:", error.message);
            // Zde můžete přidat logiku pro opětovný pokus nebo alternativní postup
        }
    }
}



