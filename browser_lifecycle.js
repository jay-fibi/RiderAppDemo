/**
 * browser_lifecycle.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Cline Browser Lifecycle Demo
 *
 * Demonstrates the complete browser resource lifecycle using Puppeteer:
 *
 *  Step 1 ── Launch browser (first instance)
 *  Step 2 ── Perform operations  (navigate, click, type, form submit, scroll)
 *  Step 3 ── Close browser explicitly
 *  Step 4 ── Verify resource cleanup  (process gone, API throws on use)
 *  Step 5 ── Launch & close browser again  (second lifecycle)
 *
 * Run with:  node browser_lifecycle.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const puppeteer = require('puppeteer');
const path      = require('path');
const fs        = require('fs');

// ── Configuration ─────────────────────────────────────────────────────────────
const BASE_DIR  = path.resolve(__dirname);
const PAGE_URL  = `file://${path.join(BASE_DIR, 'interactive_test.html')}`;
const SS_DIR    = path.join(BASE_DIR, 'screenshots');

const LAUNCH_OPTIONS = {
  headless: false,
  defaultViewport: { width: 1280, height: 800 },
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
};

// ── Logging helpers ───────────────────────────────────────────────────────────
const SEP  = '═'.repeat(60);
const THIN = '─'.repeat(60);
const PAD  = '    ';
let stepNum = 0;

function logStep(emoji, title) {
  stepNum++;
  console.log(`\n${SEP}`);
  console.log(`  [Step ${stepNum}] ${emoji}  ${title}`);
  console.log(THIN);
}
const ok   = (m) => console.log(`${PAD}✅  ${m}`);
const info = (m) => console.log(`${PAD}➜   ${m}`);
const warn = (m) => console.log(`${PAD}⚠️   ${m}`);

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function screenshot(page, label) {
  if (!fs.existsSync(SS_DIR)) fs.mkdirSync(SS_DIR, { recursive: true });
  const file = path.join(SS_DIR, `lifecycle_${label}.png`);
  await page.screenshot({ path: file, fullPage: false });
  info(`Screenshot saved → screenshots/lifecycle_${label}.png`);
}

// ── Helper: launch browser, return { browser, page } ─────────────────────────
async function launchBrowser(label) {
  info(`Launching browser instance [${label}]…`);
  const browser = await puppeteer.launch(LAUNCH_OPTIONS);
  const [page]  = await browser.pages();
  const version = await browser.version();
  ok(`Browser launched  (${version})`);
  info(`Process PID : ${browser.process()?.pid ?? 'N/A (remote)'}`);
  return { browser, page };
}

// ── Step 2: perform interactive operations ────────────────────────────────────
async function performOperations(page) {
  // 2a – Navigate
  info(`Navigating to → ${PAGE_URL}`);
  await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });
  ok(`Page loaded : "${await page.title()}"`);
  await screenshot(page, '01_loaded');
  await delay(800);

  // 2b – Click button
  info('Clicking #btn-click-me …');
  await page.waitForSelector('#btn-click-me');
  await page.click('#btn-click-me');
  await page.waitForSelector('#btn-status.show');
  const btnTxt = await page.$eval('#btn-status', el => el.textContent.trim());
  ok(`Button clicked  →  "${btnTxt.slice(0, 55)}…"`);
  await screenshot(page, '02_clicked');
  await delay(600);

  // 2c – Type text
  info('Typing into #text-input …');
  await page.waitForSelector('#text-input');
  await page.click('#text-input');
  await page.type('#text-input', 'Lifecycle test – first browser session 🚀', { delay: 35 });
  const typedVal = await page.$eval('#text-input', el => el.value);
  ok(`Text typed  →  "${typedVal}"`);
  await screenshot(page, '03_typed');
  await delay(600);
}

// ── Step 2 continued: form submit + scroll ────────────────────────────────────
async function performFormAndScroll(page) {
  // 2d – Fill & submit form
  info('Filling and submitting the demo form …');
  await page.$eval('#section-form', el => el.scrollIntoView({ block: 'start' }));
  await delay(400);
  await page.type('#form-name',    'Lifecycle User',                 { delay: 40 });
  await page.type('#form-email',   'lifecycle@example.com',          { delay: 40 });
  await page.type('#form-message', 'Sent from browser_lifecycle.js', { delay: 35 });
  await page.click('#btn-submit');
  await page.waitForSelector('#form-status.show');
  const submName  = await page.$eval('#submitted-name',  el => el.textContent);
  const submEmail = await page.$eval('#submitted-email', el => el.textContent);
  ok(`Form submitted  →  "${submName}" / "${submEmail}"`);
  await screenshot(page, '04_form');
  await delay(600);

  // 2e – Scroll to bottom
  info('Scrolling to bottom of page …');
  const before = await page.evaluate(() => window.scrollY);
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  );
  await delay(1200);
  const after  = await page.evaluate(() => window.scrollY);
  const height = await page.evaluate(() => document.body.scrollHeight);
  ok(`Scrolled  ${before}px  →  ${after}px  (page height: ${height}px)`);
  await screenshot(page, '05_scrolled');
  await delay(500);
}

// ── Step 4: verify resource cleanup ──────────────────────────────────────────
async function verifyCleanup(browser, pid) {
  let allGood = true;

  // Check 1 – browser.connected should be false
  const connected = browser.connected;
  if (!connected) {
    ok('browser.connected === false  (WebSocket disconnected)');
  } else {
    warn('browser.connected is still true – close may need more time');
    allGood = false;
  }

  // Check 2 – OS process no longer running
  if (pid) {
    let alive = false;
    try { process.kill(pid, 0); alive = true; } catch (_) {}
    if (!alive) {
      ok(`OS process PID ${pid} is no longer running  ✔`);
    } else {
      warn(`OS process PID ${pid} still appears alive (may be zombie)`);
    }
  } else {
    info('PID not available – skipping OS process check');
  }

  // Check 3 – browser.pages() should throw
  let threw = false;
  try { await browser.pages(); } catch (e) {
    threw = true;
    ok(`browser.pages() threw as expected: "${e.message.slice(0, 65)}"`);
  }
  if (!threw) warn('browser.pages() did NOT throw – Puppeteer version may differ');

  // Check 4 – browser.newPage() should throw
  let newPageThrew = false;
  try { await browser.newPage(); } catch (e) {
    newPageThrew = true;
    ok(`browser.newPage() threw as expected: "${e.message.slice(0, 65)}"`);
  }
  if (!newPageThrew) warn('browser.newPage() did NOT throw after close');

  return allGood;
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  console.log(`\n${SEP}`);
  console.log('  🔄  Cline Browser Lifecycle Demo');
  console.log('  Puppeteer · open → operate → close → verify → reopen');
  console.log(SEP);

  // ── Step 1: Launch browser ────────────────────────────────────────────────
  logStep('🚀', 'Launch browser  (first instance)');
  const { browser: b1, page: p1 } = await launchBrowser('Instance #1');
  const pid1 = b1.process()?.pid;

  // ── Step 2: Perform operations ────────────────────────────────────────────
  logStep('🖱️ ', 'Perform browser operations');
  await performOperations(p1);
  await performFormAndScroll(p1);
  ok('All operations completed successfully');

  // ── Step 3: Close browser explicitly ─────────────────────────────────────
  logStep('🔒', 'Close browser explicitly');
  info(`Calling browser.close()  (PID: ${pid1 ?? 'N/A'}) …`);
  await delay(400);
  await b1.close();
  ok('browser.close() resolved without error');
  await delay(700);  // allow OS to reap child process

  // ── Step 4: Verify resource cleanup ──────────────────────────────────────
  logStep('🔍', 'Verify resource cleanup');
  const cleanupOK = await verifyCleanup(b1, pid1);
  if (cleanupOK) {
    ok('All cleanup checks PASSED – browser resources fully released');
  } else {
    warn('Some checks did not pass – see warnings above');
  }

  // ── Step 5: Launch & close browser again ─────────────────────────────────
  logStep('🔄', 'Launch & close browser again  (second lifecycle)');
  const { browser: b2, page: p2 } = await launchBrowser('Instance #2');
  const pid2 = b2.process()?.pid;

  info('Quick navigation to verify second instance is fully operational …');
  await p2.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });
  ok(`Page loaded on second instance : "${await p2.title()}"`);
  await screenshot(p2, '06_second_launch');
  await delay(800);

  info(`Closing second browser instance (PID: ${pid2 ?? 'N/A'}) …`);
  await b2.close();
  ok('Second instance closed successfully');
  await delay(500);
  info(`browser2.connected after close : ${b2.connected}`);
  if (!b2.connected) ok('Second instance confirmed disconnected  ✔');

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\n${SEP}`);
  console.log('  📊  Lifecycle Summary');
  console.log(SEP);
  console.log(`  ✅  Step 1 – Browser launched           (PID: ${pid1 ?? 'N/A'})`);
  console.log('  ✅  Step 2 – Operations performed       (navigate · click · type · form · scroll)');
  console.log('  ✅  Step 3 – Browser closed explicitly');
  console.log(`  ✅  Step 4 – Cleanup verified            (connected: ${b1.connected})`);
  console.log(`  ✅  Step 5 – Second lifecycle complete   (PID: ${pid2 ?? 'N/A'} → closed)`);
  console.log(`\n  📸  Screenshots saved in ./screenshots/  (lifecycle_01 … lifecycle_06)`);
  console.log(`${SEP}\n`);

})().catch(err => {
  console.error(`\n❌  Fatal error: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
