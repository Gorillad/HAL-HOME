McQueen homepage CSS — support handoff
======================================

Source in editor:  classic/data/css/styles.css
FTP ZIP path:      data/logicx/css/styles.css
Live server path:  /data/logicx/css/styles.css
Images live path:  /data/logicx/images/

Support install (same pattern as Classic / gallery):
  1. FTP upload data/ only (css + images under data/logicx/) to the site root
  2. Paste meta-data-global-css-snippet.html (ZIP root) into
     “Meta Data, JavaScript & CSS (Global)”
  3. Verify /data/logicx/css/styles.css loads (not 404)
  4. Paste html/* (ZIP root) into CMS regions — do not FTP html/

Asset version starts at v0. Bump in the Showroom editor when replacing
CSS or images, then re-export and re-paste Meta Data + HTML.
