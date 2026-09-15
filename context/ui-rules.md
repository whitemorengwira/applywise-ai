# ApplyWise AI — UI Rules

## Layout Rules

### Sidebar Navigation
- Fixed left sidebar on desktop (260px wide)
- Collapsible to icon-only mode (64px)
- Slide-over sheet on mobile (triggered by hamburger)
- Navigation groups: Dashboard, Profile, Jobs, Applications, AI Copilot, Settings
- Active state: highlighted background + primary colour indicator

### Page Layout
- Max content width: 1280px (centred)
- Page padding: 24px on desktop, 16px on mobile
- Page header: title + optional breadcrumb + action buttons (right-aligned)
- Content sections separated by 32px vertical spacing

### Cards
- Background: `--background-tertiary`
- Border: `--border` (1px solid)
- Border radius: `--radius-lg` (12px)
- Padding: 24px
- Hover: subtle shadow elevation (on interactive cards)

## Interaction Rules

### Buttons
- Primary: solid `--primary` background, white text
- Secondary: `--secondary` background, muted text
- Destructive: `--destructive` background, white text
- Ghost: transparent background, hover shows background
- Loading state: spinner icon + "Processing..." text (disabled)
- All buttons: `cursor-pointer`, `transition-colors`, `focus-visible:ring`

### Forms
- Labels above inputs
- Error messages below inputs (red, small text)
- Required fields marked with asterisk
- Client-side validation via Zod + react-hook-form
- Server-side validation in Server Actions
- Submit button disabled while processing

### Tables
- Sticky header on scroll
- Row hover highlight
- Responsive: horizontal scroll on mobile, or card layout
- Pagination: 10-25 items per page
- Sort indicators on sortable columns

## State Rules

### Loading States
- Page-level: skeleton placeholder matching content layout
- Component-level: spinner or shimmer
- AI operations: streaming text with typing animation
- Button: disabled + spinner

### Empty States
- Centred illustration or icon
- Clear message explaining what's missing
- Primary action CTA to get started
- Never show a blank page

### Error States
- Inline errors for form fields
- Toast notifications for action errors
- Full-page error with retry for critical failures
- Never show raw error messages to users

## AI-Specific UI

### AI Analysis Display
- Clear header: "AI Analysis" with model indicator
- Grounding badges: "Based on your CV" / "Based on job description"
- Confidence indicator where applicable
- Source citations (collapsible)
- Regenerate button
- Timestamp

### Match Score Display
- Circular progress ring or horizontal bar
- Colour-coded: green (80%+), amber (50-79%), red (<50%)
- Breakdown categories below main score
- "How this score was calculated" expandable section

### Chat / Copilot
- Message bubbles: user (right, primary), AI (left, secondary)
- Streaming response with typing indicator
- Source citations inline
- Action buttons in AI responses (e.g., "Apply this to my CV")
- Clear distinction between AI suggestions and verified facts

## Responsive Rules
- Mobile-first implementation
- Sidebar → hamburger on mobile
- Multi-column → single column on mobile
- Tables → card layout on mobile
- Touch-friendly tap targets (min 44px)
- No horizontal overflow

## Accessibility Rules
- All interactive elements keyboard-focusable
- Visible focus indicators (ring)
- Proper heading hierarchy (one h1 per page)
- ARIA labels on icon-only buttons
- Colour contrast: WCAG AA minimum
- Form labels associated with inputs
- Error messages announced via aria-live
- Skip navigation link
- Alt text on all images
- Reduced-motion respect via `prefers-reduced-motion`
