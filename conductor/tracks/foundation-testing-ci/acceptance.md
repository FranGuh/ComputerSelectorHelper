# Acceptance Criteria — Foundation Testing CI

## Testing Suite

### Criteria
- [ ] `npm run test` runs all tests and passes
- [ ] Inference engine coverage ≥ 80%
- [ ] Overall project coverage ≥ 60%
- [ ] All 17 previously-fixed bugs have regression tests
- [ ] Edge cases tested: empty answers, conflicting answers, budget extremes
- [ ] Component tests cover: quiz flow, results rendering, fallback UI, error boundary
- [ ] Tests run in < 30 seconds on CI

### Verification
```bash
npm run test
npm run test:coverage
```

## CI/CD Pipeline

### Criteria
- [ ] GitHub Actions workflow triggers on push/PR to main
- [ ] Workflow runs: lint → test → build
- [ ] Workflow fails if any step errors
- [ ] Status badge visible in README.md
- [ ] Workflow completes in < 5 minutes
- [ ] Dependency caching works (second run is faster)

### Verification
- Push to test branch, verify workflow runs in GitHub Actions tab
- Intentionally break a test, verify workflow fails
- Fix test, verify workflow passes

## Pre-commit Hooks

### Criteria
- [ ] `husky` installed and configured
- [ ] `lint-staged` runs ESLint on staged files only
- [ ] Commit with lint error → blocked
- [ ] Commit with clean code → succeeds
- [ ] `pre-push` hook runs `npm run build`
- [ ] Push with build error → blocked
- [ ] Existing codebase has zero lint violations

### Verification
```bash
# Test lint blocking
echo "const x = " >> src/test.js
git add src/test.js
git commit -m "test: should fail"  # Expected: blocked

# Test build blocking
# Introduce syntax error, try to push  # Expected: blocked
```

## Comparison View

### Criteria
- [ ] "Compare" checkbox visible on each laptop card
- [ ] Selecting 2 laptops enables "Compare" button
- [ ] Selecting 3 laptops enables "Compare" button
- [ ] Clicking "Compare" opens `/compare` route
- [ ] Side-by-side table shows all specs for selected laptops
- [ ] Better specs highlighted in green, worse in red
- [ ] Mobile (320px): stacked cards, usable, no horizontal scroll
- [ ] Desktop (1024px): 2-3 column table
- [ ] Accessibility: screen reader announces comparison content
- [ ] Keyboard navigation works through comparison table
- [ ] Direct navigation to `/compare` without selection → redirects to results

### Verification
- Complete quiz, select 2 laptops, click Compare
- Verify all specs shown, differences highlighted
- Resize to 320px, verify stacked layout
- Use keyboard Tab/Enter to navigate table
- Navigate directly to `/compare`, verify redirect

## Shareable Links

### Criteria
- [ ] "Copy link" button copies URL to clipboard
- [ ] "Share on WhatsApp" button opens WhatsApp with pre-filled message
- [ ] Pasting encoded URL in new tab restores results
- [ ] Invalid/expired URL → redirects to quiz with error message
- [ ] URL length < 2,000 characters for typical quiz results
- [ ] Clipboard copy shows success feedback ("Link copied!")
- [ ] WhatsApp message includes: results summary + link

### Verification
```bash
# Test encoding
npm run dev
# Complete quiz, click "Copy link"
# Paste URL in new tab, verify results match

# Test WhatsApp
# Click "Share on WhatsApp", verify message format

# Test invalid URL
# Navigate to /results?r=invalid, verify redirect to quiz
```

## Overall Track Acceptance

### Criteria
- [ ] All phases complete (1-7)
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] No new console warnings/errors
- [ ] No breaking changes to existing features
- [ ] All acceptance criteria met
- [ ] Documentation updated (README, docs/)

### Final Verification
```bash
npm run lint && npm run test && npm run build
```

All three must pass with zero errors.
