/** Designer Editor — Section Three (Catalog Library). Config over base. */
(function () {
  'use strict';
  if (typeof window.createSectionEditor !== 'function') return;

  window.createSectionEditor({
    template: window.__designerSlug || 'woolf',
    namespace: '_s3',
    sectionKey: 'sectionThree',
    frameId: 'woolSectionThreeFrame',
    fieldSelector: '[data-s3-field]',
    fieldDatasetKey: 's3Field',
    defaults: {
      title: 'Vendor Catalog Library',
      subtitle: 'Browse and download digital catalogs from the manufacturers we represent',
      allLabel: 'View all catalogs', allUrl: '/catalogs',
      card0Vendor: 'Bessey', card0Title: 'Induction Bearing Heaters User Manual', card0Url: '/data/catalogs/bessey-induction-heaters.pdf',
      card1Vendor: 'Emuge Franken', card1Title: 'High Precision FPC Milling/Drilling Chucks', card1Url: '/data/catalogs/emuge-franken-fpc-chucks.pdf',
      card2Vendor: 'Bahco', card2Title: 'Bandsaw Blades Catalog', card2Url: '/data/catalogs/bahco-bandsaw-blades.pdf',
      card3Vendor: 'OSG', card3Title: 'The A Brand — Tooling Master Class', card3Url: '/data/catalogs/osg-a-brand.pdf',
    },
    fieldMap: {
      title:    { id: 's3-title',    prop: 'text' },
      subtitle: { id: 's3-subtitle', prop: 'text' },
      allLabel: { id: 's3-all',      prop: 'text' },
      allUrl:   { id: 's3-all',      prop: 'href' },
      card0Vendor: { id: 's3-card0-vendor', prop: 'text' },
      card0Title:  { id: 's3-card0-title',  prop: 'text' },
      card0Url:    { id: 's3-card0-link',   prop: 'href' },
      card1Vendor: { id: 's3-card1-vendor', prop: 'text' },
      card1Title:  { id: 's3-card1-title',  prop: 'text' },
      card1Url:    { id: 's3-card1-link',   prop: 'href' },
      card2Vendor: { id: 's3-card2-vendor', prop: 'text' },
      card2Title:  { id: 's3-card2-title',  prop: 'text' },
      card2Url:    { id: 's3-card2-link',   prop: 'href' },
      card3Vendor: { id: 's3-card3-vendor', prop: 'text' },
      card3Title:  { id: 's3-card3-title',  prop: 'text' },
      card3Url:    { id: 's3-card3-link',   prop: 'href' },
    },
  });
})();
