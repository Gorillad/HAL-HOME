McQueen homepage CSS — support handoff
======================================

Source in editor:  McQueen/data/css/styles.css
FTP ZIP path:      data/logicx/css/styles.css
Live server path:  /data/logicx/css/styles.css
Images live path:  /data/logicx/images/

CMS paste (ZIP root — no html/ folder):
  section_1.html → section_1 (full homepage body)
  footer.html    → footer (columns + copyright/ADA)
  index.html     → local proof view only (serve ZIP root; not CMS paste)

Support install:
  1. Optional: serve ZIP root and open index.html to proof the layout
  2. FTP upload data/ (css + images under data/logicx/) to the site root
  3. Paste meta-data-global-css-snippet.html into Meta Data / Global CSS
  4. Verify /data/logicx/css/styles.css and /data/logicx/images/ load (not 404)
  5. Paste section_1.html into CMS region section_1
  6. Paste footer.html into CMS region footer

Asset version starts at v0. Bump in the Showroom editor when replacing
CSS or images, then re-export and re-paste Meta Data + HTML.
