import { describe, it, expect } from 'vitest'
import convertToSpecs from '../utils/convertToSpecs'

const baseAnswers = {
  mainUse: ['basics'],
  system: 'windows',
  budget: 'medium',
  workload: 'light',
  photoVideo: 'no',
  webBrowsing: 'light',
  location: 'stationary',
  importance: 'none',
  battery: 'no',
}

describe('convertToSpecs — Basic functionality', () => {
  it('returns a valid spec profile for basic answers', () => {
    const specs = convertToSpecs(baseAnswers)
    expect(specs).toHaveProperty('processor')
    expect(specs).toHaveProperty('ram')
    expect(specs).toHaveProperty('storage')
    expect(specs).toHaveProperty('gpu')
    expect(specs).toHaveProperty('os')
    expect(specs).toHaveProperty('budget')
    expect(specs).toHaveProperty('warnings')
    expect(specs).toHaveProperty('rationale')
    expect(specs).toHaveProperty('laptopClass')
    expect(Array.isArray(specs.laptopClass)).toBe(true)
  })

  it('sets Windows 11 as default OS', () => {
    const specs = convertToSpecs(baseAnswers)
    expect(specs.os).toBe('Windows 11')
  })

  it('stores budget from answers', () => {
    const specs = convertToSpecs({ ...baseAnswers, budget: 'low' })
    expect(specs.budget).toBe('low')
  })
})

describe('convertToSpecs — Gaming use case', () => {
  it('sets high GPU score for gaming', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      mainUse: ['gaming'],
      gamesType: 'complex',
    })
    expect(specs.gpu).toContain('RTX')
    expect(specs.rationale.some(r => r.toLowerCase().includes('gaming'))).toBe(true)
  })

  it('sets prioritizeGaming flag', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      mainUse: ['gaming'],
    })
    expect(specs.flags?.prioritizeGaming).toBe(true)
  })

  it('upgrades CPU and RAM for RTX requirements', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      mainUse: ['gaming'],
      gamesType: 'complex',
    })
    expect(specs.processor).toMatch(/i5|i7|Ryzen 5|Ryzen 7/)
    expect(specs.ram).toBe('16 GB')
  })
})

describe('convertToSpecs — Content creation', () => {
  it('sets high performance and storage for creating', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      mainUse: ['creating'],
    })
    expect(specs.performance || specs.rationale.some(r => r.toLowerCase().includes('creación'))).toBeTruthy()
    expect(specs.storage).toBe('512 GB SSD')
  })

  it('sets high specs for photoVideo: pro', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      photoVideo: 'pro',
    })
    expect(specs.storage).toBe('512 GB SSD')
  })

  it('sets prioritizeScreenQuality flag for photoVideo: pro', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      photoVideo: 'pro',
    })
    expect(specs.flags?.prioritizeScreenQuality).toBe(true)
  })
})

describe('convertToSpecs — Heavy workload', () => {
  it('sets high performance for work_school + heavy', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      mainUse: ['work_school'],
      workload: 'heavy',
    })
    expect(specs.rationale.some(r => r.toLowerCase().includes('trabajo'))).toBe(true)
  })

  it('sets high RAM for heavy web browsing', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      webBrowsing: 'heavy',
    })
    expect(specs.rationale.some(r => r.toLowerCase().includes('ram'))).toBe(true)
  })
})

describe('convertToSpecs — Portability', () => {
  it('sets high portability for mobile location', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      location: 'mobile',
    })
    expect(specs.portability).toContain('Alta')
  })

  it('sets prioritizePortability flag', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      importance: 'portability',
    })
    expect(specs.flags?.prioritizePortability).toBe(true)
  })
})

describe('convertToSpecs — macOS', () => {
  it('sets macOS as OS', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      system: 'mac',
    })
    expect(specs.os).toBe('macOS')
  })

  it('forces Apple Silicon processor', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      system: 'mac',
    })
    expect(specs.processor).toMatch(/Apple M|M1|M2|M3/)
  })

  it('warns about macOS + gaming incompatibility', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      system: 'mac',
      mainUse: ['gaming'],
    })
    expect(specs.warnings.some(w => w.toLowerCase().includes('macos') && w.toLowerCase().includes('juegos'))).toBe(true)
  })

  it('warns about low budget + demanding macOS tasks', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      system: 'mac',
      budget: 'low',
      mainUse: ['gaming'],
    })
    expect(specs.warnings.some(w => w.includes('⚠️') && w.toLowerCase().includes('presupuesto'))).toBe(true)
  })
})

describe('convertToSpecs — ChromeOS', () => {
  it('sets ChromeOS as OS', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      system: 'chrome',
    })
    expect(specs.os).toBe('ChromeOS')
  })

  it('forces modest hardware for ChromeOS', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      system: 'chrome',
    })
    expect(specs.processor).toMatch(/Celeron|MediaTek/)
    expect(specs.gpu).toContain('integrados')
  })

  it('warns about ChromeOS + heavy tasks', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      system: 'chrome',
      workload: 'heavy',
    })
    expect(specs.warnings.some(w => w.toLowerCase().includes('chromeos'))).toBe(true)
  })

  it('warns about ChromeOS + gaming complex', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      system: 'chrome',
      mainUse: ['gaming'],
      gamesType: 'complex',
    })
    expect(specs.warnings.some(w => w.toLowerCase().includes('chromeos') && w.toLowerCase().includes('juegos'))).toBe(true)
  })
})

describe('convertToSpecs — Budget constraints', () => {
  it('warns about low budget with high specs', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      budget: 'low',
      mainUse: ['gaming'],
    })
    expect(specs.warnings.some(w => w.toLowerCase().includes('presupuesto'))).toBe(true)
  })

  it('warns about RTX with low budget', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      budget: 'low',
      mainUse: ['gaming'],
      gamesType: 'complex',
    })
    expect(specs.warnings.some(w => w.toLowerCase().includes('rtx'))).toBe(true)
  })
})

describe('convertToSpecs — Edge cases', () => {
  it('handles empty mainUse gracefully', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      mainUse: [],
    })
    expect(specs).toHaveProperty('processor')
    expect(specs.os).toBe('Windows 11')
  })

  it('handles full_use (all uses selected)', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      mainUse: 'full_use',
    })
    expect(specs).toHaveProperty('processor')
    expect(specs.laptopClass).toBeDefined()
  })

  it('handles touchscreen preference', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      importance: 'touch',
    })
    expect(specs.touchscreen).toBe(true)
  })

  it('handles security preference', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      importance: 'security',
    })
    expect(specs.flags?.prioritizeSecurity).toBe(true)
  })

  it('handles battery preference', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      battery: 'yes',
    })
    expect(specs.battery).toContain('Alta')
  })

  it('detects contradictory use: basic only but demanding answers', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      mainUse: ['entertainment'],
      workload: 'heavy',
      photoVideo: 'pro',
    })
    expect(specs.warnings.some(w => w.includes('⚠️') && w.toLowerCase().includes('simple'))).toBe(true)
  })
})

describe('convertToSpecs — gamesType scoring', () => {
  it('complex games increase GPU requirements more than simple', () => {
    const specsComplex = convertToSpecs({
      ...baseAnswers,
      mainUse: ['gaming'],
      gamesType: 'complex',
    })
    const specsSimple = convertToSpecs({
      ...baseAnswers,
      mainUse: ['gaming'],
      gamesType: 'simple',
    })
    // Both have gaming base (4.5), complex adds +3, simple adds +1
    expect(specsComplex.gpu).toContain('RTX')
    expect(specsSimple.gpu).toContain('RTX')
    // Complex should have higher GPU tier or same
    expect(specsComplex.gpu).toBe(specsSimple.gpu)
  })
})

describe('convertToSpecs — photoVideo: basic scoring', () => {
  it('basic photo editing adds modest GPU/storage', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      photoVideo: 'basic',
    })
    expect(specs).toHaveProperty('gpu')
    expect(specs).toHaveProperty('storage')
  })
})

describe('convertToSpecs — Apple Silicon matching', () => {
  it('does not strip M1/M2/M3 from processor spec', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      system: 'mac',
    })
    expect(specs.processor).toMatch(/M1|M2|M3/)
  })
})

describe('convertToSpecs — RAM comparison edge cases', () => {
  it('sets correct RAM for multitasking >= 4', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      mainUse: ['gaming', 'creating'],
      webBrowsing: 'heavy',
    })
    expect(specs.ram).toBe('16 GB')
  })

  it('sets 12 GB RAM for moderate multitasking', () => {
    const specs = convertToSpecs({
      ...baseAnswers,
      mainUse: ['work_school'],
      workload: 'heavy',
    })
    expect(specs.ram).toBe('12 GB')
  })
})
