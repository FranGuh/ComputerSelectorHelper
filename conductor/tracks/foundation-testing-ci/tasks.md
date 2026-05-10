# Tasks — Foundation Testing CI

## Phase 1: Testing Setup

### Task 1.1: Install Testing Dependencies
- [ ] `npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom`
- [ ] Verify installation: `npm ls vitest`

### Task 1.2: Configure Vitest
- [ ] Create `vitest.config.js` with `environment: 'jsdom'`
- [ ] Add scripts to `package.json`:
  - `"test": "vitest run"`
  - `"test:watch": "vitest"`
  - `"test:coverage": "vitest run --coverage"`
- [ ] Create `src/__tests__/setup.js` with RTL matchers
- [ ] Verify: `npm run test` passes with zero tests

## Phase 2: Inference Engine Tests

### Task 2.1: Test convertToSpecs.jsx
- [ ] Test: Basic quiz answers → valid spec profile
- [ ] Test: Gaming use case → high GPU score, `prioritizeGaming` flag
- [ ] Test: Content creation → high RAM, storage, `prioritizeScreenQuality` flag
- [ ] Test: Budget constraints → appropriate spec tier
- [ ] Test: macOS + gaming → warning flag
- [ ] Test: ChromeOS + heavy tasks → warning flag
- [ ] Test: Empty answers → graceful fallback
- [ ] Test: Conflicting answers → resolved spec profile
- [ ] Test: Apple Silicon matching (M1/M2/M3 not stripped)
- [ ] Test: RAM comparison (string vs number edge cases)

### Task 2.2: Test matchLaptopClass.jsx
- [ ] Test: Strict matching returns correct models
- [ ] Test: Relaxed matching widens budget ~30%
- [ ] Test: GPU scoring tiers correct
- [ ] Test: No matches → returns empty array (not generic class)
- [ ] Test: OS filter works correctly
- [ ] Test: Generic class excluded from OS filter

## Phase 3: Component Tests

### Task 3.1: Test Recommendation.jsx
- [ ] Test: Quiz renders with first question
- [ ] Test: Answering questions advances step
- [ ] Test: Back navigation works
- [ ] Test: Results page shows laptop cards
- [ ] Test: Fallback UI shows when no matches
- [ ] Test: localStorage persistence (mock)
- [ ] Test: ErrorBoundary catches render errors

### Task 3.2: Test LaptopCard.jsx
- [ ] Test: Renders with all props
- [ ] Test: Image fallback shows on error
- [ ] Test: Match score displays correctly
- [ ] Test: Price formatted in MXN

## Phase 4: CI/CD Pipeline

### Task 4.1: Create GitHub Actions Workflow
- [ ] Create `.github/workflows/ci.yml`
- [ ] Configure triggers: `push` and `pull_request` to `main`
- [ ] Steps: checkout → setup Node 22.x → cache → `npm ci` → `npm run lint` → `npm run test` → `npm run build`
- [ ] Add status badge to `README.md`
- [ ] Test: push to branch, confirm workflow runs and passes

## Phase 5: Pre-commit Hooks

### Task 5.1: Setup Husky + lint-staged
- [ ] Install: `npm i -D husky lint-staged`
- [ ] Run: `npx husky init`
- [ ] Configure `lint-staged` in `package.json`
- [ ] Create `.husky/pre-commit` with lint-staged
- [ ] Create `.husky/pre-push` with `npm run build`
- [ ] Run `eslint --fix .` to clean existing violations
- [ ] Test: commit with lint error → blocked

## Phase 6: Comparison View

### Task 6.1: Add Compare Checkbox to LaptopCard
- [ ] Add checkbox prop to `LaptopCard`
- [ ] Controlled by parent state in `Recommendation.jsx`
- [ ] Floating bottom bar appears when 2-3 selected
- [ ] "Compare X laptops" button opens `/compare` route

### Task 6.2: Create Comparison Component
- [ ] Create `src/components/Comparison/Comparison.jsx`
- [ ] Create `src/components/Comparison/Comparison.css`
- [ ] Side-by-side table with spec comparison
- [ ] Highlight differences: green = better, red = worse
- [ ] Mobile: stacked cards with sticky labels
- [ ] Desktop: 2-3 column table
- [ ] Accessibility: proper `<table>`, `<th>`, `aria-label`

### Task 6.3: Add Comparison Route
- [ ] Add `/compare` route in `AppRoutes.jsx`
- [ ] Pass selected laptops via state or context
- [ ] Handle direct navigation (no laptops selected → redirect)
- [ ] Test: select 2-3 laptops, verify comparison renders

## Phase 7: Shareable Links

### Task 7.1: Create Encoding/Decoding Utilities
- [ ] Create `src/utils/encodeResults.js`
- [ ] Create `src/utils/decodeResults.js`
- [ ] Encode: `btoa(JSON.stringify({ answers, result }))`
- [ ] Decode: `JSON.parse(atob(encoded))`
- [ ] Add validation on decode
- [ ] Handle invalid/expired data gracefully

### Task 7.2: Add URL Param Handling
- [ ] Modify `Recommendation.jsx` to check for `?r=<data>` on mount
- [ ] If present, decode and restore results view
- [ ] If invalid, redirect to quiz with error message
- [ ] Test: encode results, paste URL in new tab, verify restore

### Task 7.3: Add Share Buttons
- [ ] "Copy link" button → copies `window.location.href` to clipboard
- [ ] "Share on WhatsApp" button → opens `wa.me/?text=<message>`
- [ ] Message format: "Me recomiendan estas laptops: [link]"
- [ ] Test: copy link, paste in new tab, verify results
- [ ] Test: share on WhatsApp, verify message format
