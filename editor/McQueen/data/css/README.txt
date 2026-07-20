McQueen homepage CSS — support handoff
======================================

Source in editor:  McQueen/data/css/styles.css
FTP ZIP path:      data/logicx/css/styles.css
Live server path:  /data/logicx/css/styles.css
Images live path:  /data/logicx/images/

CMS paste:
  html/section_1.html → section_1 (full homepage body)
  html/footer.html    → footer (columns + copyright/ADA)

Support install:
  1. FTP upload data/ (css + images under data/logicx/) to the site root
  2. Paste meta-data-global-css-snippet.html into Meta Data / Global CSS
  3. Verify /data/logicx/css/styles.css and /data/logicx/images/ load (not 404)
  4. Paste html/section_1.html into CMS region section_1
  5. Paste html/footer.html into CMS region footer

Asset version starts at v0. Bump in the Showroom editor when replacing
CSS or images, then re-export and re-paste Meta Data + HTML.
