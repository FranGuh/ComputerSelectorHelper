import laptopModels from './laptopModels'

const normalize = (text) =>
  text.toLowerCase()
    .replace(/(intel|amd|apple|core|ryzen|graphics|nvidia|geforce|radeon|gpu|m[0-9])|\s+/gi, '')

const matchLaptopClass = (specs) => {
  const compatibleModels = laptopModels.filter(model => {
    const modelName = model.name.toLowerCase()
    const modelGPU = model.gpu.toLowerCase()
    const modelOS = model.use.toLowerCase()
    const modelSpecs = model.specs.toLowerCase()

    if (specs.os === 'ChromeOS' && modelGPU.includes('rtx')) return false
    if (specs.os === 'ChromeOS' && specs.processor.toLowerCase().includes('i7')) return false
    if (specs.os === 'macOS' && !modelName.includes('macbook')) return false
    if (specs.os === 'macOS' && modelGPU.includes('rtx')) return false
    if (modelOS.includes('chrome') && specs.gpu.toLowerCase().includes('rtx')) return false
    if (specs.gpu.toLowerCase().includes('rtx') && !modelGPU.includes('rtx')) return false
    if (specs.ram === '16 GB' && !modelSpecs.includes('16 gb')) return false
    if (
      (specs.processor.includes('i7') || specs.processor.includes('ryzen 7')) &&
      !modelSpecs.includes('i7') && !modelSpecs.includes('ryzen 7')
    ) return false

    // ✅ Presupuesto
    if (specs.budget === 'low' && model.price > 6000) return false
    if (specs.budget === 'medium' && model.price > 13000) return false
    if (specs.budget === 'high' && model.price < 13000) return false

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

    return { ...model, matchScore: score }
  })

  const bestMatch = scoredModels.sort((a, b) => b.matchScore - a.matchScore)[0]

  return bestMatch || { name: "Clase genérica", specs: "" }
}

export default matchLaptopClass
