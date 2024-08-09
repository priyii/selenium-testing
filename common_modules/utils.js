const { By } = require("selenium-webdriver");
const assert = require("assert");
const { until } = require("selenium-webdriver");

async function navigateToPage(driver, pageUrl) {
  await driver.get(pageUrl);
}

async function clickNextButton(driver, locator) {
  try {
    const nextButton = await driver.findElement(locator);
    await nextButton.click();
    // console.log("Button clicked");
    return true;
  } catch (error) {
    console.error("Error clicking button:", error);
    return false;
  }
}

class PageTitleUtils {
  static async getPageTitle(driver) {
    return await driver.getTitle();
  }
}

class DropdownUtils {
  static async selectOption(driver, locator, option) {
    const dropdown = await driver.findElement(locator);
    await dropdown.click();
    await dropdown.findElement(By.xpath(`//span[text()='${option}']`)).click();
  }
}

class InputFieldUtils {
  static async enterText(driver, locator, text) {
    const inputField = await driver.wait(until.elementLocated(locator), 10000);
    await inputField.clear();
    await inputField.sendKeys(text);
    const enteredText = await inputField.getAttribute("value");
    assert.strictEqual(
      enteredText,
      text,
      `Entered text '${text}' does not match the input field value`
    );
  }
}

async function selectDropdownOption(driver, buttonId, optionText) {
  const dropdownButton = await driver.findElement(
    By.xpath(`//button[@name="${buttonId}"]`)
  );
  await dropdownButton.click();

  const divId = await dropdownButton.getAttribute("aria-controls");
  // console.log("Div ID:", divId);

  const dropdownOptionsXPath = `//*[@id="${divId}"]//lightning-base-combobox-item`;
  const dropdownOptionsLocator = By.xpath(dropdownOptionsXPath);

  await driver.wait(until.elementsLocated(dropdownOptionsLocator));

  const dropdownOptions = await driver.findElements(dropdownOptionsLocator);
  await driver.sleep(1000);

  for (const option of dropdownOptions) {
    const text = await option.getText();
    if (text === optionText) {
      await option.click();
      break;
    }
  }

  const updatedButtonText = await dropdownButton.getText();
  assert.strictEqual(
    updatedButtonText,
    optionText,
    `Dropdown option did not update to "${optionText} of this ${buttonId}"`
  );
}

async function selectDropdownOption1(driver, buttonId, optionText) {
  const dropdownButton = await driver.findElement(
    By.xpath(`//button[@name="${buttonId}"]`)
  );

  // Scroll to the dropdown button to ensure it's in view
  await driver.executeScript(
    "arguments[0].scrollIntoView(true);",
    dropdownButton
  );

  await driver.sleep(5000);

  // Click the dropdown button
  await dropdownButton.click();

  const divId = await dropdownButton.getAttribute("aria-controls");
  // console.log("Div ID:", divId);

  const dropdownOptionsXPath = `//*[@id="${divId}"]//lightning-base-combobox-item`;
  const dropdownOptionsLocator = By.xpath(dropdownOptionsXPath);

  // Wait for dropdown options to appear
  await driver.wait(until.elementsLocated(dropdownOptionsLocator));

  const dropdownOptions = await driver.findElements(dropdownOptionsLocator);
  await driver.sleep(1000);

  for (const option of dropdownOptions) {
    const text = await option.getText();
    if (text === optionText) {
      await option.click();
      break;
    }
  }

  // Wait for the dropdown button text to update
  await driver.wait(async () => {
    const updatedButtonText = await dropdownButton.getText();
    return updatedButtonText === optionText;
  }, 5000);

  // Assert that the dropdown option updated correctly
  const updatedButtonText = await dropdownButton.getText();
  assert.strictEqual(
    updatedButtonText,
    optionText,
    `Dropdown option did not update to "${optionText}" for button ${buttonId}`
  );
}

async function selectDropdownOption2(driver, buttonId, optionText, dataIndex) {
  const dropdownButton = await driver.findElement(
    By.xpath(
      `//lightning-input-field[@data-index='${dataIndex}']//button[contains(@name, '${buttonId}')]`
    )
  );

  // Scroll to the dropdown button to ensure it's in view
  await driver.executeScript(
    "arguments[0].scrollIntoView(true);",
    dropdownButton
  );

  await driver.sleep(5000);

  // Click the dropdown button
  await dropdownButton.click();

  const divId = await dropdownButton.getAttribute("aria-controls");
  // console.log("Div ID:", divId);

  const dropdownOptionsXPath = `//*[@id="${divId}"]//lightning-base-combobox-item`;
  const dropdownOptionsLocator = By.xpath(dropdownOptionsXPath);

  // Wait for dropdown options to appear
  await driver.wait(until.elementsLocated(dropdownOptionsLocator));

  const dropdownOptions = await driver.findElements(dropdownOptionsLocator);
  await driver.sleep(1000);

  for (const option of dropdownOptions) {
    const text = await option.getText();
    if (text === optionText) {
      await option.click();
      break;
    }
  }

  // Wait for the dropdown button text to update
  await driver.wait(async () => {
    const updatedButtonText = await dropdownButton.getText();
    return updatedButtonText === optionText;
  }, 5000);

  // Assert that the dropdown option updated correctly
  const updatedButtonText = await dropdownButton.getText();
  assert.strictEqual(
    updatedButtonText,
    optionText,
    `Dropdown option did not update to "${optionText}" for button ${buttonId}`
  );
}

async function getButtonIdByLabelText(driver, labelText) {
  const button = await driver.findElement(
    By.xpath(`//label[contains(text(), '${labelText}')]//following::button[1]`)
  );

  // Assert that the button element is found
  assert.ok(button, "Button element not found");

  const buttonId = await button.getAttribute("id");
  return buttonId;
}

async function sendKeysToElement(driver, labelText, keysToSend) {
  const xpath = `//label[text()="${labelText}"]/following-sibling::div/input`;
  try {
    const element = await driver.findElement(By.xpath(xpath));
    assert.ok(element, `Element with label '${labelText}' found`);
    await element.sendKeys(keysToSend);
  } catch (error) {
    throw new Error(
      `Error locating or sending keys to element with label '${labelText}': ${error.message}`
    );
  }
}

async function sendKeysToElement1(driver, labelText, indexVal, keysToSend) {
  const xpath = `//lightning-input-field[@data-id="${labelText}" and @data-index="${indexVal}"]`;
  try {
    const element = await driver.findElement(By.xpath(xpath));
    assert.ok(element, `Element with label '${labelText}' found`);
    await element.sendKeys(keysToSend);
  } catch (error) {
    throw new Error(
      `Error locating or sending keys to element with label '${labelText}': ${error.message}`
    );
  }
}

async function fillInputFieldByText(
  driver,
  labelText,
  textToEnter,
  timeout = 10000
) {
  const inputXPath = `//label[contains(text(), '${labelText}')]/following-sibling::div/input`;
  const inputElement = await driver.wait(
    until.elementLocated(By.xpath(inputXPath)),
    timeout
  );
  assert.ok(
    inputElement,
    `Input field with label text '${labelText}' is found`
  );
  await inputElement.sendKeys(textToEnter);
}

async function fillReporterDetails(driver, testData) {
  await sendKeysToElement(driver, "First Name", testData.FirstName);
  await sendKeysToElement(driver, "Last Name", testData.LastName);
  await sendKeysToElement(driver, "Work Phone", testData.WorkPhone);
  await sendKeysToElement(driver, "Home Phone", testData.HomePhone);
  // await sendKeysToElement(driver, "Mobile Phone", testData.MobilePhone);
  await sendKeysToElement(driver, "Mailing Address ZIP", testData.Zip);
  await sendKeysToElement(driver, "Mailing Address City", testData.City);
  await sendKeysToElement(
    driver,
    "Mailing Address Street",
    testData.MallingStreet
  );
  await sendKeysToElement(driver, "Work Email", testData.WorkEmail);
  await sendKeysToElement(driver, "Personal Email", testData.PersonalEmail);
}

module.exports = {
  navigateToPage,
  clickNextButton,
  PageTitleUtils,
  DropdownUtils,
  InputFieldUtils,
  selectDropdownOption,
  selectDropdownOption1,
  getButtonIdByLabelText,
  sendKeysToElement,
  fillInputFieldByText,
  fillReporterDetails,
  sendKeysToElement1,
  selectDropdownOption2,
};
