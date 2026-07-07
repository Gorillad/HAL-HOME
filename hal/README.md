# LogicX catalog embed (`hal/`)

Copy-paste header and footer for the **XOLogic** product catalog, matching the LogicX marketing site.

Asset paths follow the XOLogic server convention:

```html
<link rel="stylesheet" href="/data/css/header.css?v1" type="text/css">
<script src="/data/js/header.js?v1" type="text/javascript"></script>
```

Bump `?v1` when you update a file (e.g. `?v2`) so browsers pick up changes.

## Folder layout (upload to XOLogic)

```
hal/
  data/
    css/
      header.css    →  /data/css/header.css
      footer.css    →  /data/css/footer.css
    js/
      header.js     →  /data/js/header.js
      footer.js     →  /data/js/footer.js
    images/
      logicxo-gold.png   →  /data/images/logicxo-gold.png
      favicon/           →  /data/images/favicon/
  header.html       →  paste into XOLogic custom header
  footer.html       →  paste into XOLogic custom footer
  head-snippet.html →  paste into global <head> / CSS
  scripts-snippet.html → paste before </body>
  preview.html      →  local preview only
```

## Paste into XOLogic

1. Upload `hal/data/css/`, `hal/data/js/`, and `hal/data/images/` to the matching `/data/` paths on your XOLogic server.
2. Paste `head-snippet.html` into global head / CSS settings.
3. Paste `header.html` (or your full Trend Catalog header + mega menu HTML) into the custom header field.
4. Paste `footer.html` into the custom footer field.
5. Paste `scripts-snippet.html` into footer scripts (or end of page).

**Mobile menu:** The hamburger requires `header.js?v2` (not the old `.site-nav-toggle` script). Header HTML must use `class="trend-catalog-header"` and `.trend-catalog-menu-toggle`. On tap, JS adds `is-open` on the header and `catalog-header-open` on `<body>` so the mega menu (`.sb-nav`) appears.

**Trending promos:** Upload `trend-catalog.js` and include it in `scripts-snippet.html` for live trend columns and promo boxes.

## Hamburger not working? Check these on catalog.logicxo.com

1. **Footer scripts** — Paste the full `scripts-snippet.html` (includes an **inline** click handler). Without any JS, the icon shows but does nothing.

2. **Header class** — In DevTools, confirm the header element includes **`trend-catalog-header`**:
   ```html
   <header class="site-nav site-nav--dark trend-catalog-header">
   ```
   If only `site-nav--dark` is present, the script exits and the hamburger will not toggle.

3. **Button class** — Confirm the button is **`trend-catalog-menu-toggle`**, not `site-nav-toggle`.

4. **CSS uploaded** — Upload `header.css?v3` and `mega-menu.css?v3`. Mobile open states need:
   - `.trend-catalog-header.is-open .trend-catalog-actions`
   - `body.catalog-header-open .sb-nav`

5. **Script 404** — In DevTools → Network, filter JS. Open `/data/js/header.js?v3`. A 404 means the file was not uploaded to the XOLogic `/data/js/` folder.

6. **Console test** — On mobile width, run in the browser console:
   ```js
   document.querySelector('.trend-catalog-header')?.classList.toggle('is-open');
   document.body.classList.toggle('catalog-header-open');
   document.querySelector('.sb-nav')?.classList.toggle('is-open');
   ```
   If the menu appears, HTML/CSS are fine and only the script snippet is missing.

7. **Remove old scripts** — Delete any legacy snippet that references `.site-nav-toggle` or `site-nav-panel`.

## Local preview

`preview.html` uses relative `data/` paths. Open via your dev server:

`http://localhost:4242/hal/preview.html`

## Customize

| Change | Edit |
|--------|------|
| Nav links | `header.html` |
| Footer copy / links | `footer.html` |
| Styles | `data/css/header.css`, `data/css/footer.css` |
| Mobile menu | `data/js/header.js` (Trend Catalog hamburger + `.sb-nav` toggle) |
| Live trends | `data/js/trend-catalog.js` |

After edits, re-upload the changed files to XOLogic and bump the `?v` query string.
