# Tasks: SEO + UI Polish + Inference Engine Fix

## Inference Engine Tasks (P0) (AgentArquitecto + AgentPerformance)
- [ ] T1.1: Fix duplicate macOS + gaming warning (lines 130, 181)
- [ ] T1.2: Fix ChromeOS warning inside macOS block (line 183 — dead code)
- [ ] T1.3: Set missing flags (`prioritizeGaming`, `prioritizeScreenQuality`) based on answers
- [ ] T1.4: Fix RAM comparison logic (line 238-240 false positive)
- [ ] T1.5: Fix `bestModels` filter returning undefined (line 271)
- [ ] T1.6: Fix `forceAppleSpecs` order — zero graphics BEFORE gaming scoring
- [ ] T1.7: Fix `answers.mainUse` as string `'full_use'` crashing `.map()` in display
- [ ] T1.8: Fix `checked` expression crashing when `answers[current.id]` is string
- [ ] T1.9: Add `gamesType` scoring: `complex` → +3 graphics, `simple` → +1
- [ ] T1.10: Add `photoVideo: 'basic'` → +1 graphics, +1 storage
- [ ] T1.11: Fix `normalize()` in `matchLaptopClass.jsx` (strips M1/M2/M3)
- [ ] T1.12: Fix price parsing for "$X,XXX MXN" format
- [ ] T1.13: Fix GPU matching logic (partial matches)
- [ ] T1.14: Fix OS fallback showing wrong models
- [ ] T1.15: Add proper fallback when no models match
- [ ] T1.16: Update `laptopModels.js` with current data
- [ ] T1.17: Add ErrorBoundary around Recommendation component

## SEO Tasks (AgentArquitecto + AgentResearch)
- [ ] T2.1: Install `react-helmet-async`
- [ ] T2.2: Add dynamic Helmet meta tags to Landing route
- [ ] T2.3: Add dynamic Helmet meta tags to Quiz route
- [ ] T2.4: Add dynamic Helmet meta tags to Results (dynamic description)
- [ ] T2.5: Add Open Graph tags (og:title, og:description, og:image, og:url, og:type)
- [ ] T2.6: Add Twitter Card tags
- [ ] T2.7: Add JSON-LD structured data (WebApplication schema)
- [ ] T2.8: Create `public/sitemap.xml`
- [ ] T2.9: Create `public/robots.txt`
- [ ] T2.10: Change `index.html` `lang="en"` to `lang="es-MX"`
- [ ] T2.11: Add semantic HTML wrapper in `App.jsx` (header, main, footer)
- [ ] T2.12: Fix all `alt` attributes on images

## UI Polish Tasks (AgentQA + AgentPerformance)
- [ ] T3.1: Add CSS variables to `index.css` (colors, spacing, typography, shadows)
- [ ] T3.2: Fix global `button` selector leaking styles
- [ ] T3.3: Fix `100dvw` causing horizontal scrollbar
- [ ] T3.4: Remove inline styles — move to CSS classes
- [ ] T3.5: Landing page — reduce visual density, more whitespace, modern typography
- [ ] T3.6: Landing page — responsive breakpoints (320px, 768px, 1024px)
- [ ] T3.7: Quiz — add progress indicator (clean bar or "X de 10")
- [ ] T3.8: Quiz — add back navigation button
- [ ] T3.9: Quiz — change "Siguiente" to "Ver resultados" on last question
- [ ] T3.10: Quiz — smooth transitions between questions (subtle fade)
- [ ] T3.11: Recommendation — progressive disclosure on results (specs first, details on demand)
- [ ] T3.12: LaptopCard — modern design (shadow, rounded corners, clean typography)
- [ ] T3.13: LaptopCard — image object-fit, fallback on broken URLs
- [ ] T3.14: Add focus-visible styles (subtle)
- [ ] T3.15: Ensure WCAG AA contrast on all text (4.5:1 minimum)
- [ ] T3.16: Add hover states to interactive elements

## Build & Validation Tasks (KimiBuildWorker + JuniorQwen)
- [ ] T4.1: Run `npm run build` — verify success
- [ ] T4.2: Run `npm run lint` — fix all errors
- [ ] T4.3: Test quiz flow end-to-end (forward + back navigation)
- [ ] T4.4: Verify SEO meta tags render correctly
- [ ] T4.5: Run Lighthouse — SEO ≥ 90, Accessibility ≥ 80
- [ ] T4.6: Test responsive design on mobile viewports
- [ ] T4.7: Test with edge case answer combinations
