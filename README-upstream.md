# Firefox Compact

Zen-style compact mode for Firefox. Hide the tab bar, the URL bar, or both, and bring them back by hovering the edge of the window. Toggle it with **Ctrl+Alt+C**.

Works with any theme: it only hides and reveals the toolbars, it never changes their colors.

## How it works

Firefox doesn't let extensions hide its own toolbars, but a small CSS file can. So this comes in two parts:

- **The extension** remembers whether compact mode is on and which mode you picked, and gives you the shortcut and the popup.
- **`compact.css`** does the hiding. The extension tells it what to do by adding invisible characters to the window title, which the CSS can read.

## Install

### 1. Set up the CSS (once)

**Windows:** paste this into PowerShell and press Enter:

```powershell
irm https://raw.githubusercontent.com/rs4t/firefox-compact/main/install.ps1 | iex
```

It finds your Firefox profile, saves `compact.css` there, and adds one `@import` line to the top of your `userChrome.css` and `userContent.css`. Any theme files you already have are kept and backed up. You can read exactly what it does in [install.ps1](install.ps1).

<details>
<summary><b>Mac, Linux, or manual setup</b></summary>

1. In `about:config`, set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true`.
2. Open `about:support` and click **Open Folder** next to *Profile Folder*. Make a `chrome` folder there if it's missing.
3. Save [`compact.css`](extension/compact.css) into that `chrome` folder.
4. Add this as the very first line of both `userChrome.css` and `userContent.css` in the same folder (create them if they don't exist):

   ```css
   @import "compact.css";
   ```

</details>

Then fully close Firefox and open it again.

### 2. Install the extension (temporary, until signed)

1. Download this repo (**Code → Download ZIP**) and unzip it.
2. In Firefox, open `about:debugging#/runtime/this-firefox` and click **Load Temporary Add-on…**.
3. Select `extension/manifest.json`.

Temporary add-ons unload when Firefox restarts, so you'll need to load it again each time until it's signed for permanent install.

If the CSS setup is missing, the extension icon shows a red **!** and the popup shows the setup command. It checks every time Firefox starts, so if you switch to a theme that replaces your CSS files, it will tell you.

## Use

- **Ctrl+Alt+C** turns compact mode on or off. You can change the shortcut in `about:addons` → ⚙ → **Manage Extension Shortcuts**.
- Click the extension icon to pick what to hide: **Tab bar**, **URL bar**, or **Both**.
- **Hover the top of the window** to bring the toolbars back. With *Both*, they float over the page so it doesn't jump.
- **With vertical tabs**, hiding the tabs hides the tab sidebar. Hover the edge of the window it sits on to slide it back.
- The toolbars also stay visible while you type in the URL bar (Ctrl+L, Ctrl+T), while a menu is open, and while you drag a tab.

## Good to know

- On Windows, minimize, maximize and close live in the tab bar, so when it's hidden they appear when you hover the top.
- Other extensions that also add a window title prefix (like Sidebery's window titles) will overwrite compact mode's marker, so the two can't be used together.
- The setup check reads the import line in `userContent.css`. If a theme replaces only `userChrome.css`, the extension can't tell.
- Firefox's fullscreen and the Customize screen ignore compact mode.

Made to pair with [Latin Accent Plus](https://github.com/rs4t/latin-accent-plus), but it works with any theme.

## License

MIT
