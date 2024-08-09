require("dotenv").config();
const { Builder, By, Capabilities, Key, until } = require("selenium-webdriver");
const assert = require("assert");
const { readTestDataFromExcel } = require("../common_modules/excelUtils");

const {
  navigateToPage,
  clickNextButton,
  selectDropdownOption,
  PageTitleUtils,
  DropdownUtils,
  InputFieldUtils,
  selectDropdownOption1,
  getButtonIdByLabelText,
  sendKeysToElement,
  fillReporterDetails,
  sendKeysToElement1,
  selectDropdownOption2,
} = require("../common_modules/utils");

const capabilities = Capabilities.chrome();
let driver;

before(async function () {
  this.timeout(90000);
  driver = await new Builder()
    .usingServer(process.env.GRID_URL)
    .withCapabilities(capabilities)
    .build();
});

after(async function () {
  if (driver) {
    // await driver.quit();
  }
});

describe("Utility Tests", function () {
  this.timeout(1200000);

  beforeEach(async function () {
    await navigateToPage(driver, process.env.BASE_URL);
  });

  it("Page Title Test", async function () {
    const pageTitle = await PageTitleUtils.getPageTitle(driver);
    assert.strictEqual(pageTitle, "Home", "Page title is incorrect");
  });

  it("Alleged victim 18 years old (NO)", async function () {
    await driver.sleep(5000);

    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    const option = "No";
    await DropdownUtils.selectOption(driver, dropdownLocator, option);
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath(
          "//div[@c-ahs_dial_apsi_intakeformmain_ahs_dial_apsi_intakeformmain]"
        )
      ),
      10000
    );

    const messageDiv = await driver.findElement(
      By.xpath(
        "//div[@c-ahs_dial_apsi_intakeformmain_ahs_dial_apsi_intakeformmain]"
      )
    );
    const messageText = await messageDiv.getText();
    assert.ok(
      messageText.includes("Adult Protective Services"),
      "Message is incorrect"
    );
  });

  it("Alleged victim 18 years old (Yes)", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );
  });

  it("Report Declaration Page Testing W OPT (NO)", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );
  });

  it("Report Declaration Page Testing W OPT (Yes)", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "Yes");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );
  });

  it("Reporter Details Page Testing  W Non Mandate Fields", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );
  });

  it("Reporter Details Page Testing  W  Mandate Fields", async function () {
    const testDataArray = readTestDataFromExcel("data_sheet/vermont.xlsx");
    for (const testData of testDataArray) {
      await driver.sleep(5000);
      const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
      await DropdownUtils.selectOption(
        driver,
        dropdownLocator,
        testData.Button6
      );
      await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

      await driver.wait(
        until.elementLocated(
          By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
        ),
        10000
      );

      // Report Declaration Page Testing //////
      const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
      await DropdownUtils.selectOption(
        driver,
        dropdownLocator2,
        testData.Button18
      );

      await clickNextButton(
        driver,
        By.xpath(
          '//button[@class="slds-button slds-button_brand" and text()="Next"]'
        )
      );

      await driver.wait(
        until.elementLocated(
          By.xpath(
            '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
          )
        ),
        10000
      );

      // Reporter Details Page ///////////

      await driver.sleep(3000);
      await selectDropdownOption(
        driver,
        "ReportMadeConjunction_withEmployment__c",
        testData.ReporterMadeConj
      );
      await selectDropdownOption1(
        driver,
        "Mailing_Address_State__c",
        testData.State
      );

      await fillReporterDetails(driver, testData);
      await selectDropdownOption(
        driver,
        "Preferred_Phone__c",
        testData.PreferredPhone
      );
      await selectDropdownOption(
        driver,
        "Relationship_to_Alleged_Victim__c",
        testData.RelationshipVictim
      );

      const nextButtonOnReporterDetailsPageLocator = By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      );
      await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);
      await driver.wait(
        until.elementLocated(
          By.xpath(
            '//*[contains(text(), "Please tell us about the alleged victim")]'
          )
        ),
        10000
      );

      await driver.navigate().refresh();
    }
  });

  it("Victim (Victim Details) With checkbox Clicked", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    // ALleged Victime Details Page (Victime Details/////

    const checkboxes = await driver.findElements(
      By.xpath('//input[@type="checkbox"]')
    );
    for (let checkbox of checkboxes) {
      // Check the checkbox if it's not already checked
      const isChecked = await checkbox.isSelected();
      if (!isChecked) {
        // Click the checkbox via JavaScript
        await driver.executeScript("arguments[0].click();", checkbox);
        // console.log("Checkbox checked.");
      } else {
        console.log("Checkbox is already checked.");
      }
    }

    // Assert that all checkboxes are checked
    for (let checkbox of checkboxes) {
      assert.ok(await checkbox.isSelected(), "Checkbox is not checked");
    }

    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );
  });

  it("Victim (Victim Details) Without checkbox Clicked", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    // ALleged Victime Details Page (Victime Details/////
    await driver.sleep(3000);

    await sendKeysToElement1(driver, "First_Name__c", "2", "Ravi");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "Singh");
    await sendKeysToElement1(driver, "Approximate_Age__c", "8", "21");
    await sendKeysToElement1(driver, "DOB__c", "9", "Apr 17, 2001");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "12", "98765");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "13",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Physical_Address_City__c", "14", "Delhi");
    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "21", "87878");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "22",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Mailing_Address_City__c", "23", "Delhi");
    await sendKeysToElement1(driver, "Work_Phone__c", "28", "1212121212");
    await sendKeysToElement1(driver, "Home_Phone__c", "29", "1212121213");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "30", "1212121214");

    await selectDropdownOption1(
      driver,
      "Physical_Address_State__c",
      "Alaska AK"
    );
    await selectDropdownOption1(
      driver,
      "Physical_Address_County__c",
      "Addison"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Alaska AK",
      "24"
    );

    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );
  });

  it("Victim (Language info) W OPT (NO)", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    // ALleged Victime Details Page (Victime Details/////

    const checkboxes = await driver.findElements(
      By.xpath('//input[@type="checkbox"]')
    );
    for (let checkbox of checkboxes) {
      // Check the checkbox if it's not already checked
      const isChecked = await checkbox.isSelected();
      if (!isChecked) {
        // Click the checkbox via JavaScript
        await driver.executeScript("arguments[0].click();", checkbox);
        // console.log("Checkbox checked.");
      } else {
        console.log("Checkbox is already checked.");
      }
    }

    // Assert that all checkboxes are checked
    for (let checkbox of checkboxes) {
      assert.ok(await checkbox.isSelected(), "Checkbox is not checked");
    }

    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "No"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );
  });

  it("Victim (Language info) W OPT (Yes)", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    // ALleged Victime Details Page (Victime Details/////
    await driver.sleep(3000);

    await sendKeysToElement1(driver, "First_Name__c", "2", "Ravi");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "Singh");
    await sendKeysToElement1(driver, "Approximate_Age__c", "8", "21");
    await sendKeysToElement1(driver, "DOB__c", "9", "Apr 17, 2001");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "12", "98765");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "13",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Physical_Address_City__c", "14", "Delhi");
    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "21", "87878");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "22",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Mailing_Address_City__c", "23", "Delhi");
    await sendKeysToElement1(driver, "Work_Phone__c", "28", "1212121212");
    await sendKeysToElement1(driver, "Home_Phone__c", "29", "1212121213");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "30", "1212121214");

    await selectDropdownOption1(
      driver,
      "Physical_Address_State__c",
      "Alaska AK"
    );
    await selectDropdownOption1(
      driver,
      "Physical_Address_County__c",
      "Addison"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Alaska AK",
      "24"
    );

    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////
    await driver.sleep(3000);

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await selectDropdownOption1(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    await selectDropdownOption1(
      driver,
      "Secondary_Language_or_Sign__c",
      "French"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );
  });

  it("Victim (Demographic or Miscellaneous) With all Required Filed ", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    // ALleged Victime Details Page (Victime Details/////

    const checkboxes = await driver.findElements(
      By.xpath('//input[@type="checkbox"]')
    );
    for (let checkbox of checkboxes) {
      // Check the checkbox if it's not already checked
      const isChecked = await checkbox.isSelected();
      if (!isChecked) {
        // Click the checkbox via JavaScript
        await driver.executeScript("arguments[0].click();", checkbox);
        // console.log("Checkbox checked.");
      } else {
        console.log("Checkbox is already checked.");
      }
    }

    // Assert that all checkboxes are checked
    for (let checkbox of checkboxes) {
      assert.ok(await checkbox.isSelected(), "Checkbox is not checked");
    }

    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    // All Required Field /////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );
  });

  it("Victim (Demographic or Miscellaneous) With all Filed ", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    // ALleged Victime Details Page (Victime Details/////

    const checkboxes = await driver.findElements(
      By.xpath('//input[@type="checkbox"]')
    );
    for (let checkbox of checkboxes) {
      // Check the checkbox if it's not already checked
      const isChecked = await checkbox.isSelected();
      if (!isChecked) {
        // Click the checkbox via JavaScript
        await driver.executeScript("arguments[0].click();", checkbox);
        // console.log("Checkbox checked.");
      } else {
        console.log("Checkbox is already checked.");
      }
    }

    // Assert that all checkboxes are checked
    for (let checkbox of checkboxes) {
      assert.ok(await checkbox.isSelected(), "Checkbox is not checked");
    }

    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    // All Required Field /////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");
    await sendKeysToElement(driver, "Name of Facility", "APA");
    await selectDropdownOption(driver, "Gender_Identity__c", "Female");
    await selectDropdownOption(driver, "Sexual_Orientation__c", "Straight");
    await selectDropdownOption(
      driver,
      "Race__c",
      "American Indian or Alaska Native"
    );
    await selectDropdownOption(
      driver,
      "Ethnicity__c",
      "No, not Hispanic or Latino/a, or Spanish Origin"
    );
    await selectDropdownOption(driver, "Disability__c", "Vision Impairment");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );
  });

  it("Victim (POA) W OPT (NO)", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    // ALleged Victime Details Page (Victime Details/////

    const checkboxes = await driver.findElements(
      By.xpath('//input[@type="checkbox"]')
    );
    for (let checkbox of checkboxes) {
      // Check the checkbox if it's not already checked
      const isChecked = await checkbox.isSelected();
      if (!isChecked) {
        // Click the checkbox via JavaScript
        await driver.executeScript("arguments[0].click();", checkbox);
        // console.log("Checkbox checked.");
      } else {
        console.log("Checkbox is already checked.");
      }
    }

    // Assert that all checkboxes are checked
    for (let checkbox of checkboxes) {
      assert.ok(await checkbox.isSelected(), "Checkbox is not checked");
    }

    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await selectDropdownOption(driver, "poaComboxbox", "No");

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );
  });

  it("Victim (POA) W OPT (Yes) w Checkbox Clicked", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    // ALleged Victime Details Page (Victime Details/////

    const checkboxes = await driver.findElements(
      By.xpath('//input[@type="checkbox"]')
    );
    for (let checkbox of checkboxes) {
      // Check the checkbox if it's not already checked
      const isChecked = await checkbox.isSelected();
      if (!isChecked) {
        // Click the checkbox via JavaScript
        await driver.executeScript("arguments[0].click();", checkbox);
        // console.log("Checkbox checked.");
      } else {
        console.log("Checkbox is already checked.");
      }
    }

    // Assert that all checkboxes are checked
    for (let checkbox of checkboxes) {
      assert.ok(await checkbox.isSelected(), "Checkbox is not checked");
    }

    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await driver.sleep(2000);
    await selectDropdownOption(driver, "poaComboxbox", "Yes");

    await selectDropdownOption2(
      driver,
      "POA_Guardian_Relationship__c",
      "Doctor",
      "7"
    );

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );
  });

  it("Victim (POA) W OPT (Yes) wthout Checkbox Clicked", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    //// ALleged Victime Details Page (Victime Details/////
    await driver.sleep(3000);

    await sendKeysToElement1(driver, "First_Name__c", "2", "Ravi");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "Singh");
    await sendKeysToElement1(driver, "Approximate_Age__c", "8", "21");
    await sendKeysToElement1(driver, "DOB__c", "9", "Apr 17, 2001");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "12", "98765");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "13",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Physical_Address_City__c", "14", "Delhi");
    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "21", "87878");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "22",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Mailing_Address_City__c", "23", "Delhi");
    await sendKeysToElement1(driver, "Work_Phone__c", "28", "1212121212");
    await sendKeysToElement1(driver, "Home_Phone__c", "29", "1212121213");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "30", "1212121214");

    await selectDropdownOption1(
      driver,
      "Physical_Address_State__c",
      "Alaska AK"
    );
    await selectDropdownOption1(
      driver,
      "Physical_Address_County__c",
      "Addison"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Alaska AK",
      "24"
    );
    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await driver.sleep(2000);
    await selectDropdownOption(driver, "poaComboxbox", "Yes");

    await selectDropdownOption2(
      driver,
      "POA_Guardian_Relationship__c",
      "Doctor",
      "7"
    );

    await sendKeysToElement1(driver, "POA_Guardian_First_Name__c", "2", "DP");
    await sendKeysToElement1(driver, "POA_Guardian_Last_Name__c", "4", "Sign");
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_ZIP__c",
      "11",
      "21212"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_Street__c",
      "12",
      "Rajiv Chok"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_City__c",
      "13",
      "Delhi"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_State__c",
      "14",
      "Alaska AK"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Work_Phone__c",
      "18",
      "1515151515"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Home_Phone__c",
      "19",
      "1515151516"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mobile_Phone__c",
      "20",
      "1515151519"
    );

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );
  });

  it("Victim (Vulnerability Questions) W OPT (Yes)", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    //// ALleged Victime Details Page (Victime Details/////
    await driver.sleep(3000);

    await sendKeysToElement1(driver, "First_Name__c", "2", "Ravi");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "Singh");
    await sendKeysToElement1(driver, "Approximate_Age__c", "8", "21");
    await sendKeysToElement1(driver, "DOB__c", "9", "Apr 17, 2001");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "12", "98765");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "13",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Physical_Address_City__c", "14", "Delhi");
    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "21", "87878");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "22",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Mailing_Address_City__c", "23", "Delhi");
    await sendKeysToElement1(driver, "Work_Phone__c", "28", "1212121212");
    await sendKeysToElement1(driver, "Home_Phone__c", "29", "1212121213");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "30", "1212121214");

    await selectDropdownOption1(
      driver,
      "Physical_Address_State__c",
      "Alaska AK"
    );
    await selectDropdownOption1(
      driver,
      "Physical_Address_County__c",
      "Addison"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Alaska AK",
      "24"
    );
    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await driver.sleep(2000);
    await selectDropdownOption(driver, "poaComboxbox", "Yes");

    await selectDropdownOption2(
      driver,
      "POA_Guardian_Relationship__c",
      "Doctor",
      "7"
    );

    await sendKeysToElement1(driver, "POA_Guardian_First_Name__c", "2", "DP");
    await sendKeysToElement1(driver, "POA_Guardian_Last_Name__c", "4", "Sign");
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_ZIP__c",
      "11",
      "21212"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_Street__c",
      "12",
      "Rajiv Chok"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_City__c",
      "13",
      "Delhi"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_State__c",
      "14",
      "Alaska AK"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Work_Phone__c",
      "18",
      "1515151515"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Home_Phone__c",
      "19",
      "1515151516"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mobile_Phone__c",
      "20",
      "1515151519"
    );

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );

    //   // Vulnerability Questions //////////
    await selectDropdownOption(driver, "AV_Is_Resident_of_Facility__c", "Yes");

    // Required Input Field//////

    await sendKeysToElement(driver, "AV Resident Facility Name", "Ap Builders");

    const nextButtonOnPerpetrator = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Victim to Report"]'
    );
    await clickNextButton(driver, nextButtonOnPerpetrator);

    //// /////// Finish Victime Details Test tabs and pages//////
    const nextButtonPerpetratorData = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonPerpetratorData);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );
  });

  it("Victim (Vulnerability Questions) W OPT (No)", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    //// ALleged Victime Details Page (Victime Details/////
    await driver.sleep(3000);

    await sendKeysToElement1(driver, "First_Name__c", "2", "Ravi");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "Singh");
    await sendKeysToElement1(driver, "Approximate_Age__c", "8", "21");
    await sendKeysToElement1(driver, "DOB__c", "9", "Apr 17, 2001");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "12", "98765");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "13",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Physical_Address_City__c", "14", "Delhi");
    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "21", "87878");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "22",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Mailing_Address_City__c", "23", "Delhi");
    await sendKeysToElement1(driver, "Work_Phone__c", "28", "1212121212");
    await sendKeysToElement1(driver, "Home_Phone__c", "29", "1212121213");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "30", "1212121214");

    await selectDropdownOption1(
      driver,
      "Physical_Address_State__c",
      "Alaska AK"
    );
    await selectDropdownOption1(
      driver,
      "Physical_Address_County__c",
      "Addison"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Alaska AK",
      "24"
    );
    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await driver.sleep(2000);
    await selectDropdownOption(driver, "poaComboxbox", "Yes");

    await selectDropdownOption2(
      driver,
      "POA_Guardian_Relationship__c",
      "Doctor",
      "7"
    );

    await sendKeysToElement1(driver, "POA_Guardian_First_Name__c", "2", "DP");
    await sendKeysToElement1(driver, "POA_Guardian_Last_Name__c", "4", "Sign");
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_ZIP__c",
      "11",
      "21212"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_Street__c",
      "12",
      "Rajiv Chok"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_City__c",
      "13",
      "Delhi"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_State__c",
      "14",
      "Alaska AK"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Work_Phone__c",
      "18",
      "1515151515"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Home_Phone__c",
      "19",
      "1515151516"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mobile_Phone__c",
      "20",
      "1515151519"
    );

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );

    //   // Vulnerability Questions //////////
    await selectDropdownOption(driver, "AV_Is_Resident_of_Facility__c", "No");
    await selectDropdownOption(driver, "AV_Receiving_Personal_Care__c", "No");
    await selectDropdownOption(
      driver,
      "AV_Has_Daily_Living_Impairment__c",
      "No"
    );
    await selectDropdownOption(
      driver,
      "AV_Has_ANE_Prevention_Impairment__c",
      "No"
    );

    const nextButtonOnPerpetrator = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Victim to Report"]'
    );
    await clickNextButton(driver, nextButtonOnPerpetrator);

    //// /////// Finish Victime Details Test tabs and pages//////
    const nextButtonPerpetratorData = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonPerpetratorData);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );
  });

  it("Perpetrator W OPT (Yes)", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    //// ALleged Victime Details Page (Victime Details/////
    await driver.sleep(3000);

    await sendKeysToElement1(driver, "First_Name__c", "2", "Ravi");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "Singh");
    await sendKeysToElement1(driver, "Approximate_Age__c", "8", "21");
    await sendKeysToElement1(driver, "DOB__c", "9", "Apr 17, 2001");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "12", "98765");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "13",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Physical_Address_City__c", "14", "Delhi");
    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "21", "87878");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "22",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Mailing_Address_City__c", "23", "Delhi");
    await sendKeysToElement1(driver, "Work_Phone__c", "28", "1212121212");
    await sendKeysToElement1(driver, "Home_Phone__c", "29", "1212121213");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "30", "1212121214");

    await selectDropdownOption1(
      driver,
      "Physical_Address_State__c",
      "Alaska AK"
    );
    await selectDropdownOption1(
      driver,
      "Physical_Address_County__c",
      "Addison"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Alaska AK",
      "24"
    );
    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await driver.sleep(2000);
    await selectDropdownOption(driver, "poaComboxbox", "Yes");

    await selectDropdownOption2(
      driver,
      "POA_Guardian_Relationship__c",
      "Doctor",
      "7"
    );

    await sendKeysToElement1(driver, "POA_Guardian_First_Name__c", "2", "DP");
    await sendKeysToElement1(driver, "POA_Guardian_Last_Name__c", "4", "Sign");
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_ZIP__c",
      "11",
      "21212"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_Street__c",
      "12",
      "Rajiv Chok"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_City__c",
      "13",
      "Delhi"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_State__c",
      "14",
      "Alaska AK"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Work_Phone__c",
      "18",
      "1515151515"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Home_Phone__c",
      "19",
      "1515151516"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mobile_Phone__c",
      "20",
      "1515151519"
    );

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );

    //   // Vulnerability Questions //////////
    await selectDropdownOption(driver, "AV_Is_Resident_of_Facility__c", "No");
    await selectDropdownOption(driver, "AV_Receiving_Personal_Care__c", "No");
    await selectDropdownOption(
      driver,
      "AV_Has_Daily_Living_Impairment__c",
      "No"
    );
    await selectDropdownOption(
      driver,
      "AV_Has_ANE_Prevention_Impairment__c",
      "No"
    );

    const nextButtonOnPerpetrator = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Victim to Report"]'
    );
    await clickNextButton(driver, nextButtonOnPerpetrator);

    //// /////// Finish Victime Details Test tabs and pages//////
    const nextButtonPerpetratorData = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonPerpetratorData);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );

    /////////Perpetrator Page Testing Start/////////////////////////////
    await selectDropdownOption(driver, "selfHarm", "Yes");

    const nextButtonProceed = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Proceed"]'
    );
    await clickNextButton(driver, nextButtonProceed);

    await driver.sleep(1000);

    const messageElement = await driver.findElement(
      By.xpath(
        "//div[contains(@class, 'slds-align_absolute-center')]/div[contains(@style, 'color: red; margin-right: 30px; margin-left: 30px;')]"
      )
    );

    // Check if the message element is visible
    const isMessageVisible = await messageElement.isDisplayed();

    // Assert that the message is visible
    assert.ok(isMessageVisible, "Message is not visible");

    await driver.sleep(1000);

    const nextButtonIncidentDetails = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonIncidentDetails);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Please tell us about the incident")]')
      ),
      10000
    );
  });

  it("Perpetrator W checkbox clicked", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    //// ALleged Victime Details Page (Victime Details/////
    await driver.sleep(3000);

    await sendKeysToElement1(driver, "First_Name__c", "2", "Ravi");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "Singh");
    await sendKeysToElement1(driver, "Approximate_Age__c", "8", "21");
    await sendKeysToElement1(driver, "DOB__c", "9", "Apr 17, 2001");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "12", "98765");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "13",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Physical_Address_City__c", "14", "Delhi");
    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "21", "87878");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "22",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Mailing_Address_City__c", "23", "Delhi");
    await sendKeysToElement1(driver, "Work_Phone__c", "28", "1212121212");
    await sendKeysToElement1(driver, "Home_Phone__c", "29", "1212121213");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "30", "1212121214");

    await selectDropdownOption1(
      driver,
      "Physical_Address_State__c",
      "Alaska AK"
    );
    await selectDropdownOption1(
      driver,
      "Physical_Address_County__c",
      "Addison"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Alaska AK",
      "24"
    );
    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await driver.sleep(2000);
    await selectDropdownOption(driver, "poaComboxbox", "Yes");

    await selectDropdownOption2(
      driver,
      "POA_Guardian_Relationship__c",
      "Doctor",
      "7"
    );

    await sendKeysToElement1(driver, "POA_Guardian_First_Name__c", "2", "DP");
    await sendKeysToElement1(driver, "POA_Guardian_Last_Name__c", "4", "Sign");
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_ZIP__c",
      "11",
      "21212"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_Street__c",
      "12",
      "Rajiv Chok"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_City__c",
      "13",
      "Delhi"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_State__c",
      "14",
      "Alaska AK"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Work_Phone__c",
      "18",
      "1515151515"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Home_Phone__c",
      "19",
      "1515151516"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mobile_Phone__c",
      "20",
      "1515151519"
    );

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );

    //   // Vulnerability Questions //////////
    await selectDropdownOption(driver, "AV_Is_Resident_of_Facility__c", "No");
    await selectDropdownOption(driver, "AV_Receiving_Personal_Care__c", "No");
    await selectDropdownOption(
      driver,
      "AV_Has_Daily_Living_Impairment__c",
      "No"
    );
    await selectDropdownOption(
      driver,
      "AV_Has_ANE_Prevention_Impairment__c",
      "No"
    );

    const nextButtonOnPerpetrator = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Victim to Report"]'
    );
    await clickNextButton(driver, nextButtonOnPerpetrator);

    //// /////// Finish Victime Details Test tabs and pages//////
    const nextButtonPerpetratorData = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonPerpetratorData);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );

    /////////Perpetrator Page Testing Start/////////////////////////////

    const checkboxes = await driver.findElements(
      By.xpath('//input[@type="checkbox"]')
    );
    for (let checkbox of checkboxes) {
      // Check the checkbox if it's not already checked
      const isChecked = await checkbox.isSelected();
      if (!isChecked) {
        // Click the checkbox via JavaScript
        await driver.executeScript("arguments[0].click();", checkbox);
        // console.log("Checkbox checked.");
      } else {
        console.log("Checkbox is already checked.");
      }
    }

    // Assert that all checkboxes are checked
    for (let checkbox of checkboxes) {
      assert.ok(await checkbox.isSelected(), "Checkbox is not checked");
    }

    const nextButtonProceed = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Proceed"]'
    );
    await clickNextButton(driver, nextButtonProceed);

    await driver.sleep(1000);

    const messageElement = await driver.findElement(
      By.xpath(
        "//div[contains(@class, 'slds-align_absolute-center')]/div[contains(@style, 'color: red; margin-right: 30px; margin-left: 30px;')]"
      )
    );

    // Check if the message element is visible
    const isMessageVisible = await messageElement.isDisplayed();

    // Assert that the message is visible
    assert.ok(isMessageVisible, "Message is not visible");

    await driver.sleep(1000);

    const nextButtonIncidentDetails = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonIncidentDetails);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Please tell us about the incident")]')
      ),
      10000
    );
  });

  it("Perpetrator W OPT (NO)", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    //// ALleged Victime Details Page (Victime Details/////
    await driver.sleep(3000);

    await sendKeysToElement1(driver, "First_Name__c", "2", "Ravi");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "Singh");
    await sendKeysToElement1(driver, "Approximate_Age__c", "8", "21");
    await sendKeysToElement1(driver, "DOB__c", "9", "Apr 17, 2001");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "12", "98765");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "13",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Physical_Address_City__c", "14", "Delhi");
    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "21", "87878");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "22",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Mailing_Address_City__c", "23", "Delhi");
    await sendKeysToElement1(driver, "Work_Phone__c", "28", "1212121212");
    await sendKeysToElement1(driver, "Home_Phone__c", "29", "1212121213");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "30", "1212121214");

    await selectDropdownOption1(
      driver,
      "Physical_Address_State__c",
      "Alaska AK"
    );
    await selectDropdownOption1(
      driver,
      "Physical_Address_County__c",
      "Addison"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Alaska AK",
      "24"
    );
    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await driver.sleep(2000);
    await selectDropdownOption(driver, "poaComboxbox", "Yes");

    await selectDropdownOption2(
      driver,
      "POA_Guardian_Relationship__c",
      "Doctor",
      "7"
    );

    await sendKeysToElement1(driver, "POA_Guardian_First_Name__c", "2", "DP");
    await sendKeysToElement1(driver, "POA_Guardian_Last_Name__c", "4", "Sign");
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_ZIP__c",
      "11",
      "21212"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_Street__c",
      "12",
      "Rajiv Chok"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_City__c",
      "13",
      "Delhi"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_State__c",
      "14",
      "Alaska AK"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Work_Phone__c",
      "18",
      "1515151515"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Home_Phone__c",
      "19",
      "1515151516"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mobile_Phone__c",
      "20",
      "1515151519"
    );

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );

    //   // Vulnerability Questions //////////
    await selectDropdownOption(driver, "AV_Is_Resident_of_Facility__c", "No");
    await selectDropdownOption(driver, "AV_Receiving_Personal_Care__c", "No");
    await selectDropdownOption(
      driver,
      "AV_Has_Daily_Living_Impairment__c",
      "No"
    );
    await selectDropdownOption(
      driver,
      "AV_Has_ANE_Prevention_Impairment__c",
      "No"
    );

    const nextButtonOnPerpetrator = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Victim to Report"]'
    );
    await clickNextButton(driver, nextButtonOnPerpetrator);

    //// /////// Finish Victime Details Test tabs and pages//////
    const nextButtonPerpetratorData = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonPerpetratorData);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );

    /////////Perpetrator Page Testing Start/////////////////////////////
    await selectDropdownOption(driver, "selfHarm", "No");

    const nextButtonProceed = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Proceed"]'
    );
    await clickNextButton(driver, nextButtonProceed);
    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );
  });

  it("Perpetrator (Perpetrator details page) W checkbox clicked", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    //// ALleged Victime Details Page (Victime Details/////
    await driver.sleep(3000);

    await sendKeysToElement1(driver, "First_Name__c", "2", "Ravi");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "Singh");
    await sendKeysToElement1(driver, "Approximate_Age__c", "8", "21");
    await sendKeysToElement1(driver, "DOB__c", "9", "Apr 17, 2001");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "12", "98765");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "13",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Physical_Address_City__c", "14", "Delhi");
    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "21", "87878");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "22",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Mailing_Address_City__c", "23", "Delhi");
    await sendKeysToElement1(driver, "Work_Phone__c", "28", "1212121212");
    await sendKeysToElement1(driver, "Home_Phone__c", "29", "1212121213");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "30", "1212121214");

    await selectDropdownOption1(
      driver,
      "Physical_Address_State__c",
      "Alaska AK"
    );
    await selectDropdownOption1(
      driver,
      "Physical_Address_County__c",
      "Addison"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Alaska AK",
      "24"
    );
    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await driver.sleep(2000);
    await selectDropdownOption(driver, "poaComboxbox", "Yes");

    await selectDropdownOption2(
      driver,
      "POA_Guardian_Relationship__c",
      "Doctor",
      "7"
    );

    await sendKeysToElement1(driver, "POA_Guardian_First_Name__c", "2", "DP");
    await sendKeysToElement1(driver, "POA_Guardian_Last_Name__c", "4", "Sign");
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_ZIP__c",
      "11",
      "21212"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_Street__c",
      "12",
      "Rajiv Chok"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_City__c",
      "13",
      "Delhi"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_State__c",
      "14",
      "Alaska AK"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Work_Phone__c",
      "18",
      "1515151515"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Home_Phone__c",
      "19",
      "1515151516"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mobile_Phone__c",
      "20",
      "1515151519"
    );

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );

    //   // Vulnerability Questions //////////
    await selectDropdownOption(driver, "AV_Is_Resident_of_Facility__c", "No");
    await selectDropdownOption(driver, "AV_Receiving_Personal_Care__c", "No");
    await selectDropdownOption(
      driver,
      "AV_Has_Daily_Living_Impairment__c",
      "No"
    );
    await selectDropdownOption(
      driver,
      "AV_Has_ANE_Prevention_Impairment__c",
      "No"
    );

    const nextButtonOnPerpetrator = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Victim to Report"]'
    );
    await clickNextButton(driver, nextButtonOnPerpetrator);

    //// /////// Finish Victime Details Test tabs and pages//////
    const nextButtonPerpetratorData = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonPerpetratorData);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );

    /////////Perpetrator Page Testing Start/////////////////////////////
    await selectDropdownOption(driver, "selfHarm", "No");

    const nextButtonProceed = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Proceed"]'
    );
    await clickNextButton(driver, nextButtonProceed);
    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );
    await driver.sleep(1000);

    const checkboxes = await driver.findElements(
      By.xpath('//input[@type="checkbox"]')
    );
    for (let checkbox of checkboxes) {
      // Check the checkbox if it's not already checked
      const isChecked = await checkbox.isSelected();
      if (!isChecked) {
        // Click the checkbox via JavaScript
        await driver.executeScript("arguments[0].click();", checkbox);
        // console.log("Checkbox checked.");
      } else {
        console.log("Checkbox is already checked.");
      }
    }

    // Assert that all checkboxes are checked
    for (let checkbox of checkboxes) {
      assert.ok(await checkbox.isSelected(), "Checkbox is not checked");
    }

    await selectDropdownOption2(
      driver,
      "Relationship_to_Alleged_Victim__c",
      "Doctor",
      "35"
    );

    const nextButtonIncidentDetails = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonIncidentDetails);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Please tell us about the incident")]')
      ),
      10000
    );
  });

  it("Perpetrator (Perpetrator details page) Without checkbox clicked", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    //// ALleged Victime Details Page (Victime Details/////
    await driver.sleep(3000);

    await sendKeysToElement1(driver, "First_Name__c", "2", "Ravi");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "Singh");
    await sendKeysToElement1(driver, "Approximate_Age__c", "8", "21");
    await sendKeysToElement1(driver, "DOB__c", "9", "Apr 17, 2001");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "12", "98765");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "13",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Physical_Address_City__c", "14", "Delhi");
    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "21", "87878");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "22",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Mailing_Address_City__c", "23", "Delhi");
    await sendKeysToElement1(driver, "Work_Phone__c", "28", "1212121212");
    await sendKeysToElement1(driver, "Home_Phone__c", "29", "1212121213");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "30", "1212121214");

    await selectDropdownOption1(
      driver,
      "Physical_Address_State__c",
      "Alaska AK"
    );
    await selectDropdownOption1(
      driver,
      "Physical_Address_County__c",
      "Addison"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Alaska AK",
      "24"
    );
    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await driver.sleep(2000);
    await selectDropdownOption(driver, "poaComboxbox", "Yes");

    await selectDropdownOption2(
      driver,
      "POA_Guardian_Relationship__c",
      "Doctor",
      "7"
    );

    await sendKeysToElement1(driver, "POA_Guardian_First_Name__c", "2", "DP");
    await sendKeysToElement1(driver, "POA_Guardian_Last_Name__c", "4", "Sign");
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_ZIP__c",
      "11",
      "21212"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_Street__c",
      "12",
      "Rajiv Chok"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_City__c",
      "13",
      "Delhi"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_State__c",
      "14",
      "Alaska AK"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Work_Phone__c",
      "18",
      "1515151515"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Home_Phone__c",
      "19",
      "1515151516"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mobile_Phone__c",
      "20",
      "1515151519"
    );

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );

    //   // Vulnerability Questions //////////
    await selectDropdownOption(driver, "AV_Is_Resident_of_Facility__c", "No");
    await selectDropdownOption(driver, "AV_Receiving_Personal_Care__c", "No");
    await selectDropdownOption(
      driver,
      "AV_Has_Daily_Living_Impairment__c",
      "No"
    );
    await selectDropdownOption(
      driver,
      "AV_Has_ANE_Prevention_Impairment__c",
      "No"
    );

    const nextButtonOnPerpetrator = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Victim to Report"]'
    );
    await clickNextButton(driver, nextButtonOnPerpetrator);

    //// /////// Finish Victime Details Test tabs and pages//////
    const nextButtonPerpetratorData = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonPerpetratorData);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );

    /////////Perpetrator Page Testing Start/////////////////////////////
    await selectDropdownOption(driver, "selfHarm", "No");

    const nextButtonProceed = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Proceed"]'
    );
    await clickNextButton(driver, nextButtonProceed);
    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );
    await driver.sleep(4000);

    //////// perpetrator details page testing/////////////

    await selectDropdownOption2(
      driver,
      "Relationship_to_Alleged_Victim__c",
      "Doctor",
      "35"
    );

    await sendKeysToElement1(driver, "First_Name__c", "2", "Sam");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "SP");
    await sendKeysToElement1(driver, "Approximate_Age__c", "9", "25");
    await sendKeysToElement1(driver, "DOB__c", "10", "Apr 22, 1999");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "13", "45245");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "14",
      "Udyog vihar"
    );
    await sendKeysToElement1(
      driver,
      "Physical_Address_City__c",
      "15",
      "Delhi NCR"
    );

    await selectDropdownOption2(
      driver,
      "Physical_Address_State__c",
      "Arizona AZ",
      "16"
    );

    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "22", "548484");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "23",
      "Udyog Vihar"
    );
    await sendKeysToElement1(
      driver,
      "Mailing_Address_City__c",
      "24",
      "Delhi NCR"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Arizona AZ",
      "25"
    );
    await selectDropdownOption2(
      driver,
      "Physical_Address_County__c",
      "Addison",
      "17"
    );

    await sendKeysToElement1(driver, "Work_Phone__c", "30", "1521521521");
    await sendKeysToElement1(driver, "Home_Phone__c", "31", "1521521522");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "32", "1521521525");

    const nextButtonIncidentDetails = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonIncidentDetails);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Please tell us about the incident")]')
      ),
      10000
    );
  });

  it("Perpetrator (Language Page) W OPT (No)", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    //// ALleged Victime Details Page (Victime Details/////
    await driver.sleep(3000);

    await sendKeysToElement1(driver, "First_Name__c", "2", "Ravi");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "Singh");
    await sendKeysToElement1(driver, "Approximate_Age__c", "8", "21");
    await sendKeysToElement1(driver, "DOB__c", "9", "Apr 17, 2001");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "12", "98765");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "13",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Physical_Address_City__c", "14", "Delhi");
    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "21", "87878");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "22",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Mailing_Address_City__c", "23", "Delhi");
    await sendKeysToElement1(driver, "Work_Phone__c", "28", "1212121212");
    await sendKeysToElement1(driver, "Home_Phone__c", "29", "1212121213");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "30", "1212121214");

    await selectDropdownOption1(
      driver,
      "Physical_Address_State__c",
      "Alaska AK"
    );
    await selectDropdownOption1(
      driver,
      "Physical_Address_County__c",
      "Addison"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Alaska AK",
      "24"
    );
    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await driver.sleep(2000);
    await selectDropdownOption(driver, "poaComboxbox", "Yes");

    await selectDropdownOption2(
      driver,
      "POA_Guardian_Relationship__c",
      "Doctor",
      "7"
    );

    await sendKeysToElement1(driver, "POA_Guardian_First_Name__c", "2", "DP");
    await sendKeysToElement1(driver, "POA_Guardian_Last_Name__c", "4", "Sign");
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_ZIP__c",
      "11",
      "21212"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_Street__c",
      "12",
      "Rajiv Chok"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_City__c",
      "13",
      "Delhi"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_State__c",
      "14",
      "Alaska AK"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Work_Phone__c",
      "18",
      "1515151515"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Home_Phone__c",
      "19",
      "1515151516"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mobile_Phone__c",
      "20",
      "1515151519"
    );

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );

    //   // Vulnerability Questions //////////
    await selectDropdownOption(driver, "AV_Is_Resident_of_Facility__c", "No");
    await selectDropdownOption(driver, "AV_Receiving_Personal_Care__c", "No");
    await selectDropdownOption(
      driver,
      "AV_Has_Daily_Living_Impairment__c",
      "No"
    );
    await selectDropdownOption(
      driver,
      "AV_Has_ANE_Prevention_Impairment__c",
      "No"
    );

    const nextButtonOnPerpetrator = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Victim to Report"]'
    );
    await clickNextButton(driver, nextButtonOnPerpetrator);

    //// /////// Finish Victime Details Test tabs and pages//////
    const nextButtonPerpetratorData = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonPerpetratorData);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );

    /////////Perpetrator Page Testing Start/////////////////////////////
    await selectDropdownOption(driver, "selfHarm", "No");

    const nextButtonProceed = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Proceed"]'
    );
    await clickNextButton(driver, nextButtonProceed);
    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );
    await driver.sleep(1000);

    //////// perpetrator details page testing/////////////

    await selectDropdownOption2(
      driver,
      "Relationship_to_Alleged_Victim__c",
      "Doctor",
      "35"
    );

    await sendKeysToElement1(driver, "First_Name__c", "2", "Sam");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "SP");
    await sendKeysToElement1(driver, "Approximate_Age__c", "9", "25");
    await sendKeysToElement1(driver, "DOB__c", "10", "Apr 22, 1999");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "13", "45245");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "14",
      "Udyog vihar"
    );
    await sendKeysToElement1(
      driver,
      "Physical_Address_City__c",
      "15",
      "Delhi NCR"
    );

    await selectDropdownOption2(
      driver,
      "Physical_Address_State__c",
      "Arizona AZ",
      "16"
    );

    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "22", "548484");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "23",
      "Udyog Vihar"
    );
    await sendKeysToElement1(
      driver,
      "Mailing_Address_City__c",
      "24",
      "Delhi NCR"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Arizona AZ",
      "25"
    );
    await selectDropdownOption2(
      driver,
      "Physical_Address_County__c",
      "Addison",
      "17"
    );

    await sendKeysToElement1(driver, "Work_Phone__c", "30", "1521521521");
    await sendKeysToElement1(driver, "Home_Phone__c", "31", "1521521522");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "32", "1521521525");

    const nextButtonIncidentDetails = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonIncidentDetails);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language Page Option Test //////////////////////

    await selectDropdownOption2(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "No",
      "0"
    );

    const nextButtonDORM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonDORM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );
  });

  it("Perpetrator (Language Page) W OPT (Yes)", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    //// ALleged Victime Details Page (Victime Details/////
    await driver.sleep(3000);

    await sendKeysToElement1(driver, "First_Name__c", "2", "Ravi");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "Singh");
    await sendKeysToElement1(driver, "Approximate_Age__c", "8", "21");
    await sendKeysToElement1(driver, "DOB__c", "9", "Apr 17, 2001");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "12", "98765");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "13",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Physical_Address_City__c", "14", "Delhi");
    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "21", "87878");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "22",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Mailing_Address_City__c", "23", "Delhi");
    await sendKeysToElement1(driver, "Work_Phone__c", "28", "1212121212");
    await sendKeysToElement1(driver, "Home_Phone__c", "29", "1212121213");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "30", "1212121214");

    await selectDropdownOption1(
      driver,
      "Physical_Address_State__c",
      "Alaska AK"
    );
    await selectDropdownOption1(
      driver,
      "Physical_Address_County__c",
      "Addison"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Alaska AK",
      "24"
    );
    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await driver.sleep(2000);
    await selectDropdownOption(driver, "poaComboxbox", "Yes");

    await selectDropdownOption2(
      driver,
      "POA_Guardian_Relationship__c",
      "Doctor",
      "7"
    );

    await sendKeysToElement1(driver, "POA_Guardian_First_Name__c", "2", "DP");
    await sendKeysToElement1(driver, "POA_Guardian_Last_Name__c", "4", "Sign");
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_ZIP__c",
      "11",
      "21212"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_Street__c",
      "12",
      "Rajiv Chok"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_City__c",
      "13",
      "Delhi"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_State__c",
      "14",
      "Alaska AK"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Work_Phone__c",
      "18",
      "1515151515"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Home_Phone__c",
      "19",
      "1515151516"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mobile_Phone__c",
      "20",
      "1515151519"
    );

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );

    //   // Vulnerability Questions //////////
    await selectDropdownOption(driver, "AV_Is_Resident_of_Facility__c", "No");
    await selectDropdownOption(driver, "AV_Receiving_Personal_Care__c", "No");
    await selectDropdownOption(
      driver,
      "AV_Has_Daily_Living_Impairment__c",
      "No"
    );
    await selectDropdownOption(
      driver,
      "AV_Has_ANE_Prevention_Impairment__c",
      "No"
    );

    const nextButtonOnPerpetrator = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Victim to Report"]'
    );
    await clickNextButton(driver, nextButtonOnPerpetrator);

    //// /////// Finish Victime Details Test tabs and pages//////
    const nextButtonPerpetratorData = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonPerpetratorData);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );

    /////////Perpetrator Page Testing Start/////////////////////////////
    await selectDropdownOption(driver, "selfHarm", "No");

    const nextButtonProceed = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Proceed"]'
    );
    await clickNextButton(driver, nextButtonProceed);
    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );
    await driver.sleep(1000);

    //////// perpetrator details page testing/////////////

    await selectDropdownOption2(
      driver,
      "Relationship_to_Alleged_Victim__c",
      "Doctor",
      "35"
    );

    await sendKeysToElement1(driver, "First_Name__c", "2", "Sam");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "SP");
    await sendKeysToElement1(driver, "Approximate_Age__c", "9", "25");
    await sendKeysToElement1(driver, "DOB__c", "10", "Apr 22, 1999");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "13", "45245");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "14",
      "Udyog vihar"
    );
    await sendKeysToElement1(
      driver,
      "Physical_Address_City__c",
      "15",
      "Delhi NCR"
    );

    await selectDropdownOption2(
      driver,
      "Physical_Address_State__c",
      "Arizona AZ",
      "16"
    );

    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "22", "548484");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "23",
      "Udyog Vihar"
    );
    await sendKeysToElement1(
      driver,
      "Mailing_Address_City__c",
      "24",
      "Delhi NCR"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Arizona AZ",
      "25"
    );
    await selectDropdownOption2(
      driver,
      "Physical_Address_County__c",
      "Addison",
      "17"
    );

    await sendKeysToElement1(driver, "Work_Phone__c", "30", "1521521521");
    await sendKeysToElement1(driver, "Home_Phone__c", "31", "1521521522");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "32", "1521521525");

    const nextButtonIncidentDetails = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonIncidentDetails);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language Page Option Test //////////////////////

    await selectDropdownOption2(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes",
      "0"
    );

    await selectDropdownOption2(
      driver,
      "Primary_Language_or_Sign__c",
      "English",
      "1"
    );

    await selectDropdownOption2(
      driver,
      "Secondary_Language_or_Sign__c",
      "French",
      "2"
    );

    const nextButtonDORM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonDORM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );
  });

  it("Perpetrator (D or M) W OPT (Yes)", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    //// ALleged Victime Details Page (Victime Details/////
    await driver.sleep(3000);

    await sendKeysToElement1(driver, "First_Name__c", "2", "Ravi");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "Singh");
    await sendKeysToElement1(driver, "Approximate_Age__c", "8", "21");
    await sendKeysToElement1(driver, "DOB__c", "9", "Apr 17, 2001");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "12", "98765");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "13",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Physical_Address_City__c", "14", "Delhi");
    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "21", "87878");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "22",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Mailing_Address_City__c", "23", "Delhi");
    await sendKeysToElement1(driver, "Work_Phone__c", "28", "1212121212");
    await sendKeysToElement1(driver, "Home_Phone__c", "29", "1212121213");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "30", "1212121214");

    await selectDropdownOption1(
      driver,
      "Physical_Address_State__c",
      "Alaska AK"
    );
    await selectDropdownOption1(
      driver,
      "Physical_Address_County__c",
      "Addison"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Alaska AK",
      "24"
    );
    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await driver.sleep(2000);
    await selectDropdownOption(driver, "poaComboxbox", "Yes");

    await selectDropdownOption2(
      driver,
      "POA_Guardian_Relationship__c",
      "Doctor",
      "7"
    );

    await sendKeysToElement1(driver, "POA_Guardian_First_Name__c", "2", "DP");
    await sendKeysToElement1(driver, "POA_Guardian_Last_Name__c", "4", "Sign");
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_ZIP__c",
      "11",
      "21212"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_Street__c",
      "12",
      "Rajiv Chok"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_City__c",
      "13",
      "Delhi"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_State__c",
      "14",
      "Alaska AK"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Work_Phone__c",
      "18",
      "1515151515"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Home_Phone__c",
      "19",
      "1515151516"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mobile_Phone__c",
      "20",
      "1515151519"
    );

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );

    //   // Vulnerability Questions //////////
    await selectDropdownOption(driver, "AV_Is_Resident_of_Facility__c", "No");
    await selectDropdownOption(driver, "AV_Receiving_Personal_Care__c", "No");
    await selectDropdownOption(
      driver,
      "AV_Has_Daily_Living_Impairment__c",
      "No"
    );
    await selectDropdownOption(
      driver,
      "AV_Has_ANE_Prevention_Impairment__c",
      "No"
    );

    const nextButtonOnPerpetrator = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Victim to Report"]'
    );
    await clickNextButton(driver, nextButtonOnPerpetrator);

    //// /////// Finish Victime Details Test tabs and pages//////
    const nextButtonPerpetratorData = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonPerpetratorData);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );

    /////////Perpetrator Page Testing Start/////////////////////////////
    await selectDropdownOption(driver, "selfHarm", "No");

    const nextButtonProceed = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Proceed"]'
    );
    await clickNextButton(driver, nextButtonProceed);
    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );
    await driver.sleep(1000);

    //////// perpetrator details page testing/////////////

    await selectDropdownOption2(
      driver,
      "Relationship_to_Alleged_Victim__c",
      "Doctor",
      "35"
    );

    await sendKeysToElement1(driver, "First_Name__c", "2", "Sam");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "SP");
    await sendKeysToElement1(driver, "Approximate_Age__c", "9", "25");
    await sendKeysToElement1(driver, "DOB__c", "10", "Apr 22, 1999");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "13", "45245");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "14",
      "Udyog vihar"
    );
    await sendKeysToElement1(
      driver,
      "Physical_Address_City__c",
      "15",
      "Delhi NCR"
    );

    await selectDropdownOption2(
      driver,
      "Physical_Address_State__c",
      "Arizona AZ",
      "16"
    );

    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "22", "548484");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "23",
      "Udyog Vihar"
    );
    await sendKeysToElement1(
      driver,
      "Mailing_Address_City__c",
      "24",
      "Delhi NCR"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Arizona AZ",
      "25"
    );
    await selectDropdownOption2(
      driver,
      "Physical_Address_County__c",
      "Addison",
      "17"
    );

    await sendKeysToElement1(driver, "Work_Phone__c", "30", "1521521521");
    await sendKeysToElement1(driver, "Home_Phone__c", "31", "1521521522");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "32", "1521521525");

    const nextButtonIncidentDetails = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonIncidentDetails);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language Page Option Test //////////////////////

    await selectDropdownOption2(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes",
      "0"
    );

    await selectDropdownOption2(
      driver,
      "Primary_Language_or_Sign__c",
      "English",
      "1"
    );

    await selectDropdownOption2(
      driver,
      "Secondary_Language_or_Sign__c",
      "French",
      "2"
    );

    const nextButtonDORM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonDORM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M page Testing ////////////

    await selectDropdownOption2(
      driver,
      "AP_Has_Professional_License__c",
      "Yes",
      "10"
    );

    await sendKeysToElement(
      driver,
      "AP Professional License Description",
      "20132546"
    );

    const nextButtonAdd = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Perpetrator to Report"]'
    );
    await clickNextButton(driver, nextButtonAdd);

    const nextButtonWit = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonWit);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Please tell us about the incident")]')
      ),
      10000
    );
  });

  it("Perpetrator (D or M) W OPT (No)", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    //// ALleged Victime Details Page (Victime Details/////
    await driver.sleep(3000);

    await sendKeysToElement1(driver, "First_Name__c", "2", "Ravi");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "Singh");
    await sendKeysToElement1(driver, "Approximate_Age__c", "8", "21");
    await sendKeysToElement1(driver, "DOB__c", "9", "Apr 17, 2001");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "12", "98765");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "13",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Physical_Address_City__c", "14", "Delhi");
    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "21", "87878");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "22",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Mailing_Address_City__c", "23", "Delhi");
    await sendKeysToElement1(driver, "Work_Phone__c", "28", "1212121212");
    await sendKeysToElement1(driver, "Home_Phone__c", "29", "1212121213");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "30", "1212121214");

    await selectDropdownOption1(
      driver,
      "Physical_Address_State__c",
      "Alaska AK"
    );
    await selectDropdownOption1(
      driver,
      "Physical_Address_County__c",
      "Addison"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Alaska AK",
      "24"
    );
    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await driver.sleep(2000);
    await selectDropdownOption(driver, "poaComboxbox", "Yes");

    await selectDropdownOption2(
      driver,
      "POA_Guardian_Relationship__c",
      "Doctor",
      "7"
    );

    await sendKeysToElement1(driver, "POA_Guardian_First_Name__c", "2", "DP");
    await sendKeysToElement1(driver, "POA_Guardian_Last_Name__c", "4", "Sign");
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_ZIP__c",
      "11",
      "21212"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_Street__c",
      "12",
      "Rajiv Chok"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_City__c",
      "13",
      "Delhi"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_State__c",
      "14",
      "Alaska AK"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Work_Phone__c",
      "18",
      "1515151515"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Home_Phone__c",
      "19",
      "1515151516"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mobile_Phone__c",
      "20",
      "1515151519"
    );

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );

    //   // Vulnerability Questions //////////
    await selectDropdownOption(driver, "AV_Is_Resident_of_Facility__c", "No");
    await selectDropdownOption(driver, "AV_Receiving_Personal_Care__c", "No");
    await selectDropdownOption(
      driver,
      "AV_Has_Daily_Living_Impairment__c",
      "No"
    );
    await selectDropdownOption(
      driver,
      "AV_Has_ANE_Prevention_Impairment__c",
      "No"
    );

    const nextButtonOnPerpetrator = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Victim to Report"]'
    );
    await clickNextButton(driver, nextButtonOnPerpetrator);

    //// /////// Finish Victime Details Test tabs and pages//////
    const nextButtonPerpetratorData = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonPerpetratorData);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );

    /////////Perpetrator Page Testing Start/////////////////////////////
    await selectDropdownOption(driver, "selfHarm", "No");

    const nextButtonProceed = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Proceed"]'
    );
    await clickNextButton(driver, nextButtonProceed);
    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );
    await driver.sleep(1000);

    //////// perpetrator details page testing/////////////

    await selectDropdownOption2(
      driver,
      "Relationship_to_Alleged_Victim__c",
      "Doctor",
      "35"
    );

    await sendKeysToElement1(driver, "First_Name__c", "2", "Sam");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "SP");
    await sendKeysToElement1(driver, "Approximate_Age__c", "9", "25");
    await sendKeysToElement1(driver, "DOB__c", "10", "Apr 22, 1999");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "13", "45245");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "14",
      "Udyog vihar"
    );
    await sendKeysToElement1(
      driver,
      "Physical_Address_City__c",
      "15",
      "Delhi NCR"
    );

    await selectDropdownOption2(
      driver,
      "Physical_Address_State__c",
      "Arizona AZ",
      "16"
    );

    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "22", "548484");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "23",
      "Udyog Vihar"
    );
    await sendKeysToElement1(
      driver,
      "Mailing_Address_City__c",
      "24",
      "Delhi NCR"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Arizona AZ",
      "25"
    );
    await selectDropdownOption2(
      driver,
      "Physical_Address_County__c",
      "Addison",
      "17"
    );

    await sendKeysToElement1(driver, "Work_Phone__c", "30", "1521521521");
    await sendKeysToElement1(driver, "Home_Phone__c", "31", "1521521522");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "32", "1521521525");

    const nextButtonIncidentDetails = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonIncidentDetails);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language Page Option Test //////////////////////

    await selectDropdownOption2(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes",
      "0"
    );

    await selectDropdownOption2(
      driver,
      "Primary_Language_or_Sign__c",
      "English",
      "1"
    );

    await selectDropdownOption2(
      driver,
      "Secondary_Language_or_Sign__c",
      "French",
      "2"
    );

    const nextButtonDORM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonDORM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M page Testing ////////////

    await selectDropdownOption2(
      driver,
      "AP_Has_Professional_License__c",
      "No",
      "10"
    );

    const nextButtonAdd = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Perpetrator to Report"]'
    );
    await clickNextButton(driver, nextButtonAdd);

    const nextButtonWit = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonWit);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Please tell us about the incident")]')
      ),
      10000
    );
  });

  it("Incident page test", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    //// ALleged Victime Details Page (Victime Details/////
    await driver.sleep(3000);

    await sendKeysToElement1(driver, "First_Name__c", "2", "Ravi");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "Singh");
    await sendKeysToElement1(driver, "Approximate_Age__c", "8", "21");
    await sendKeysToElement1(driver, "DOB__c", "9", "Apr 17, 2001");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "12", "98765");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "13",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Physical_Address_City__c", "14", "Delhi");
    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "21", "87878");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "22",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Mailing_Address_City__c", "23", "Delhi");
    await sendKeysToElement1(driver, "Work_Phone__c", "28", "1212121212");
    await sendKeysToElement1(driver, "Home_Phone__c", "29", "1212121213");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "30", "1212121214");

    await selectDropdownOption1(
      driver,
      "Physical_Address_State__c",
      "Alaska AK"
    );
    await selectDropdownOption1(
      driver,
      "Physical_Address_County__c",
      "Addison"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Alaska AK",
      "24"
    );
    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await driver.sleep(2000);
    await selectDropdownOption(driver, "poaComboxbox", "Yes");

    await selectDropdownOption2(
      driver,
      "POA_Guardian_Relationship__c",
      "Doctor",
      "7"
    );

    await sendKeysToElement1(driver, "POA_Guardian_First_Name__c", "2", "DP");
    await sendKeysToElement1(driver, "POA_Guardian_Last_Name__c", "4", "Sign");
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_ZIP__c",
      "11",
      "21212"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_Street__c",
      "12",
      "Rajiv Chok"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_City__c",
      "13",
      "Delhi"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_State__c",
      "14",
      "Alaska AK"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Work_Phone__c",
      "18",
      "1515151515"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Home_Phone__c",
      "19",
      "1515151516"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mobile_Phone__c",
      "20",
      "1515151519"
    );

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );

    //   // Vulnerability Questions //////////
    await selectDropdownOption(driver, "AV_Is_Resident_of_Facility__c", "No");
    await selectDropdownOption(driver, "AV_Receiving_Personal_Care__c", "No");
    await selectDropdownOption(
      driver,
      "AV_Has_Daily_Living_Impairment__c",
      "No"
    );
    await selectDropdownOption(
      driver,
      "AV_Has_ANE_Prevention_Impairment__c",
      "No"
    );

    const nextButtonOnPerpetrator = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Victim to Report"]'
    );
    await clickNextButton(driver, nextButtonOnPerpetrator);

    //// /////// Finish Victime Details Test tabs and pages//////
    const nextButtonPerpetratorData = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonPerpetratorData);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );

    /////////Perpetrator Page Testing Start/////////////////////////////
    await selectDropdownOption(driver, "selfHarm", "No");

    const nextButtonProceed = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Proceed"]'
    );
    await clickNextButton(driver, nextButtonProceed);
    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );
    await driver.sleep(1000);

    //////// perpetrator details page testing/////////////

    await selectDropdownOption2(
      driver,
      "Relationship_to_Alleged_Victim__c",
      "Doctor",
      "35"
    );

    await sendKeysToElement1(driver, "First_Name__c", "2", "Sam");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "SP");
    await sendKeysToElement1(driver, "Approximate_Age__c", "9", "25");
    await sendKeysToElement1(driver, "DOB__c", "10", "Apr 22, 1999");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "13", "45245");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "14",
      "Udyog vihar"
    );
    await sendKeysToElement1(
      driver,
      "Physical_Address_City__c",
      "15",
      "Delhi NCR"
    );

    await selectDropdownOption2(
      driver,
      "Physical_Address_State__c",
      "Arizona AZ",
      "16"
    );

    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "22", "548484");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "23",
      "Udyog Vihar"
    );
    await sendKeysToElement1(
      driver,
      "Mailing_Address_City__c",
      "24",
      "Delhi NCR"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Arizona AZ",
      "25"
    );
    await selectDropdownOption2(
      driver,
      "Physical_Address_County__c",
      "Addison",
      "17"
    );

    await sendKeysToElement1(driver, "Work_Phone__c", "30", "1521521521");
    await sendKeysToElement1(driver, "Home_Phone__c", "31", "1521521522");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "32", "1521521525");

    const nextButtonIncidentDetails = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonIncidentDetails);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language Page Option Test //////////////////////

    await selectDropdownOption2(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes",
      "0"
    );

    await selectDropdownOption2(
      driver,
      "Primary_Language_or_Sign__c",
      "English",
      "1"
    );

    await selectDropdownOption2(
      driver,
      "Secondary_Language_or_Sign__c",
      "French",
      "2"
    );

    const nextButtonDORM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonDORM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M page Testing ////////////

    await selectDropdownOption2(
      driver,
      "AP_Has_Professional_License__c",
      "No",
      "10"
    );

    const nextButtonAdd = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Perpetrator to Report"]'
    );
    await clickNextButton(driver, nextButtonAdd);

    const nextButtonWit = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonWit);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Please tell us about the incident")]')
      ),
      10000
    );

    /////////Incident Details Page Testing Start/////////////////////////////
    await selectDropdownOption(driver, "Incident_Location__c", "Own Home");
    await selectDropdownOption(
      driver,
      "Incident_Occurred_at_Agency_Facility__c",
      "No"
    );
    await driver.sleep(5000);

    await selectDropdownOption1(
      driver,
      "Alleged_Perpetrator_Has_AccessVictim__c",
      "No"
    );
    await selectDropdownOption1(
      driver,
      "Dangers_Present_In_AllegedVictimHome__c",
      "No"
    );
    await selectDropdownOption(driver, "Law_Enforcement_Involvement__c", "No");
    await selectDropdownOption(
      driver,
      "Other_Parties_With_Relevant_Info__c",
      "No"
    );

    await sendKeysToElement1(driver, "Incident_ZIP__c", "7", "98765");
    await sendKeysToElement1(
      driver,
      "Incident_Street_Address__c",
      "8",
      "CP road"
    );
    await sendKeysToElement1(driver, "Incident_Apartment_Number__c", "9", "21");
    await sendKeysToElement1(driver, "Incident_City__c", "10", "Delhi");
    await selectDropdownOption2(driver, "Incident_State__c", "Alaska AK", "11");
    await selectDropdownOption2(driver, "Incident_County__c", "Franklin", "12");

    const incidentDes = await driver.findElement(
      By.xpath(
        '//label[text()="Incident Narrative"]/following-sibling::div/textarea'
      )
    );
    await incidentDes.sendKeys("Incident Narrative");
    await driver.sleep(1000);
    const nextButtonWitness = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonWitness);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the witness details")]'
        )
      ),
      10000
    );
  });

  it("Witness Page Test", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declaration Page Testing //////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    //// ALleged Victime Details Page (Victime Details/////
    await driver.sleep(3000);

    await sendKeysToElement1(driver, "First_Name__c", "2", "Ravi");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "Singh");
    await sendKeysToElement1(driver, "Approximate_Age__c", "8", "21");
    await sendKeysToElement1(driver, "DOB__c", "9", "Apr 17, 2001");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "12", "98765");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "13",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Physical_Address_City__c", "14", "Delhi");
    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "21", "87878");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "22",
      "Rajiv Chok"
    );
    await sendKeysToElement1(driver, "Mailing_Address_City__c", "23", "Delhi");
    await sendKeysToElement1(driver, "Work_Phone__c", "28", "1212121212");
    await sendKeysToElement1(driver, "Home_Phone__c", "29", "1212121213");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "30", "1212121214");

    await selectDropdownOption1(
      driver,
      "Physical_Address_State__c",
      "Alaska AK"
    );
    await selectDropdownOption1(
      driver,
      "Physical_Address_County__c",
      "Addison"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Alaska AK",
      "24"
    );
    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes"
    );

    await driver.sleep(2000);
    await selectDropdownOption(
      driver,
      "Primary_Language_or_Sign__c",
      "English"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");
    await sendKeysToElement(driver, "Current Location", "Delhi NCR");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await driver.sleep(2000);
    await selectDropdownOption(driver, "poaComboxbox", "Yes");

    await selectDropdownOption2(
      driver,
      "POA_Guardian_Relationship__c",
      "Doctor",
      "7"
    );

    await sendKeysToElement1(driver, "POA_Guardian_First_Name__c", "2", "DP");
    await sendKeysToElement1(driver, "POA_Guardian_Last_Name__c", "4", "Sign");
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_ZIP__c",
      "11",
      "21212"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_Street__c",
      "12",
      "Rajiv Chok"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_City__c",
      "13",
      "Delhi"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mailing_Address_State__c",
      "14",
      "Alaska AK"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Work_Phone__c",
      "18",
      "1515151515"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Home_Phone__c",
      "19",
      "1515151516"
    );
    await sendKeysToElement1(
      driver,
      "POA_Guardian_Mobile_Phone__c",
      "20",
      "1515151519"
    );

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );

    //   // Vulnerability Questions //////////
    await selectDropdownOption(driver, "AV_Is_Resident_of_Facility__c", "No");
    await selectDropdownOption(driver, "AV_Receiving_Personal_Care__c", "No");
    await selectDropdownOption(
      driver,
      "AV_Has_Daily_Living_Impairment__c",
      "No"
    );
    await selectDropdownOption(
      driver,
      "AV_Has_ANE_Prevention_Impairment__c",
      "No"
    );

    const nextButtonOnPerpetrator = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Victim to Report"]'
    );
    await clickNextButton(driver, nextButtonOnPerpetrator);

    //// /////// Finish Victime Details Test tabs and pages//////
    const nextButtonPerpetratorData = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonPerpetratorData);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );

    /////////Perpetrator Page Testing Start/////////////////////////////
    await selectDropdownOption(driver, "selfHarm", "No");

    const nextButtonProceed = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Proceed"]'
    );
    await clickNextButton(driver, nextButtonProceed);
    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );

    //////// perpetrator details page testing/////////////
    await driver.sleep(4000);

    await selectDropdownOption2(
      driver,
      "Relationship_to_Alleged_Victim__c",
      "Doctor",
      "35"
    );

    await sendKeysToElement1(driver, "First_Name__c", "2", "Sam");
    await sendKeysToElement1(driver, "Last_Name__c", "4", "SP");
    await sendKeysToElement1(driver, "Approximate_Age__c", "9", "25");
    await sendKeysToElement1(driver, "DOB__c", "10", "Apr 22, 1999");
    await sendKeysToElement1(driver, "Physical_Adress_ZIP__c", "13", "45245");
    await sendKeysToElement1(
      driver,
      "Physical_Address_Street__c",
      "14",
      "Udyog vihar"
    );
    await sendKeysToElement1(
      driver,
      "Physical_Address_City__c",
      "15",
      "Delhi NCR"
    );

    await selectDropdownOption2(
      driver,
      "Physical_Address_State__c",
      "Arizona AZ",
      "16"
    );

    await sendKeysToElement1(driver, "Mailing_Address_ZIP__c", "22", "548484");
    await sendKeysToElement1(
      driver,
      "Mailing_Address_Street__c",
      "23",
      "Udyog Vihar"
    );
    await sendKeysToElement1(
      driver,
      "Mailing_Address_City__c",
      "24",
      "Delhi NCR"
    );

    await selectDropdownOption2(
      driver,
      "Mailing_Address_State__c",
      "Arizona AZ",
      "25"
    );
    await selectDropdownOption2(
      driver,
      "Physical_Address_County__c",
      "Addison",
      "17"
    );

    await sendKeysToElement1(driver, "Work_Phone__c", "30", "1521521521");
    await sendKeysToElement1(driver, "Home_Phone__c", "31", "1521521522");
    await sendKeysToElement1(driver, "Mobile_Phone__c", "32", "1521521525");

    const nextButtonIncidentDetails = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonIncidentDetails);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language Page Option Test //////////////////////

    await selectDropdownOption2(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "Yes",
      "0"
    );

    await selectDropdownOption2(
      driver,
      "Primary_Language_or_Sign__c",
      "English",
      "1"
    );

    await selectDropdownOption2(
      driver,
      "Secondary_Language_or_Sign__c",
      "French",
      "2"
    );

    const nextButtonDORM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonDORM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M page Testing ////////////

    await selectDropdownOption2(
      driver,
      "AP_Has_Professional_License__c",
      "No",
      "10"
    );

    const nextButtonAdd = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Perpetrator to Report"]'
    );
    await clickNextButton(driver, nextButtonAdd);

    const nextButtonWit = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonWit);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Please tell us about the incident")]')
      ),
      10000
    );

    /////////Incident Details Page Testing Start/////////////////////////////
    await selectDropdownOption(driver, "Incident_Location__c", "Own Home");
    await selectDropdownOption(
      driver,
      "Incident_Occurred_at_Agency_Facility__c",
      "No"
    );
    await driver.sleep(5000);

    await selectDropdownOption1(
      driver,
      "Alleged_Perpetrator_Has_AccessVictim__c",
      "No"
    );
    await selectDropdownOption1(
      driver,
      "Dangers_Present_In_AllegedVictimHome__c",
      "No"
    );
    await selectDropdownOption(driver, "Law_Enforcement_Involvement__c", "No");
    await selectDropdownOption(
      driver,
      "Other_Parties_With_Relevant_Info__c",
      "No"
    );

    await sendKeysToElement1(driver, "Incident_ZIP__c", "7", "98765");
    await sendKeysToElement1(
      driver,
      "Incident_Street_Address__c",
      "8",
      "CP road"
    );
    await sendKeysToElement1(driver, "Incident_Apartment_Number__c", "9", "21");
    await sendKeysToElement1(driver, "Incident_City__c", "10", "Delhi");
    await sendKeysToElement1(driver, "Incident_City__c", "10", "Delhi");

    const incidentDes = await driver.findElement(
      By.xpath(
        '//label[text()="Incident Narrative"]/following-sibling::div/textarea'
      )
    );
    await incidentDes.sendKeys("Incident Narrative");
    await selectDropdownOption2(driver, "Incident_State__c", "Alaska AK", "11");

    await selectDropdownOption2(driver, "Incident_County__c", "Franklin", "12");
    await driver.sleep(1000);
    const nextButtonWitness = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonWitness);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the witness details")]'
        )
      ),
      10000
    );

    ////////////// // Witness Testing Page /////////////////////

    const checkboxes = await driver.findElements(
      By.xpath('//input[@type="checkbox"]')
    );
    for (let checkbox of checkboxes) {
      // Check the checkbox if it's not already checked
      const isChecked = await checkbox.isSelected();
      if (!isChecked) {
        // Click the checkbox via JavaScript
        await driver.executeScript("arguments[0].click();", checkbox);
        // console.log("Checkbox checked.");
      } else {
        console.log("Checkbox is already checked.");
      }
    }
    for (let checkbox of checkboxes) {
      assert.ok(await checkbox.isSelected(), "Checkbox is not checked");
    }

    const labelText =
      "What is the Witness’s relationship to the alleged victim?";
    const buttonId = await getButtonIdByLabelText(driver, labelText);

    const dropdownButtonIncident2 = await driver.findElement(
      By.xpath(`//button[@id="${buttonId}"]`)
    );
    await dropdownButtonIncident2.click();

    const divIdIncident2 = await dropdownButtonIncident2.getAttribute(
      "aria-controls"
    );

    const dropdownOptionsXPath9 = `//*[@id="${divIdIncident2}"]//lightning-base-combobox-item`;
    const dropdownOptionsLocator9 = By.xpath(dropdownOptionsXPath9);

    const dropdownOptions9 = await driver.findElements(dropdownOptionsLocator9);
    await driver.sleep(1000);

    for (const option of dropdownOptions9) {
      const optionText = await option.getText();
      if (optionText === "AAA") {
        await option.click();
        break;
      }
    }

    const updatedButtonIncident2 = await dropdownButtonIncident2.getText();
    assert.strictEqual(
      updatedButtonIncident2,
      "AAA",
      "Witness’s relationship to the alleged victim"
    );

    // await selectDropdownOption2(
    //   driver,
    //   "Relationship_to_Alleged_Victim__c",
    //   "AAA",
    //   "22"
    // );
    const witnessProvidedInfo = await driver.findElement(
      By.xpath(
        '//label[text()="Information Witness Can Provide"]/following-sibling::div/textarea'
      )
    );
    await witnessProvidedInfo.sendKeys("Information Witness Can Provide");

    await selectDropdownOption1(driver, "Witness_Aware_of_Report__c", "No");

    const nextButtonAddWitness = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Add Witness to Report"]'
    );
    await clickNextButton(driver, nextButtonAddWitness);

    const nextButton = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButton);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Supported Documents")]')
      ),
      10000
    );
  });

  it("Complete Form Test Manually", async function () {
    await driver.sleep(5000);
    const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
    await DropdownUtils.selectOption(driver, dropdownLocator, "Yes");
    await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
      ),
      10000
    );

    // Report Declartion page Testing//////
    const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
    await DropdownUtils.selectOption(driver, dropdownLocator2, "No");

    await clickNextButton(
      driver,
      By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      )
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
        )
      ),
      10000
    );

    await driver.sleep(1000);

    // Reporter Details Page ///////////

    const nextButtonOnReporterDetailsPageLocator = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged victim")]'
        )
      ),
      10000
    );

    // ALleged Victime Details Page (Victime Details/////

    const checkboxes = await driver.findElements(
      By.xpath('//input[@type="checkbox"]')
    );
    for (let checkbox of checkboxes) {
      // Check the checkbox if it's not already checked
      const isChecked = await checkbox.isSelected();
      if (!isChecked) {
        // Click the checkbox via JavaScript
        await driver.executeScript("arguments[0].click();", checkbox);
        // console.log("Checkbox checked.");
      } else {
        console.log("Checkbox is already checked.");
      }
    }

    // Assert that all checkboxes are checked
    for (let checkbox of checkboxes) {
      assert.ok(await checkbox.isSelected(), "Checkbox is not checked");
    }

    const nextButtonOnVicLang = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
    );
    await clickNextButton(driver, nextButtonOnVicLang);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
        )
      ),
      10000
    );

    // Language option section//////

    await selectDropdownOption(
      driver,
      "Interpreter_or_Translator_Needed__c",
      "No"
    );

    const nextButtonOnVicDorM = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
    );
    await clickNextButton(driver, nextButtonOnVicDorM);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
      ),
      10000
    );

    // D or M option section//////

    // First Option Button /////
    await selectDropdownOption(driver, "Other_Accommodation_Needed__c", "CART");

    // Second Option Button /////
    await selectDropdownOption(driver, "Assisted_Telephone_Needed__c", "TTY");

    // Third Option Button /////
    await selectDropdownOption(driver, "Living_Arrangement__c", "Own Home");

    // Require Input Field value///

    await sendKeysToElement(driver, "Current Location", "CP Road India");

    const nextButtonOnPOA = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
    );
    await clickNextButton(driver, nextButtonOnPOA);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
        )
      ),
      10000
    );

    // POA (Victime Details Page Tsting)
    await selectDropdownOption(driver, "poaComboxbox", "No");

    const nextButtonOnVUR = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
    );
    await clickNextButton(driver, nextButtonOnVUR);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
        )
      ),
      10000
    );

    // Vulnerability Questions //////////
    await selectDropdownOption(driver, "AV_Is_Resident_of_Facility__c", "Yes");

    // Required Input Field//////

    await sendKeysToElement(driver, "AV Resident Facility Name", "Ap Builders");

    const nextButtonOnPerpetrator = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Victim to Report"]'
    );
    await clickNextButton(driver, nextButtonOnPerpetrator);

    //// /////// Finish Victime Details Test tabs and pages//////
    const nextButtonPerpetratorData = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonPerpetratorData);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
        )
      ),
      10000
    );

    /////////Perpetrator Page Testing Start/////////////////////////////
    await selectDropdownOption(driver, "selfHarm", "Yes");

    const nextButtonProceed = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Proceed"]'
    );
    await clickNextButton(driver, nextButtonProceed);

    await driver.sleep(1000);

    const messageElement = await driver.findElement(
      By.xpath(
        "//div[contains(@class, 'slds-align_absolute-center')]/div[contains(@style, 'color: red; margin-right: 30px; margin-left: 30px;')]"
      )
    );

    // Check if the message element is visible
    const isMessageVisible = await messageElement.isDisplayed();

    // Assert that the message is visible
    assert.ok(isMessageVisible, "Message is not visible");

    await driver.sleep(1000);

    const nextButtonIncidentDetails = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonIncidentDetails);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Please tell us about the incident")]')
      ),
      10000
    );

    /////////Incident Details Page Testing Start/////////////////////////////

    // First drop down option/////////
    await selectDropdownOption(driver, "Incident_Location__c", "Own Home");

    // Second drop down option/////////
    await selectDropdownOption(
      driver,
      "Incident_Occurred_at_Agency_Facility__c",
      "No"
    );

    // Third Drop Down option
    await driver.sleep(5000);

    await selectDropdownOption1(
      driver,
      "Alleged_Perpetrator_Has_AccessVictim__c",
      "No"
    );

    // Fourth drop down option/////////
    await selectDropdownOption1(
      driver,
      "Dangers_Present_In_AllegedVictimHome__c",
      "No"
    );

    // Require Textarea/////////

    const incidentDes = await driver.findElement(
      By.xpath(
        '//label[text()="Incident Narrative"]/following-sibling::div/textarea'
      )
    );
    await incidentDes.sendKeys("Incident Narrative");

    // Fivth drop down option/////////
    await selectDropdownOption(driver, "Law_Enforcement_Involvement__c", "No");

    // Sixth drop down option/////////

    await selectDropdownOption(
      driver,
      "Other_Parties_With_Relevant_Info__c",
      "No"
    );

    await driver.sleep(1000);

    const nextButtonWitness = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Next"]'
    );
    await clickNextButton(driver, nextButtonWitness);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[contains(text(), "Please tell us about the witness details")]'
        )
      ),
      10000
    );

    ////////////// // Witness Testing Page /////////////////////

    // first drop down option testing
    const labelText =
      "What is the Witness’s relationship to the alleged victim?";
    const buttonId = await getButtonIdByLabelText(driver, labelText);

    // console.log(buttonId);

    const dropdownButtonIncident2 = await driver.findElement(
      By.xpath(`//button[@id="${buttonId}"]`)
    );
    await dropdownButtonIncident2.click();

    const divIdIncident2 = await dropdownButtonIncident2.getAttribute(
      "aria-controls"
    );

    const dropdownOptionsXPath9 = `//*[@id="${divIdIncident2}"]//lightning-base-combobox-item`;
    const dropdownOptionsLocator9 = By.xpath(dropdownOptionsXPath9);

    const dropdownOptions9 = await driver.findElements(dropdownOptionsLocator9);
    await driver.sleep(1000);

    for (const option of dropdownOptions9) {
      const optionText = await option.getText();
      if (optionText === "AAA") {
        await option.click();
        break;
      }
    }

    const updatedButtonIncident2 = await dropdownButtonIncident2.getText();
    assert.strictEqual(
      updatedButtonIncident2,
      "AAA",
      "Witness’s relationship to the alleged victim"
    );

    // Second drop down option testing
    await selectDropdownOption(driver, "Witness_Aware_of_Report__c", "No");

    // Require Textarea/////////
    const witnessProvidedInfo = await driver.findElement(
      By.xpath(
        '//label[text()="Information Witness Can Provide"]/following-sibling::div/textarea'
      )
    );
    await witnessProvidedInfo.sendKeys("Information Witness Can Provide");

    const nextButtonAddWitness = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Add Witness to Report"]'
    );
    await clickNextButton(driver, nextButtonAddWitness);

    const nextButton = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Next"]'
    );
    await clickNextButton(driver, nextButton);

    await driver.wait(
      until.elementLocated(
        By.xpath('//*[contains(text(), "Supported Documents")]')
      ),
      10000
    );

    // Finally Submit the Form Button click
    const submitButton = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Submit Report"]'
    );
    await clickNextButton(driver, submitButton);
    await driver.sleep(1000);

    //// /////Confirmation POp Up Click  selecting Cancel Option///////

    const confirmationPopupBtn = By.xpath(
      '//button[@class="slds-button slds-button_neutral" and text()="Cancel"]'
    );
    await clickNextButton(driver, confirmationPopupBtn);
    await driver.sleep(1000);

    // Finally Submit the Form Button click
    const submitButton1 = By.xpath(
      '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Submit Report"]'
    );
    await clickNextButton(driver, submitButton1);

    await driver.sleep(1000);

    //// /////Confirmation POp Up Click  selecting Cancel Option///////

    await driver.sleep(1000);

    const confirmationPopupBtn1 = By.xpath(
      '//button[@class="slds-button slds-button_brand" and text()="Yes"]'
    );
    await clickNextButton(driver, confirmationPopupBtn1);

    // Find the success message element using XPath
    const successMessageElement = await driver.wait(
      until.elementLocated(By.xpath("//div[@class='text']/h1")),
      5000
    );

    const messageText = await successMessageElement.getText();
    assert.ok(
      await successMessageElement.isDisplayed(),
      "Message is not visible"
    );
    assert.strictEqual(
      messageText,
      "Success",
      "Success message text does not match"
    );
  });

  it("Complete Form Test Using Excle", async function () {
    const testDataArray = readTestDataFromExcel("data_sheet/vermont.xlsx");
    for (const testData of testDataArray) {
      await driver.sleep(5000);
      const dropdownLocator = By.xpath('//*[@id="combobox-button-6"]');
      await DropdownUtils.selectOption(
        driver,
        dropdownLocator,
        testData.Button6
      );
      await clickNextButton(driver, By.xpath('//button[@label="Next"]'));

      await driver.wait(
        until.elementLocated(
          By.xpath('//*[contains(text(), "If you are a mandated reporter")]')
        ),
        10000
      );

      // Report Declaration Page Testing //////
      const dropdownLocator2 = By.xpath('//*[@id="combobox-button-18"]');
      await DropdownUtils.selectOption(
        driver,
        dropdownLocator2,
        testData.Button18
      );

      await clickNextButton(
        driver,
        By.xpath(
          '//button[@class="slds-button slds-button_brand" and text()="Next"]'
        )
      );

      await driver.wait(
        until.elementLocated(
          By.xpath(
            '//*[contains(text(), "Please tell us about you, the reporter of the incident")]'
          )
        ),
        10000
      );

      // Reporter Details Page ///////////

      await driver.sleep(3000);
      await selectDropdownOption(
        driver,
        "ReportMadeConjunction_withEmployment__c",
        testData.ReporterMadeConj
      );
      await selectDropdownOption1(
        driver,
        "Mailing_Address_State__c",
        testData.State
      );

      await fillReporterDetails(driver, testData);
      await selectDropdownOption(
        driver,
        "Preferred_Phone__c",
        testData.PreferredPhone
      );
      await selectDropdownOption(
        driver,
        "Relationship_to_Alleged_Victim__c",
        testData.RelationshipVictim
      );

      const nextButtonOnReporterDetailsPageLocator = By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      );
      await clickNextButton(driver, nextButtonOnReporterDetailsPageLocator);
      await driver.wait(
        until.elementLocated(
          By.xpath(
            '//*[contains(text(), "Please tell us about the alleged victim")]'
          )
        ),
        10000
      );

      //// ALleged Victime Details Page (Victime Details/////
      await driver.sleep(3000);
      await sendKeysToElement1(
        driver,
        "First_Name__c",
        "2",
        testData.VFirstName
      );
      await sendKeysToElement1(driver, "Last_Name__c", "4", testData.VLastName);
      await sendKeysToElement1(
        driver,
        "Approximate_Age__c",
        "8",
        testData.VApproximateAge
      );
      await sendKeysToElement1(driver, "DOB__c", "9", testData.VDOB);
      await sendKeysToElement1(
        driver,
        "Physical_Adress_ZIP__c",
        "12",
        testData.VPhysicalAdressZIP
      );
      await sendKeysToElement1(
        driver,
        "Physical_Address_Street__c",
        "13",
        testData.VPhysicalAddressStreet
      );
      await sendKeysToElement1(
        driver,
        "Physical_Address_City__c",
        "14",
        testData.VPhysicalAddressCity
      );
      await sendKeysToElement1(
        driver,
        "Mailing_Address_ZIP__c",
        "21",
        testData.VMailingAddressZIP
      );
      await sendKeysToElement1(
        driver,
        "Mailing_Address_Street__c",
        "22",
        testData.VMailingAddressStreet
      );
      await sendKeysToElement1(
        driver,
        "Mailing_Address_City__c",
        "23",
        testData.VMailingAddressCity
      );
      await sendKeysToElement1(
        driver,
        "Work_Phone__c",
        "28",
        testData.VWorkPhone
      );
      await sendKeysToElement1(
        driver,
        "Home_Phone__c",
        "29",
        testData.VHomePhone
      );
      await sendKeysToElement1(
        driver,
        "Mobile_Phone__c",
        "30",
        testData.VMobilePhone
      );

      await selectDropdownOption1(
        driver,
        "Physical_Address_State__c",
        testData.VPhysicalAddressState
      );
      await selectDropdownOption1(
        driver,
        "Physical_Address_County__c",
        testData.VPhysicalAddressCounty
      );

      await selectDropdownOption2(
        driver,
        "Mailing_Address_State__c",
        testData.VMailingAddressState,
        "24"
      );

      const nextButtonOnVicLang = By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Go to Language"]'
      );
      await clickNextButton(driver, nextButtonOnVicLang);

      await driver.wait(
        until.elementLocated(
          By.xpath(
            '//*[contains(text(), "Is an Interpreter or Translator Needed?")]'
          )
        ),
        10000
      );

      // Language option section//////

      await driver.sleep(3000);
      await selectDropdownOption(
        driver,
        "Interpreter_or_Translator_Needed__c",
        testData.VInterpreterTranslatorNeeded
      );

      await driver.sleep(2000);
      await selectDropdownOption(
        driver,
        "Primary_Language_or_Sign__c",
        testData.VPrimaryLanguageSign
      );

      const nextButtonOnVicDorM = By.xpath(
        '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Demographics"]'
      );
      await clickNextButton(driver, nextButtonOnVicDorM);

      await driver.wait(
        until.elementLocated(
          By.xpath('//*[contains(text(), "Other Accommodation Needed")]')
        ),
        10000
      );

      // D or M option section//////
      await selectDropdownOption(
        driver,
        "Other_Accommodation_Needed__c",
        testData.VOtherAccommodationNeeded
      );
      await selectDropdownOption(
        driver,
        "Assisted_Telephone_Needed__c",
        testData.VAssistedTelephoneNeeded
      );
      await selectDropdownOption(
        driver,
        "Living_Arrangement__c",
        testData.VLivingArrangement
      );
      await sendKeysToElement(
        driver,
        "Current Location",
        testData.VCurrentLocation
      );

      const nextButtonOnPOA = By.xpath(
        '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Power Of Attroney"]'
      );
      await clickNextButton(driver, nextButtonOnPOA);

      await driver.wait(
        until.elementLocated(
          By.xpath(
            '//*[contains(text(), "Does the alleged victim have a guardian or power of attorney (POA)?")]'
          )
        ),
        10000
      );

      // POA (Victime Details Page Tsting)
      await selectDropdownOption(driver, "poaComboxbox", testData.PoaComboxbox);

      const nextButtonOnVUR = By.xpath(
        '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Go to Vulnerability Questions"]'
      );
      await clickNextButton(driver, nextButtonOnVUR);

      await driver.wait(
        until.elementLocated(
          By.xpath(
            '//*[contains(text(), "Was the alleged victim a resident of a licensed long term care facility")]'
          )
        ),
        10000
      );

      // Vulnerability Questions //////////
      await selectDropdownOption(
        driver,
        "AV_Is_Resident_of_Facility__c",
        testData.VAVIsResidentofFacility
      );

      // Required Input Field//////

      await sendKeysToElement(
        driver,
        "AV Resident Facility Name",
        testData.VAVResidentFacilityName
      );

      const nextButtonOnPerpetrator = By.xpath(
        '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Add Victim to Report"]'
      );
      await clickNextButton(driver, nextButtonOnPerpetrator);

      //// /////// Finish Victime Details Test tabs and pages//////
      const nextButtonPerpetratorData = By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      );
      await clickNextButton(driver, nextButtonPerpetratorData);

      await driver.wait(
        until.elementLocated(
          By.xpath(
            '//*[contains(text(), "Please tell us about the alleged perpetrator")]'
          )
        ),
        10000
      );

      ///////////Perpetrator Page Testing Start/////////////////////////////
      await selectDropdownOption(driver, "selfHarm", testData.SelfHarm);

      const nextButtonProceed = By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Proceed"]'
      );
      await clickNextButton(driver, nextButtonProceed);

      await driver.sleep(1000);

      const messageElement = await driver.findElement(
        By.xpath(
          "//div[contains(@class, 'slds-align_absolute-center')]/div[contains(@style, 'color: red; margin-right: 30px; margin-left: 30px;')]"
        )
      );

      // Check if the message element is visible
      const isMessageVisible = await messageElement.isDisplayed();

      // Assert that the message is visible
      assert.ok(isMessageVisible, "Message is not visible");

      await driver.sleep(1000);

      const nextButtonIncidentDetails = By.xpath(
        '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Next"]'
      );
      await clickNextButton(driver, nextButtonIncidentDetails);

      await driver.wait(
        until.elementLocated(
          By.xpath('//*[contains(text(), "Please tell us about the incident")]')
        ),
        10000
      );

      ///////////Incident Details Page Testing Start/////////////////////////////

      const checkboxes = await driver.findElements(
        By.xpath('//input[@type="checkbox"]')
      );
      for (let checkbox of checkboxes) {
        // Check the checkbox if it's not already checked
        const isChecked = await checkbox.isSelected();
        if (!isChecked) {
          // Click the checkbox via JavaScript
          await driver.executeScript("arguments[0].click();", checkbox);
          // console.log("Checkbox checked.");
        } else {
          console.log("Checkbox is already checked.");
        }
      }

      // Assert that all checkboxes are checked
      for (let checkbox of checkboxes) {
        assert.ok(await checkbox.isSelected(), "Checkbox is not checked");
      }

      // First drop down option/////////
      await selectDropdownOption(
        driver,
        "Incident_Location__c",
        testData.IncidentLocation
      );

      // Second drop down option/////////
      await selectDropdownOption(
        driver,
        "Incident_Occurred_at_Agency_Facility__c",
        testData.IncidentOccurredatAgencyFacility
      );

      // Third Drop Down option
      await driver.sleep(5000);

      await selectDropdownOption1(
        driver,
        "Alleged_Perpetrator_Has_AccessVictim__c",
        testData.AllegedPerpetratorHasAccessVictim
      );

      // Fourth drop down option/////////
      await selectDropdownOption1(
        driver,
        "Dangers_Present_In_AllegedVictimHome__c",
        testData.DangersPresentInAllegedVictimHome
      );

      // Require Textarea/////////

      const incidentDes = await driver.findElement(
        By.xpath(
          '//label[text()="Incident Narrative"]/following-sibling::div/textarea'
        )
      );
      await incidentDes.sendKeys(testData.IncidentNarrative);

      // Fivth drop down option/////////
      await selectDropdownOption(
        driver,
        "Law_Enforcement_Involvement__c",
        testData.LawEnforcementInvolvement
      );

      // Sixth drop down option/////////

      await selectDropdownOption(
        driver,
        "Other_Parties_With_Relevant_Info__c",
        testData.OtherPartiesWithRelevantInfo
      );

      await driver.sleep(1000);

      const nextButtonWitness = By.xpath(
        '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Next"]'
      );
      await clickNextButton(driver, nextButtonWitness);

      await driver.wait(
        until.elementLocated(
          By.xpath(
            '//*[contains(text(), "Please tell us about the witness details")]'
          )
        ),
        10000
      );

      ////////////// // Witness Testing Page /////////////////////

      // first drop down option testing
      const labelText =
        "What is the Witness’s relationship to the alleged victim?";
      const buttonId = await getButtonIdByLabelText(driver, labelText);

      // console.log(buttonId);

      const dropdownButtonIncident2 = await driver.findElement(
        By.xpath(`//button[@id="${buttonId}"]`)
      );
      await dropdownButtonIncident2.click();

      const divIdIncident2 = await dropdownButtonIncident2.getAttribute(
        "aria-controls"
      );

      const dropdownOptionsXPath9 = `//*[@id="${divIdIncident2}"]//lightning-base-combobox-item`;
      const dropdownOptionsLocator9 = By.xpath(dropdownOptionsXPath9);

      const dropdownOptions9 = await driver.findElements(
        dropdownOptionsLocator9
      );
      await driver.sleep(1000);

      for (const option of dropdownOptions9) {
        const optionText = await option.getText();
        if (optionText === testData.optionText) {
          await option.click();
          break;
        }
      }

      const updatedButtonIncident2 = await dropdownButtonIncident2.getText();
      assert.strictEqual(
        updatedButtonIncident2,
        testData.optionText,
        "Witness’s relationship to the alleged victim"
      );

      // Second drop down option testing
      await selectDropdownOption(
        driver,
        "Witness_Aware_of_Report__c",
        testData.WitnessAwareofReport
      );

      // Require Textarea/////////
      const witnessProvidedInfo = await driver.findElement(
        By.xpath(
          '//label[text()="Information Witness Can Provide"]/following-sibling::div/textarea'
        )
      );
      await witnessProvidedInfo.sendKeys(testData.WitnessInfo);

      const nextButtonAddWitness = By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Add Witness to Report"]'
      );
      await clickNextButton(driver, nextButtonAddWitness);

      const nextButton = By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Next"]'
      );
      await clickNextButton(driver, nextButton);

      await driver.wait(
        until.elementLocated(
          By.xpath('//*[contains(text(), "Supported Documents")]')
        ),
        10000
      );

      // Finally Submit the Form Button click
      const submitButton = By.xpath(
        '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Submit Report"]'
      );
      await clickNextButton(driver, submitButton);
      await driver.sleep(1000);

      //// /////Confirmation POp Up Click  selecting Cancel Option///////

      const confirmationPopupBtn = By.xpath(
        '//button[@class="slds-button slds-button_neutral" and text()="Cancel"]'
      );
      await clickNextButton(driver, confirmationPopupBtn);
      await driver.sleep(1000);

      // Finally Submit the Form Button click
      const submitButton1 = By.xpath(
        '//button[@class="slds-button slds-button_brand slds-kx-is-animating-from-click" and text()="Submit Report"]'
      );
      await clickNextButton(driver, submitButton1);

      await driver.sleep(1000);

      //// /////Confirmation POp Up Click  selecting Cancel Option///////

      await driver.sleep(1000);

      const confirmationPopupBtn1 = By.xpath(
        '//button[@class="slds-button slds-button_brand" and text()="Yes"]'
      );
      await clickNextButton(driver, confirmationPopupBtn1);

      // Find the success message element using XPath
      const successMessageElement = await driver.wait(
        until.elementLocated(By.xpath("//div[@class='text']/h1")),
        5000
      );

      const messageText = await successMessageElement.getText();
      assert.ok(
        await successMessageElement.isDisplayed(),
        "Message is not visible"
      );
      assert.strictEqual(
        messageText,
        "Success",
        "Success message text does not match"
      );

      await driver.navigate().refresh();
    }
  });
});
