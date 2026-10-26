// Invisible characters put in each window's title preface. compact.css reads
// them from the titlepreface attribute Firefox sets on the window's root.
const MARKERS = {
  tabs: "⁣",
  urlbar: "⁤",
  both: "⁣⁤",
};

const DEFAULTS = {
  enabled: false,
  mode: "both",
  hoverSize: "comfortable",
  hideDelay: "normal",
  // New key deliberately leaves the earlier experimental editor off after
  // updating. Firefox 158's suggestion popover did not track it reliably.
  centeredUrlbarV2: false,
};
const HOVER_MARKERS = { smaller: "\u200B", comfortable: "", larger: "\u200C" };
const DELAY_MARKERS = { quick: "\u200E", normal: "", slow: "\u200F" };

async function getState() {
  return browser.storage.local.get(DEFAULTS);
}

function prefaceFor(state) {
  return state.enabled
    ? (MARKERS[state.mode] ?? MARKERS.both) +
      (HOVER_MARKERS[state.hoverSize] ?? "") +
      (DELAY_MARKERS[state.hideDelay] ?? "") +
      (state.centeredUrlbarV2 ? "\u2061" : "")
    : "";
}

async function applyToWindow(windowId, preface) {
  try {
    await browser.windows.update(windowId, { titlePreface: preface });
  } catch {
    // Private window the extension isn't allowed in, or a window that closed.
  }
}

async function applyToAllWindows() {
  const preface = prefaceFor(await getState());
  const windows = await browser.windows.getAll({ windowTypes: ["normal"] });
  await Promise.all(windows.map((w) => applyToWindow(w.id, preface)));
}

// The background page is a moz-extension:// document, so userContent.css
// applies to it. compact.css sets a custom property on #compact-mode-probe
// there, which tells us the setup step was done.
function isCssInstalled() {
  const probe = document.createElement("div");
  probe.id = "compact-mode-probe";
  document.documentElement.append(probe);
  const value = getComputedStyle(probe).getPropertyValue("--compact-mode-css").trim();
  probe.remove();
  return value === "comfort-v8";
}

function updateSetupBadge() {
  const missing = !isCssInstalled();
  browser.action.setBadgeText({ text: missing ? "!" : "" });
  if (missing) {
    browser.action.setBadgeBackgroundColor({ color: "#d70022" });
    browser.action.setTitle({ title: "Compact Comfort — updated stylesheet not loaded" });
  } else {
    browser.action.setTitle({ title: "Compact Comfort" });
  }
}

browser.windows.onCreated.addListener(async (win) => {
  if (win.type === "normal") {
    await applyToWindow(win.id, prefaceFor(await getState()));
  }
});

browser.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-compact-mode") {
    const state = await getState();
    await browser.storage.local.set({ enabled: !state.enabled });
  }
});

browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && ("enabled" in changes || "mode" in changes || "hoverSize" in changes || "hideDelay" in changes || "centeredUrlbarV2" in changes)) {
    applyToAllWindows();
  }
});

// Every Firefox start re-checks the setup, so switching to a theme that
// replaced the CSS files brings the warning back.
function init() {
  updateSetupBadge();
  applyToAllWindows();
}

browser.runtime.onStartup.addListener(init);
browser.runtime.onInstalled.addListener(init);

