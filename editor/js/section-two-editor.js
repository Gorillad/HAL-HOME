/** Designer Editor — Section Two (About). Config over section-editor-base.js. */
(function () {
  'use strict';
  if (typeof window.createSectionEditor !== 'function') return;

  window.createSectionEditor({
    template: window.__designerSlug || 'woolf',
    namespace: '_s2',
    sectionKey: 'sectionTwo',
    frameId: 'woolSectionTwoFrame',
    fieldSelector: '[data-s2-field]',
    fieldDatasetKey: 's2Field',
    defaults: {
      eyebrow: 'About Us',
      title: 'Supplying industry with the parts and products that keep operations running',
      text1: 'IBC Master is a full-line industrial distributor serving manufacturing, construction, maintenance, and MRO teams across North America. From cutting tools and safety equipment to hydraulics and electrical supplies, we help customers find the right product — fast.',
      text2: 'Our team combines deep product knowledge with responsive service, whether you are stocking a plant floor, outfitting a job site, or sourcing a hard-to-find part number. We partner with leading manufacturers so you get the brands you trust, backed by people who understand your business.',
      btn1Label: 'Learn More About IBC', btn1Url: '/about',
      btn2Label: 'Contact Our Team', btn2Url: '/contact',
      stat0Value: '25+', stat0Label: 'Years in business',
      stat1Value: '500K+', stat1Label: 'Products in catalog',
      stat2Value: 'Nationwide', stat2Label: 'Shipping & support',
    },
    fieldMap: {
      eyebrow:    { id: 's2-eyebrow', prop: 'text' },
      title:      { id: 's2-title',   prop: 'text' },
      text1:      { id: 's2-text1',   prop: 'text' },
      text2:      { id: 's2-text2',   prop: 'text' },
      btn1Label:  { id: 's2-btn1',    prop: 'text' },
      btn1Url:    { id: 's2-btn1',    prop: 'href' },
      btn2Label:  { id: 's2-btn2',    prop: 'text' },
      btn2Url:    { id: 's2-btn2',    prop: 'href' },
      stat0Value: { id: 's2-stat0-value', prop: 'text' },
      stat0Label: { id: 's2-stat0-label', prop: 'text' },
      stat1Value: { id: 's2-stat1-value', prop: 'text' },
      stat1Label: { id: 's2-stat1-label', prop: 'text' },
      stat2Value: { id: 's2-stat2-value', prop: 'text' },
      stat2Label: { id: 's2-stat2-label', prop: 'text' },
    },
  });
})();
