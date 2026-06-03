// app.js - Main JavaScript file

// ─── Constants ────────────────────────────────────────────────────────────────
const COUNTER_MIN = -10;
const COUNTER_MAX =  10;

// ─── Greeting Function ───────────────────────────────────────────────────────
/**
 * Returns a personalised greeting that includes the current formatted date.
 * @param {string} name - The user's name.
 * @returns {string}
 */
function greetUser(name) {
  return `Hello, ${name}! Welcome to the app — today is ${formatDate()}.`;
}

// ─── Simple Counter ───────────────────────────────────────────────────────────
let counter = 0;

/**
 * Increment the counter by 1, clamped to COUNTER_MAX.
 * @returns {number} The updated counter value.
 */
function increment() {
  if (counter < COUNTER_MAX) {
    counter++;
  } else {
    console.warn(`Counter is already at its maximum value (${COUNTER_MAX}).`);
  }
  console.log(`Counter: ${counter}`);
  return counter;
}

/**
 * Decrement the counter by 1, clamped to COUNTER_MIN.
 * @returns {number} The updated counter value.
 */
function decrement() {
  if (counter > COUNTER_MIN) {
    counter--;
  } else {
    console.warn(`Counter is already at its minimum value (${COUNTER_MIN}).`);
  }
  console.log(`Counter: ${counter}`);
  return counter;
}

/**
 * Reset the counter back to 0.
 * @returns {number} Always returns 0.
 */
function resetCounter() {
  counter = 0;
  console.log("Counter reset to 0.");
  return counter;
}

// ─── Utility: Format Date ─────────────────────────────────────────────────────
/**
 * Format a Date object into a human-readable string.
 * @param {Date} [date=new Date()] - The date to format (defaults to today).
 * @returns {string}
 */
function formatDate(date = new Date()) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

// ─── Dark Mode Toggle ────────────────────────────────────────────────────────
/**
 * Toggle dark mode on the <html> element and persist the preference in
 * localStorage so it survives page reloads.
 */
function toggleDarkMode() {
  const root = document.documentElement;
  const isDark = root.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
  console.log(`Dark mode ${isDark ? "enabled" : "disabled"}.`);
}

/**
 * Restore dark-mode preference from localStorage on page load.
 */
function restoreDarkModePreference() {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.documentElement.classList.add("dark-mode");
  }
}

// ─── DOM Ready Handler ────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  restoreDarkModePreference();

  console.log("DOM fully loaded and parsed.");
  console.log(greetUser("Jay"));

  // Wire up counter buttons if they exist in the page
  const btnIncrement   = document.getElementById("btn-increment");
  const btnDecrement   = document.getElementById("btn-decrement");
  const btnReset       = document.getElementById("btn-reset");
  const counterDisplay = document.getElementById("counter-display");

  /**
   * Sync the #counter-display element with the current counter value and
   * apply a colour class that reflects whether the value is positive,
   * negative, or zero.
   */
  function updateDisplay() {
    if (!counterDisplay) return;
    counterDisplay.textContent = counter;
    counterDisplay.classList.remove("counter-positive", "counter-negative");
    if (counter > 0) {
      counterDisplay.classList.add("counter-positive");
    } else if (counter < 0) {
      counterDisplay.classList.add("counter-negative");
    }
  }

  if (btnIncrement) btnIncrement.addEventListener("click", () => { increment(); updateDisplay(); });
  if (btnDecrement) btnDecrement.addEventListener("click", () => { decrement(); updateDisplay(); });
  if (btnReset)     btnReset.addEventListener("click",     () => { resetCounter(); updateDisplay(); });

  // Wire up a dark-mode toggle button if one exists
  const btnDarkMode = document.getElementById("btn-dark-mode");
  if (btnDarkMode) btnDarkMode.addEventListener("click", toggleDarkMode);
});
