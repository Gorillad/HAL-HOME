# Changelog

All notable changes to the LogicX marketing site are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/). Version tags use [Semantic Versioning](https://semver.org/).

## [1.0.0] — 2026-06-07

### Added

- Marketing homepage with templates, pricing, campaigns, and design services sections
- Showroom homepage template editor (`/editor/showroom.html`) with PDF/ZIP export
- Stripe Checkout integration (test mode) with 12% sales tax
- Cart drawer, thank-you page, and order confirmation email template
- Creative brief intake page (post-order design services)
- Shared footer component and contact email registry (`data/contacts.json`)

### Changed

- Package name `hal-home` → `logicxo-marketing`
- Documentation and footer KB links point to https://support.logicxo.com/
- Homepage hero image naming normalized (`hero-03.png`)

[1.0.0]: https://github.com/Gorillad/HAL-HOME/releases/tag/v1.0.0

## [Unreleased]

### Added

- Designer homepage editor scaffold (`/editor/designer.html`) — Gallery, Curator, Canvas with three-design URL guard
- Showroom editor progress dock — section completion checklist (collapsed by default) with support@logicxo.com
- Homepage Designer column links to Designer editor (`#designerEditorBtn`) with tab-synced template URLs

### Changed

- Showroom editor: two-tier header (site nav + editor chrome), black/gold theme, progress dock integration
- Homepage Designer card copy and CTA mirror Showroom editor pattern
