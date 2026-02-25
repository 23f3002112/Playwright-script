const { chromium } = require('playwright');

// UPDATE THIS BASE URL to match your actual seed URLs
const URLS = [
  'https://exam.sanand.workers.dev/tds-2025-01-ga2?seed=78',
  'https://exam.sanand.workers.dev/tds-2025-01-ga2?seed=79',
  'https://exam.sanand.workers.dev/tds-2025-01-ga2?seed=80',
  'https://exam.sanand.workers.dev/tds-2025-01-ga2?seed=81',
  'https://exam.sanand.workers.dev/tds-2025-01-ga2?seed=82',
  'https://exam.sanand.workers.dev/tds-2025-01-ga2?seed=83',
  'https://exam.sanand.workers.dev/tds-2025-01-ga2?seed=84',
  'https://exam.sanand.workers.dev/tds-2025-01-ga2?seed=85',
  'https://exam.sanand.workers.dev/tds-2025-01-ga2?seed=86',
  'https://exam.sanand.workers.dev/tds-2025-01-ga2?seed=87',
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let grandTotal = 0;

  for (const url of URLS) {
    console.log(`Scraping: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

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
      console.log(`  ERROR scraping ${url}: ${e.message}`);
    }
  }

  await browser.close();

  // This line is what the grader searches for:
  console.log(`Total: ${grandTotal}`);
})();
