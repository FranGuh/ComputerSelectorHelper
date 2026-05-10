# Risks — Foundation Testing CI

## Risk Matrix

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|------------|--------|------------|
| 1 | Inference engine tests reveal more bugs | High | Medium | Fix bugs as found, add to test suite, document in track |
| 2 | Existing lint violations block pre-commit hooks | High | Low | Run `eslint --fix .` before enabling hooks, commit cleanup separately |
| 3 | URL-encoded results exceed browser limits | Medium | Medium | Use compression, fallback to localStorage if URL too long, warn user |
| 4 | Comparison view breaks on mobile with 3 laptops | Medium | Medium | Limit to 2 on mobile, stack vertically, test on 320px breakpoint |
| 5 | CI pipeline fails on first run due to environment differences | Medium | Low | Test workflow locally with `act` or push to test branch first |
| 6 | Test coverage target (80%) is too ambitious for initial suite | Medium | Low | Start with 60% target, increase incrementally, focus on critical paths |
| 7 | Shareable links break if inference logic changes | Low | Medium | Version the encoded data format, add validation on decode |
| 8 | Husky hooks slow down developer workflow | Low | Low | Keep hooks fast (lint only staged files), use `--no-verify` escape hatch |

## Detailed Risks

### R1: Inference Engine Tests Reveal More Bugs

**Scenario**: After writing 15+ test cases for `convertToSpecs.jsx` and `matchLaptopClass.jsx`, edge cases that weren't caught during the 17-bug fix are discovered.

**Impact**: Tests fail, track timeline extends by 1-2 days.

**Mitigation**:
- Fix bugs as they're found, add regression tests immediately
- Document each new bug in the track's issue log
- If >5 new bugs found, split into separate bugfix track
- Keep failing tests as `test.skip()` with issue reference until fixed

### R2: Existing Lint Violations Block Pre-commit Hooks

**Scenario**: Enabling Husky + lint-staged reveals 50+ existing ESLint warnings/errors across the codebase.

**Impact**: Developers can't commit until all violations are fixed.

**Mitigation**:
- Run `eslint --fix .` BEFORE enabling hooks
- Commit cleanup as separate commit: `chore: fix all existing lint violations`
- Enable hooks only after codebase is clean
- Add `--no-verify` as temporary escape hatch for urgent commits

### R3: URL-Encoded Results Exceed Browser Limits

**Scenario**: Encoding all 10 quiz answers + result data creates a URL > 2,000 characters, exceeding some browser/proxy limits.

**Impact**: Shareable links break for complex quiz results.

**Mitigation**:
- Compress with `pako` (gzip) before base64 encoding
- If still too long, fall back to localStorage + short ID
- Warn user: "This link is long, consider using the copy button"
- Test with maximum data payload (all answers + 3 laptop results)

### R4: Comparison View Breaks on Mobile with 3 Laptops

**Scenario**: Side-by-side comparison of 3 laptops on 320px screen is unusable.

**Impact**: Poor UX on mobile, accessibility issues.

**Mitigation**:
- Limit to 2 laptops on mobile (disable 3rd checkbox)
- Stack cards vertically with sticky spec labels
- Use horizontal scroll with snap points as alternative
- Test on actual 320px device, not just DevTools

### R5: CI Pipeline Fails on First Run

**Scenario**: GitHub Actions workflow fails due to Node version mismatch, missing env vars, or different npm behavior.

**Impact**: Wasted time debugging CI instead of building features.

**Mitigation**:
- Use `actions/setup-node@v4` with explicit Node 22.x
- Cache `node_modules` with `actions/cache`
- Test workflow locally with `nektos/act` if available
- Push to test branch first, verify workflow passes before merging

### R6: Test Coverage Target Too Ambitious

**Scenario**: Reaching 80% coverage on inference engine requires mocking complex browser APIs or testing trivial code.

**Impact**: Time spent on coverage metrics instead of meaningful tests.

**Mitigation**:
- Start with 60% target, increase to 80% in follow-up
- Focus on critical paths: scoring, matching, edge cases
- Exclude trivial code (constants, simple getters) from coverage
- Use `// istanbul ignore next` for untestable browser-specific code

## Rollback Plan

If any phase introduces breaking changes:

1. **Testing/CI**: Revert the workflow/hook commits — no user-facing impact
2. **Comparison View**: Remove `/compare` route and checkbox — existing features unaffected
3. **Shareable Links**: Remove URL decoding logic — existing quiz flow unchanged
4. **Nuclear option**: Revert entire track via `git revert` — all changes are additive, no breaking changes to existing code

## Monitoring

After merge:
- Monitor CI pass rate (should be >95%)
- Track test coverage trend (should increase, not decrease)
- Watch for shareable link errors in Vercel logs
- Monitor comparison page usage via Vercel Analytics
