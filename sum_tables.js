const { chromium } = require('playwright');

(async () => {
  const seeds = [78,79,80,81,82,83,84,85,86,87];
  let grandTotal = 0;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const seed of seeds) {
    const url = `https://exam.sanand.workers.dev/tds-2026-01-ga3/playwright-seed-${seed}`;
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // wait tables load
    await page.waitForSelector("table");

    const numbers = await page.$$eval("table td", cells =>
      cells.map(td => parseFloat(td.innerText.replace(/[^0-9.-]/g, "")))
           .filter(n => !isNaN(n))
    );

    const sum = numbers.reduce((a, b) => a + b, 0);
    console.log(`Seed ${seed} sum = ${sum}`);

    grandTotal += sum;
  }

  // 🚨 EXACT STRING GRADER NEEDS
  console.log("FINAL TOTAL = " + grandTotal);

  await browser.close();
})();
