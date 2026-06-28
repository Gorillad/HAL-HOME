/** Designer Editor — Section Four (CTA + Quick Order). Config over base. */
(function () {
  'use strict';
  if (typeof window.createSectionEditor !== 'function') return;

  window.createSectionEditor({
    template: window.__designerSlug || 'woolf',
    namespace: '_s4',
    sectionKey: 'sectionFour',
    frameId: 'woolSectionFourFrame',
    fieldSelector: '[data-s4-field]',
    fieldDatasetKey: 's4Field',
    defaults: {
      ctaEyebrow: 'Talk to our team',
      ctaTitle: 'Need help sourcing the right product?',
      ctaText: 'Our team is ready to assist with quotes, bulk orders, and hard-to-find parts for your operation.',
      ctaBtn1Label: 'Request a Quote', ctaBtn1Url: '/contact',
      ctaBtn2Label: 'Open an Account', ctaBtn2Url: '/sign-up',
      ctaShowPhone: true,
      ctaBgColor: '#004fa3',
      qoTitle: 'Quick Order',
      qoSubtitle: 'Know your part number? Enter it below to search and order fast.',
      qoSubmit: 'Search & Order',
    },
    fieldMap: {
      ctaEyebrow:  { id: 's4-cta-eyebrow', prop: 'text' },
      ctaTitle:    { id: 's4-cta-title',   prop: 'text' },
      ctaText:     { id: 's4-cta-text',    prop: 'text' },
      ctaBtn1Label:{ id: 's4-cta-btn1',    prop: 'text' },
      ctaBtn1Url:  { id: 's4-cta-btn1',    prop: 'href' },
      ctaBtn2Label:{ id: 's4-cta-btn2',    prop: 'text' },
      ctaBtn2Url:  { id: 's4-cta-btn2',    prop: 'href' },
      qoTitle:     { id: 's4-qo-title',    prop: 'text' },
      qoSubtitle:  { id: 's4-qo-subtitle', prop: 'text' },
      qoSubmit:    { id: 's4-qo-submit',   prop: 'text' },
    },
  });
})();
