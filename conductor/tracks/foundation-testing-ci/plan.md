# Implementation Plan — Foundation Testing CI

## Phase Order & Dependencies

```
Phase 1: Testing Setup (no dependencies)
    ↓
Phase 2: Inference Engine Tests (depends on Phase 1)
    ↓
Phase 3: Component Tests (depends on Phase 1)
    ↓
Phase 4: CI/CD Pipeline (depends on Phase 2+3 having tests)
    ↓
Phase 5: Pre-commit Hooks (depends on Phase 4)
    ↓
Phase 6: Comparison View (parallel with Phase 1-5)
    ↓
Phase 7: Shareable Links (parallel with Phase 1-5)
```

## Phase 1: Testing Setup

**Files**: `vitest.config.js`, `package.json` (scripts), `src/__tests__/setup.js`
**Steps**:
1. Install: `npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom`
2. Create `vitest.config.js` with `environment: 'jsdom'`
3. Add scripts: `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:coverage": "vitest run --coverage"`
4. Create setup file for RTL matchers
5. Verify: `npm run test` runs with zero tests (passes)

## Phase 2: Inference Engine Tests

**Files**: `src/__tests__/convertToSpecs.test.jsx`, `src/__tests__/matchLaptopClass.test.jsx`
**Test Cases**:
- `convertToSpecs`:
  - Basic quiz answers → valid spec profile
  - Gaming use case → high GPU score, prioritizeGaming flag
  - Content creation → high RAM, storage, screen quality flag
  - Budget constraints → appropriate spec tier
  - macOS + gaming → warning flag
  - ChromeOS + heavy tasks → warning flag
  - Empty answers → graceful fallback
  - Conflicting answers → resolved spec profile
  - Apple Silicon matching (M1/M2/M3 not stripped by normalize)
  - RAM comparison (string vs number edge cases)
- `matchLaptopClass`:
  - Strict matching returns correct models
  - Relaxed matching widens budget ~30%
  - GPU scoring tiers correct
  - No matches → returns empty array (not generic class)
  - OS filter works correctly
  - Generic class excluded from OS filter

## Phase 3: Component Tests

**Files**: `src/__tests__/Recommendation.test.jsx`, `src/__tests__/LaptopCard.test.jsx`
**Test Cases**:
- `Recommendation`:
  - Quiz renders with first question
  - Answering questions advances step
  - Back navigation works
  - Results page shows laptop cards
  - Fallback UI shows when no matches
  - localStorage persistence (mock)
  - ErrorBoundary catches render errors
- `LaptopCard`:
  - Renders with all props
  - Image fallback shows on error
  - Match score displays correctly
  - Price formatted in MXN

## Phase 4: CI/CD Pipeline

**Files**: `.github/workflows/ci.yml`
**Steps**:
1. Create workflow triggering on `push` and `pull_request` to `main`
2. Steps: checkout → setup Node 22.x → cache → `npm ci` → `npm run lint` → `npm run test` → `npm run build`
3. Add status badge to `README.md`
4. Verify: push to branch, confirm workflow runs

## Phase 5: Pre-commit Hooks

**Files**: `.husky/pre-commit`, `.husky/pre-push`, `package.json` (lint-staged config)
**Steps**:
1. Install: `npm i -D husky lint-staged`
2. Run: `npx husky init`
3. Configure `lint-staged` in `package.json`: `{"src/**/*.{js,jsx}": ["eslint --fix", "git add"]}`
4. Add `pre-push` hook: `npm run build`
5. Run `eslint --fix .` to clean existing violations first
6. Verify: commit with lint error → blocked

## Phase 6: Comparison View

**Files**: `src/components/Comparison/Comparison.jsx`, `src/components/Comparison/Comparison.css`, `src/routes/AppRoutes.jsx` (add route), `src/components/LaptopCard/LaptopCard.jsx` (add checkbox)
**Steps**:
1. Add "Compare" checkbox to `LaptopCard` (controlled by parent state)
2. Create `Comparison` component with side-by-side table
3. Highlight differences: compare each spec, mark better/worse
4. Add route `/compare` in `AppRoutes.jsx`
5. Mobile: stacked cards with sticky labels
6. Desktop: 2-3 column table
7. Accessibility: proper `<table>`, `<th>`, `aria-label`
8. Test: select 2-3 laptops, verify comparison renders correctly

## Phase 7: Shareable Links

**Files**: `src/utils/encodeResults.js`, `src/utils/decodeResults.js`, `src/components/Recommendation/Recommendation.jsx` (add share buttons), `src/routes/AppRoutes.jsx` (handle URL params)
**Steps**:
1. Create `encodeResults(answers, result)` → base64 string
2. Create `decodeResults(encoded)` → parsed answers + result
3. Add URL param handling in `Recommendation.jsx`: if `?r=<data>`, decode and show results
4. Add "Copy link" button → copies `window.location.href` to clipboard
5. Add "Share on WhatsApp" button → opens `wa.me/?text=<message>`
6. Handle invalid/expired URLs → redirect to quiz with error message
7. Test: encode results, paste URL in new tab, verify results restore

## Estimated Effort

| Phase | Days | Complexity |
|-------|------|------------|
| 1. Testing Setup | 0.5 | Low |
| 2. Inference Tests | 1.5 | Medium |
| 3. Component Tests | 1 | Medium |
| 4. CI/CD Pipeline | 0.5 | Low |
| 5. Pre-commit Hooks | 0.5 | Low |
| 6. Comparison View | 1.5 | Medium |
| 7. Shareable Links | 1 | Medium |
| **Total** | **~6.5 days** | |

## Parallel Execution

- Phases 1-5 can run sequentially (foundation)
- Phases 6-7 can run in parallel with 1-5 (feature work, no dependencies on tests)
- Recommended: 2 agents — one on foundation (1-5), one on features (6-7)
