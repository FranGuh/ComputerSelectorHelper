import laptopModels from './laptopModels'

const normalize = (text) =>
  text.toLowerCase()
    .replace(/(intel|amd|apple|core|ryzen|graphics|nvidia|geforce|radeon|gpu|m[0-9])|\s+/gi, '')

const parsePrice = (priceString) =>
  parseInt(priceString.replace(/[^\d]/g, ''), 10)


const matchLaptopClass = (specs) => {
  const compatibleModels = laptopModels.filter(model => {
    const modelGPU = model.gpu.toLowerCase()
    const modelOS = model.use.toLowerCase()
    const modelSpecs = model.specs.toLowerCase()

    if (specs.os === 'ChromeOS' && modelGPU.includes('rtx')) return false
    if (specs.os === 'ChromeOS' && specs.processor.toLowerCase().includes('i7')) return false
    if (specs.os === 'macOS') {
      if (!model.name.toLowerCase().includes('macbook')) return false
      if (!model.gpu.toLowerCase().includes('m1') && !model.gpu.toLowerCase().includes('m2') && !model.gpu.toLowerCase().includes('m3')) return false
    }

    if (specs.os === 'macOS' && modelGPU.includes('rtx')) return false
    if (modelOS.includes('chrome') && specs.gpu.toLowerCase().includes('rtx')) return false
    if (specs.gpu.toLowerCase().includes('rtx') && !modelGPU.includes('rtx')) return false
    if (specs.ram === '16 GB' && !modelSpecs.includes('16 gb')) return false
    if (
      (specs.processor.includes('i7') || specs.processor.includes('ryzen 7')) &&
      !modelSpecs.includes('i7') && !modelSpecs.includes('ryzen 7')
    ) return false

    // ✅ Presupuesto
    const price = parsePrice(model.price)

    if (specs.budget === 'low' && price > 6000) return false
    if (specs.budget === 'medium' && price > 13000) return false
    if (specs.budget === 'high' && price < 13000) return false

    return true
  })

  const scoredModels = compatibleModels.map(model => {
    let score = 0

    const modelSpecs = model.specs.toLowerCase()
    const modelGPU = model.gpu.toLowerCase()

    if (normalize(modelSpecs).includes(normalize(specs.processor))) score += 2
    if (modelSpecs.includes(specs.ram.toLowerCase())) score += 2
    if (normalize(modelGPU).includes(normalize(specs.gpu))) score += 2
    if (modelSpecs.includes(specs.storage.toLowerCase())) score += 1
    if (model.portability === specs.portability) score += 1
    if (model.use.toLowerCase().includes(specs.os.toLowerCase())) score += 1

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
    .slice(0, 3) // 👈 Cambia 3 por cuántas quieres mostrar

  return bestMatches.length ? bestMatches : [{ name: "Clase genérica", specs: "" }]

}

export default matchLaptopClass
