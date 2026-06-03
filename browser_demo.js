/**
 * browser_demo.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Cline Browser Automation Demo
 *
 * Steps:
 *  1. Launch a Chromium browser instance via Puppeteer
 *  2. Navigate to the local index.html file
 *  3. Verify page loading (title + h1 content)
 *  4. Navigate to a second local page (page2.html)
 *  5. Verify the second page loaded
 *  6. Close the browser
 * ─────────────────────────────────────────────────────────────────────────────
 */

const puppeteer = require('puppeteer');
const path      = require('path');

// ── Helpers ──────────────────────────────────────────────────────────────────

const log = (step, msg) =>
  console.log(`\n  [Step ${step}] ${msg}`);

const CHECK  = '✅';
const CROSS  = '❌';
const ARROW  = '➜';
const ROCKET = '🚀';
const CLOSE  = '🔒';

// ── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  const baseDir  = path.resolve(__dirname);
  const page1URL = `file://${path.join(baseDir, 'index.html')}`;
  const page2URL = `file://${path.join(baseDir, 'page2.html')}`;

  console.log('\n══════════════════════════════════════════════════════');
  console.log('  Cline Browser Automation Demo');
  console.log('══════════════════════════════════════════════════════');

  // ── Step 1 – Launch browser ───────────────────────────────────────────────
  log(1, `${ROCKET} Launching Chromium browser instance…`);

  const browser = await puppeteer.launch({
    headless: false,          // Show the browser window so you can watch!
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const pages   = await browser.pages();
  const page    = pages[0] || await browser.newPage();

  console.log(`       ${CHECK} Browser launched successfully.`);
  console.log(`       ${ARROW}  Browser version : ${await browser.version()}`);

  // ── Step 2 – Navigate to index.html ──────────────────────────────────────
  log(2, `${ARROW} Navigating to local page 1…`);
  console.log(`       URL : ${page1URL}`);

  await page.goto(page1URL, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));   // brief pause – watch the page

  console.log(`       ${CHECK} Navigation complete.`);

  // ── Step 3 – Verify page 1 loaded ────────────────────────────────────────
  log(3, '🔍 Verifying page 1 content…');

  const title1 = await page.title();
  const h1Text = await page.$eval('h1', el => el.textContent.trim())
                        .catch(() => '<h1 not found>');

  console.log(`       ${ARROW}  Page title : "${title1}"`);
  console.log(`       ${ARROW}  <h1> text  : "${h1Text}"`);

  const page1OK = title1.includes('Cline') && h1Text.length > 0;
  console.log(`       ${page1OK ? CHECK : CROSS} Verification ${page1OK ? 'PASSED' : 'FAILED'}`);

  if (!page1OK) {
    console.error('\n  Verification failed – aborting.');
    await browser.close();
    process.exit(1);
  }

  // ── Step 4 – Navigate to page2.html ──────────────────────────────────────
  log(4, `${ARROW} Navigating to local page 2…`);
  console.log(`       URL : ${page2URL}`);

  await page.goto(page2URL, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));   // brief pause – watch the page

  const title2   = await page.title();
  const badgeText = await page.$eval('.badge', el => el.textContent.trim())
                          .catch(() => '<badge not found>');

  console.log(`       ${CHECK} Navigation complete.`);
  console.log(`       ${ARROW}  Page title  : "${title2}"`);
  console.log(`       ${ARROW}  Badge text  : "${badgeText}"`);

  const page2OK = title2.includes('Page 2');
  console.log(`       ${page2OK ? CHECK : CROSS} Verification ${page2OK ? 'PASSED' : 'FAILED'}`);

  // ── Step 5 – Close browser ────────────────────────────────────────────────
  log(5, `${CLOSE} Closing browser…`);
  await new Promise(r => setTimeout(r, 800));    // tiny pause before close
  await browser.close();
  console.log(`       ${CHECK} Browser closed successfully.\n`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('══════════════════════════════════════════════════════');
  console.log('  Demo Summary');
  console.log('══════════════════════════════════════════════════════');
  console.log(`  ${CHECK} Step 1 – Browser launched`);
  console.log(`  ${CHECK} Step 2 – Navigated to index.html`);
  console.log(`  ${page1OK ? CHECK : CROSS} Step 3 – Page 1 verified  (title: "${title1}")`);
  console.log(`  ${CHECK} Step 4 – Navigated to page2.html  (title: "${title2}")`);
  console.log(`  ${CHECK} Step 5 – Browser closed`);
  console.log('══════════════════════════════════════════════════════\n');

})();
