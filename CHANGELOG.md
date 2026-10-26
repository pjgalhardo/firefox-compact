# Changelog

This records saved Compact Comfort source snapshots recovered into Git history. Entries describe source changes, not independently verified live browser behavior.

## 0.4.6

- Keep the concealed toolbar visible to keyboard focus while opacity hides it. This lets native Ctrl+L focus the address input before the centred-editor rules activate.
- Preserve the sidebar's hiding behavior and bump the stylesheet setup marker.

## 0.4.5

- Recognize actual URL-bar focus with `:focus-within` as well as Firefox's `focused` attribute, so Ctrl+L can activate the centred editor when the toolbar is hidden.
- Bump the stylesheet setup marker.

## 0.4.4

- Apply the coordinated fixed sidebar overlay to Firefox's newer `#sidebar-main` vertical-tab sidebar as well as the earlier `#sidebar-container` layout.
- Bump the stylesheet setup marker so the extension warns when an older profile stylesheet is still installed.

## 0.4.3

- Keep Both-mode toolbar and sidebar fixed over the page.
- Anchor the sidebar to the toolbar's actual bottom edge so their overlays can meet without overlapping.
- Retain the comfort-v5 stylesheet checks, editor styling, and reveal suppression introduced in 0.4.2.

## 0.4.2

- Revise reveal/hide layout and timing. This intermediate layout is superseded by the fixed overlays in 0.4.3.
- Suppress toolbar/sidebar reveal while the centred native address editor is focused.
- Align the editor and native suggestions and simplify their background, spacing, and shadows.
- Require comfort-v5 in both stylesheet checks.

## 0.4.1 saved follow-ups

- Require an exact stylesheet marker instead of accepting any non-empty value.
- Revise the address editor and suggestion alignment.

## 0.4.1

- Introduce the Compact Comfort name and separate add-on ID.
- Add larger hover targets, configurable hide delays, and coordinated toolbar/sidebar reveal.
- Add an optional centred native address editor.
- Preserve rs4t's original MIT license and attribution.

## Upstream

Based on rs4t/firefox-compact commit `3e0db6643cbda318715b7592add210ec4606d126`, retained as the ancestor of all Compact Comfort import commits.
