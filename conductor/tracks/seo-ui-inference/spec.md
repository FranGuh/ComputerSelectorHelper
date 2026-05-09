# Track: SEO + UI Polish + Inference Engine Fix

## What
Comprehensive upgrade covering three critical areas of ComputerSelectorHelper:
1. **Inference Engine (P0)**: Fix bugs in `convertToSpecs.jsx` and `matchLaptopClass.jsx`, improve scoring logic, add ErrorBoundary
2. **SEO**: Add `react-helmet-async` for dynamic meta tags, Open Graph, structured data, sitemap, semantic HTML
3. **UI Polish**: Modernize current UI — keep the essence but make it cleaner, less overwhelming, more spacious. Add responsive design, accessibility, back navigation, progress indicator.

## Why
- Project is ~1 year old with no SEO (invisible to search engines)
- UI is basic and visually dense — needs modern, clean treatment while keeping the friendly tone and card-based layout
- Inference engine has bugs and incomplete logic (incorrect recommendations in edge cases)
- User requested all three areas addressed together since it's a small project

## Scope
- `index.html` — Change lang to `es-MX`, base meta tags
- `src/App.jsx` — Semantic structure (header, main, footer), ErrorBoundary
- `src/pages/Landing/` — UI modernization, responsive, accessibility
- `src/pages/Quiz/` — UI modernization
- `src/components/Recommendation/` — UI modernization, back navigation, progress indicator, progressive disclosure
- `src/components/LaptopCard/` — Modern card design, image fallback
- `src/utils/convertToSpecs.jsx` — Fix inference bugs, improve logic
- `src/utils/matchLaptopClass.jsx` — Fix matching logic, improve scoring
- `src/utils/laptopModels.js` — Update/validate laptop data
- `public/sitemap.xml` — New file
- `public/robots.txt` — New file
- New dependency: `react-helmet-async`

## UI Design Direction
- **Inspire from current UI** — keep the color palette essence, card-based layout, friendly tone
- **Modernize** — more whitespace, cleaner typography, subtle shadows, rounded corners
- **Less overwhelming** — fewer competing visual elements, clearer hierarchy, progressive disclosure on results
- **Accessible** — WCAG AA contrast, focus-visible, semantic HTML, aria labels

## Out of Scope
- Adding new quiz questions (separate track)
- Backend/API integration (not applicable)
- Real-time price fetching (explicitly a non-goal)
- Share/export results feature (separate track)
- TypeScript migration (separate track)
