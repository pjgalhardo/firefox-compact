const DEFAULTS = {
  enabled: false,
  mode: "both",
  hoverSize: "comfortable",
  hideDelay: "normal",
  centeredUrlbarV2: false,
};
const $ = (id) => document.getElementById(id);

function isCssInstalled() {
  return getComputedStyle($("compact-mode-probe")).getPropertyValue("--compact-mode-css").trim() === "comfort-v4";
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

  $("hover-size").value = state.hoverSize;
  $("hover-size").addEventListener("change", (event) => {
    browser.storage.local.set({ hoverSize: event.target.value });
  });

  $("hide-delay").value = state.hideDelay;
  $("hide-delay").addEventListener("change", (event) => {
    browser.storage.local.set({ hideDelay: event.target.value });
  });

  $("centered-urlbar").checked = state.centeredUrlbarV2;
  $("centered-urlbar").addEventListener("change", (event) => {
    browser.storage.local.set({ centeredUrlbarV2: event.target.checked });
  });

  showShortcut();

  if (!isCssInstalled()) {
    $("setup").hidden = false;
    $("copy-css").addEventListener("click", async (e) => {
      const css = await (await fetch(browser.runtime.getURL("compact.css"))).text();
      copy(e.target, css);
    });
  }
}

init();

