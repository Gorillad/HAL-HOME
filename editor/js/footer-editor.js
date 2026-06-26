/** Designer Editor — Footer. Config over section-editor-base.js. */
(function () {
  'use strict';
  if (typeof window.createSectionEditor !== 'function') return;

  window.createSectionEditor({
    template: window.__designerSlug || 'woolf',
    namespace: '_footer',
    sectionKey: 'footer',
    frameId: 'woolFooterFrame',
    fieldSelector: '[data-footer-field]',
    fieldDatasetKey: 'footerField',
    defaults: {
      tagline: 'Your source for industrial supplies, tooling, safety, and MRO products — shipped nationwide.',
      socialLabel: 'Follow Us',
      facebookUrl: 'https://www.facebook.com/',
      linkedinUrl: 'https://www.linkedin.com/',
      youtubeUrl: 'https://www.youtube.com/',
      xUrl: 'https://x.com/',
      phone: '1-800-555-1234',
      email: 'sales@ibcmaster.com',
      hours: 'Mon–Fri, 7:00 AM – 6:00 PM CT',
      address: '1200 Industrial Parkway, Houston, TX 77001',
      copy: '© 2026 IBC Master. All rights reserved.',
    },
    fieldMap: {
      tagline:     { id: 'footer-tagline',        prop: 'text' },
      socialLabel: { id: 'footer-social-label',   prop: 'text' },
      facebookUrl: { id: 'footer-social-facebook', prop: 'href' },
      linkedinUrl: { id: 'footer-social-linkedin', prop: 'href' },
      youtubeUrl:  { id: 'footer-social-youtube',  prop: 'href' },
      xUrl:        { id: 'footer-social-x',        prop: 'href' },
      phone:       { id: 'footer-phone',  prop: 'text' },
      email:       { id: 'footer-email',  prop: 'text' },
      hours:       { id: 'footer-hours',  prop: 'text' },
      address:     { id: 'footer-address', prop: 'text' },
      copy:        { id: 'footer-copy',   prop: 'text' },
    },
  });
})();
