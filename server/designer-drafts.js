/**
 * server/designer-drafts.js
 * Per-account draft storage for the Designer Editor.
 * Drafts are stored as JSON files in server/data/designer-drafts/.
 */

const fs   = require('fs');
const path = require('path');

const DRAFTS_DIR = path.join(__dirname, 'data', 'designer-drafts');

function ensureDir() {
    if (!fs.existsSync(DRAFTS_DIR)) {
        fs.mkdirSync(DRAFTS_DIR, { recursive: true });
    }
}

// Prevent path traversal — keep only safe characters
function sanitize(str) {
    return String(str || '').replace(/[^a-zA-Z0-9@._-]/g, '_').slice(0, 120);
}

function draftPath(user, template) {
    return path.join(DRAFTS_DIR, `${sanitize(user)}__${sanitize(template)}.json`);
}

function loadDraft(user, template) {
    ensureDir();
    const p = draftPath(user, template);
    if (!fs.existsSync(p)) return null;
    try {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch {
        return null;
    }
}

function saveDraft(user, template, data) {
    ensureDir();
    fs.writeFileSync(draftPath(user, template), JSON.stringify(data, null, 2), 'utf8');
}

function listDrafts(user) {
    ensureDir();
    const prefix = sanitize(user) + '__';
    return fs
        .readdirSync(DRAFTS_DIR)
        .filter(f => f.startsWith(prefix) && f.endsWith('.json'))
        .map(f => f.slice(prefix.length, -5)); // template name
}

module.exports = { loadDraft, saveDraft, listDrafts };
