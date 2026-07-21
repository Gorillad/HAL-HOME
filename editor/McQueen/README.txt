McQueen template defaults
=========================

Editor source (relative to editor/showroom.html):

  McQueen/data/images/   Default images (live-site filenames)
  McQueen/data/css/      Homepage stylesheet (handoff source)
  McQueen/data/js/       Optional scripts (placeholder)

Images (live-site names at images/ root)
---------------------------------------
Header
  Alveraanlogo_v1.png               Company logo
  header/classic-white.png          Dark-theme logo fallback

Hero
  hero-product.png                  Product image (left, top)
  hero-lg-right.jpg                 Lifestyle image (right)

About Us
  about-us.jpg                      Employee / about photo

Feature Cards (Explore)
  explore-image-left.jpg            Left card photo
  explore-image-right.jpg           Right card photo

Featured Categories (thumbnails)
  featured-categories/*.jpg

Sketch Section
  building.png, computer.png, truck.png, male-female.png

You May Like
  you-may-like/*.jpg

Get Inspired
  get-inspired.jpg
  get-inspired/1.png … 8.png

Support handoff
---------------
  FTP CSS:     data/logicx/css/styles.css  →  /data/logicx/css/styles.css
  FTP images:  data/logicx/images/         →  /data/logicx/images/
  CMS paste:   section_1.html (ZIP root)   →  section_1 (full homepage body)
               footer.html (ZIP root)      →  footer (columns + copyright/ADA)
  Local proof: index.html (ZIP root)       →  serve ZIP root, open before CMS paste
               (no html/ folder — paste + proof files are at ZIP root)

  Support install:
  1. Optional: serve ZIP root and open index.html to proof the layout
  2. FTP upload data/ (css + images under data/logicx/) to the site root
  3. Paste meta-data-global-css-snippet.html into Meta Data / Global CSS
  4. Verify /data/logicx/css/styles.css and /data/logicx/images/* load (not 404)
  5. Paste section_1.html into CMS region section_1
  6. Paste footer.html into CMS region footer

Uploaded images are stored as data URLs in localStorage and replace these defaults.
