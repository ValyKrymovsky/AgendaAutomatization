import { Page, expect, Browser } from "@playwright/test";
import { Fixtures } from "../../hooks/PagesFixtures";

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


    async GoToAgendas() {

        //await Fixtures.page.getByRole('button', { name: 'Hlavní menu' }).click();
        //await Fixtures.page.getByRole('link', { name: 'Agendy' }).click();
        //await Fixtures.page.getByRole('link', { name: 'Zadat' }).click();
        let responseReceived = false;

        // Posluchač pro zachycení odpovědí po navigaci
        this.page.on('response', response => {
            if (response.url() === 'https://testsofa.602.cz/InProgress/Agendas?viewId=agendas' && response.status() === 200) {
                console.log('Response status for Agendas page is 200');
                responseReceived = true;
            }
        });

        await this.page.goto("https://testsofa.602.cz/InProgress/Agendas?viewId=agendas");

        // Počkejte na načtení stránky
        await this.page.waitForLoadState('networkidle');

        // Zkontrolujte, zda byla přijata odpověď s kódem 200
        if (!responseReceived) {
            throw new Error('Agendas page did not load successfully or response status was not 200.');
        }
    }

    async NavigateToSignPoint() {


        try {


            // Očekává otevření nového tabu a zároveň klikne na prvek, který tab otevírá
            const [newPage] = await Promise.all([
                this.page.context().waitForEvent('page', { timeout: 50000 }), // Čeká na nový tab s vlastním timeoutem
                this.page.click(`text=${this.Elements.signPointPanelSelector}`),
            ]);
            console.log("Page opened.");

            // Počká na specifický stav načítání stránky, 'networkidle' indikuje, že síťová aktivita je minimální
            await newPage.waitForLoadState('networkidle', { timeout: 50000 }); // Zvýšený timeout pro načítání

            console.log(await newPage.url());
            console.log("Page loaded.");
        }
        catch (error) {
            // Zachytí a zpracuje výjimku (např. TimeoutException)
            console.error("An error occurred during navigation:", error.message);
            // Zde můžete přidat logiku pro opětovný pokus nebo alternativní postup
        }


    }

    async TrySign() {

        console.log("try sign.");

        const allPages = this.page.context().pages();
        const secoundTab = allPages[1];
        await secoundTab.bringToFront();
        console.log("Tab =" + secoundTab.url());
        // Čekáme na tlačítko "Podepsat", než na něj pokusíme kliknout
        const signButton = await secoundTab.waitForSelector("#wf_btn32", { timeout: 10000 }); // Upravte selektor podle potřeby

        if (signButton) {
            await signButton.click();
        }
        else {
            console.log("Tlačítko 'Podepsat' nebylo nalezeno.");
        }


        console.log("Assert dialog.");
        try {
            // Očekáváme, že se zobrazí dialog s chybou a najdeme jeho text
            await secoundTab.waitForSelector('#wf_Dlg_Message:visible', { timeout: 10000 }); // Přizpůsobte timeout podle potřeby
            const errorMessage = await secoundTab.textContent('#wf_Dlg_Message td:nth-child(2)');

            // Ověříme, že dialog obsahuje očekávanou chybovou zprávu
            if (errorMessage.includes("Formulář není správně vyplněný")) {
                // Zavřeme dialog kliknutím na tlačítko zavřít
                await secoundTab.locator('#wf_Dlg_Message').getByRole('button', { name: '×' }).click();
                console.log("Error dialog dismissed.");
            }
            else {
                throw new Error("Unexpected error message in the dialog.");
            }
        }
        catch (error) {
            // Pokud dialog s chybou není nalezen nebo obsahuje neočekávanou zprávu
            console.error("An error occurred or the error dialog did not appear as expected:", error.message);
            throw new Error("An error occurred or the error dialog did not appear as expected:" + error.message);
        }

        console.log("try completly.");
    }

    async CheckData(userName: string, personalNumber: string) {
        const allPages = this.page.context().pages();
        const secoundTab = allPages[1];
        await secoundTab.bringToFront();
        console.log("Tab in check data =" + secoundTab.url());

        // Získání hodnoty atributu 'for' z <label> elementu
        const stringUserNameId = await secoundTab.getAttribute(this.Elements.userNameText, 'for');
        if (!stringUserNameId) {
            throw new Error('Nelze najít element s daným selektorem: ' + this.Elements.userNameText);
        }

        // Nalezení <input> elementu pomocí získané hodnoty 'for' a získání jeho hodnoty 'value'
        const valueNameUser = await secoundTab.inputValue(`input[id="${stringUserNameId}"]`);

        // Logování a ověření hodnoty
        console.log(`Expected: ${"Michal Jančula"}, Found: ${valueNameUser}`);

        // Ověření, že hodnota odpovídá očekávané hodnotě
        expect(valueNameUser).toEqual("Michal Jančula");

        console.log("Value of User: " + valueNameUser);
    }

    async FillSignPoint(randomText: string) {
        const { setDefaultTimeout } = require('@cucumber/cucumber');
        setDefaultTimeout(60 * 1000); // Nastaví defaultní timeout na 60 sekund pro všechny kroky
        const allPages = this.page.context().pages();
        const secoundTab = allPages[1];
        await secoundTab.bringToFront();
        console.log("Tab in check data =" + secoundTab.url());
        // Použití promptu v konzoli
        const prompt = require('prompt-sync')({ sigint: true });
        const answer = prompt('Stiskněte [Enter] pro pokračování testu...');
        //const filePath = 'D:/Repositories/MyRepositories/PlaywrightAutomation/PlaywrightBDD/files/download.pdf';
        console.log(`Enter` + answer);
        // Tlačítko pro nahrání souboru nebo input, který přijímá soubory
        // Změňte selektor podle potřeby, aby odpovídal vaší stránce
        //const fileInputSelector = 'input[type="file"]';
        //await this.page.waitForSelector('#wf_btm0_file0-preview'); 
        /*await secoundTab.evaluate(() => {
            // Vytvoříme skrytý input typu file
            const fileInput = document.createElement('input');
            fileInput.style.display = 'none';
            fileInput.type = 'file';
            document.body.appendChild(fileInput);

            // Simulujeme kliknutí na skrytý input
            fileInput.click();

            // Nasloucháme změně a předáme soubor(y)
            fileInput.addEventListener('change', () => {
                secoundTab.keyboard.press('D:/Repositories/MyRepositories/PlaywrightAutomation/PlaywrightBDD/files/download.pdf');
                secoundTab.keyboard.press('Enter');
                // Zde by se pak soubor předal do nějakého handleru na stránce
                // Toto je jen příklad a vyžaduje další logiku specifickou pro vaši aplikaci
            });

        });*/



        await secoundTab.locator('#wf_txt3').click();
        await secoundTab.locator('#wf_txt3').fill(randomText);
        await secoundTab.locator('#wf_txt4').click();
        await secoundTab.locator('#wf_acl0').click();
        await secoundTab.getByText('Jančula, Michal (uživatel)').click();
        await secoundTab.getByRole('button', { name: 'Podepsat' }).click();
    }

    async CheckSignFrame() {
        const { setDefaultTimeout } = require('@cucumber/cucumber');
        setDefaultTimeout(60 * 1000); // Nastaví defaultní timeout na 60 sekund pro všechny kroky
        const allPages = this.page.context().pages();
        const secoundTab = allPages[1];
        await secoundTab.bringToFront();
        console.log("Tab in check data =" + secoundTab.url());


        // Explicitní čekání na pop-up elementy před interakcí
        await secoundTab.locator('div').filter({ hasText: /^Probíhá validace zadaných údajů\.\.\.$/ }).waitFor({ timeout: 30000 });
        await secoundTab.locator('div').filter({ hasText: /^Příprava na podpis souborů$/ }).waitFor({ timeout: 30000 });
        console.log('Pop ups jsou validní.');


        // Přepněte se na iframe pomocí jeho id nebo jiného unikátního selektoru
        const frameElementHandle = await secoundTab.waitForSelector('iframe#wf_IFid', { timeout: 80000 });
        // Získání objektu iframe
        const frame = await secoundTab.frame({ name: 'wf_IFid' });

        if (frame) 
        {
            // Pokud frame existuje, pracujeme s ním
            const pinInputSelector = 'input[name="pin"]';
            await frame.waitForSelector(pinInputSelector, { timeout: 80000 });
            await frame.fill(pinInputSelector, '12345');

            const confirmButtonSelector = '#enter-pin-ok';
            await frame.click(confirmButtonSelector);
        } 
        else 
        {
            console.error('Nepodařilo se získat iframe.');
        }

        const pageSelector = '.page[data-page-number="1"]';
        await frame.waitForSelector(pageSelector, { timeout: 80000 });
        await frame.click(pageSelector, { position: { x: 396.5, y: 223 } });
        console.error('Podpis umístěn.');
        // Počkejte, až se objeví tlačítko pro potvrzení umístění a podepsání
        await frame.waitForSelector('span:has-text("Potvrdit umístění a podepsat")', { state: 'visible' });
        console.error('Tlačítko viditelné.');

        // Klikněte na tlačítko pro potvrzení
        await frame.click('span:has-text("Potvrdit umístění a podepsat")');
        console.error('Podepsat.');
    }

    async SendToArchive()
    {
        const { setDefaultTimeout } = require('@cucumber/cucumber');
        setDefaultTimeout(60 * 1000); // Nastaví defaultní timeout na 60 sekund pro všechny kroky
        const allPages = this.page.context().pages();
        const secoundTab = allPages[1];
        await secoundTab.bringToFront();
        console.log("Tab in check data =" + secoundTab.url());

        // Čekání na zprávu o úspěšném zpracování úkolu
        await secoundTab.waitForSelector('div:has-text("Uživatel svůj úkol úspěšně zpracoval.")');
        await secoundTab.getByRole('button', { name: 'Archivovat' }).click();

        await secoundTab.waitForSelector('div:has-text("Soubory byly úspěšně podepsány. Můžete si zobrazit podepsané soubory a následně zavřít záložku s formulářem.")');

        await secoundTab.getByRole('link', { name: 'Náhled' }).click();

        await secoundTab.close();
    }


}