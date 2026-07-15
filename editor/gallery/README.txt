Classic template default images + homepage CSS
===============================================

Paths are relative to editor/showroom.html (gallery/).

Header
  xologic-logo.png          Company logo (left, in line with main nav)

Hero (500 px tall · 1479 px wide)
  quorum1.jpg               Large lifestyle image (left)
  chandelier4.jpg           Lifestyle image (top right)
  pendants3.jpg             Lifestyle image (bottom right)

Catalog Highlights (4 tiles)
  bathroom1.jpg             Bathroom Fixtures
  exterior1.jpg             Exterior
  fans1.jpg                 Fans
  hall-lantern3.jpg         Foyer Hall Lanterns

Homepage stylesheet (developer handoff)
  data/css/styles.css       Production Classic homepage CSS

  Handoff ZIP path:  data/css/styles.css
  Hosting upload:    /data/css/styles.css
  Path convention:   data/css/[file-name].css → /data/css/[file-name].css

  DevOps: paste Global Meta links from the handoff file
  spec/devops-global-css-snippet.html into the hosting dashboard section
  “Meta Data, JavaScript & CSS (Global)”. Keep enhanced-search links;
  wire styles.css and bump ?v when replacing the file.

Uploaded images are stored as data URLs in localStorage and replace these defaults.
The editor applies bundled defaults automatically on load (including empty saved drafts).
