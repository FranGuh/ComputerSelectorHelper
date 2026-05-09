# Plan: SEO + UI Polish + Inference Engine Fix

## Phase 1: Inference Engine Fix (P0) (AgentArquitecto + AgentPerformance)
1. Audit `convertToSpecs.jsx` for bugs:
   - Fix duplicate warning for macOS + gaming (lines 130, 181)
   - Fix contradictory ChromeOS + gaming warning (line 183 inside macOS block — dead code)
   - Fix `prioritizeGaming` and `prioritizeScreenQuality` flags never set
   - Fix RAM ideal vs real comparison (line 238-240 always triggers false positive)
   - Fix `bestModels` filter can return undefined (line 271)
   - Fix `forceAppleSpecs` zeroing graphics score AFTER gaming scoring (order bug)
   - Fix `answers.mainUse` as string `'full_use'` crashing `.map()` in display
   - Fix `checked` expression crashing when `answers[current.id]` is string
2. Improve scoring logic:
   - Add `gamesType`: `complex` → +3 graphics, `simple` → +1 graphics, `none` → 0
   - Add `photoVideo: 'basic'` → +1 graphics, +1 storage
   - Add weight for budget constraints in scoring
   - Better handling of `full_use` edge cases
3. Fix `matchLaptopClass.jsx`:
   - Fix `normalize()` function removing too much (strips M1/M2/M3, breaks Apple matching)
   - Fix price parsing for formatted strings like "$14,999 MXN"
   - Fix GPU matching logic (too strict/loose)
   - Fix fallback showing ALL models (including wrong OS) when OS filter returns empty
   - Add proper fallback when no models match
4. Update `laptopModels.js` with current models and prices
5. Add ErrorBoundary around Recommendation component

## Phase 2: SEO (AgentArquitecto + AgentResearch)
1. Install `react-helmet-async`
2. Add dynamic meta tags per route via Helmet:
   - Landing: title, description, keywords, OG tags, Twitter Cards
   - Quiz: title, description, OG tags
   - Results: dynamic description based on recommendations
3. Add JSON-LD structured data (WebApplication schema)
4. Create `public/sitemap.xml`
5. Create `public/robots.txt`
6. Change `index.html` `lang="en"` to `lang="es-MX"`
7. Add semantic HTML in `App.jsx` (main, header, footer)
8. Add proper `alt` attributes to all images

## Phase 3: UI Polish — Modern, Simple, Clean (AgentQA + AgentPerformance)

**Design Direction**: Inspire from current UI but modernize it. Keep the essence (color palette, card-based layout, friendly tone) but make it less overwhelming. Modern, clean, spacious. Think: fewer visual elements competing for attention, more whitespace, clearer hierarchy.

1. Landing page:
   - Reduce visual density — more whitespace, fewer competing sections
   - Keep current friendly tone and benefit/warning structure
   - Improve typography hierarchy (larger headings, better line-height)
   - Add responsive breakpoints (320px, 768px, 1024px)
   - Subtle hover/focus states (not flashy)
   - Improve color contrast for WCAG AA
2. Quiz/Recommendation:
   - Add progress indicator (clean bar or "X de 10" text)
   - Add back navigation button
   - Change "Siguiente" to "Ver resultados" on last question
   - Improve card layouts — less clutter, more breathing room
   - Add smooth transitions between questions (subtle fade)
   - Result page: progressive disclosure (specs first, then details on demand)
3. LaptopCard:
   - Modern card design — subtle shadow, rounded corners, clean typography
   - Image handling: object-fit, fallback on broken URLs
   - Price display: clear, prominent
   - Keep "Ver en tienda" button but make it secondary style
4. Global:
   - CSS variables for theming (colors, spacing, typography, shadows)
   - Ensure WCAG AA contrast minimum (4.5:1)
   - Add focus-visible styles (subtle, not intrusive)
   - Remove inline styles — move to CSS classes
   - Fix global `button` selector leaking styles
   - Fix `100dvw` causing horizontal scrollbar
   - Test on mobile viewports

## Phase 4: Cross-Review (All Agents)
1. All agents review each other's work
2. Document issues found
3. Fix critical issues
4. Run build and lint

## Phase 5: Testing & Validation (KimiBuildWorker + JuniorQwen)
1. Run `npm run build` — must succeed
2. Run `npm run lint` — must pass
3. Manual testing of quiz flow (forward + back navigation)
4. Verify SEO with meta tag inspection + Lighthouse
5. Test responsive breakpoints
6. Lighthouse target: SEO ≥ 90, Accessibility ≥ 80
