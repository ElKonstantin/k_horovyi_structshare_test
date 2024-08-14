const { test, expect } = require('@playwright/test');
const fs = require('fs');
const Papa = require('papaparse');

test.describe('Products ordering using CSV file for guest users', () => {
  let records = [];

  test.beforeAll(async () => {
    console.log('Reading CSV file');
    const fileContent = fs.readFileSync('e2e/test_data_structshare.csv', 'utf8');
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        records = results.data;
        console.log('CSV data:', records);
      },
    });
  });

  test('Dynamic test generation', async ({ page }) => {
    for (const record of records) {
      await test.step(`Test ordering for ${record.productName}`, async () => {
        console.log(`Running test for ${record.productName}`);
        await page.goto(record.productUrl);

        // productName validation
        const productNameOnPage = await page.getByRole('heading', { name: 'Кавоварка рожкова CECOTEC' }).textContent();
        expect(productNameOnPage.trim()).toBe(record.productName);

        // Clicking the Buy and Checkout button
        await page.locator('rz-product-buy-btn').getByLabel('Купити').click();
        await page.locator('data-testid=cart-receipt-submit-order').click();

        // Entering the phone from CSV 
        await page.locator('id=phone').fill(record.userPhone);

        // Filling the address of the store from CSV 
        await page.getByLabel('Вибрати адресу доставки').click();
        await page.getByPlaceholder('Введіть адресу або номер відділення').fill(record.deliveryAddress);
        await page.keyboard.press('Enter');

        // Checking the post-payment method
        const paymentType = await page.getByRole('button', { name: 'Оплата під час отримання товару Змінити' });
        const buttonText = await paymentType.textContent();
        expect(buttonText.trim()).toBe(record.paymentMethod);

        // Filling customers data
        await page.locator('id=recipientSurname').fill(record.userSurname);
        await page.locator('id=recipientName').fill(record.userName);
        await page.locator('id=recipientTel').fill(record.userPhone);

        // Clicking confirmation order button
        await page.getByRole('button', { name: 'Замовлення підтверджую' }).click();

        // Confirmation page validation
        const productNameCfrm = await page.getByText(record.productName);
        await expect(productNameCfrm).toBeVisible();
        const deliveryAddressCfrm = await page.getByText(record.deliveryAddress);
        await expect(deliveryAddressCfrm).toBeVisible();
        await expect(fullNameCfrm).toBeVisible();
        const phoneCfrm = await page.getByText(record.userPhone);
        await expect(phoneCfrm).toBeVisible();
      });
    }
  });
});