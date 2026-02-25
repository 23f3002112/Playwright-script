const { chromium } = require('playwright');

(async () => {
  const seeds = [78,79,80,81,82,83,84,85,86,87];
  let grandTotal = 0;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const seed of seeds) {
    const url = `https://example.com/seed-${seed}`;   // <-- replace with actual URLs
    await page.goto(url, { waitUntil: 'load' });

    const sum = await page.evaluate(() => {
      let total = 0;
      document.querySelectorAll("table td").forEach(td => {
        const num = parseFloat(td.innerText.replace(/[^0-9.-]/g, ""));
        if (!isNaN(num)) total += num;
      });
      return total;
    });

    console.log(`Seed ${seed} sum = ${sum}`);
    grandTotal += sum;
  }

  console.log(`FINAL TOTAL = ${grandTotal}`);
  await browser.close();
})();
