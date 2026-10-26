# Compact Comfort

An experimental, unsigned fork of [Firefox Compact by rs4t](https://github.com/rs4t/firefox-compact), with larger hover targets, delayed hiding, coordinated toolbar/sidebar reveal, and an optional centred native address editor.

Current version: **0.4.9**. The original MIT license and copyright are preserved in [LICENSE](LICENSE), the upstream history remains intact, and the original documentation is in [README-upstream.md](README-upstream.md). This is an independent fork, not the upstream author's official release.

## Behavior

- Hide the tab bar, URL bar, or both. In Both mode with vertical tabs, hovering either edge is intended to reveal the toolbar and sidebar together as continuous overlays without resizing the page.
- In URL-bar-only mode with vertical tabs, hover the top edge to reveal the toolbar beside the visible sidebar. Page loading and ordinary mouse focus do not reveal it automatically.
- Choose 8, 16, or 24 px hover areas and quick, normal, or slow hide delays. The default hover area is 16 px with a 650 ms hide delay.
- Optionally enable **Centred address editor** for Ctrl+L (Command+L on macOS). This uses Firefox's native field and suggestions. Both-mode toolbar and sidebar remain visible and usable throughout editing. It is disabled by default and remains experimental.
- Toggle compact mode with Ctrl+Alt+C on Windows/Linux or Control+Option+C on macOS. Firefox's extension shortcut settings can change this.

Larger invisible hover areas cover more of the page edge. Choose Smaller if they interfere with page controls. Compact mode removes the outer page border and rounded corners. Address focus uses the centred editor whether it came from a mouse click or Ctrl+L; keeping both surfaces visible avoids an abrupt toolbar disappearance. Escape retains Firefox's native sequence of closing suggestions before leaving the field.

## Install

Firefox chrome customization and the temporary add-on are separate installation steps. Download or clone this repository first. Disable the original Compact Mode add-on before enabling this fork so their window-title markers do not compete.

### 1. Install the stylesheet

1. Open `about:support` in the Firefox profile you want to customize and open its **Profile Folder**.
2. Back up existing `compact.css`, `userChrome.css`, and `userContent.css`, if present.
3. Create a `chrome` folder inside that profile if needed. Copy [extension/compact.css](extension/compact.css) into it.
4. Add `@import "compact.css";` before other rules in both `userChrome.css` and `userContent.css` inside `chrome` (create the files if absent). An existing `@charset` declaration may remain before the import. Preserve your other CSS.
5. In `about:config`, set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true`.
6. Fully exit Firefox and reopen it to load the stylesheet.

On Windows, the inherited [install.ps1](install.ps1) is an alternative installer. Review it before running it. It downloads the stylesheet from this fork, adds missing imports, and sets the customization preference through `user.js`. Back up an existing `compact.css` yourself before using it.

### 2. Load the temporary add-on

1. Open `about:debugging#/runtime/this-firefox`.
2. Choose **Load Temporary Add-on** and select `extension/manifest.json` in your downloaded clone.
3. Open Compact Comfort's popup, enable it, and select a mode. Enable the centred editor separately if desired.

Temporary add-ons disappear after Firefox exits. Reload the add-on after every restart. This project has not been submitted for Mozilla signing; it is not a permanently installable signed release.

Both stylesheet checks require the **comfort-v11** marker bundled with 0.4.9. Updating the extension without replacing older profile CSS can leave the setup warning visible.

## Permissions and privacy

The manifest requests only `storage`. The extension stores settings locally and updates window-title prefixes to communicate with the stylesheet. It does not request website access, browsing history, cookies, or native messaging. The popup reads its packaged stylesheet when you use **Copy compact.css**. The separate Windows installer downloads CSS from this repository.

## Compatibility and verification

The manifest declares Firefox 140 or newer. Development used Firefox 158 browser styles; that minimum version is not a claim that all versions have been visually tested. The CSS supports both the older `#sidebar-container` and newer `#sidebar-main` vertical-tab layouts. It uses unsupported browser-chrome customization and CSS anchoring, so Firefox updates or themes may require changes. Fullscreen and Customize modes are excluded.

Isolated Firefox 158.0.1 checks cover the real browser interface's address-submission/loading transition, theme gradients, page frame, and visibility of both surfaces during editing. Fixture checks also cover sidebar placement and stable page dimensions. Theme combinations and centred suggestion alignment remain experimental.

## History

See [CHANGELOG.md](CHANGELOG.md). Saved source snapshots were imported as separate commits after the original upstream commit. These are recovery/import commits made now, not reconstructed original development timestamps. No local profile configuration, installation reports, or unrelated review files are part of this repository.

## Rollback

Disable/remove Compact Comfort, restore your backed-up CSS, and fully restart Firefox. Restore the previous stylesheet-customization preference if you no longer use any custom CSS. If you used `install.ps1`, review its addition to `user.js` as well.

## License and attribution

MIT. Original copyright: **Copyright (c) 2026 rs4t**. See [LICENSE](LICENSE). Compact Comfort retains the original attribution in its stylesheet and popup.
