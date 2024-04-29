import { Given, setWorldConstructor } from "@cucumber/cucumber"
import { LinkNames } from "../../pages/SmartSafe/SmartSageManagerPage";
import { readFileSync } from "fs";

Given('Hromadny podpis smluv', async function () {
  const { setDefaultTimeout } = require('@cucumber/cucumber');
  setDefaultTimeout(1000 * 1000); // Nastaví defaultní timeout na 60 sekund pro všechny kroky

  await this.loginPage.NavigateToLoginPage(process.env.BASEURL);
  this.logger.info(process.env.BASEURL + " Base URL.");
  await this.loginPage.FillUserName(process.env.EMAIL);
  await this.loginPage.FillPassword(process.env.PASSWORD);
  await this.page.waitForSelector('button[title="Hlavní menu"]');

  await this.page.goto('https://testsofa.602.cz/Process/StartNewProcess?ProcessAgendaIdent=efb1c30f-8c8f-4224-ba27-94f2c10226c0&userIdent=fc225f1f-97cf-4877-884f-aa4d9f705707');
  await this.page.waitForLoadState('networkidle');
  //await this.smartSafeManagerPage.TabsManager(LinkNames.AllFiles);
  /*
  await this.signedFilesPage.FindFileByDescription('911338b0e48bd3f0', 
  '', 
  'Jančula, Michal', 
  'MJ',
  'Ground_signed',
  'Michal Jančula',
  '13. 3. 2024 14:13',
  '0006/2024',
  '13. 3. 2024 14:13',
  '269 kB',
  'Dokončený',
  'Podepsáno');
  */
  //await this.allFilesPage.InsertFile();


  // Najděte label s textem "Hodnota" a získejte hodnotu atributu 'for'
  const labelForValue = await this.page.$$eval('label', (labels, searchText) => {
    const foundLabel = labels.find(label => label.textContent?.trim() === searchText) as HTMLLabelElement;
    return foundLabel ? foundLabel.htmlFor : null;
  }, 'Hodnota');

  if (labelForValue) {
    // Použijte získané 'for' pro nalezení inputu a zkontrolujte jeho hodnotu
    const inputValue = await this.page.locator(`#${labelForValue}`);
    console.log(`Hodnota inputu: ${inputValue}`);

    // Ověřte, že hodnota inputu je rovna očekávané hodnotě
    if (inputValue === 'vstupní hodnota') {
      console.log('Hodnota inputu je správná.');
    } else {
      console.log('Hodnota inputu není správná.');
    }
  } else {
    console.log('Label s textem "Hodnota" nebyl nalezen.');
  }
  // Vyplnění formuláře
  await this.page.fill('input[name="wf_txt0"]', 'Testovací text');
  await this.page.fill('input[name="wf_out1"]', 'vstupní hodnota');
  await this.page.fill('input[name="wf_num0"]', '123');

  const labelForValue2 = await this.page.$$eval('label', (labels, searchText) => {
    const foundLabel = labels.find(label => label.textContent?.trim() === searchText) as HTMLLabelElement;
    return foundLabel ? foundLabel.htmlFor : null;
  }, 'Měna');

  if (labelForValue2) {
    // Použijte získané 'for' pro nalezení inputu a zkontrolujte jeho hodnotu
    const inputValue = await this.page.locator(`#${labelForValue2}`);
    console.log(`Hodnota inputu: ${inputValue}`);
    inputValue.click();
    this.page.click(`#${labelForValue2}:has-text("Kč")`);


  } else {
    console.log(`Label s textem "${labelForValue2}" nebyl nalezen.`);
  }
  await this.page.fill('textarea[name="wf_txt1"]', 'Další testovací text');
  await this.page.fill('input[name="wf_num1"]', '456');
  await this.page.fill('input[name="wf_dat0"]', '01.01.2024');
  await this.page.fill('input[name="wf_tim0"]', '12:00:00');
  // Předpokládá, že máte radio a checkbox inputy
  await this.page.check('input[name="Variables.prepinac"][value="Hodnota0"]');
  await this.page.click('input[name="Variables.zaskrtavaci_pol"]');


  // Read your file into a buffer.
  const buffer = readFileSync('files/GlobalTest.pdf');

  // Create the DataTransfer and File
  const dataTransfer = await this.page.evaluateHandle((data) => {
    const dt = new DataTransfer();
    // Convert the buffer to a hex array
    const file = new File([data.toString('hex')], 'files/GlobalTest.pdf', { type: 'application/pdf' });
    dt.items.add(file);
    return dt;
  }, buffer);

  // Now dispatch
  await this.page.dispatchEvent('#wf_btm0_attachment', 'drop', { dataTransfer });

  await this.page.waitForSelector('#wf_btm0_file0-preview');
  await this.page.click('#wf_btn3');

});