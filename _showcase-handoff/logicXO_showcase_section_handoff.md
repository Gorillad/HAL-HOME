# LogicX — Developer Handoff: Showcase / Proof Section ("Our Work")

## Overview

A dark-background gallery section that proves LogicX's work with **device mockups** (laptop + phone) showing real showroom sites. An interactive **project switcher** lets visitors click between projects; the laptop and phone screens swap with smooth transitions.

Placement: after the Features/Services section, before the CTA closer. This is the visual high point of the page — the "show, don't tell" moment.

A ready-to-use React component is provided: **`Showcase.jsx`**.

---

## Status: PLACEHOLDERS IN PLACE

The component currently renders wireframe placeholders. It is fully functional but needs real assets swapped in before launch.

### What's needed to go live
For **each** showroom project:
1. **Desktop screenshot** — 16:10 aspect ratio (goes in the laptop frame)
2. **Mobile screenshot** — 9:19 aspect ratio (goes in the phone frame)
3. **Project / client name** (e.g. "Modern Lighting Co.")
4. **Short tag line** (e.g. "Contemporary showroom")

---

## Copy

### Eyebrow
```
Our Work
```

### Headline (H2)
```
Built for showrooms like yours.
```

### Subheadline
```
See how we've brought lighting showrooms online — each site designed around their brand, on every device.
```

*(Copy is intentionally minimal — the visuals carry this section.)*

---

## Interaction

- Three (or more) project tabs sit below the device mockups.
- Clicking a tab sets it active and swaps:
  - The laptop screen content
  - The phone screen content
  - The accent color (each project can have its own)
  - The tag line above the tabs
- Transitions are smooth (~0.4–0.5s ease on color/background).
- The active tab is filled with that project's accent color; inactive tabs are outline-style.

---

## React Component (`Showcase.jsx`)

### Structure
- A `PROJECTS` array at the top holds all project data. **To add or edit projects, edit this array only.**
- Each project object currently has: `id`, `name`, `tag`, `accent` (hex), `heroGrad` (placeholder gradient), `cols` (placeholder grid columns).
- `<ScreenContent>` renders the placeholder wireframe for both laptop and phone.

### Swapping in real screenshots
Replace the `<ScreenContent>` component's output with real images:

```jsx
// Desktop (inside the laptop frame):
<img src={project.desktopImg} alt={`${project.name} homepage`}
     style={{ width: "100%", height: "100%", objectFit: "cover" }} />

// Mobile (inside the phone frame):
<img src={project.mobileImg} alt={`${project.name} mobile view`}
     style={{ width: "100%", height: "100%", objectFit: "cover" }} />
```

Then add `desktopImg` and `mobileImg` fields to each object in the `PROJECTS` array. The `heroGrad` and `cols` fields can be removed once real images are in.

### Notes
- Pure React + inline styles, no external dependencies.
- State-driven via `useState` (the active project index).
- Default export, no required props — drops in anywhere.

---

## Styling Reference

### Section
| Property | Value |
|----------|-------|
| Background | `#080808` |
| Padding | 64px top/bottom, 40px left/right |

### Header
| Element | Value |
|---------|-------|
| Eyebrow | `#C9A96E` gold, 10px uppercase |
| Headline | `#ffffff`, 30px, weight 500 |
| Subheadline | `rgba(255,255,255,0.45)`, 14px, line-height 1.8 |

### Laptop mockup
| Property | Value |
|----------|-------|
| Width | 460px (max 70% of container) |
| Screen | `#1a1a1a` bg, 6px `#2a2a2a` border, radius 12px top corners, 16:10 ratio |
| Base | 14px `#2a2a2a`, rounded bottom, with notch detail |

### Phone mockup
| Property | Value |
|----------|-------|
| Width | 130px |
| Position | overlaps laptop, `margin-left: -50px`, sits in front (z-index 3) |
| Screen | `#1a1a1a` bg, 5px `#2a2a2a` border, radius 18px, 9:19 ratio |
| Notch | 40x5px `#2a2a2a` pill, top center |

### Tabs
| State | Value |
|-------|-------|
| Default | text `rgba(255,255,255,0.5)`, 0.5px border `rgba(255,255,255,0.15)`, transparent bg, pill radius 20px, 8px/18px padding |
| Active | text `#0a0a0a`, bg = project accent color, weight 500 |

### Tag line (above tabs)
| Property | Value |
|----------|-------|
| Color | project accent color (changes per project) |
| Size | 11px uppercase, letter-spacing 0.12em |

---

## Placeholder accent colors (replace with real brand-appropriate tones)
| Project | Accent |
|---------|--------|
| Modern Lighting Co. | `#C9A96E` (gold) |
| Coastal Illumination | `#8FB4C4` (coastal blue) |
| Heritage Fixtures | `#B08D57` (warm bronze) |

---

## Note on Real Assets

Even one real showroom site dramatically outperforms any placeholder here. As soon as a real project is available, prioritize getting it into this section — it's the single strongest proof element on the page.

---

*Prepared for LogicX homepage build. Showcase / Proof section. Includes Showcase.jsx React component.*
