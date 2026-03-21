# Logic Looper Brand Guidelines

## 1. Color System

| Name | Hex | CSS Variable | Tailwind Class | Usage |
| --- | --- | --- | --- | --- |
| Brand Dark | `#222222` | `--color-primary` | `brand-dark` | Primary text, dark surfaces, high-contrast sections |
| Brand Blue | `#414BEA` | `--color-blue` | `brand-blue` | Primary CTAs, links, focused interactive elements |
| Brand Purple | `#7752FE` | `--color-purple` | `brand-purple` | Secondary CTAs, highlights, supporting accents |
| Brand Deep Purple | `#190482` | `--color-deep-purple` | `brand-deep-purple` | Strong contrast backgrounds, active states |
| Brand Accent | `#F05537` | `--color-accent` | `brand-accent` | Alerts, key counters, urgent game signals |
| White | `#FFFFFF` | `--color-white` | `brand-white` | Text on dark backgrounds, card surfaces |
| Light Gray | `#F6F5F5` | `--color-light-gray` | `brand-light-gray` | App background and neutral sections |
| Dark Gray | `#3D3B40` | `--color-dark-gray` | `brand-dark-gray` | Secondary text and muted labels |
| Light Blue | `#D9E2FF` | `--color-light-blue` | `brand-light-blue` | Soft callouts and hover backgrounds |
| Light Sky | `#DDF2FD` | `--color-light-sky` | `brand-light-sky` | Information panels and low-emphasis fills |
| Light Periwinkle | `#C2D9FF` | `--color-light-periwinkle` | `brand-light-periwinkle` | Interactive hover/focus backgrounds |
| Light Steel | `#BFCFE7` | `--color-light-steel` | `brand-light-steel` | Borders, separators, disabled surfaces |
| Light Lavender | `#F8EDFF` | `--color-light-lavender` | `brand-light-lavender` | Alternate cards and promotional blocks |

### Color Usage Rules
- Keep `brand-blue` as the default primary action color.
- Use `brand-accent` sparingly to preserve urgency.
- Prefer `brand-dark` for long-form text over pure black.
- Use light variants for background fills rather than primary text.

## 2. Typography

### Font Families
- Primary (Headings/UI): **Poppins**
- Secondary (Body/Documentation): **Open Sans**

### Usage Rules
- Use `font-sans` (Poppins) for headlines, buttons, labels, navigation, and KPI values.
- Use `font-body` (Open Sans) for body copy, help text, tooltip content, and docs.

### Weight Guidelines
- `300`: Large decorative hero text only; avoid for normal UI text.
- `400`: Default paragraphs, descriptions, and captions.
- `500`: Input labels, tabs, compact controls.
- `600`: Section headings, card titles, emphasis text.
- `700`: Hero titles, page headers, high-priority callouts.

## 3. Icon Libraries

| Library | Primary Use | Notes |
| --- | --- | --- |
| Font Awesome | General product UI icons | Best for broad coverage and common interaction patterns |
| Bootstrap Icons | Lightweight app controls | Use when simple line/filled UI glyphs are enough |
| Flaticon | Illustrative or thematic icons | Use for marketing/game-themed visual flavor, not dense controls |

## 4. Spacing and Sizing Conventions

- Use a 4px base grid (`4, 8, 12, 16, 20, 24, 32, 40, 48...`).
- Prefer padding pairs: `px-4 py-2`, `px-5 py-3`, `px-6 py-4` for controls.
- Standard radius scale:
  - `rounded-md` (6px): dense inputs
  - `rounded-lg` (8px): buttons/default cards
  - `rounded-2xl` (16px): featured containers
- Button sizes:
  - `sm`: compact utility actions
  - `md`: default action size
  - `lg`: primary/high-attention call-to-action

## 5. Brand Gradients

| Token | CSS Gradient | Tailwind Background Class | Use |
| --- | --- | --- | --- |
| `hero` | `linear-gradient(135deg, #414BEA 0%, #7752FE 100%)` | `bg-brand-hero` | Main hero banners and top-level page headers |
| `action` | `linear-gradient(135deg, #F05537 0%, #7752FE 100%)` | `bg-brand-action` | Promotions, rewards, special event modules |
| `night` | `linear-gradient(135deg, #222222 0%, #190482 100%)` | `bg-brand-night` | Dark theme sections and footer callouts |
| `calm` | `linear-gradient(135deg, #D9E2FF 0%, #DDF2FD 100%)` | `bg-brand-calm` | Soft backgrounds for informational cards |
| `aura` | `linear-gradient(135deg, #F8EDFF 0%, #C2D9FF 100%)` | `bg-brand-aura` | Secondary hero strips and onboarding panels |

## 6. Accessibility Notes

### Recommended Contrast Pairings

| Text / Background | Contrast Ratio | WCAG AA Normal Text |
| --- | --- | --- |
| `#FFFFFF` on `#222222` | `15.91:1` | Pass |
| `#FFFFFF` on `#414BEA` | `6.14:1` | Pass |
| `#FFFFFF` on `#7752FE` | `4.75:1` | Pass |
| `#FFFFFF` on `#190482` | `15.21:1` | Pass |
| `#222222` on `#F05537` | `4.59:1` | Pass |
| `#FFFFFF` on `#F05537` | `3.47:1` | Fail (normal text) |
| `#222222` on `#F6F5F5` | `14.62:1` | Pass |

### Accessibility Rules
- Do not use white text on `brand-accent` for normal-size copy.
- For primary and secondary buttons, keep white text on blue/purple backgrounds.
- Keep paragraph text at `16px`+ and avoid weight `300` for readability.
- Always preserve visible focus states (`focus-visible:ring-*`) for keyboard users.

## 7. Compliance Checklist

- [ ] Colors come from `src/config/brand.ts`.
- [ ] Tailwind classes use `brand-*` color tokens.
- [ ] Headings/UI use Poppins; body copy uses Open Sans.
- [ ] Button states include hover, focus-visible, active, and disabled styles.
- [ ] Accent color is not overloaded across non-urgent interactions.
- [ ] Contrast is verified for text/background combinations.
- [ ] New UI components include responsive sizing and spacing on the 4px grid.
