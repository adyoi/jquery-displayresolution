# jQuery Display Resolution

Floating widget that displays **viewport dimensions, scroll position, screen resolution and device pixel ratio** — with one-click **copy to clipboard** for fast CSS debugging.

[![CI](https://github.com/adyoi/jquery-displayresolution/actions/workflows/ci.yml/badge.svg)](https://github.com/adyoi/jquery-displayresolution/actions)
[![npm version](https://img.shields.io/npm/v/jquery-displayresolution)](https://www.npmjs.com/package/jquery-displayresolution)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Live demo:** https://adyoi.github.io/jquery-displayresolution/

## Features

- Viewport width / height + scroll position, updated in real time (rAF-throttled)
- Optional screen resolution (`screen: true`) and device pixel ratio (`dpr: true`)
- Click or press **Enter** on the widget to copy CSS values to clipboard (modern Clipboard API with legacy fallback)
- 11 positions: corners, edges, center and axis-centered variants
- Fully styleable: background, color, opacity, radius, font
- jQuery plugin (UMD) **and** dependency-free vanilla fallback when jQuery is absent
- Chainable API with `destroy`, `update`, `show`, `hide` methods
- Keyboard accessible (`role="button"`, focusable, Enter/Space to copy)

## Install

**npm**

```bash
npm install jquery-displayresolution
```

**CDN (jsDelivr)**

```html
<script src="https://cdn.jsdelivr.net/npm/jquery-displayresolution@2.1.0/jquery.displayresolution.min.js"></script>
```

**GitHub Pages (this repo)**

```html
<script src="https://cdn.jsdelivr.net/gh/adyoi/jquery-displayresolution@master/jquery.displayresolution.min.js"></script>
```

jQuery 3.x is required for the jQuery build. If jQuery is not loaded, the file automatically falls back to a small vanilla implementation exposed as `window.displayresolution(element, options)`.

## Quick Start

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="jquery.displayresolution.min.js"></script>

<div id="resolution"></div>

<script>
    $('#resolution').displayresolution({
        position: 'top-right',
        screen: true,
        dpr: true
    });
</script>
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `sep` | `" \| "` | Separator between values |
| `font` | `System, -apple-system, ...` | CSS `font-family` |
| `size` | `"14px"` | CSS `font-size` |
| `background` | `"#000000"` | Widget background (hex/rgb color) |
| `color` | `"#fff"` | Text color |
| `opacity` | `1` | Widget opacity (0–1) |
| `width` | `300` | Widget width in px (also accepts CSS strings like `"50%"`) |
| `height` | `"auto"` | Widget height (`"auto"` or px value) |
| `padding` | `12` | Inner padding in px |
| `margin` | `12` | Outer margin in px |
| `borderRadius` | `8` | Corner radius in px (also accepts CSS strings) |
| `position` | `"top-right"` | `top-right`, `top-left`, `bottom-right`, `bottom-left`, `top-center`, `bottom-center`, `center`, `top`, `right`, `bottom`, `left` |
| `top` / `right` / `bottom` / `left` | `20` | Offset in px for the matching edge |
| `zIndex` | `999999` | Widget `z-index` |
| `screen` | `false` | Show physical screen resolution (`Screen: 1920 x 1080`) |
| `dpr` | `false` | Show `devicePixelRatio` (`DPR: 1.5`) |
| `copyFormat` | `"css"` | Copied text format: `"css"` (`width: 1280px;`) or `"text"` (human readable) |
| `copyFeedback` | `"Copied!"` | Temporary text shown after copying |
| `feedbackTimeout` | `1500` | Feedback duration in ms |
| `labels` | `{ scroll: 'Scroll Top', width: 'Width', height: 'Height', screen: 'Screen', dpr: 'DPR' }` | Custom labels (i18n friendly) |
| `onCopy` | `null` | Callback invoked with the copied text |

## Methods

```javascript
$('#resolution').displayresolution('update');   // re-render values immediately
$('#resolution').displayresolution('show');     // show widget
$('#resolution').displayresolution('hide');     // hide widget
$('#resolution').displayresolution('destroy');  // remove widget + all event listeners
```

Calling the plugin again on the same element automatically destroys the previous instance — no listener stacking.

## Events & accessibility

- Scroll/resize updates are throttled with `requestAnimationFrame`.
- The widget is focusable (`tabindex="0"`, `role="button"`); press **Enter** or **Space** to copy.
- A `displayresolution-copied` class is applied to the widget during copy feedback for custom styling.

## Build

```bash
npm install
npm test        # jsdom smoke tests
npm run build   # regenerate jquery.displayresolution.min.js (+ source map)
```

The demo page lives in `docs/` and is published to GitHub Pages from that folder (`docs/.nojekyll` disables Jekyll processing).

## Browser support

Chrome 80+, Firefox 75+, Safari 14+, Edge 80+, Opera 67+. The vanilla fallback and Clipboard API degrade gracefully to `document.execCommand('copy')` on older engines.

## License

MIT License — Copyright (c) 2026 Adi Apriyanto
