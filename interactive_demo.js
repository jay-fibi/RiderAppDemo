/**
 * interactive_demo.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Cline Browser Automation – Interactive Demo
 *
 * Performs 5 automated steps on interactive_test.html:
 *   1. Launch browser & navigate to the interactive test page
 *   2. Click a button element
 *   3. Input text into a form field
 *   4. Submit a form (with name + email)
 *   5. Scroll down the page
 *
 * Screenshots are saved after every key step inside ./screenshots/
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const puppeteer = require('puppeteer');
const path      = require('path');
const fs        = require('fs');

const BASE_DIR = path.resolve(__dirname);
const PAGE_URL = `file://${path.join(BASE_DIR, 'interactive_test.html')}`;
const SS_DIR   = path.join(BASE_DIR, 'screenshots');

const PAD   = '    ';
const CHECK = '✅';
const CROSS = '❌';
const ARROW = '➜';
const CAM   = '📸';

let stepNum = 0;
function logStep(title) {
  stepNum++;
  console.log(`\n${'═'.repeat(56)}`);
  console.log(`  [Step ${stepNum}] ${title}`);
  console.log(`${'─'.repeat(56)}`);
}
function logOK(msg)   { console.log(`${PAD}${CHECK} ${msg}`); }
function logInfo(msg) { console.log(`${PAD}${ARROW}  ${msg}`); }

async function screenshot(page, name) {
  const file = path.join(SS_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`${PAD}${CAM}  Saved → screenshots/${name}.png`);
}

const delay = (ms) => new Promise(r => setTimeout(r, ms));


// ── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  if (!fs.existsSync(SS_DIR)) fs.mkdirSync(SS_DIR, { recursive: true });

  console.log('\n' + '═'.repeat(56));
  console.log('  🤖 Cline Browser Automation – Interactive Demo');
  console.log('  Target : interactive_test.html');
  console.log('═'.repeat(56));

  // ── Step 1 – Launch browser & navigate ──────────────────────
  logStep('🚀 Launch browser & navigate to the interactive test page');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const [page] = await browser.pages();
  logInfo(`Browser version : ${await browser.version()}`);

  await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });
  logOK('Page loaded successfully');
  logInfo(`Page title : "${await page.title()}"`);
  const pageTitle = await page.title();

  await screenshot(page, '01_page_loaded');
  await delay(1000);

  // ── Step 2 – Click a button ──────────────────────────────────
  logStep('🖱️  Click a button element');
  await page.waitForSelector('#btn-click-me');
  await page.click('#btn-click-me');
  logOK('Clicked "Click Me!" button');
  await page.waitForSelector('#btn-status.show');
  const btnText = await page.$eval('#btn-status', el => el.textContent.trim());
  logOK(`Status confirmed : "${btnText.slice(0, 50)}…"`);
  await screenshot(page, '02_button_clicked');
  await delay(800);

  // ── Step 3 – Input text ──────────────────────────────────────
  logStep('✍️  Input text into a form field');
  const sampleText = 'Hello from Puppeteer automation! 🤖';
  await page.waitForSelector('#text-input');
  await page.click('#text-input');
  await page.type('#text-input', sampleText, { delay: 40 });
  logOK(`Typed : "${sampleText}"`);
  const inputVal    = await page.$eval('#text-input', el => el.value);
  const charCounter = await page.$eval('#char-count',  el => el.textContent);
  logInfo(`DOM value : "${inputVal}"`);
  logInfo(`Char counter : ${charCounter}`);
  await screenshot(page, '03_text_input');
  await delay(800);

  // ── Step 4 – Submit a form ───────────────────────────────────
  logStep('📋 Submit a form');
  await page.$eval('#section-form', el => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  await delay(600);

  await page.click('#form-name');
  await page.type('#form-name', 'Jay Gohil', { delay: 50 });
  logOK('Typed Full Name : "Jay Gohil"');

  await page.click('#form-email');
  await page.type('#form-email', 'jay@example.com', { delay: 50 });
  logOK('Typed Email : "jay@example.com"');

  await page.click('#form-message');
  await page.type('#form-message', 'Automated form submission via Puppeteer.', { delay: 40 });
  logOK('Typed Message in textarea');

  await screenshot(page, '04a_form_filled');
  await delay(500);

  await page.click('#btn-submit');
  logOK('Clicked "🚀 Submit Form" button');

  await page.waitForSelector('#form-status.show');
  const submittedName  = await page.$eval('#submitted-name',  el => el.textContent);
  const submittedEmail = await page.$eval('#submitted-email', el => el.textContent);
  logOK('Form success banner appeared');
  logInfo(`Submitted Name  : "${submittedName}"`);
  logInfo(`Submitted Email : "${submittedEmail}"`);
  await screenshot(page, '04b_form_submitted');
  await delay(800);

  // ── Step 5 – Scroll down the page ───────────────────────────
  logStep('⬇️  Scroll down the page');
  const scrollBefore = await page.evaluate(() => window.scrollY);
  logInfo(`Scroll position before : ${scrollBefore}px`);

  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
  await delay(1400);

  const scrollAfter = await page.evaluate(() => window.scrollY);
  const pageHeight  = await page.evaluate(() => document.body.scrollHeight);
  logOK(`Scrolled from ${scrollBefore}px → ${scrollAfter}px`);
  logInfo(`Total page height : ${pageHeight}px`);

  await page.$eval('#bottom-anchor', el => el.scrollIntoView({ block: 'center' }));
  await delay(500);
  const scrollPct = await page.$eval('#scroll-indicator', el => el.textContent);
  logInfo(`On-page indicator : "${scrollPct}"`);
  await screenshot(page, '05_scrolled_to_bottom');
  await delay(800);

  // ── Close ─────────────────────────────────────────────────────
  logStep('🔒 Closing browser');
  await delay(500);
  await browser.close();
  logOK('Browser closed successfully');

  // ── Summary ───────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(56));
  console.log('  📊 Demo Summary');
  console.log('═'.repeat(56));
  console.log(`  ✅ Step 1 – Browser launched  ("${pageTitle}")`);
  console.log(`  ✅ Step 2 – Button clicked     (status badge confirmed)`);
  console.log(`  ✅ Step 3 – Text entered       ("${sampleText.slice(0,30)}…")`);
  console.log(`  ✅ Step 4 – Form submitted     (${submittedName} / ${submittedEmail})`);
  console.log(`  ✅ Step 5 – Page scrolled      (${scrollBefore}px → ${scrollAfter}px)`);
  console.log(`\n  📸  Screenshots in ./screenshots/`);
  console.log(`      01_page_loaded.png  |  02_button_clicked.png`);
  console.log(`      03_text_input.png   |  04a_form_filled.png`);
  console.log(`      04b_form_submitted.png  |  05_scrolled_to_bottom.png`);
  console.log('═'.repeat(56) + '\n');

})().catch(err => {
  console.error(`\n❌ Fatal error: ${err.message}`);
  process.exit(1);
});

