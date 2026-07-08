/**
 * Mario 1-Up pixel Easter egg — block bounce, mushroom, "1UP" text.
 * Exposes window.triggerOneUp(anchorBtn, onComplete, options?)
 * options.placement: 'above' (default) | 'left' | 'right'
 */
(function () {
    'use strict';

    var T = null;
    var BK = '#000000';
    var G = '#00AA00';
    var DG = '#005500';
    var LG = '#55EE55';
    var CR = '#FFCC99';
    var RED = '#CC0000';
    var SKIN = '#FFB347';
    var BLUE = '#2255CC';
    var BROW = '#7A4000';
    var GOLD = '#F7BE00';
    var YL = '#FFFF00';

    var MUSH = [
        [T, T, BK, BK, BK, BK, BK, BK, BK, BK, BK, BK, T, T, T, T],
        [T, BK, G, G, G, G, G, G, G, G, G, G, BK, T, T, T],
        [BK, G, G, DG, DG, G, G, G, DG, DG, G, G, G, BK, T, T],
        [BK, G, DG, DG, DG, G, G, DG, DG, DG, G, G, G, BK, T, T],
        [BK, G, DG, DG, G, G, G, G, DG, DG, G, G, G, BK, T, T],
        [BK, G, G, G, G, LG, G, G, G, G, G, G, G, BK, T, T],
        [BK, LG, LG, G, G, G, G, G, G, G, LG, G, G, BK, T, T],
        [T, BK, G, G, G, G, G, G, G, G, G, G, BK, T, T, T],
        [T, BK, BK, G, G, G, G, G, G, G, G, BK, BK, T, T, T],
        [T, T, BK, CR, CR, BK, BK, BK, BK, CR, CR, BK, T, T, T, T],
        [T, BK, CR, CR, CR, CR, BK, BK, CR, CR, CR, CR, BK, T, T, T],
        [T, BK, CR, CR, CR, CR, CR, CR, CR, CR, CR, CR, BK, T, T, T],
        [BK, CR, CR, CR, CR, CR, CR, CR, CR, CR, CR, CR, CR, BK, T, T],
        [BK, CR, CR, CR, CR, CR, CR, CR, CR, CR, CR, CR, CR, BK, T, T],
        [T, BK, BK, CR, CR, CR, CR, CR, CR, CR, CR, BK, BK, T, T, T],
        [T, T, T, BK, BK, BK, BK, BK, BK, BK, BK, T, T, T, T, T],
    ];

    var MARIO_STAND = [
        [T, T, T, RED, RED, RED, RED, RED, T, T, T, T, T, T, T, T],
        [T, T, RED, RED, RED, RED, RED, RED, RED, RED, RED, T, T, T, T, T],
        [T, T, BROW, BROW, BROW, SKIN, SKIN, BROW, SKIN, T, T, T, T, T, T, T],
        [T, BROW, SKIN, BROW, SKIN, SKIN, SKIN, BROW, SKIN, SKIN, SKIN, T, T, T, T, T],
        [T, BROW, SKIN, BROW, BROW, SKIN, SKIN, SKIN, BROW, SKIN, SKIN, SKIN, T, T, T, T],
        [T, BROW, BROW, SKIN, SKIN, SKIN, SKIN, BROW, BROW, BROW, BROW, T, T, T, T, T],
        [T, T, T, SKIN, SKIN, SKIN, SKIN, SKIN, SKIN, SKIN, T, T, T, T, T, T],
        [T, T, BLUE, RED, RED, BLUE, BLUE, RED, RED, BLUE, T, T, T, T, T, T],
        [T, BLUE, BLUE, RED, RED, BLUE, BLUE, RED, RED, BLUE, BLUE, T, T, T, T, T],
        [T, BLUE, BLUE, RED, RED, BLUE, BLUE, RED, RED, BLUE, BLUE, T, T, T, T, T],
        [T, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, T, T, T, T, T],
        [T, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, T, T, T, T, T],
        [T, T, BROW, BROW, T, BLUE, BLUE, T, BROW, BROW, T, T, T, T, T, T],
        [T, BROW, BROW, BROW, T, BLUE, BLUE, T, BROW, BROW, BROW, T, T, T, T, T],
    ];

    var MARIO_JUMP = [
        [T, T, T, RED, RED, RED, RED, RED, T, T, T, T, T, T, T, T],
        [T, T, RED, RED, RED, RED, RED, RED, RED, RED, RED, T, T, T, T, T],
        [T, T, BROW, BROW, BROW, SKIN, SKIN, BROW, SKIN, T, T, T, T, T, T, T],
        [T, BROW, SKIN, BROW, SKIN, SKIN, SKIN, BROW, SKIN, SKIN, SKIN, T, T, T, T, T],
        [T, BROW, SKIN, BROW, BROW, SKIN, SKIN, SKIN, BROW, SKIN, SKIN, SKIN, T, T, T, T],
        [T, BROW, BROW, SKIN, SKIN, SKIN, SKIN, BROW, BROW, BROW, BROW, T, T, T, T, T],
        [T, T, BLUE, SKIN, SKIN, SKIN, SKIN, SKIN, SKIN, SKIN, BLUE, T, T, T, T, T],
        [T, BLUE, BLUE, BLUE, RED, RED, BLUE, BLUE, BLUE, BLUE, BLUE, T, T, T, T, T],
        [BLUE, BLUE, BLUE, RED, RED, RED, BLUE, BLUE, RED, BLUE, BLUE, BLUE, T, T, T, T],
        [SKIN, SKIN, BLUE, RED, RED, RED, BLUE, RED, RED, RED, BLUE, SKIN, SKIN, T, T, T],
        [SKIN, SKIN, SKIN, RED, RED, RED, RED, RED, RED, SKIN, SKIN, SKIN, T, T, T, T],
        [T, T, SKIN, SKIN, RED, RED, RED, RED, SKIN, SKIN, T, T, T, T, T, T],
        [T, T, T, BROW, BROW, T, T, BROW, BROW, T, T, T, T, T, T, T],
        [T, T, BROW, BROW, T, T, T, T, BROW, BROW, T, T, T, T, T, T],
    ];

    var BLOCK_NORMAL = [
        ['#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038'],
        ['#C88038', '#F0D090', '#F0D090', '#F0D090', '#F0D090', '#F0D090', '#F0D090', '#C88038'],
        ['#C88038', '#F0D090', GOLD, GOLD, '?', GOLD, GOLD, '#C88038'],
        ['#C88038', '#F0D090', GOLD, '#F5E88A', '#F5E88A', GOLD, GOLD, '#C88038'],
        ['#C88038', '#F0D090', GOLD, '#F5E88A', '#F5E88A', GOLD, GOLD, '#C88038'],
        ['#C88038', '#F0D090', GOLD, GOLD, GOLD, GOLD, GOLD, '#C88038'],
        ['#C88038', '#F0D090', '#F0D090', '#F0D090', '#F0D090', '#F0D090', '#F0D090', '#C88038'],
        ['#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038'],
    ];

    var BLOCK_HIT = [
        ['#8B5E00', '#8B5E00', '#8B5E00', '#8B5E00', '#8B5E00', '#8B5E00', '#8B5E00', '#8B5E00'],
        ['#8B5E00', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#8B5E00'],
        ['#8B5E00', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#8B5E00'],
        ['#8B5E00', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#8B5E00'],
        ['#8B5E00', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#8B5E00'],
        ['#8B5E00', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#8B5E00'],
        ['#8B5E00', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#C88038', '#8B5E00'],
        ['#8B5E00', '#8B5E00', '#8B5E00', '#8B5E00', '#8B5E00', '#8B5E00', '#8B5E00', '#8B5E00'],
    ];

    var ONEUP = [
        [BK, T, T, T, BK, BK, BK, T, T, BK, BK, T, T, T, T, T, T, T, BK, BK, BK, T, BK, BK, T],
        [BK, BK, T, T, BK, T, BK, T, BK, T, T, BK, T, T, T, T, T, BK, T, T, T, T, BK, T, BK],
        [T, BK, T, T, BK, BK, BK, T, BK, BK, BK, BK, T, T, T, T, T, BK, BK, BK, T, T, BK, BK, T],
        [T, BK, T, T, BK, T, BK, T, BK, T, T, BK, T, T, T, T, T, BK, T, T, T, T, BK, T, BK],
        [BK, BK, BK, T, BK, BK, BK, T, BK, T, T, BK, T, T, T, T, T, BK, BK, BK, T, T, BK, T, BK],
    ];

    var WRAP_W = 104;
    var WRAP_H = 220;

    var wrapper = document.createElement('div');
    wrapper.id = 'mario-1up-egg';
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.style.cssText = [
        'position:fixed;z-index:99999;pointer-events:none;',
        'width:' + WRAP_W + 'px;height:' + WRAP_H + 'px;overflow:visible;display:none;',
    ].join('');

    var textCvs = document.createElement('canvas');
    textCvs.width = 50;
    textCvs.height = 10;
    textCvs.style.cssText = 'image-rendering:pixelated;width:100px;height:20px;position:absolute;left:50%;transform:translateX(-50%);bottom:158px;opacity:0;pointer-events:none;';

    var mushCvs = document.createElement('canvas');
    mushCvs.width = 16;
    mushCvs.height = 16;
    mushCvs.style.cssText = 'image-rendering:pixelated;width:48px;height:48px;position:absolute;left:50%;transform:translateX(-50%);bottom:84px;opacity:0;pointer-events:none;';

    var blockCvs = document.createElement('canvas');
    blockCvs.width = 40;
    blockCvs.height = 40;
    blockCvs.style.cssText = 'image-rendering:pixelated;width:40px;height:40px;position:absolute;left:50%;transform:translateX(-50%);bottom:36px;pointer-events:none;';

    var marioCvs = document.createElement('canvas');
    marioCvs.width = 32;
    marioCvs.height = 28;
    marioCvs.style.cssText = 'image-rendering:pixelated;width:64px;height:56px;position:absolute;left:50%;transform:translateX(-50%);bottom:-56px;pointer-events:none;';

    wrapper.appendChild(textCvs);
    wrapper.appendChild(mushCvs);
    wrapper.appendChild(blockCvs);
    wrapper.appendChild(marioCvs);
    document.body.appendChild(wrapper);

    function drawPixelGrid(cvs, grid, pw) {
        var ctx = cvs.getContext('2d');
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        grid.forEach(function (row, y) {
            row.forEach(function (col, x) {
                if (!col) return;
                if (col === '?') {
                    ctx.fillStyle = '#8B5E00';
                    ctx.font = 'bold ' + Math.max(pw, 4) + 'px monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('?', x * pw + pw / 2, y * pw + pw / 2);
                } else {
                    ctx.fillStyle = col;
                    ctx.fillRect(x * pw, y * pw, pw, pw);
                }
            });
        });
    }

    function drawBlock(hit) {
        drawPixelGrid(blockCvs, hit ? BLOCK_HIT : BLOCK_NORMAL, 5);
    }

    function drawMario(jump) {
        drawPixelGrid(marioCvs, jump ? MARIO_JUMP : MARIO_STAND, 2);
    }

    function drawOneUp() {
        var ctx = textCvs.getContext('2d');
        ctx.clearRect(0, 0, textCvs.width, textCvs.height);
        ONEUP.forEach(function (row, y) {
            row.forEach(function (col, x) {
                if (col) {
                    ctx.fillStyle = YL;
                    ctx.fillRect(x * 2, y * 2, 2, 2);
                }
            });
        });
    }

    drawBlock(false);
    drawMario(false);
    drawOneUp();
    drawPixelGrid(mushCvs, MUSH, 1);

    function positionAbove(btn) {
        var rect = btn.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var left = Math.max(4, Math.min(window.innerWidth - WRAP_W - 4, cx - WRAP_W / 2));
        var top;

        if (rect.top >= WRAP_H + 8) {
            top = rect.top - WRAP_H;
        } else {
            top = rect.bottom + 8;
        }

        wrapper.style.left = Math.round(left) + 'px';
        wrapper.style.top = Math.round(top) + 'px';
        wrapper.style.right = 'auto';
        wrapper.style.bottom = 'auto';
    }

    function positionLeft() {
        var top = Math.round(window.innerHeight * 0.38 - WRAP_H / 2);
        wrapper.style.left = '32px';
        wrapper.style.top = Math.max(16, top) + 'px';
        wrapper.style.right = 'auto';
        wrapper.style.bottom = 'auto';
    }

    function positionRight() {
        var top = Math.round(window.innerHeight * 0.38 - WRAP_H / 2);
        wrapper.style.left = 'auto';
        wrapper.style.right = '32px';
        wrapper.style.top = Math.max(16, top) + 'px';
        wrapper.style.bottom = 'auto';
    }

    var animRunning = false;

    window.triggerOneUp = function triggerOneUp(anchorBtn, onComplete, options) {
        if (animRunning) {
            if (onComplete) setTimeout(onComplete, 400);
            return;
        }

        var placement = (options && options.placement) || 'above';
        if (placement === 'left') {
            positionLeft();
        } else if (placement === 'right') {
            positionRight();
        } else if (anchorBtn) {
            positionAbove(anchorBtn);
        }

        wrapper.style.display = 'block';
        animRunning = true;

        drawMario(true);
        drawBlock(true);
        mushCvs.style.opacity = '0';
        mushCvs.style.bottom = '84px';
        textCvs.style.opacity = '0';
        textCvs.style.bottom = '158px';

        var TOTAL = 65;
        var blockBounce = [0, -4, -8, -11, -12, -11, -8, -4, 0];
        var frame = 0;
        var lastTime = null;
        var MS_PER_FRAME = 18;

        function tick(ts) {
            if (!lastTime) lastTime = ts;
            if (ts - lastTime < MS_PER_FRAME) {
                requestAnimationFrame(tick);
                return;
            }
            lastTime = ts;

            blockCvs.style.transform = 'translateX(-50%) translateY(' +
                (frame < blockBounce.length ? blockBounce[frame] : 0) + 'px)';

            var mf = frame - 3;
            if (mf >= 0) {
                mushCvs.style.bottom = (84 + Math.min(mf / 38, 1) * 100) + 'px';
                mushCvs.style.opacity = mf > 30 ? String(Math.max(0, 1 - (mf - 30) / 8)) : '1';
            }

            var tf = frame - 12;
            if (tf >= 0) {
                textCvs.style.bottom = (158 + Math.min(tf / 35, 1) * 70) + 'px';
                textCvs.style.opacity = tf < 4
                    ? String(tf / 4)
                    : tf > 28 ? String(Math.max(0, 1 - (tf - 28) / 8)) : '1';
            }

            frame += 1;

            if (frame < TOTAL) {
                requestAnimationFrame(tick);
                return;
            }

            blockCvs.style.transform = 'translateX(-50%) translateY(0)';
            drawBlock(false);
            drawMario(false);
            mushCvs.style.opacity = '0';
            textCvs.style.opacity = '0';
            animRunning = false;

            if (onComplete) setTimeout(onComplete, 450);
            setTimeout(function () {
                wrapper.style.display = 'none';
            }, 900);
        }

        requestAnimationFrame(tick);
    };
}());
