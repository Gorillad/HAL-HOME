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
3. Paste `header.html` into the custom header field.
4. Paste `footer.html` into the custom footer field.
5. Paste `scripts-snippet.html` into footer scripts (or end of page).

## Local preview

`preview.html` uses relative `data/` paths. Open via your dev server:

`http://localhost:4242/hal/preview.html`

## Customize

| Change | Edit |
|--------|------|
| Nav links | `header.html` |
| Footer copy / links | `footer.html` |
| Styles | `data/css/header.css`, `data/css/footer.css` |
| Mobile menu | `data/js/header.js` |

After edits, re-upload the changed files to XOLogic and bump the `?v` query string.
