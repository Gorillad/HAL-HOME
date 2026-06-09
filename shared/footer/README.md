# LogicXO shared footer

Portable footer for every page on the site (homepage, support, etc.). Copy this **entire folder** into a new repo or site.

## Files

| File | Purpose |
|------|---------|
| `footer.html` | Footer markup — paste before `</body>` |
| `footer.css` | Self-contained styles + brand tokens |
| `footer.js` | Year, newsletter validation, back-to-top |

## Install on a new page

1. **Fonts** (in `<head>`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">
```

2. **CSS** (in `<head>`):

```html
<link href="shared/footer/footer.css" rel="stylesheet">
```

3. **HTML** — paste contents of `footer.html` before `</body>`.

4. **JS** (before `</body>`):

```html
<script src="shared/footer/footer.js" defer></script>
<script defer>
  document.addEventListener('DOMContentLoaded', () => Footer.load());
</script>
```

## Customize per page

- Edit **Quick Links** and **Resources** in `footer.html` only.
- Keep brand block, contact, newsletter, and legal rows the same across pages.
- Point **Support Knowledge Base** to your support site URL.

## Source of truth

Canonical copy lives in the [HALXO support repo](https://github.com/Gorillad/HALXO):

- `shared/footer/` (this folder)
- Support site also embeds the same footer in its homepage

When you change the footer design, update `shared/footer/` first, then sync to other repos.
