/**
 * parseSpecs.js — Parses laptop model spec strings into structured numbers
 * for the comparison module.
 */

import { isMac, isChromeOS } from './osDetector'

const GPU_TIERS = [
  { keywords: ['rtx 4090', 'rtx 4080'], tier: 10 },
  { keywords: ['rtx 4070'], tier: 9 },
  { keywords: ['rtx 4060'], tier: 8 },
  { keywords: ['rtx 4050'], tier: 7 },
  { keywords: ['rtx 3060', 'rtx 3070'], tier: 6.5 },
  { keywords: ['rtx 3050'], tier: 6 },
  { keywords: ['gtx 1660'], tier: 5.5 },
  { keywords: ['gtx 1650'], tier: 5 },
  { keywords: ['m4'], tier: 5.5 },
  { keywords: ['m3'], tier: 5 },
  { keywords: ['m2'], tier: 4.5 },
  { keywords: ['m1'], tier: 4 },
  { keywords: ['arc'], tier: 4 },
  { keywords: ['iris xe'], tier: 3.5 },
  { keywords: ['vega 8', 'vega 7'], tier: 3 },
  { keywords: ['610m', '600m'], tier: 2.5 },
  { keywords: ['mali', 'uhd', 'integrada', 'integrated'], tier: 2 },
]

/**
 * Returns a numeric tier for a GPU string (higher = better).
 * @param {string} gpu
 * @returns {number}
 */
export const getGPUTier = (gpu) => {
  const g = gpu.toLowerCase()
  for (const { keywords, tier } of GPU_TIERS) {
    if (keywords.some(k => g.includes(k))) return tier
  }
  return 1
}

/**
 * Parses a laptop model object into structured comparison fields.
 * @param {Object} model
 * @returns {{ram: number, storageGB: number, storageLabel: string, price: number, gpuTier: number, screenLabel: string, os: string, processor: string}}
 */
export const parseModelSpecs = (model) => {
  const specs = model.specs.toLowerCase()

  // RAM
  const ramMatch = specs.match(/(\d+)\s*gb\s*ram/)
  const ram = ramMatch ? parseInt(ramMatch[1]) : 0

  // Storage
  const storageTBMatch = specs.match(/(\d+)\s*tb\s*ssd/)
  const storageGBMatch = specs.match(/(\d+)\s*gb\s*(ssd|emmc)/)
  const storageGB = storageTBMatch
    ? parseInt(storageTBMatch[1]) * 1024
    : storageGBMatch ? parseInt(storageGBMatch[1]) : 0
  const storageLabel = storageTBMatch
    ? `${storageTBMatch[1]} TB SSD`
    : storageGBMatch ? `${storageGBMatch[1]} GB SSD` : 'N/A'

  // Price (numeric)
  const priceMatch = model.price.match(/[\d,]+/)
  const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0

  // GPU tier
  const gpuTier = getGPUTier(model.gpu)

  // Screen size
  const screenMatch = specs.match(/(\d+\.?\d*)[""']/)
  const screenSize = screenMatch ? `${screenMatch[1]}"` : ''
  const hasOLED = specs.includes('oled')
  const hasRetina = specs.includes('retina')
  const hasQHD = specs.includes('qhd') || specs.includes('2.5k') || specs.includes('2.8k')
  const screenType = hasOLED ? ' OLED' : hasRetina ? ' Retina' : hasQHD ? ' QHD' : ' FHD'
  const screenLabel = screenSize ? `${screenSize}${screenType}` : 'N/A'

  // Processor = first comma-separated segment of original specs
  const processor = model.specs.split(',')[0].trim()

  // OS detection
  let os = 'Windows'
  if (isMac(model.name, model.gpu)) os = 'macOS'
  else if (isChromeOS(model.name) || model.gpu.toLowerCase().includes('mali')) os = 'ChromeOS'

  return { ram, storageGB, storageLabel, price, gpuTier, screenLabel, os, processor }
}

/**
 * Returns an array of booleans marking which index holds the "best" value.
 * Ties are both marked true. Zero values are excluded from winning.
 * @param {number[]} values
 * @param {boolean} higherIsBetter
 * @returns {boolean[]}
 */
export const getBestIndices = (values, higherIsBetter = true) => {
  const valid = values.filter(v => v > 0)
  if (valid.length === 0) return values.map(() => false)
  const best = higherIsBetter ? Math.max(...valid) : Math.min(...valid)
  return values.map(v => v === best && v > 0)
}
