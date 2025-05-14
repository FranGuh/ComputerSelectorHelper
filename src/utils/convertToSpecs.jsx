import matchLaptopClass from './matchLaptopClass'

const convertToSpecs = (answers) => {
  const specs = {
    processor: '',
    ram: '',
    storage: '',
    gpu: '',
    touchscreen: false,
    portability: '',
    os: '',
    battery: '',
    rationale: [],
    warnings: []
  }

  specs.budget = answers.budget


  const scores = {
    performance: 0,
    graphics: 0,
    multitasking: 0,
    portability: 0,
    battery: 0,
    storage: 0
  }

  const uses = answers.mainUse === 'full_use'
    ? ['basics', 'entertainment', 'gaming', 'work_school', 'creating', 'family']
    : answers.mainUse || []

  // ==== 1. Scoring según uso ====
  if (uses.includes('gaming')) {
    scores.performance += 3.5
    scores.graphics += 4.5
    scores.storage += 1
    specs.rationale.push('Para gaming se requiere GPU dedicada y CPU potente.')
  }

  if (uses.includes('creating') || answers.photoVideo === 'pro') {
    scores.performance += 3
    scores.graphics += 2.5
    scores.multitasking += 2
    scores.storage += 2
    specs.rationale.push('Creación de contenido profesional requiere potencia y espacio.')
  }

  if (uses.includes('work_school') || answers.workload === 'heavy') {
    scores.performance += 2.5
    scores.multitasking += 2.5
    specs.rationale.push('Trabajo exigente necesita buena CPU y multitarea.')
  }

  if (answers.webBrowsing === 'heavy') {
    scores.multitasking += 1.5
    specs.rationale.push('Muchas pestañas requieren buena RAM.')
  }

  if (answers.location === 'mobile') {
    scores.portability += 3
    specs.rationale.push('Necesitas algo ligero y fácil de transportar.')
  }

  if (answers.importance === 'touch') {
    specs.touchscreen = true
    specs.rationale.push('Requiere pantalla táctil.')
  }

  if (answers.battery === 'yes') {
    scores.battery += 3
    specs.rationale.push('Priorizás batería de larga duración.')
  }

  // ==== 2. Especificaciones recomendadas ====
  specs.processor =
    scores.performance >= 6 ? 'Intel i7 / Ryzen 7' :
      scores.performance >= 4 ? 'Intel i5 / Ryzen 5' :
        'Intel i3 / Ryzen 3 o Celeron'

  specs.ram =
    scores.multitasking >= 4 ? '16 GB' :
      scores.multitasking >= 2 ? '12 GB' :
        '8 GB'

  specs.storage = scores.storage >= 2 ? '512 GB SSD' : '256 GB SSD'

  specs.gpu =
    scores.graphics >= 4 ? 'NVIDIA RTX 3050 o superior' :
      scores.graphics >= 2 ? 'Intel Iris Xe / Radeon Vega' :
        'Gráficos integrados básicos'

  specs.portability = scores.portability >= 3 ? 'Alta (menos de 1.5kg, 14")' : 'Media o baja'
  specs.battery = scores.battery >= 3 ? 'Alta (8h o más)' : 'Media (4-7h)'

  // ==== 3. Sistema operativo filtrado ====
  switch (answers.system) {
    case 'windows':
      specs.os = 'Windows 11'
      break
    case 'mac':
      specs.os = 'macOS'
      break
    case 'chrome':
      specs.os = 'ChromeOS'
      break
    default:
      specs.os = 'Windows 11'
  }

  if (specs.os === 'ChromeOS') {
    specs.processor = 'Intel Celeron / MediaTek'
    specs.ram = '4 GB o 8 GB'
    specs.gpu = 'Gráficos integrados básicos'
    specs.storage = '64 GB eMMC o 128 GB SSD'
    specs.rationale.push('ChromeOS está pensado para tareas básicas con hardware modesto.')
  }

  // ==== 4. Validaciones cruzadas ====
  if (specs.os === 'macOS') {
    if (uses.includes('gaming')) {
      specs.warnings.push('macOS no es ideal para juegos exigentes ni es compatible con la mayoría de títulos AAA. Recomendamos Windows.')
    }
    if (specs.gpu.includes('RTX')) {
      specs.warnings.push('Mac no usa GPUs dedicadas tipo RTX, sus chips integrados (M1/M2/M3) tienen gráficas propias.')
      specs.gpu = 'Apple Silicon GPU (M1/M2/M3)'
    }
    if (specs.processor.includes('i7') || specs.processor.includes('Ryzen')) {
      specs.processor = 'Apple M1 / M2 / M3'
      specs.rationale.push('En macOS se usan procesadores Apple Silicon, no Intel/AMD tradicionales.')
    }
  }

  if (
  specs.os === 'macOS' &&
  answers.budget === 'low' &&
  (
    uses.includes('gaming') ||
    uses.includes('creating') ||
    uses.includes('work_school') ||
    answers.workload === 'heavy' ||
    answers.photoVideo === 'pro'
  )
) {
  specs.warnings.unshift('⚠️ Querés hacer cosas muy exigentes en una Mac, pero con menos de $5,000 MXN. No es viable. Recomendamos subir el presupuesto o considerar una laptop con Windows.')
}


  if (specs.os === 'ChromeOS') {
    if (answers.workload === 'heavy') {
      specs.warnings.push('ChromeOS no es ideal para multitarea exigente ni software pesado.')
    }
    if (answers.photoVideo === 'pro') {
      specs.warnings.push('ChromeOS no soporta software profesional como Photoshop o Premiere. Considerá Windows o macOS.')
    }
    if (uses.includes('gaming') && answers.gamesType === 'complex') {
      specs.warnings.push('ChromeOS no puede ejecutar juegos complejos como GTA o FIFA.')
    }
    if (specs.gpu.includes('RTX') || specs.processor.includes('i7')) {
      specs.warnings.push('ChromeOS no usa hardware de alto rendimiento como RTX o i7. Recomendamos evitar este OS si necesitás potencia.')
      specs.gpu = 'Gráficos integrados básicos'
      specs.processor = 'Intel Celeron / MediaTek'
    }
  }

  if (answers.budget === 'low' && (specs.processor.includes('i5') || specs.ram === '16 GB')) {
    specs.warnings.push('Tu presupuesto bajo podría no alcanzar para estas specs. Considerá ajustar prioridades o aumentar presupuesto.')
  }

  if (specs.gpu.includes('RTX') && answers.budget === 'low') {
    specs.warnings.push('Una GPU RTX requiere un presupuesto medio o alto. Podrías no encontrar algo accesible con esas specs.')
  }

  // ==== 5. RAM recomendada vs real ====
  const idealRam = scores.multitasking >= 4 ? '16 GB' : scores.multitasking >= 2 ? '12 GB' : '8 GB'
  if (specs.ram !== idealRam) {
    specs.warnings.push(`Idealmente deberías tener ${idealRam} de RAM para tu uso.`)
  }

  // ==== 6. Validación de coherencia interna de specs ====
  if (specs.gpu.includes('RTX')) {
    if (
      !specs.processor.includes('i5') &&
      !specs.processor.includes('i7') &&
      !specs.processor.includes('Ryzen 5') &&
      !specs.processor.includes('Ryzen 7')
    ) {
      specs.processor = 'Intel i5 / Ryzen 5'
      specs.rationale.push('Se ajustó el procesador porque una GPU RTX requiere al menos un i5 o Ryzen 5.')
    }

    if (specs.ram !== '16 GB') {
      specs.ram = '16 GB'
      specs.rationale.push('Se ajustó la RAM porque una GPU RTX necesita al menos 16 GB para funcionar correctamente.')
    }
  }

  const bestModel = matchLaptopClass(specs)
  specs.laptopClass = bestModel.name || bestModel

  // Verificación si el modelo tiene menos RAM que la recomendada
  if (
    bestModel &&
    bestModel.name !== 'Clase genérica' &&
    specs.ram === '12 GB' &&
    bestModel.specs.toLowerCase().includes('8 gb')
  ) {
    specs.warnings.push('El modelo sugerido tiene 8 GB de RAM, que puede ser justo si hacés mucha multitarea.')
  }

  // ==== 7. Advertencia crítica por combinación inviable ====
if (
  specs.os === 'ChromeOS' &&
  answers.budget === 'low' &&
  (
    uses.includes('gaming') ||
    uses.includes('creating') ||
    uses.includes('work_school') ||
    answers.workload === 'heavy' ||
    answers.photoVideo === 'pro'
  )
) {
  specs.warnings.unshift('⚠️ Estás solicitando tareas exigentes (edición, juegos, multitarea) en un sistema muy limitado (ChromeOS con presupuesto bajo). No es viable cumplir esos requerimientos con esta combinación. Recomendamos considerar Windows con mayor inversión.')
}




  return specs
}

export default convertToSpecs
