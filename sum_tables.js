const { chromium } = require('playwright');

(async () => {
  const seeds = [78,79,80,81,82,83,84,85,86,87];
  let grandTotal = 0;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const seed of seeds) {
    const url = `https://exam.sanand.workers.dev/tds-2026-01-ga3/playwright-seed-${seed}`;
    await page.goto(url);

    const sum = await page.$$eval("table td", tds =>
      tds.reduce((acc, td) => {
        const num = parseFloat(td.innerText.replace(/[^0-9.-]/g, ""));
        return isNaN(num) ? acc : acc + num;
      }, 0)
    );

    console.log(`Seed ${seed} sum = ${sum}`);
    grandTotal += sum;
  }

  console.log("FINAL TOTAL = " + grandTotal);

  await browser.close();
})();
