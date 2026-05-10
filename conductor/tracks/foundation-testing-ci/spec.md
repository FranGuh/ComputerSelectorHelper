# Track: Foundation — Testing + CI/CD + Comparison + Sharing

## What

Build the technical foundation for safe future development while delivering the two most-requested user-facing features:

1. **Automated Testing Suite**: Vitest + React Testing Library with 80% coverage on inference engine
2. **CI/CD Pipeline**: GitHub Actions with lint → test → build on every PR, Husky pre-commit hooks
3. **Results Comparison View**: Side-by-side laptop comparison (2-3 models) with highlighted differences
4. **Shareable Results Link**: URL-encoded quiz results with "Copy link" and "Share on WhatsApp" buttons

## Why

- **17 inference bugs were fixed with zero tests** — regressions are guaranteed without a safety net
- **No CI/CD** — broken code deploys directly to production on every push to main
- **Users narrow down to 2-3 laptops** and need to compare specs before deciding (consensus from 3 agents)
- **Users want to share results** with family/friends via WhatsApp (critical for Mexican market)
- **Agent consensus**: Testing + CI/CD (3 agents), Comparison (3 agents), Sharing (2 agents) — highest priority features

## Scope

### Testing
- `vitest` + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom`
- Unit tests for `convertToSpecs.jsx` — each question-to-spec mapping, edge cases
- Unit tests for `matchLaptopClass.jsx` — strict/relaxed matching, GPU scoring
- Component tests for `Recommendation.jsx` — quiz flow, results rendering, fallback
- Tests for `LaptopCard.jsx` — rendering, image fallback, props
- Coverage target: 80% on inference engine, 60% overall

### CI/CD
- `.github/workflows/ci.yml` — triggers on push/PR to main
- Steps: `npm ci` → `npm run lint` → `npm run test` → `npm run build`
- Node 22.x with dependency caching
- Fail workflow on any step error
- `husky` + `lint-staged` — ESLint on staged files before commit
- `pre-push` hook — run `npm run build` to catch build-time failures

### Comparison View
- "Compare" checkbox on each `LaptopCard`
- Floating bottom bar when 2-3 selected: "Compare X laptops"
- New route `/compare` with side-by-side table
- Highlight differences: green = better, red = worse
- Mobile: stacked cards with sticky spec labels
- Desktop: 2-3 column table with proper `<th>` headers
- Accessible: `role="region"` per laptop, `aria-label`, text indicators ("✓ Better")

### Shareable Links
- Encode quiz answers + results into URL query params
- Compression via `btoa(JSON.stringify())` to keep URLs reasonable
- "Copy link" button on results page
- "Share on WhatsApp" button with pre-filled message
- URL format: `/results?r=<base64-encoded-data>`
- Decode on load, restore results view
- Fallback: if URL is invalid, redirect to quiz

## Out of Scope

- TypeScript migration (separate track)
- Sentry error tracking (separate track)
- PWA / offline support (separate track)
- Price history / deal alerts (separate track)
- Multi-language / i18n (separate track)
- Buying guides / blog content (separate track)
- Dark mode (separate track)
