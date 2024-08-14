const { test, expect } = require('@playwright/test');
const fs = require('fs');
const parse = require('csv-parse');

test.describe('Products oredering using csv file for guest users', () => {
  let records = [];

  test.beforeAll(async () => {
      const parser = fs.createReadStream('e2e/test_data/test_data_structshare.csv').pipe(parse({ columns: true }));

      for await (const record of parser) {
          records.push(record);
      }
  });
  
  records.forEach((record) => {
      test(`Test oredering for ${record.productName}`, async ({ page }) => {
        
        await page.goto(record.productUrl);

        // productName validation
        const productNameOnPage = await page.getByRole('heading').textContent();
        expect(productNameOnPage.trim()).toBe(record.productName);

        // Clicking the Buy and Checkout button
        await page.getByText('Купити').click();
        await page.locator('data-testid=cart-receipt-submit-order').click();

        // Entering the phone from CSV 
        await page.locator('id=phone').fill(record.userPhone);

        // Filling the address of the store from CSV 
        await page.getByLabel('Вибрати адресу доставки').click();
        await page.getByPlaceholder('Введіть адресу або номер відділення').fill(record.deliveryAddress);
        await page.keyboard.press('Enter');

        // Checking the post-payment method
        const paymentType =  await page.getByRole('button', { name: 'Оплата під час отримання товару Змінити' });
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
        const delieveryAddressCfrm = await page.getByText(record.deliveryAddress);
        await expect(delieveryAddressCfrm).toBeVisible();
        const fullName = `${record.userName} ${record.userSurname}`;
        const fullNameCfrm = await page.getByText(fullName);
        await expect(fullNameCfrm).toBeVisible();
        const phoneCfrm = await page.getByText(record.userPhone);
        await expect(phoneCfrm).toBeVisible();

      });
  });
});