/*
 * CHANGES (2026-05-09 — Inference Engine P0 Fixes):
 * T1.11: Fixed normalize() — no longer strips M1/M2/M3 from GPU strings; only normalizes spaces
 * T1.12: Fixed parsePrice() — robust regex-based extraction
 * T1.13: Replaced strict GPU string matching with scoring approach
 *
 * CHANGES (2026-05-10 — DRY & budget fix):
 * DT-02: scoreGPU extracted to top-level — was copy-pasted inside both match functions
 * DT-01: Budget thresholds documented — quiz shows <$5k/12k but matcher uses 6k/13k tolerance
 */
import laptopModels from './laptopModels'

// T1.11: Only normalize spaces, don't strip chip identifiers
const normalize = (text) =>
  text.toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

// T1.12: Robust price parser
const parsePrice = (priceString) => {
  const match = priceString.match(/[\d,]+/)
  return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0
}

// DT-02: scoreGPU extracted from both match functions — single source of truth
// Returns a numeric score reflecting how well modelGPU matches the recommended GPU tier.
const scoreGPU = (recommendedGPU, modelGPU) => {
  const rec = recommendedGPU.toLowerCase()
  const mod = modelGPU.toLowerCase()
  let score = 0

  // Apple Silicon matching
  if ((rec.includes('apple') || rec.includes('m1') || rec.includes('m2') || rec.includes('m3') || rec.includes('m4')) &&
      (mod.includes('apple') || mod.includes('m1') || mod.includes('m2') || mod.includes('m3') || mod.includes('m4'))) {
    score += 2
  }

  // RTX 40 series
  if (rec.includes('rtx 40') && mod.includes('rtx 40')) score += 3
  // RTX 4050 specific
  else if (rec.includes('rtx 4050') && mod.includes('rtx 4050')) score += 2
  // RTX 30 series
  else if (rec.includes('rtx 30') && mod.includes('rtx 30')) score += 2
  // Generic RTX
  else if (rec.includes('rtx') && mod.includes('rtx')) score += 1

  // GTX scoring
  if (rec.includes('gtx') && mod.includes('gtx')) return 1.5
  if (rec.includes('gtx') && mod.includes('rtx')) return 2

  // Intel Arc Graphics
  if (rec.includes('arc') && mod.includes('arc')) score += 1.5
  // Iris Xe
  if (rec.includes('iris xe') && mod.includes('iris xe')) score += 1
  // AMD Radeon Vega
  if (rec.includes('vega') && mod.includes('vega')) score += 1
  // AMD Radeon 610M
  if (rec.includes('610m') && mod.includes('610m')) score += 0.5
  // Mali-G52 (ChromeOS basic)
  if (rec.includes('mali') && mod.includes('mali')) score += 0.5
  // Integrated graphics
  if ((rec.includes('integrados') || rec.includes('integrada')) &&
      (mod.includes('integrada') || mod.includes('intel'))) {
    score += 1
  }
  // Relaxed: RTX requested but only GTX/integrated available
  if (rec.includes('rtx') && mod.includes('gtx')) score += 1
  if (rec.includes('rtx') && (mod.includes('integrada') || mod.includes('intel'))) score += 0.5

  return score
}


const matchLaptopClass = (specs) => {
  const compatibleModels = laptopModels.filter(model => {
    const modelGPU = model.gpu.toLowerCase()
    const modelOS = model.use.toLowerCase()
    const modelSpecs = model.specs.toLowerCase()

    if (specs.os === 'ChromeOS' && modelGPU.includes('rtx')) return false
    if (specs.os === 'ChromeOS' && specs.processor.toLowerCase().includes('i7')) return false
    if (specs.os === 'macOS') {
      if (!model.name.toLowerCase().includes('macbook')) return false
      if (!model.gpu.toLowerCase().includes('m1') && !model.gpu.toLowerCase().includes('m2') && !model.gpu.toLowerCase().includes('m3') && !model.gpu.toLowerCase().includes('m4') && !model.gpu.toLowerCase().includes('apple')) return false
    }

    if (specs.os === 'macOS' && modelGPU.includes('rtx')) return false
    if (modelOS.includes('chrome') && specs.gpu.toLowerCase().includes('rtx')) return false
    if (specs.gpu.toLowerCase().includes('rtx') && !modelGPU.includes('rtx')) return false
    if (specs.ram === '16 GB' && !modelSpecs.includes('16 gb')) return false
    if (
      (specs.processor.includes('i7') || specs.processor.includes('ryzen 7')) &&
      !modelSpecs.includes('i7') && !modelSpecs.includes('ryzen 7')
    ) return false

    // DT-01: Budget thresholds include a small tolerance above the quiz labels.
    // Quiz labels: low=<$5k, medium=$5k-$12k, high=>$12k.
    // Matcher allows low up to $6k and medium up to $13k to capture edge pricing.
    const price = parsePrice(model.price)
    if (specs.budget === 'low' && price > 6000) return false
    if (specs.budget === 'medium' && price > 13000) return false
    if (specs.budget === 'high' && price < 13000) return false

    return true
  })

  // DT-02: Use shared scoreGPU (top-level) instead of local copy
  const scoredModels = compatibleModels.map(model => {
    let score = 0

    const modelSpecs = model.specs.toLowerCase()
    const modelGPU = model.gpu.toLowerCase()

    // T1.11: Use improved normalize for processor matching
    if (normalize(modelSpecs).includes(normalize(specs.processor))) score += 2
    if (modelSpecs.includes(specs.ram.toLowerCase())) score += 2
    // T1.13: Use scoring-based GPU matching
    score += scoreGPU(specs.gpu, model.gpu)
    if (modelSpecs.includes(specs.storage.toLowerCase())) score += 1
    if (model.portability === specs.portability) score += 1

    if (specs.flags?.prioritizePortability && model.portability === 'Alta') {
      score += 1.5
    }
    if (specs.flags?.prioritizeGaming) {
      if (modelGPU.includes('rtx') || modelGPU.includes('gtx') || modelGPU.includes('mx')) {
        score += 1.5
      }
    }

    if (specs.flags?.prioritizeScreenQuality) {
      if (
        modelSpecs.includes('2.5k') ||
        modelSpecs.includes('retina') ||
        modelSpecs.includes('qhd') ||
        modelSpecs.includes('2560') ||
        modelSpecs.includes('amoled')
      ) {
        score += 1.5
      }
    }



    if (specs.flags?.prioritizeSecurity && model.specs.toLowerCase().includes('huella')) {
      score += 1.5
    }

    return { ...model, matchScore: score }
  })

  const bestMatches = scoredModels
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)

  return bestMatches

}

export const matchLaptopClassRelaxed = (specs) => {
  const relaxedModels = laptopModels.filter(model => {
    const price = parsePrice(model.price)
    const budgetLimit = specs.budget === 'low' ? 7800 : specs.budget === 'medium' ? 16900 : Infinity
    if (specs.budget === 'high' && price < 10000) return false
    if (specs.budget !== 'high' && price > budgetLimit) return false
    return true
  })

  // DT-02: Use shared scoreGPU (top-level) instead of local copy
  const scoredModels = relaxedModels.map(model => {
    let score = 0
    const modelSpecs = model.specs.toLowerCase()

    if (modelSpecs.includes(specs.processor.toLowerCase().split('/')[0].trim())) score += 1
    if (modelSpecs.includes(specs.ram.toLowerCase())) score += 2
    else if (specs.ram === '16 GB' && modelSpecs.includes('8 gb')) score += 1
    score += scoreGPU(specs.gpu, model.gpu)
    if (modelSpecs.includes(specs.storage.toLowerCase())) score += 1

    return { ...model, matchScore: score }
  })

  return scoredModels
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)
    .filter(m => m.matchScore > 0)
}

export default matchLaptopClass
