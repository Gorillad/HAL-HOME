(function () {
    'use strict';

    var root = document.getElementById('chandelierSizingTool');
    if (!root) return;

    var modeInputs = root.querySelectorAll('input[name="pt-size-mode"]');
    var tablePanel = root.querySelector('[data-panel="table"]');
    var roomPanel = root.querySelector('[data-panel="room"]');
    var tableWidth = root.querySelector('#ptTableWidth');
    var tableLength = root.querySelector('#ptTableLength');
    var roomLength = root.querySelector('#ptRoomLength');
    var roomWidth = root.querySelector('#ptRoomWidth');
    var ceiling = root.querySelector('#ptCeiling');
    var results = root.querySelector('#ptSizeResults');
    var resultDiameter = root.querySelector('#ptResultDiameter');
    var resultHang = root.querySelector('#ptResultHang');
    var resultFixture = root.querySelector('#ptResultFixture');
    var resultNote = root.querySelector('#ptResultNote');
    var resultShape = root.querySelector('#ptResultShape');

    function mode() {
        var checked = root.querySelector('input[name="pt-size-mode"]:checked');
        return checked ? checked.value : 'table';
    }

    function num(el, fallback) {
        var v = parseFloat(el && el.value);
        return Number.isFinite(v) && v > 0 ? v : fallback;
    }

    function clamp(n, min, max) {
        return Math.min(max, Math.max(min, n));
    }

    function roundInch(n) {
        return Math.round(n);
    }

    function formatRange(lo, hi) {
        lo = roundInch(lo);
        hi = roundInch(hi);
        if (lo === hi) return lo + '"';
        return lo + '–' + hi + '"';
    }

    function compute() {
        var ceilingFt = clamp(num(ceiling, 8), 7, 20);
        var hangLo = 30 + Math.max(0, ceilingFt - 8) * 3;
        var hangHi = 36 + Math.max(0, ceilingFt - 8) * 3;
        var fixtureLo = ceilingFt * 2.5;
        var fixtureHi = ceilingFt * 3;

        var diameterLo;
        var diameterHi;
        var note;
        var shapeHint;
        var longTable = false;

        if (mode() === 'room') {
            var rl = clamp(num(roomLength, 12), 8, 40);
            var rw = clamp(num(roomWidth, 14), 8, 40);
            var roomDiameter = rl + rw;
            diameterLo = roomDiameter * 0.9;
            diameterHi = roomDiameter * 1.1;
            note = 'Room formula: ' + rl + "' + " + rw + "' ≈ " + roundInch(roomDiameter) + '" diameter. Treat this as a starting range — refine once you have a table.';
            shapeHint = 'Match fixture shape to the table you choose (round → round; long rectangle → linear or pendant row).';
        } else {
            var tw = clamp(num(tableWidth, 48), 24, 96);
            var tl = clamp(num(tableLength, 72), 24, 144);
            diameterLo = tw * 0.5;
            diameterHi = tw * (2 / 3);
            var maxSafe = tw - 12;
            if (diameterHi > maxSafe) {
                diameterHi = Math.max(diameterLo, maxSafe);
            }
            longTable = tl >= 72;
            note = 'Table rule: ½–⅔ of ' + roundInch(tw) + '" width' +
                (longTable ? '. Your table is ' + roundInch(tl) + '" long — consider a linear fixture or 2–3 pendants.' : '.') +
                ' Keep the fixture at least 12" narrower than the table.';
            if (longTable) {
                var linearLo = tl / 3;
                var linearHi = tl / 2;
                shapeHint = 'Linear length target: ' + formatRange(linearLo, linearHi) +
                    ' (⅓–½ of table length), or space 2–3 pendants 24–36" apart.';
            } else {
                shapeHint = 'Round or oval tables suit round/tiered fixtures; square tables suit round or square.';
            }
        }

        resultDiameter.textContent = formatRange(diameterLo, diameterHi);
        resultHang.textContent = formatRange(hangLo, hangHi) + ' above tabletop';
        resultFixture.textContent = formatRange(fixtureLo, fixtureHi) + ' tall';
        resultNote.textContent = note;
        resultShape.textContent = shapeHint;
        results.hidden = false;
        results.setAttribute('data-ready', 'true');
    }

    function syncPanels() {
        var isRoom = mode() === 'room';
        if (tablePanel) tablePanel.hidden = isRoom;
        if (roomPanel) roomPanel.hidden = !isRoom;
        compute();
    }

    modeInputs.forEach(function (input) {
        input.addEventListener('change', syncPanels);
    });

    [tableWidth, tableLength, roomLength, roomWidth, ceiling].forEach(function (el) {
        if (!el) return;
        el.addEventListener('input', compute);
        el.addEventListener('change', compute);
    });

    syncPanels();
})();
