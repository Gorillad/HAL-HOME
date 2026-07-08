/**
 * Shared html2canvas capture helpers for Showroom exports.
 * Used by export-pdf.js (developer handoff) and export-client-review.js.
 */
(function () {
    'use strict';

    const CAPTURE_COLOR_PROPS = [
        'color',
        'background-color',
        'border-color',
        'border-top-color',
        'border-right-color',
        'border-bottom-color',
        'border-left-color',
        'outline-color',
    ];

    function copyLoadedImageToClone(originalImg, cloneImg) {
        if (!originalImg || !cloneImg) return;
        if (!originalImg.complete || originalImg.naturalWidth <= 0) return;

        try {
            const canvas = document.createElement('canvas');
            canvas.width = originalImg.naturalWidth;
            canvas.height = originalImg.naturalHeight;
            const context = canvas.getContext('2d');
            if (!context) return;
            context.drawImage(originalImg, 0, 0);
            cloneImg.src = canvas.toDataURL('image/png');
        } catch {
            cloneImg.src = originalImg.currentSrc || originalImg.src;
        }

        cloneImg.hidden = false;
        cloneImg.removeAttribute('hidden');
    }

    function inlineLoadedImagesForClone(sourceEl, clonedEl) {
        if (!sourceEl || !clonedEl) return;

        sourceEl.querySelectorAll('img[id]').forEach((originalImg) => {
            const cloneImg = clonedEl.querySelector(`#${CSS.escape(originalImg.id)}`);
            copyLoadedImageToClone(originalImg, cloneImg);
        });

        const sourceImages = [...sourceEl.querySelectorAll('img')];
        const cloneImages = [...clonedEl.querySelectorAll('img')];
        sourceImages.forEach((originalImg, index) => {
            if (originalImg.id) return;
            copyLoadedImageToClone(originalImg, cloneImages[index]);
        });
    }

    function sanitizeCloneStylesheets(clonedDoc) {
        [...clonedDoc.styleSheets].forEach((sheet) => {
            let rules;
            try {
                rules = sheet.cssRules;
            } catch {
                return;
            }

            [...rules].forEach((rule) => {
                if (!rule.style) return;
                for (let index = rule.style.length - 1; index >= 0; index -= 1) {
                    const prop = rule.style[index];
                    const value = rule.style.getPropertyValue(prop);
                    if (value && value.includes('color-mix(')) {
                        rule.style.removeProperty(prop);
                    }
                }
            });
        });
    }

    function inlineComputedColors(sourceNode, cloneNode) {
        if (!sourceNode || !cloneNode) return;

        const computed = window.getComputedStyle(sourceNode);
        CAPTURE_COLOR_PROPS.forEach((prop) => {
            const value = computed.getPropertyValue(prop);
            if (!value || value.includes('color-mix(')) return;
            if (value === 'rgba(0, 0, 0, 0)' && prop !== 'background-color') return;
            cloneNode.style.setProperty(prop, value);
        });

        const sourceChildren = [...sourceNode.children];
        const cloneChildren = [...cloneNode.children];
        sourceChildren.forEach((sourceChild, index) => {
            inlineComputedColors(sourceChild, cloneChildren[index]);
        });
    }

    function prepareCloneForCapture(clonedDoc, clonedEl, sourceEl) {
        sanitizeCloneStylesheets(clonedDoc);

        if (clonedEl) {
            clonedEl.classList.add('is-pdf-export-capture');
            clonedEl.style.transform = 'none';
            clonedEl.style.boxShadow = 'none';
            inlineComputedColors(sourceEl, clonedEl);
            inlineLoadedImagesForClone(sourceEl, clonedEl);
        }

        const previewFrame = clonedDoc.getElementById('showroomPreview');
        if (previewFrame) {
            previewFrame.classList.add('is-pdf-export-capture');
            previewFrame.style.transform = 'none';
            previewFrame.style.boxShadow = 'none';
        }

        clonedDoc.querySelectorAll('.showroom-you-may-like-track').forEach((track) => {
            track.style.overflow = 'visible';
            track.scrollLeft = 0;
        });
        clonedDoc.querySelectorAll('.showroom-you-may-like-viewport').forEach((viewport) => {
            viewport.style.overflow = 'visible';
        });
        clonedDoc.querySelectorAll('.showroom-you-may-like-nav').forEach((nav) => {
            nav.style.display = 'none';
        });
        clonedDoc.querySelectorAll('img[loading="lazy"]').forEach((img) => {
            img.loading = 'eager';
            img.removeAttribute('loading');
        });
        clonedDoc.querySelectorAll('.showroom-hero-copy, .showroom-feature-card-overlay').forEach((panel) => {
            panel.style.overflow = 'hidden';
        });
        clonedDoc.querySelectorAll(
            '.showroom-spotlight-carousel-nav, .showroom-spotlight-carousel-dots',
        ).forEach((control) => {
            control.style.display = 'none';
        });
        clonedDoc.querySelectorAll('.showroom-main-nav-dropdown').forEach((dropdown) => {
            dropdown.style.display = 'none';
        });
        clonedDoc.querySelectorAll('[hidden]').forEach((node) => {
            node.style.setProperty('display', 'none', 'important');
        });

        hardenCopyrightForCapture(sourceEl, clonedEl);
    }

    function hardenCopyrightForCapture(sourceEl, clonedEl) {
        if (!sourceEl || !clonedEl) return;

        const copyrightSection = clonedEl.querySelector('.showroom-copyright-classic-section');
        if (copyrightSection) {
            copyrightSection.style.setProperty('background-color', '#f0f0f0', 'important');
            copyrightSection.style.setProperty('color', '#2b2b2b', 'important');
        }

        clonedEl.querySelectorAll(
            '.showroom-copyright-classic-text, .showroom-copyright-classic-text #rightCol, .showroom-copyright-classic-text a',
        ).forEach((node) => {
            node.style.setProperty('color', '#2b2b2b', 'important');
            node.style.setProperty('font-size', '13px', 'important');
            node.style.setProperty('line-height', '1.55', 'important');
            node.style.setProperty('opacity', '1', 'important');
        });

        const footerBottom = clonedEl.querySelector('.showroom-footer-bottom');
        if (footerBottom) {
            footerBottom.style.setProperty('background-color', '#e4e7ea', 'important');
        }

        clonedEl.querySelectorAll(
            '.showroom-footer-copyright, .showroom-footer-copyright #rightCol, .showroom-footer-copyright a',
        ).forEach((node) => {
            node.style.setProperty('color', '#3d454c', 'important');
            node.style.setProperty('font-size', '12px', 'important');
            node.style.setProperty('line-height', '1.55', 'important');
            node.style.setProperty('opacity', '1', 'important');
        });

        const spotlightFooterBottom = clonedEl.querySelector('.showroom-spotlight-footer-bottom');
        if (spotlightFooterBottom) {
            spotlightFooterBottom.style.setProperty('background-color', '#1a3347', 'important');
        }

        clonedEl.querySelectorAll(
            '.showroom-spotlight-footer-copyright, .showroom-spotlight-footer-copyright #rightCol, .showroom-spotlight-footer-copyright a',
        ).forEach((node) => {
            node.style.setProperty('color', '#d8e2ea', 'important');
            node.style.setProperty('font-size', '12px', 'important');
            node.style.setProperty('line-height', '1.55', 'important');
            node.style.setProperty('opacity', '1', 'important');
        });
    }

    function prepareImagesForCapture(el) {
        if (!el) return;

        el.querySelectorAll('img').forEach((img) => {
            if (img.loading === 'lazy') {
                img.loading = 'eager';
            }
            img.removeAttribute('loading');

            // Sketch / carousel previews keep imgs hidden until load; hidden lazy imgs never start.
            if (img.hasAttribute('hidden')) {
                img.dataset.captureWasHidden = '1';
                img.hidden = false;
                img.removeAttribute('hidden');
            }

            const src = img.getAttribute('src');
            if (src && !img.complete) {
                img.src = src;
            }
        });
    }

    async function scrollElementIntoCaptureView(el) {
        if (!el?.scrollIntoView) return;

        el.scrollIntoView({ block: 'center', inline: 'nearest' });
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }

    function waitForImage(img, maxWaitMs) {
        if (img.complete) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const finish = () => {
                window.clearTimeout(timerId);
                resolve();
            };
            const timerId = window.setTimeout(finish, maxWaitMs);
            img.addEventListener('load', finish, { once: true });
            img.addEventListener('error', finish, { once: true });
        });
    }

    async function waitForImagesInElement(el, maxWaitMs = 12000) {
        if (!el) return;

        await scrollElementIntoCaptureView(el);
        prepareImagesForCapture(el);

        const images = [...el.querySelectorAll('img[src]')];
        await Promise.all(images.map((img) => waitForImage(img, maxWaitMs)));
    }

    function isCapturable(el) {
        if (!el || el.hidden) return false;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 1 && rect.height > 1;
    }

    async function captureElement(el, options = {}) {
        if (!el) {
            throw new Error('Nothing to capture for layout preview.');
        }
        if (typeof html2canvas !== 'function') {
            throw new Error('html2canvas not loaded.');
        }

        const scale = options.scale || 2;
        const imageTimeout = options.imageTimeout || 15000;
        const timeoutMs = options.timeoutMs || 60000;

        if (document.fonts?.ready) {
            await document.fonts.ready;
        }

        await waitForImagesInElement(el, imageTimeout);
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        const capturePromise = html2canvas(el, {
            scale,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout,
            onclone: (clonedDoc, clonedEl) => prepareCloneForCapture(clonedDoc, clonedEl, el),
        });

        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = window.setTimeout(() => {
                reject(new Error(`Capture timed out after ${Math.round(timeoutMs / 1000)}s.`));
            }, timeoutMs);
        });

        let canvas;
        try {
            canvas = await Promise.race([capturePromise, timeoutPromise]);
        } finally {
            window.clearTimeout(timeoutId);
        }

        if (!canvas.width || !canvas.height) {
            throw new Error('Layout capture failed.');
        }

        return canvas;
    }

    async function captureElementAsDataUrl(el, options = {}) {
        const canvas = await captureElement(el, options);
        return canvas.toDataURL('image/png');
    }

    window.ShowroomCapture = {
        isCapturable,
        captureElement,
        captureElementAsDataUrl,
    };
}());
