McQueen template defaults
=========================

Editor source (relative to editor/showroom.html):

  McQueen/data/images/   Default images (live-site filenames)
  McQueen/data/css/      Homepage stylesheet (handoff source)
  McQueen/data/js/       Optional scripts (placeholder)
  McQueen/html/          Live CMS reference (section_1 shape)

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
  CMS paste:   html/section_1.html         →  section_1 (full homepage body)
               html/footer.html            →  footer (columns + copyright/ADA)

  Support install:
  1. FTP upload data/ (css + images under data/logicx/) to the site root
  2. Paste meta-data-global-css-snippet.html into Meta Data / Global CSS
  3. Verify /data/logicx/css/styles.css and /data/logicx/images/* load (not 404)
  4. Paste html/section_1.html into CMS region section_1
  5. Paste html/footer.html into CMS region footer

Uploaded images are stored as data URLs in localStorage and replace these defaults.
