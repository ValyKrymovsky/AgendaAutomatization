import { Page } from "@playwright/test";
import { Logger } from "winston";

export default class AllFilesPage 
{
    
    constructor(private page: Page, private logger: Logger) {}

    async InsertFile() 
    {
        await this.page.waitForSelector('text=Vložit');
        await this.page.getByLabel('Vložit').click();
        await this.page.waitForSelector('text=Přidat soubor');
        await this.page.getByRole('button', { name: 'Přidat soubor' }).click();
        await this.page.setInputFiles('input[type="file"]', `C:\Users\HP\Downloads\Ground_signed.pdf`);       
        this.logger.info("SouborVložen");
    }

    async FillMetadata()
    {
        await this.page.getByRole('textbox', { name: 'Ground_signed.pdf' }).fill('testžž');
        this.logger.info("Metadata filled");
    }
}