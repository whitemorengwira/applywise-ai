# ADR-004: UI Framework — shadcn/ui with Tailwind CSS

## Status
Accepted

## Context
Need an accessible, professional UI component system that works with Next.js 15 and can be fully customised for a premium SaaS look. Options: Material UI, Chakra UI, Ant Design, shadcn/ui, custom components from scratch.

## Decision
Use **shadcn/ui** built on **Radix UI** primitives with **Tailwind CSS** for styling.

## Consequences
- Positive: Components are copied into the project — full ownership and customisation
- Positive: Built on Radix UI — accessibility is built-in (ARIA, keyboard nav, focus management)
- Positive: Works natively with Tailwind CSS and Next.js
- Positive: Active community, well-maintained
- Positive: Not a traditional dependency — components won't break on library updates
- Negative: Initial setup requires adding components one by one
- Negative: More work than a fully packaged library — but this is a showcase project

## Alternatives Considered
- **Material UI**: Opinionated Google design language, harder to customise for a unique look
- **Chakra UI**: Good but less aligned with the Tailwind ecosystem
- **Ant Design**: Enterprise-focused but heavy, more suited to internal tools
- **Custom from scratch**: Too much work for the timeline, and accessibility would need manual implementation
