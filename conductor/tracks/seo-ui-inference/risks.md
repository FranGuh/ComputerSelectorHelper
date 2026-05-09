# Risks: SEO + UI + Inference Engine Fix

## R1: Inference Logic Changes Break Existing Recommendations
**Probability**: Medium | **Impact**: High
**Mitigation**: Document current behavior before changes. Test with known answer combinations. Keep scoring thresholds conservative.

## R2: `react-helmet-async` Adds Bundle Weight
**Probability**: Low | **Impact**: Low
**Mitigation**: Package is ~5kb gzipped. Acceptable for SEO benefit. Monitor Lighthouse Performance score.

## R3: UI Modernization Loses User's Design Essence
**Probability**: Medium | **Impact**: High
**Mitigation**: Keep current color palette, card-based layout, friendly tone. Modernize spacing/typography/shadows, don't redesign from scratch. User reviews before merge.

## R4: Back Navigation Introduces State Bugs
**Probability**: Low | **Impact**: Medium
**Mitigation**: `answers` state already persists. Only need UI button + step decrement. No complex state changes needed.

## R5: Build Fails After Changes
**Probability**: Low | **Impact**: High
**Mitigation**: Run `npm run build` and `npm run lint` after each phase. JuniorQwen on standby.

## R6: Lighthouse Targets Not Met
**Probability**: Medium | **Impact**: Medium
**Mitigation**: SEO ≥ 90 achievable with meta tags + semantic HTML. Accessibility ≥ 80 requires focus-visible, aria labels, contrast fixes. All planned in tasks.

## R7: Laptop Model Data Becomes Outdated Again
**Probability**: High (over time) | **Impact**: Low
**Mitigation**: Add comment in `laptopModels.js` noting last update date. Use price ranges instead of exact prices where possible.
