# LogicXO contact emails

Canonical list: `data/contacts.json` (keep in sync with the [HALXO support repo](https://github.com/Gorillad/HALXO)).

| Address | Purpose | Public site? | Use on |
|---------|---------|--------------|--------|
| hello@logicxo.com | Main contact, general inquiries | Yes | Marketing site contact, sales/demo CTA |
| orders@logicxo.com | Order confirmations & receipts | No | Transactional order emails, Stripe |
| support@logicxo.com | Customer help & after-purchase questions | Yes | Support site footer, KB, help links |
| noreply@logicxo.com | Automated system emails (download links, etc.) | **Never** | SMTP From for system mail only |
| legal@logicxo.com | Disputes, DMCA, formal correspondence | Yes | Privacy, Terms, legal footer links |

## By site

- **Marketing site (this repo):** `hello@logicxo.com` for general/demo; `support@logicxo.com` as secondary help link.
- **Support site (HALXO):** `support@logicxo.com` in footer and contact blocks.
- **Transactional:** `orders@logicxo.com` for receipts; `noreply@logicxo.com` for automated sends.
- **Legal pages:** `legal@logicxo.com`.

## Rules

- Do not display `noreply@` or `orders@` in public footers unless explicitly required.
- Retire `@xologic.com` — use `@logicxo.com` only.
- When an address changes, update `data/contacts.json` in **both** this repo and HALXO.
