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
        const productNameOnPage = await page.getByRole('heading');
        console.log(`Expected: ${record.productName}, Actual: ${productNameOnPage}`);
        expect(productNameOnPage.trim()).toBe(record.productName);

        // Clicking the Buy and Checkout button
        await page.locator('rz-product-buy-btn >> text=Купити').click();
        await page.locator('data-testid=cart-receipt-submit-order').click();



      });
  });
});