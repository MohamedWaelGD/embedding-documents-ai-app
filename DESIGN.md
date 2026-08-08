---
name: DocIntelligence
description: AI-powered regulatory document ingestion, structuring, and semantic search
colors:
  navy-deep: "#0f172a"
  navy-mid: "#475685"
  navy-pale: "#dee2ee"
  parchment-light: "#fefcf6"
  parchment-warm: "#fef7ed"
  parchment-mid: "#fcefd5"
  gold-rich: "#b8932e"
  gold-pale: "#f9efd0"
  burgundy-deep: "#722f37"
  burgundy-pale: "#f3e8eb"
typography:
  display:
    fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif"
    fontSize: "1.875rem"
    fontWeight: 600
    fontStyle: italic
    lineHeight: 1.3
  body:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif"
    fontSize: "0.75rem"
    fontWeight: 500
    fontStyle: italic
    letterSpacing: "0.025em"
  data:
    fontFamily: "'IBM Plex Mono', 'Consolas', 'Courier New', monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "0.25rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
spacing:
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  section: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.navy-deep}"
    textColor: "{colors.parchment-light}"
    rounded: "{rounded.md}"
    padding: "0.625rem 1.5rem"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "#1e253c"
    textColor: "{colors.parchment-light}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "#475685"
    rounded: "{rounded.md}"
    padding: "0.625rem 1.25rem"
    typography: "{typography.label}"
  button-ghost-hover:
    textColor: "#1e253c"
  card-default:
    backgroundColor: "#ffffff"
    rounded: "{rounded.lg}"
  card-parchment:
    backgroundColor: "{colors.parchment-warm}"
    rounded: "{rounded.lg}"
  input-default:
    backgroundColor: "{colors.parchment-light}"
    textColor: "{colors.navy-deep}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
  sidebar:
    backgroundColor: "{colors.navy-deep}"
    textColor: "#dee2ee"
    width: "15rem"
  sidebar-active:
    textColor: "{colors.parchment-warm}"
---

# Design System: DocIntelligence

## Overview

**Creative North Star: "The Law Library"**

DocIntelligence speaks the visual language of a great law library — quiet authority, bound volumes, gold lettering on spines, the weight of precedent made accessible. The palette pairs deep navy with warm parchment, evoking leather-bound ledgers and fine paper stock. Gold accents are deployed sparingly, marking important moments the way gilded page edges catch light. The system feels heavy with tradition but human in its warmth: this is software that takes your documents as seriously as you do.

The design operates in Operate mode — legal professionals completing structured tasks. Scanability, consistency, and clarity govern every decision. Expression lives in the precise details: the italic serif headings, the gold border that marks the active navigation item, the ornamental corners framing the upload zone. Nothing shouts. Everything is considered.

**Key Characteristics:**
- Dark navy sidebar anchors every page with institutional gravity
- Cormorant Garamond italic headings carry the library's typographic heritage
- Parchment-warm backgrounds soften the data density
- Gold appears on ~5% of any screen — its rarity is the point
- IBM Plex Mono for code, data, and measurements — precision where it matters
- Subtle shadows lift cards and modals; the baseline is flat tonal contrast

## Colors

The palette is built around the material contrast of a traditional law library: dark wood and leather against warm paper and gold leaf. Navy carries weight and authority; parchment provides a soft, human reading surface; gold marks importance; burgundy signals caution and destruction.

### Primary
- **Navy Deep** (#0f172a): Sidebar background, primary button fill, active navigation state, user message bubbles. The system's structural color — it carries the weight of the institution.
- **Navy Mid** (#475685): Body text on light backgrounds, secondary labels, hover state text.
- **Navy Pale** (#dee2ee): Borders, dividers, inactive nav text on dark surfaces.

### Neutral
- **Parchment Light** (#fefcf6): Page background. Warmer than pure white, cooler than cream — a paper tone that reads as intentional, not yellowed.
- **Parchment Warm** (#fef7ed): Input field backgrounds, assistant message cards, table header bands. Provides subtle tonal differentiation without introducing a new hue.
- **Parchment Mid** (#fcefd5): Selection background, dragging hover states, focus highlights.

### Accent
- **Gold Rich** (#b8932e): Active nav indicator, ornamental upload zone corners, success borders, loading spinner. The accent is deliberately scarce — appearing on no more than 5% of any screen.
- **Gold Pale** (#f9efd0): Success notification backgrounds, hover highlights on gold-adjacent elements.

### Destructive
- **Burgundy Deep** (#722f37): Error alert borders, delete action text and borders. A warm, traditional red that sits naturally alongside navy rather than clashing with it.
- **Burgundy Pale** (#f3e8eb): Error alert backgrounds.

**The One Accent Rule.** Gold is the system's only accent. No blue, no teal, no secondary chromatic color. The palette's richness comes from the tonal range within navy and parchment, not from additional hues.

## Typography

**Display Font:** Cormorant Garamond (with Georgia/Times fallback)
**Body Font:** Georgia (with Times fallback)
**Data Font:** IBM Plex Mono (with Consolas/Courier fallback)

**Character:** The serif-heavy stack roots the interface in print tradition without feeling decorative. Cormorant Garamond's sharp italics give headings editorial presence; Georgia's sturdy body text ensures readability at small sizes. The mono face appears only in code, measurements, and structured data — never as stylistic decoration.

### Hierarchy
- **Display** (semibold italic, ~1.875rem / 30px, 1.3): Page headings on Upload, Search, and Documents. One per page, always in navy deep.
- **Title** (medium italic, ~0.875rem / 14px, 1.4): Section labels, tab text, button text, card headers. The system's primary label weight — italic Cormorant Garamond at small sizes.
- **Body** (regular, 0.875rem / 14px, 1.6): Page descriptions, assistant messages, table content, form values. Georgia at reading size with generous line-height. Max measure ~75ch.
- **Label** (medium italic, 0.75rem / 12px, 0.025em tracking): Form field labels, table column headers, metadata text. Uppercase when used in table headers; sentence case for form labels.
- **Data** (regular, 0.75rem / 12px, 1.6): Code blocks, textareas, chunk content, similarity scores, character counts. IBM Plex Mono; never used for prose.

**The Serif-Forward Rule.** Serifs carry the system's entire voice outside of data displays. Sans-serif faces do not appear in the design. The mono face is reserved for code, measurements, and structured output — it is never a "technical" costume for label text.

## Layout

The shell uses a fixed 240px (15rem) left sidebar with the main content area filling remaining width. Pages use a max-width container (max-w-4xl for Search and Documents, max-w-5xl for Upload's wider review layout). Content sits inside generous padding (2rem / 32px on the main area).

The sidebar is always visible; there is no collapsible or hamburger state. Navigation items are stacked vertically with 0.125rem gaps, each 2.5rem tall with 0.75rem horizontal padding. The active item is indicated by a 2px gold left border and a subtle gold background tint.

Section spacing follows a clear rhythm: 3rem between the page header and first content, 1.5rem between major content blocks, 1rem between related form fields, and 0.5rem between label and input. The upload page's review section uses a top border (1px navy pale) as a section separator before the action buttons.

## Elevation & Depth

The system uses subtle, diffused shadows sparingly. The baseline is flat tonal contrast — darker elements sit forward against lighter backgrounds through color alone (navy sidebar against parchment page, white cards against parchment background). Shadows appear only as a state response on hover, with soft ambient diffusion and no hard edges.

### Shadow Vocabulary
- **Card hover** (`box-shadow: 0 2px 12px rgba(15, 23, 42, 0.06)`): Document cards and structured regulation accordions lift gently on hover to indicate interactivity. The shadow is tinted navy, not pure black.
- **Modal / overlay** (`box-shadow: 0 8px 32px rgba(15, 23, 42, 0.12)`): Reserved for floating panels and confirmation dialogs that need clear separation from the page surface.

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only in response to state (hover, focus, or modal elevation). An element without interactive behavior never gets a shadow.

## Shapes

The system uses a consistent corner language: 0.5rem (8px) radius for buttons, inputs, and small controls; 0.75rem (12px) for cards and containers; 1rem (16px) for chat message bubbles and the segmented tab control. The upload drop zone uses a subtle double-border ornament — an outer 2px dashed border with an inner 1px solid border at 0.5rem inset, plus gold corner brackets — giving it the feel of a formal document tray rather than a generic file input.

Borders are 1px solid throughout, using navy pale (#dee2ee) for standard boundaries and gold rich (#b8932e) for active or drag states. The sidebar uses a 2px gold left border on the active navigation item. No component uses a colored right or bottom border above 1px.

## Components

### Buttons
- **Shape:** 0.5rem (8px) radius, consistent across all variants.
- **Primary:** Navy deep background (#0f172a), parchment light text, 0.625rem vertical × 1.5rem horizontal padding. Hover lightens to navy-800 (#1e253c). Used for confirm/save, send/search, and primary page actions.
- **Ghost / Secondary:** Transparent background, 1px navy mid border, navy mid text. Hover shifts text to navy deep and border to navy-500. Used for cancel, download, and secondary actions.
- **Destructive:** Transparent background, 1px burgundy deep border, burgundy deep text. Hover intensifies to burgundy-800. Used only for delete actions.
- **Focus:** 2px gold rich outline with 2px offset on all variants.
- **Disabled:** 50% opacity with `cursor: not-allowed`.

### Cards / Containers
- **Shape:** 0.75rem (12px) radius for standard cards; 1rem (16px) for chat messages.
- **White cards** (default): White background, 1px navy pale border. Used for chat container, regulation accordions, chunk cards, source references.
- **Parchment cards:** Parchment warm (#fef7ed) background, 1px navy pale border. Used for assistant chat messages, accordion expanded interiors, table headers.
- **Navy cards:** Navy deep (#0f172a) background. Used for user chat messages and segmented tab active states.

### Inputs / Fields
- **Style:** 1px navy pale border, parchment light (#fefcf6) or white background, 0.5rem (8px) radius.
- **Padding:** 0.5rem vertical × 0.75rem horizontal for text inputs; 1rem padding for textareas.
- **Focus:** Border shifts to navy-500 with a 1px navy-300 ring. No glow, no color shift — precise and restrained.
- **Placeholder:** Navy pale or navy-300 text, italic in serif contexts to distinguish from user-entered text.
- **Error / Disabled:** No special input styling beyond the parent alert component's treatment.

### Navigation
- **Sidebar:** Fixed 240px width, navy deep (#0f172a) background, 1px navy-700 right border. Logo area at top with Cormorant Garamond italic display text in parchment.
- **Nav items:** 0.5rem (8px) radius, 2.5rem tall, 0.75rem horizontal padding. Default text in navy pale (#dee2ee) at body size. Hover lightens to parchment. Active state adds a 2px gold left border and a subtle gold background tint (gold-800 at 15% opacity).
- **Icons:** Consistent 1.5px stroke SVG icons at 18×18px, inheriting text color. One consistent stroke weight across all icons.
- **Tab control:** Segmented pill with 0.75rem (12px) outer radius, 0.5rem (8px) inner item radius. Active tab fills navy deep with parchment text; inactive tabs are transparent with navy mid text.

### Structured Form Accordion
- Each regulation type is a bordered card with a clickable header. Chevron icon rotates 90° on expand. Expanded interiors use a parchment-warm background to distinguish from the parent card.
- Regulation actions render as nested cards (white bg, navy pale border) within the expanded section. Each action's value type determines the input rendered (text, number with EGP label, days, or percentage).

### Chunks Viewer
- Each chunk displays as a card with a header showing chunk index in serif italic and character count in mono. The chunk content is rendered as a `<pre>` block in IBM Plex Mono with a max-height of 12rem and vertical overflow scroll.

### Status Indicators
- **Loading:** Centered layout with a gold spinning ring spinner and italic serif message.
- **Error:** Burgundy-pale background card with burgundy-deep border and an alert circle SVG icon.
- **Success:** Gold-pale background card with gold-rich border and a checkmark SVG icon.
- **Empty:** Centered column with a dashed-border circular icon container, a serif italic message, and generous vertical padding (3.5rem).

## Do's and Don'ts

### Do:
- **Do** use Cormorant Garamond italic for all headings, labels, and button text — it is the system's typographic voice.
- **Do** keep gold accent usage below 5% of any screen. Its power is in scarcity.
- **Do** use the navy deep / parchment light tonal contrast as the primary depth mechanism; shadows are secondary.
- **Do** render all icons as inline SVGs with 1.5px consistent stroke weight, inheriting text color.
- **Do** keep body text at 0.875rem with 1.6 line-height in Georgia — no smaller, no tighter for running text.
- **Do** use IBM Plex Mono exclusively for code, data values, measurements, and structured output — never for labels or prose.

### Don't:
- **Don't** introduce a second accent color. Gold is it. No blue, no teal, no green beyond what Burgundy already covers for errors.
- **Don't** use sans-serif fonts anywhere. The system's voice is serif-only outside of data displays.
- **Don't** add shadows to elements without interactive states. Flat is the default.
- **Don't** use colored left/right borders above 2px. The sidebar's 2px gold indicator is the ceiling.
- **Don't** use gradient text, glass effects, or blur-backdrop. The system's materials are paper, ink, and gold leaf — not glass or light.
- **Don't** nest cards inside cards. Use borderless tonal differentiation (parchment-warm background) for nested content within a card.
