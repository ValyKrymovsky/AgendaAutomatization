import { Page } from "@playwright/test";
export enum LinkNames {
    AllFiles = 'Všechny soubory',
    Invoices = 'Faktury',
    SignedFiles = 'Podepsané soubory',
    SignatureAddendums = 'Podpisové doložky',
    Contracts = 'Smlouvy',
    ReceivedDataMessages = 'Přijaté datové zprávy',
    SentDataMessages = 'Odeslané datové zprávy',
    IncomingAttachments = 'Přílohy přijatých datových',
    OutgoingAttachments = 'Přílohy odeslaných datových',
    SharedWithMe = 'Sdíleno se mnou',
    ReadyForDisposal = 'Připraveno ke skartaci',
    Disposed = 'Skartováno',
    GenericDocument = 'Obecný dokument'
};
export default class SmartSafeManagerPage 
{
    constructor(private page: Page) {}

    async TabsManager(linkKey: LinkNames) 
    {
        await this.page.getByRole('link', { name: linkKey }).click();
        await this.page.waitForLoadState('networkidle');
    }
}