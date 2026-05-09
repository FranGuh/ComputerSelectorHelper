# Acceptance Criteria: SEO + UI + Inference Engine Fix

## Inference Engine (P0)
- [ ] No duplicate warnings in recommendations
- [ ] ChromeOS warning NOT inside macOS block
- [ ] `prioritizeGaming` and `prioritizeScreenQuality` flags properly set
- [ ] RAM comparison doesn't trigger false warnings
- [ ] `gamesType` affects scoring (`complex` → +3 graphics, `simple` → +1)
- [ ] `photoVideo: 'basic'` adds +1 graphics, +1 storage
- [ ] `normalize()` doesn't strip M1/M2/M3 from Apple GPUs
- [ ] Price parsing works for "$X,XXX MXN" format
- [ ] GPU matching works for partial matches
- [ ] OS fallback doesn't show wrong-OS models
- [ ] Fallback shows generic models when no exact match
- [ ] `laptopModels.js` has at least 15 models with current data
- [ ] ErrorBoundary catches crashes and shows friendly message + retry button
- [ ] `full_use` display doesn't crash (string vs array)
- [ ] `forceAppleSpecs` doesn't zero out gaming score after it's added

## SEO
- [ ] `react-helmet-async` installed and working
- [ ] Dynamic meta tags per route (Landing, Quiz, Results)
- [ ] Open Graph tags present (og:title, og:description, og:image, og:url, og:type)
- [ ] Twitter Card tags present
- [ ] JSON-LD structured data present (WebApplication schema)
- [ ] `public/sitemap.xml` exists with correct URLs
- [ ] `public/robots.txt` exists and allows crawling
- [ ] `index.html` has `lang="es-MX"`
- [ ] All images have descriptive `alt` attributes
- [ ] `App.jsx` uses semantic HTML (header, main, footer)

## UI Polish
- [ ] CSS variables defined in `index.css` (colors, spacing, typography, shadows)
- [ ] No global `button` selector leaking styles
- [ ] No `100dvw` causing horizontal scrollbar
- [ ] No inline styles (moved to CSS classes)
- [ ] Landing page: reduced visual density, more whitespace, modern typography
- [ ] Landing page responsive at 320px, 768px, 1024px
- [ ] Quiz has progress indicator
- [ ] Quiz has back navigation button
- [ ] Last question button says "Ver resultados"
- [ ] Smooth transitions between questions
- [ ] Result page uses progressive disclosure
- [ ] LaptopCard: modern design (shadow, rounded corners, clean typography)
- [ ] LaptopCard images use object-fit, have fallback
- [ ] Focus-visible styles present on interactive elements
- [ ] All text meets WCAG AA contrast (4.5:1 minimum)
- [ ] Hover states on buttons and cards
- [ ] UI keeps essence of original design (color palette, card layout, friendly tone)

## Build & Validation
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` passes with no errors
- [ ] Quiz flow works end-to-end (forward + back + results + reset)
- [ ] Meta tags visible in page source per route
- [ ] No console errors in browser dev tools
- [ ] Lighthouse: SEO ≥ 90, Accessibility ≥ 80
