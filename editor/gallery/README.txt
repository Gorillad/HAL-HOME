Classic template default images + homepage CSS
===============================================

Paths are relative to editor/showroom.html (gallery/).

Header
  xologic-logo.png          Company logo (left, in line with main nav)

Hero (500 px tall · 1440 px wide)
  quorum1.jpg               Large lifestyle image (left)
  chandelier4.jpg           Lifestyle image (top right)
  pendants3.jpg             Lifestyle image (bottom right)

Catalog Highlights (4 tiles)
  bathroom1.jpg             Bathroom Fixtures
  exterior1.jpg             Exterior
  fans1.jpg                 Fans
  hall-lantern3.jpg         Foyer Hall Lanterns

Homepage stylesheet (support handoff)
  Source in editor:  gallery/data/css/styles.css
  FTP ZIP path:      data/logicx/css/styles.css
  Live server path:  /data/logicx/css/styles.css
  Images live path:  /data/logicx/images/

  Support install:
  1. FTP upload data/ only (css + images under data/logicx/) to the site root
  2. Paste meta-data-global-css-snippet.html (ZIP root) into
     “Meta Data, JavaScript & CSS (Global)”
  3. Verify /data/logicx/css/styles.css loads (not 404)
  4. Paste html/* (ZIP root) into CMS regions — do not FTP html/

Uploaded images are stored as data URLs in localStorage and replace these defaults.
The editor applies bundled defaults automatically on load (including empty saved drafts).
