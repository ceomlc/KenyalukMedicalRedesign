# Kenyaluk Medical Foundation - Modern Marketing Design System

## Design Philosophy

**Modern Marketing Meets Mission**: Inspired by leading SaaS and marketing websites (v0 templates, Vercel, Linear), we blend bold contemporary aesthetics with nonprofit credibility. The design uses smooth animations, gradient treatments, and engaging micro-interactions while maintaining trust and accessibility.

**Core Principles**: 
- **Bold & Confident**: Large typography, generous whitespace, clear visual hierarchy
- **Fluid & Dynamic**: Subtle animations that respond to user interaction and scroll
- **Trust Through Design**: Professional polish signals credibility and impact
- **Conversion-Optimized**: Clear CTAs, minimal friction, emotionally resonant

## Typography System

**Font Stack**: 
- **Headlines**: Inter (Bold/Extrabold) - modern, geometric, excellent at large sizes
- **Body**: Inter (Regular/Medium) - superior readability, consistent family
- **Accent/Numbers**: Inter (Semibold/Bold) with tabular figures for metrics

**Scale (Fluid Typography)**:
```
Hero Headline:     text-5xl  md:text-6xl  lg:text-7xl  xl:text-8xl  (font-bold)
Section Headers:   text-4xl  md:text-5xl  lg:text-6xl           (font-semibold)
Subsection:        text-2xl  md:text-3xl  lg:text-4xl           (font-semibold)
Lead Paragraph:    text-lg   md:text-xl   lg:text-2xl           (leading-relaxed)
Body Text:         text-base md:text-lg                         (leading-relaxed)
Small/Caption:     text-sm   md:text-base                       (text-muted-foreground)
CTA Buttons:       text-base md:text-lg                         (font-semibold)
```

**Typography Treatments**:
- Gradient text for key headlines: `bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent`
- Letter spacing on CTAs: `tracking-wide uppercase`
- Line height generous: `leading-relaxed` (1.625) for body, `leading-tight` (1.25) for headings

## Color System

**Base Palette** (Defined in index.css):
```css
--background: 0 0% 100%;           /* Pure white */
--foreground: 222 47% 11%;         /* Deep navy for text */

--primary: 203 89% 24%;            /* Medical blue - trust, authority */
--primary-foreground: 0 0% 100%;   

--accent: 142 76% 36%;             /* Medical green - growth, health */
--accent-foreground: 0 0% 100%;

--muted: 210 40% 96%;              /* Subtle background variation */
--muted-foreground: 215 16% 47%;   /* Secondary text */

--card: 0 0% 100%;
--card-foreground: 222 47% 11%;

--border: 214 32% 91%;             /* Subtle dividers */
```

**Gradient Treatments**:
- **Hero Overlays**: `from-black/70 via-black/50 to-black/60` over images
- **Accent Gradients**: `from-primary to-primary/60` for static backgrounds
- **Subtle Backgrounds**: `from-muted to-background` for section backgrounds
- **Interactive Elements**: Use hover-elevate class for automatic hover states (no custom gradients)

## Layout System

**Spacing Scale** (Tailwind-based):
```
Micro:    gap-2, gap-3           (8px, 12px)
Small:    gap-4, p-4             (16px)
Medium:   gap-6, p-6, py-12      (24px, 48px)
Large:    gap-8, p-8, py-16      (32px, 64px)
XLarge:   gap-12, p-12, py-20    (48px, 80px)
XXLarge:  gap-16, py-24          (64px, 96px)
```

**Container System**:
```
Max width:     max-w-7xl mx-auto px-4 md:px-6 lg:px-8
Content:       max-w-6xl mx-auto
Narrow:        max-w-4xl mx-auto (forms, single column)
Text:          max-w-3xl (optimal reading width)
```

**Grid Patterns**:
- Feature grids: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8`
- Two-column: `grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center`
- Asymmetric: `grid grid-cols-1 lg:grid-cols-5 gap-12` (content in 3 cols, image in 2)

## Component Design Patterns

### Navigation Header
**Modern sticky nav** with blur background:
```
- Use component default heights (no manual h-* classes)
- Background: bg-background/80 backdrop-blur-lg border-b
- Logo (left), nav links (center/left), Donate CTA (right)
- Mobile: Sheet/slide-in menu from right
- Sticky with smooth shadow transition on scroll
- Donate button: size="default" variant="default" (component sizing only)
```

### Hero Sections

**Homepage Hero** (Full-screen impact):
```
Structure:
- min-h-[600px] md:min-h-[700px] lg:min-h-[800px]
- Background image with dark gradient overlay (from-black/70 via-black/50 to-transparent)
- Centered content with animated entrance (fade-up on load)
- Large headline (text-5xl to text-8xl)
- Lead paragraph (text-xl to text-2xl)
- CTA button group with backdrop blur effects
- Floating elements: Subtle animated shapes or gradients in background
- Trust indicator below CTAs: "10,000+ lives impacted"

Animation:
- Hero content: fade-in with slide-up (translateY) on page load (entry animation only)
- Background: Static or subtle gradient shift only (no zoom/pan effects)
- CTAs: Use hover-elevate for background color elevation (no transforms)
```

**Interior Page Heroes** (Compact):
```
- min-h-[400px] md:min-h-[500px]
- Similar gradient treatment
- Breadcrumb navigation above title
- Centered or left-aligned based on content
```

### Card Components

**Program/Feature Cards**:
```
Structure:
- Card with rounded-lg, border, subtle shadow
- Image: aspect-video with rounded-t-lg, object-cover
- Content: p-6 md:p-8
- Icon: h-12 w-12, positioned top-left or above title
- Title: text-xl md:text-2xl font-semibold
- Description: text-muted-foreground leading-relaxed
- CTA: Link or button at bottom

Hover State:
- transition-all duration-300
- hover:-translate-y-1 hover:shadow-lg
- Subtle border color shift using hover-elevate class
- Card lifts as single unit (no individual element transforms)
```

**Event Cards**:
```
- Date badge: Absolute position top-right, bg-primary text-primary-foreground
- Location icon and text
- Registration CTA button
- Hover: entire card lifts with shadow
```

**Testimonial/Story Cards**:
```
- Quote in large italic text
- Avatar: circular, 60x60px
- Name and role below
- Optional: Decorative quote marks as background element
- Subtle background: bg-muted/50 or bg-gradient-to-br from-muted to-background
- Full border if needed: border border-border rounded-lg
```

### Impact Metrics Section

**Animated counter display**:
```
Grid: grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12
Each stat:
- Number: text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent
- Label: text-lg text-muted-foreground
- Optional: Icon above number
- Animation: Count-up on scroll into view (use framer-motion or simple JS)
```

### Forms

**Donation Form**:
```
Container: max-w-2xl mx-auto
Layout:
- Recurring toggle (pill-style): bg-muted rounded-full p-1, active state bg-background
- Amount grid: 3x2 or 2x3 grid, use Button size="lg" for each amount option
  - Selected: border-primary border-2 bg-primary/5
  - Impact text below amount: "Provides medical kits for 5 families"
- Custom amount: Use Input component with default sizing
- Stripe Elements: Styled to match design system
- Trust indicators: Row of icons (lock, payment logos, "Secure")
- CTA: Full-width, size="lg" (use component sizing only)
```

**Contact/Volunteer Forms**:
```
- Single column, max-w-xl
- Each field: Label above, use Input/Textarea components with default sizing
- Focus states: ring-2 ring-primary/20
- Submit: Button size="lg", full-width on mobile, auto-width on desktop
- Success state: Slide-in confirmation with checkmark animation
```

### CTA Sections

**Inline CTAs** (between sections):
```
- Full-width background: bg-primary or bg-gradient-to-r from-primary to-accent
- Text: text-primary-foreground
- Centered content: max-w-4xl
- Headline: text-3xl md:text-4xl font-bold
- Description: text-lg md:text-xl
- Button: variant="secondary" or variant="outline" with backdrop-blur
- Padding: py-16 md:py-20
```

## Animation System

**Scroll-Triggered Animations**:
```typescript
// Use Intersection Observer or framer-motion
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

// Apply to sections as they enter viewport
// Stagger children for sequential animation
```

**Interaction Animations** (NO layout changes on hover):
- **Buttons**: Use built-in hover-elevate and active-elevate-2 classes (automatic background elevation)
- **Cards**: `transition-all duration-300 hover:-translate-y-2 hover:shadow-xl` (lift, not scale)
- **Images**: Keep at 100% size, use parent card's hover state for visual feedback
- **Links**: `transition-colors duration-200 hover:text-primary`
- **Icons**: `transition-colors duration-200` only, no transforms

**Floating Elements** (Hero backgrounds):
```
- Gradient orbs: Absolute positioned circles with blur
- Slow floating animation: translateY and translateX with different durations
- Low opacity: 10-20%
- Behind content: z-index lower than text
```

**Micro-interactions**:
- Focus rings: `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`
- Loading states: Skeleton screens with shimmer effect
- Success: Checkmark with fade-in animation (no scale)
- Error: Border color pulse with red highlight (no shake)

## Responsive Design

**Breakpoint Strategy**:
```
Mobile:     0-768px   (Stack everything, large touch targets)
Tablet:     768-1024px (2-column grids, hybrid layouts)  
Desktop:    1024px+   (Full multi-column, advanced layouts)
```

**Mobile-First Priorities**:
1. Single-column layouts
2. Sticky donate button (bottom-right FAB on mobile)
3. Simplified navigation (sheet menu)
4. Touch targets: Use component defaults (Button size="default" or size="lg" provides 44px targets)
5. Readable text: 16px minimum base size
6. Reduced animation complexity

## Imagery Guidelines

**Hero Images**:
- High quality, authentic, emotionally resonant
- Minimum 1920x1080px resolution
- Optimized for web (WebP, compressed)
- Dark overlay gradient always applied for text contrast
- Focus on people, action, impact

**Supporting Images**:
- Programs: Action shots of medical work, education, training
- Events: Wide shots showing community, engagement
- Stories: Close-ups of beneficiaries, volunteers (with consent)
- All images: Alt text required, context-aware descriptions

## Accessibility Standards

**WCAG 2.1 Level AA Compliance**:
- Color contrast: 4.5:1 for normal text, 3:1 for large text
- Keyboard navigation: Full access, visible focus states
- Screen readers: ARIA labels, semantic HTML, skip links
- Touch targets: Minimum 44x44px
- Form labels: Always visible, never placeholder-only
- Animation: Respect `prefers-reduced-motion` media query

**Accessibility Widget** (bottom-right):
- Font size controls (+/-)
- High contrast toggle
- Keyboard navigation guide
- Not intrusive to main experience

## Page Structure Templates

**Homepage**:
```
1. Hero (full-screen with animated elements)
2. Trust Bar (logos of partners or stats)
3. Impact Metrics (animated counters)
4. Programs Grid (3-column cards with hover effects)
5. Latest News (2-column featured + grid)
6. Testimonials (Carousel or grid)
7. CTA Section (full-width with gradient)
8. Footer
```

**Programs Listing**:
```
1. Hero (medium height with breadcrumb)
2. Program Grid (3-column cards, each links to detail)
3. Impact metrics specific to all programs
4. CTA Section
5. Footer
```

**Individual Program**:
```
1. Hero (program-specific image)
2. Overview (2-column: text + stats)
3. Success Stories (alternating image/text)
4. Impact Metrics (program-specific)
5. CTA "Support This Program"
6. Footer
```

**Events Page**:
```
1. Hero (compact)
2. Filter Bar (sticky on scroll)
3. Events Grid (3-column cards)
4. Pagination
5. CTA "View All Past Events"
6. Footer
```

**Donate Page**:
```
1. Centered form (max-w-2xl)
2. Impact messaging sidebar (optional)
3. Trust indicators
4. Secure payment (Stripe)
5. Thank you confirmation (inline or redirect)
```

## Dark Mode Support

**Toggle Implementation**:
- Switch in header (moon/sun icon)
- Smooth transition: `transition-colors duration-300`
- Store preference in localStorage

**Dark Theme Colors**:
```css
.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  --primary: 203 89% 54%;    /* Lighter blue for dark mode */
  --accent: 142 76% 46%;     /* Lighter green */
  --muted: 217 33% 17%;
  --border: 217 33% 22%;
}
```

## Performance Guidelines

- **Images**: WebP format, lazy loading, responsive srcset
- **Animations**: CSS transforms (GPU-accelerated), avoid layout thrashing
- **Fonts**: Subset Inter, preload critical weights
- **CSS**: Tailwind purge, minimize custom CSS
- **JavaScript**: Code splitting, dynamic imports for animations
- **Target**: Lighthouse score >90 for all metrics

---

## Implementation Checklist

When building each page:
- [ ] Mobile-first responsive design
- [ ] Scroll-triggered fade-in animations
- [ ] Hover states on all interactive elements
- [ ] Proper semantic HTML
- [ ] ARIA labels where needed
- [ ] Alt text on all images
- [ ] Loading/error states for forms
- [ ] Dark mode compatible
- [ ] Performance optimized (lazy load, WebP)
- [ ] Test with keyboard navigation
- [ ] Test with screen reader

This design system creates a modern, engaging experience that builds trust while maintaining the mission-driven focus essential for nonprofit success.
