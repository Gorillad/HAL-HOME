McQueen template default images
=================================

Paths are relative to editor/showroom.html (classic/).

Header
  header/logo-classic.png           Company logo

Hero
  gemma.jpg                         Product image (left, top)
  Gemma_FR33738VBZ_H_Models-min.jpg Lifestyle image (right)

About Us
  lady-showroom.jpg                 Employee photo

Feature Cards
  kitchEnclavePhoto-min.jpg         Left card photo
  exteriorLightingPhoto-min.jpg     Right card photo

Featured Categories (thumbnails)
  featured-categories/*.jpg           One file per category id

Sketch Section
  sketch-section/building.png
  sketch-section/computer.png
  sketch-section/truck.png
  sketch-section/male-female.png

You May Like (carousel slots 1–3)
  you-may-like/Hinkley500750opt.jpg
  you-may-like/modernforms500750opt.jpg
  you-may-like/Eurofase500750opt.jpg

Get Inspired
  get-inspired/Everett_4398BN_Models.jpg   Lifestyle column (left)
  get-inspired/1.png … 8.png               Grid card slots 1–8

Homepage stylesheet (support handoff)
  Source in editor:  classic/data/css/styles.css
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
