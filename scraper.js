const { chromium } = require('playwright');

const BASE_URL = 'https://exam.sanand.workers.dev/tds-2025-01-ga2';
const seeds = [78, 79, 80, 81, 82, 83, 84, 85, 86, 87];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  let grandTotal = 0;

  for (const seed of seeds) {
    const url = `${BASE_URL}?seed=${seed}`;
    console.log(`Scraping: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Debug: show what the page actually contains
      const title = await page.title();
      const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 300));
      console.log(`  Title: ${title}`);
      console.log(`  Content preview: ${bodyText}`);

      const numbers = await page.evaluate(() => {
        const cells = document.querySelectorAll('table td, table th');
        const nums = [];
        cells.forEach(cell => {
          const text = cell.innerText.trim().replace(/,/g, '');
          const num = parseFloat(text);
          if (!isNaN(num)) nums.push(num);
        });
        return nums;
      });

      const seedTotal = numbers.reduce((a, b) => a + b, 0);
      console.log(`  Found ${numbers.length} numbers, subtotal = ${seedTotal}`);
      grandTotal += seedTotal;
    } catch (e) {
      console.log(`  ERROR: ${e.message}`);
    }
  }

  await browser.close();
  console.log(`Total: ${grandTotal}`);
})();
