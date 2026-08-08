---
name: DocIntelligence
description: A calm evidence library for bilingual regulatory document review and search
colors:
  pine-deep: "#183d35"
  pine-mid: "#526f65"
  pine-pale: "#c5d7cf"
  sage: "#dce8e1"
  mist: "#f5f8f6"
  paper: "#ffffff"
  clay: "#c56a4a"
  danger: "#8b2c27"
typography:
  display:
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Candara, 'Segoe UI', Arial, sans-serif"
    fontSize: "0.875rem"
    lineHeight: 1.6
  data:
    fontFamily: "'Cascadia Mono', 'IBM Plex Mono', Consolas, monospace"
    fontSize: "0.75rem"
    lineHeight: 1.6
rounded:
  control: "0.625rem"
  container: "0.875rem"
  panel: "1rem"
---

# Design System: Evidence Library

## Creative direction

DocIntelligence is a working evidence library: quiet enough for long legal review sessions, clear enough for high-consequence decisions, and warm enough to avoid feeling like a generic admin console. It replaces the former fixed dark sidebar with a horizontal library header and lets the active document occupy the widest part of the screen.

The design operates in **Operate** mode. Every expressive decision supports the sequence that creates trust: provide a source, inspect its interpretation, and confirm before indexing.

## Visual language

- Cool mist backgrounds reduce glare during desk-based work.
- White paper surfaces hold editable source material and structured data.
- Pine is the structural color for text, actions, active navigation, and verified states.
- Sage separates supporting guidance from the primary task without creating nested cards.
- Clay is used sparingly for attention, focus, active tabs, and the brand punctuation mark.
- Thin borders provide most of the depth. Shadows appear only on floating or interactive elements.

## Typography

Display headings use an old-style serif stack at medium weight. The face is reserved for page and section titles, giving the product an editorial character without making dense forms harder to scan. Body copy, labels, buttons, navigation, and form controls use a clean humanist sans-serif stack. Monospace is reserved for extracted text, measurements, similarity scores, and structured values.

Headings use tight but restrained tracking, never beyond `-0.035em`. Running text stays within roughly 70 characters per line and uses generous line height.

## Layout

The global shell uses a sticky horizontal header. Navigation wraps into a full-width row on small screens rather than collapsing behind a menu. Main content is constrained to `max-w-6xl`, allowing the review interface to be spacious without becoming difficult to scan.

The upload surface uses a two-column desk at large sizes:

- The document tray owns the primary column.
- A sage review-path panel explains extraction, structuring, and confirmation.
- On mobile, the page becomes a single clear reading order with the upload action first.

Review mode replaces the upload introduction with a concise progress path and tabbed source, structure, and passage views. Search uses a conversation surface paired with a compact explanation of grounding. Documents use a full-width library table with deliberate horizontal scrolling on narrow screens.

## Components and states

- Primary buttons use pine with white text and clay focus outlines.
- Secondary buttons use transparent or white surfaces with pine borders.
- Destructive controls use the dedicated danger ramp.
- Inputs sit on white or mist surfaces and receive a precise pine border/ring on focus.
- Loading states use clay progress marks and plain-language status copy.
- Errors explain the failure; empty states always offer a next action.
- Cards use 14–16px radii. Small controls use 10px radii; pills are reserved for compact status labels.

## Motion

Motion is limited to useful feedback: the document folio lifts slightly on hover, review content fades in when tabs change, and state transitions use a fast exponential ease-out. All animation is disabled when reduced motion is requested.

## Accessibility

- All interactive elements expose visible keyboard focus.
- Navigation remains fully available at mobile widths.
- Arabic source and form content preserve `dir="auto"` or `dir="rtl"` where appropriate.
- Status updates use live regions through the existing status components.
- Color is never the only indicator of workflow state.
