const { chromium } = require('playwright');

const seeds = [78, 79, 80, 81, 82, 83, 84, 85, 86, 87];
const BASE_URL = 'https://exam.sanand.workers.dev/tds-2025-01-ga2?q=';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let grandTotal = 0;

  for (const seed of seeds) {
    const url = `${BASE_URL}${seed}`;
    console.log(`Scraping: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle' });

    const numbers = await page.evaluate(() => {
      const cells = document.querySelectorAll('table td, table th');
      const nums = [];
      cells.forEach(cell => {
        const text = cell.innerText.trim();
        const num = parseFloat(text.replace(/,/g, ''));
        if (!isNaN(num)) nums.push(num);
      });
      return nums;
    });

    const seedTotal = numbers.reduce((a, b) => a + b, 0);
    console.log(`Seed ${seed}: found ${numbers.length} numbers, sum = ${seedTotal}`);
    grandTotal += seedTotal;
  }

  console.log(`\nGRAND TOTAL OF ALL NUMBERS: ${grandTotal}`);
  await browser.close();
})();
