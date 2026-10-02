const INSTALL_COMMAND =
  "irm https://raw.githubusercontent.com/rs4t/firefox-compact/main/install.ps1 | iex";

const DEFAULTS = { enabled: false, mode: "both" };
const $ = (id) => document.getElementById(id);

function isCssInstalled() {
  return getComputedStyle($("compact-mode-probe")).getPropertyValue("--compact-mode-css").trim() !== "";
}

async function copy(button, text) {
  await navigator.clipboard.writeText(text);
  const label = button.textContent;
  button.textContent = "Copied";
  setTimeout(() => (button.textContent = label), 1500);
}

async function showShortcut() {
  const commands = await browser.commands.getAll();
  const toggle = commands.find((c) => c.name === "toggle-compact-mode");
  $("shortcut").textContent = toggle?.shortcut || "not set";

  if (typeof browser.commands.openShortcutSettings === "function") {
    $("change-shortcut").hidden = false;
    $("change-shortcut").addEventListener("click", () => browser.commands.openShortcutSettings());
  }
}

async function init() {
  const state = await browser.storage.local.get(DEFAULTS);

  $("enabled").checked = state.enabled;
  $("enabled").addEventListener("change", (e) => {
    browser.storage.local.set({ enabled: e.target.checked });
  });

  for (const radio of document.querySelectorAll('input[name="mode"]')) {
    radio.checked = radio.value === state.mode;
    // Picking what to hide also turns compact mode on.
    radio.addEventListener("change", () => {
      $("enabled").checked = true;
      browser.storage.local.set({ mode: radio.value, enabled: true });
    });
  }

  showShortcut();

  if (!isCssInstalled()) {
    $("setup").hidden = false;
    $("command").textContent = INSTALL_COMMAND;
    $("copy-command").addEventListener("click", (e) => copy(e.target, INSTALL_COMMAND));
    $("copy-css").addEventListener("click", async (e) => {
      const css = await (await fetch(browser.runtime.getURL("compact.css"))).text();
      copy(e.target, css);
    });
  }
}

init();
