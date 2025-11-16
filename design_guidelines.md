# Kenyaluk Medical Foundation - Design Guidelines

## Design Approach

**Reference-Based Strategy**: Drawing inspiration from leading nonprofit organizations (Charity: Water, Doctors Without Borders, UNICEF) that excel at emotional storytelling, trust-building, and conversion optimization. Focus on clarity, accessibility, and human-centered design that motivates action while maintaining professional credibility.

**Core Principles**: 
- Trust and transparency through visual hierarchy and clear communication
- Emotional connection via impactful imagery and storytelling
- Friction-free conversion paths for donations and engagement
- Inclusive design for all users and abilities

## Typography System

**Font Stack**: 
- Headlines: Inter or Poppins (Bold/Semibold) - modern, trustworthy, highly legible
- Body: Inter or Open Sans (Regular/Medium) - excellent readability at all sizes
- Accent/CTAs: Same as headlines but uppercase with letter-spacing

**Scale**:
- Hero Headline: text-5xl md:text-6xl lg:text-7xl (bold)
- Section Headers: text-3xl md:text-4xl lg:text-5xl (semibold)
- Subsection Headers: text-2xl md:text-3xl (semibold)
- Body Text: text-base md:text-lg (leading-relaxed for readability)
- Small Text/Captions: text-sm md:text-base
- CTA Buttons: text-base md:text-lg (semibold, uppercase tracking-wide)

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistency
- Component padding: p-6 md:p-8 lg:p-12
- Section spacing: py-16 md:py-20 lg:py-24
- Element gaps: gap-4, gap-6, gap-8
- Container margins: mx-4 md:mx-6 lg:mx-8

**Grid System**:
- Max container width: max-w-7xl mx-auto
- Content sections: max-w-6xl mx-auto
- Text content: max-w-3xl for optimal readability
- Feature grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

## Component Library

### Navigation
**Sticky Header**: Fixed top navigation with slight shadow, blur background
- Logo (left), navigation links (center), Donate button (right)
- Mobile: Hamburger menu, full-screen overlay
- Min height: h-16 md:h-20
- Donate button always prominent with subtle pulse animation

### Hero Section (Homepage)
**Full-width impactful design**: min-h-[600px] md:min-h-[700px] lg:min-h-[800px]
- Large background image showing medical mission work or beneficiaries
- Overlay gradient for text readability
- Centered content with mission headline, 2-3 sentence value proposition, primary CTA
- Trust indicator: "Trusted by 10,000+ beneficiaries" with small icons
- Buttons with blur background (backdrop-blur-sm bg-white/10 border border-white/20)

### Program Cards
**3-column grid on desktop**, stack on mobile
- Card structure: Image (aspect-ratio-16/9), icon, title, 2-3 line description, "Learn More" link
- Hover: Subtle lift (transform scale-105) and shadow increase
- Icons: 48x48px minimum, positioned top-left of text content

### Impact Metrics Section
**4-column stat showcase** (2-column on tablet, 1-column mobile)
- Large number (text-4xl md:text-5xl bold), label below (text-lg)
- Spacing: gap-8 md:gap-12
- Optional: Animated counter on scroll-into-view

### Donation Form
**Single-column, centered layout**: max-w-2xl mx-auto
- Preset amount buttons in 2x2 or 3x2 grid (min 44x44px touch targets)
- Selected state: bold border, subtle background
- "Other Amount" input field with clear labeling
- Impact messaging: "$50 = Medical kit for 5 children" above each preset
- Recurring toggle (Monthly/One-time) prominent at top
- Minimal form fields: Name, Email, Payment (Stripe elements)
- Trust badges: SSL icon, payment method logos, "100% Secure" messaging
- Large CTA button: "Complete Donation" (min h-12 md:h-14)

### Events Listing
**Card grid layout**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Each card: Event image (aspect-ratio-4/3), date badge (absolute top-right), title, location, short description, "Register" button
- Filter bar above: Dropdown for program type, date range
- Sticky filter on scroll

### Volunteer/Contact Forms
**Single-column centered**: max-w-xl mx-auto
- Each input: Full-width, clear labels above, generous padding (p-4), min h-12
- Visual hierarchy: Required fields marked, optional fields labeled
- Submit button: Full-width on mobile, auto-width on desktop
- Success state: Inline confirmation message with checkmark

### Story/Testimonial Cards
**Alternating layout** or **masonry grid**
- Profile image (circular, 80x80px), quote (text-lg italic), name, role
- For full stories: Image left, content right on desktop (reverse on mobile)

### Footer
**Multi-column rich footer**: 4 columns on desktop, stack on mobile
- Column 1: Logo, mission tagline, social icons
- Column 2: Quick links (Programs, Events, About)
- Column 3: Get Involved (Donate, Volunteer, Sponsor)
- Column 4: Newsletter signup (email input + button), contact info
- Bottom bar: Copyright, accessibility statement, privacy policy

## Images

**Hero Images Required**:
- Homepage hero: Compelling medical mission scene (doctors with patients, community health work, smiling beneficiaries)
- Each program page: Specific to program (medical outreach, health education, healthcare training)

**Supporting Images**:
- Impact stories: Real photos of beneficiaries and volunteers in action
- Event listings: Event-specific photos
- Team/About page: Staff and volunteer portraits
- All images: Authentic, diverse, high-quality, properly compressed

## Accessibility Features

- Alt text for all images (descriptive, context-aware)
- ARIA labels on interactive elements
- Keyboard navigation: Focus states visible (ring-2 ring-offset-2)
- Minimum touch targets: 44x44px (min-h-11 min-w-11)
- Form labels always visible (no placeholder-only)
- High contrast text ratios
- Skip-to-content link for screen readers
- Accessibility widget: Font size adjuster, contrast toggle (positioned bottom-right)

## Responsive Breakpoints

- Mobile: 0-768px (single column, stacked navigation, full-width CTAs)
- Tablet: 768-1024px (2-column grids, hybrid navigation)
- Desktop: 1024px+ (full multi-column layouts, horizontal navigation)

**Mobile-First Priorities**:
- Sticky Donate button always visible
- Tap targets 44x44px minimum
- Readable font sizes without zooming (16px base minimum)
- Simplified navigation (hamburger menu)
- Single-column forms

## Animations

**Minimal, purposeful only**:
- Subtle fade-in on scroll for sections (opacity + translateY)
- Hover states on cards: slight lift and shadow
- Button hovers: No custom animations (use framework defaults)
- Page transitions: Smooth, fast (200-300ms)
- **NO** parallax, **NO** complex scroll effects, **NO** auto-playing carousels

## Key Page Structures

**Homepage**: Hero → Impact Metrics → Programs (3-column) → Latest News (2-column) → Testimonials → CTA Section → Footer

**Programs Page**: Hero → Program Grid (3-column) → Each program links to dedicated page

**Individual Program**: Hero → Overview → Statistics → Success Stories → "Support This Program" CTA

**Events**: Filter Bar → Event Grid (3-column) → Pagination

**Donate**: Centered form with impact messaging, trust badges, minimal fields

**Portal Login**: Centered login card, simple email/password, "Forgot Password" link

This design prioritizes trust, clarity, and conversion while maintaining accessibility and performance standards critical for nonprofit success.