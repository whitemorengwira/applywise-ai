# ApplyWise AI — UI Tokens

## Colour System

### Brand Palette (Dark-First Design)
```css
/* Background */
--background: 222 47% 6%;         /* Deep navy-black */
--background-secondary: 222 40% 9%; /* Slightly lighter */
--background-tertiary: 222 35% 12%; /* Card backgrounds */

/* Foreground */
--foreground: 210 20% 95%;        /* Off-white text */
--foreground-muted: 215 15% 65%;  /* Secondary text */
--foreground-subtle: 215 10% 45%; /* Tertiary text */

/* Primary (Teal-Blue) */
--primary: 199 89% 48%;           /* #0ea5e9 — actions, links */
--primary-hover: 199 89% 42%;
--primary-foreground: 0 0% 100%;

/* Secondary */
--secondary: 222 35% 16%;         /* Subtle backgrounds */
--secondary-hover: 222 35% 20%;
--secondary-foreground: 210 20% 90%;

/* Accent (Emerald) */
--accent: 160 84% 39%;            /* #10b981 — success, positive matches */
--accent-foreground: 0 0% 100%;

/* Destructive */
--destructive: 0 84% 60%;         /* Red — errors, warnings */
--destructive-foreground: 0 0% 100%;

/* Warning */
--warning: 38 92% 50%;            /* Amber */
--warning-foreground: 0 0% 10%;

/* Match Score Gradient */
--match-high: 160 84% 39%;        /* 80%+ — green */
--match-medium: 38 92% 50%;       /* 50-79% — amber */
--match-low: 0 84% 60%;           /* <50% — red */

/* Border / Ring */
--border: 222 30% 18%;
--ring: 199 89% 48%;

/* Sidebar */
--sidebar-bg: 222 47% 5%;
--sidebar-border: 222 30% 14%;
--sidebar-active: 199 89% 48%;
```

### Light Mode (Secondary)
Light mode tokens will follow shadcn/ui defaults with brand colour overrides.

## Typography

### Font Stack
- **Primary:** `Inter` (Google Fonts) — body text, UI
- **Mono:** `JetBrains Mono` — code, technical data

### Scale
| Token | Size | Weight | Usage |
|---|---|---|---|
| `heading-1` | 2rem (32px) | 700 | Page titles |
| `heading-2` | 1.5rem (24px) | 600 | Section titles |
| `heading-3` | 1.25rem (20px) | 600 | Card titles |
| `heading-4` | 1.125rem (18px) | 500 | Subsection titles |
| `body` | 0.9375rem (15px) | 400 | Body text |
| `body-sm` | 0.8125rem (13px) | 400 | Secondary text |
| `caption` | 0.75rem (12px) | 400 | Labels, timestamps |
| `mono` | 0.8125rem (13px) | 400 | Code, scores |

## Spacing
Base unit: `4px` (0.25rem)
| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Tight gaps |
| `space-2` | 8px | Inline spacing |
| `space-3` | 12px | Component padding |
| `space-4` | 16px | Standard padding |
| `space-5` | 20px | Section gaps |
| `space-6` | 24px | Card padding |
| `space-8` | 32px | Section spacing |
| `space-10` | 40px | Page padding |
| `space-12` | 48px | Major sections |
| `space-16` | 64px | Hero spacing |

## Border Radius
| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 6px | Badges, tags |
| `radius-md` | 8px | Buttons, inputs |
| `radius-lg` | 12px | Cards |
| `radius-xl` | 16px | Modals, panels |
| `radius-full` | 9999px | Avatars, pills |

## Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
```

## Breakpoints
| Breakpoint | Width | Usage |
|---|---|---|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1536px | Ultra-wide |

## Z-Index Scale
| Token | Value | Usage |
|---|---|---|
| `z-base` | 0 | Normal flow |
| `z-dropdown` | 50 | Dropdowns |
| `z-sticky` | 100 | Sticky headers |
| `z-modal` | 200 | Modals, dialogs |
| `z-toast` | 300 | Toast notifications |
| `z-tooltip` | 400 | Tooltips |
