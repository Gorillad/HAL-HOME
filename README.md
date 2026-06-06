# HAL-HOME — LogicXO Marketing Homepage

Static marketing homepage for LogicXO / XOLogic. Shares the same footer as the [HALXO](https://github.com/Gorillad/HALXO) support knowledge base.

## Run locally

```bash
cd HAL-HOME
python -m http.server 8080
```

Open http://localhost:8080/index.html

## Project structure

```
HAL-HOME/
├── index.html           # Homepage
├── css/style.css        # Homepage-only styles
├── js/main.js           # Boots shared footer
├── images/              # Logo & favicons
└── shared/footer/       # Copied from HALXO — keep in sync
```

## Footer sync

When the footer design changes in HALXO, copy `shared/footer/` from:

https://github.com/Gorillad/HALXO/tree/main/shared/footer

Then update Quick Links in `index.html` / `shared/footer/footer.html` for this site only.

## Support site link

Update support URLs when you deploy HALXO (currently points to the GitHub repo):

- Nav: `https://github.com/Gorillad/HALXO`
- Footer: same

Replace with your live support URL (e.g. GitHub Pages) when ready.
