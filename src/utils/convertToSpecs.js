/*
 * CHANGES (2026-05-09 — Inference Engine P0 Fixes):
 * T1.1: Removed duplicate macOS+gaming warning (was at old line 129-131)
 * T1.2: Moved dead ChromeOS warning from inside macOS block to ChromeOS block
 * T1.3: Added prioritizeGaming and prioritizeScreenQuality flags
 * T1.4: Fixed RAM comparison false positive — skip warning on macOS
 * T1.5/T1.14: Fixed bestModels filter — empty result stays empty, no fallback to unfiltered
 * T1.6: forceAppleSpecs now sets scores.graphics = 1 (Apple Silicon has decent iGPU)
 * T1.7: Normalizes uses early; when mainUse === 'full_use' expands to full array
 * T1.9: Added gamesType scoring (complex/simple)
 * T1.10: Added photoVideo === 'basic' scoring
 * T1.15: Added generic spec-profile fallback when laptopClass is empty
 */
import matchLaptopClass, { matchLaptopClassRelaxed } from './matchLaptopClass'
import { isMac, isChromeOS, isWindows } from './osDetector'

const forceAppleSpecs = (specs, scores) => {
  specs.processor = 'Apple M1 / M2 / M3'
  specs.gpu = 'Apple Silicon GPU (M1/M2/M3)'
  scores.graphics = 1
}

const forceChromeSpecs = (specs) => {
  specs.processor = 'Intel Celeron / MediaTek'
  specs.ram = '4 GB o 8 GB'
  specs.gpu = 'Gráficos integrados básicos'
  specs.storage = '64 GB eMMC o 128 GB SSD'
  specs.rationale.push('ChromeOS está pensado para tareas básicas con hardware modesto.')
}


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

  // T1.7: Normalize uses early — expand 'full_use' to full array
  const uses = answers.mainUse === 'full_use'
    ? ['basics', 'entertainment', 'gaming', 'work_school', 'creating', 'family']
    : (Array.isArray(answers.mainUse) ? answers.mainUse : [])


  if (answers.system === 'mac') {
    forceAppleSpecs(specs, scores)
  }

  if (answers.system === 'chrome') {
    forceChromeSpecs(specs)
  }


  // ==== 1. Scoring según uso ====
  if (uses.includes('gaming')) {
    scores.performance += 3.5
    scores.graphics += 4.5
    scores.storage += 1
    specs.rationale.push('Para gaming se requiere GPU dedicada y CPU potente.')

    // T1.9: gamesType scoring
    if (answers.gamesType === 'complex') {
      scores.graphics += 3
      specs.rationale.push('Juegos complejos como GTA o FIFA requieren GPU dedicada.')
    }
    if (answers.gamesType === 'simple') {
      scores.graphics += 1
      specs.rationale.push('Juegos simples como Roblox funcionan con gráficos integrados.')
    }
  }

  if (uses.includes('creating') || answers.photoVideo === 'pro') {
    scores.performance += 3
    scores.graphics += 2.5
    scores.multitasking += 2
    scores.storage += 2
    specs.rationale.push('Creación de contenido profesional requiere potencia y espacio.')
  }

  // T1.10: photoVideo basic scoring
  if (answers.photoVideo === 'basic') {
    scores.graphics += 1
    scores.storage += 1
    specs.rationale.push('Edición básica de fotos/videos requiere algo de potencia gráfica y almacenamiento.')
  }

  if (uses.includes('work_school') || answers.workload === 'heavy') {
    scores.performance += 2.5
    scores.multitasking += 2.5
    specs.rationale.push('Trabajo exigente necesita buena CPU y multitarea.')
  }

  if (uses.includes('family')) {
    scores.multitasking += 1
    specs.rationale.push('Uso compartido en casa requiere buena capacidad multitarea.')
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

  if (answers.importance === 'security') {
    specs.rationale.push('Prioritás seguridad. Buscamos modelos con lector de huellas o reconocimiento facial si es posible.')
  }

  if (answers.importance === 'portability') {
    specs.rationale.push('Buscás un equipo liviano. Se prioriza que pese menos de 1.5 kg y tenga una pantalla de 14" o menor.')
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

  if (answers.system === 'mac') {
    specs.ram = scores.multitasking >= 4 ? '16 GB' : '8 GB'
  } else {
    specs.ram =
      scores.multitasking >= 4 ? '16 GB' :
        scores.multitasking >= 2 ? '12 GB' :
          '8 GB'
  }

  // T1.1: REMOVED duplicate macOS+gaming warning (kept the one at line ~175)

  if (answers.system === 'chrome' && (
    answers.photoVideo === 'pro' ||
    answers.workload === 'heavy' ||
    uses.includes('gaming'))
  ) {
    specs.warnings.push('ChromeOS no es ideal para tareas pesadas o software profesional. Considerá Windows o macOS.')
  }



  specs.storage = scores.storage >= 2 ? '512 GB SSD' : '256 GB SSD'

  if (specs.storage === '256 GB SSD' && uses.includes('creating')) {
    specs.warnings.push('256 GB puede llenarse rápido con archivos de diseño o video. Considerá 512 GB o más.')
  }


  specs.gpu =
    scores.graphics >= 4 ? 'NVIDIA RTX 3050 o superior' :
      scores.graphics >= 2 ? 'Intel Iris Xe / Radeon Vega' :
        'Gráficos integrados básicos'
  // Override para macOS: siempre Apple Silicon
  if (answers.system === 'mac') {
    specs.gpu = 'Apple integrada (M1/M2/M3) o Intel HD (modelos antiguos)'
  }


  specs.portability = scores.portability >= 3 ? 'Alta (menos de 1.5kg, 14")' : 'Media o baja'
  specs.battery = scores.battery >= 3 ? 'Alta (8h o más)' : 'Media (4-7h)'

  // ==== 3. Sistema operativo filtrado ====
  // BUG-03 FIX: Added explicit 'any' case so intent is documented
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
    case 'any':
    default:
      // 'any' or unset → recommend Windows (most compatible)
      specs.os = 'Windows 11'
  }

  // ==== 4. Validaciones cruzadas ====
  if (specs.os === 'macOS') {
    if (uses.includes('gaming')) {
      specs.warnings.push('macOS no es ideal para juegos exigentes ni es compatible con la mayoría de títulos AAA. Recomendamos Windows.')
    }
    // T1.2: REMOVED dead code (ChromeOS check inside macOS block — impossible path)
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
    // T1.2: Moved ChromeOS+gaming warning here (was dead code inside macOS block)
    if (uses.includes('gaming') && answers.system === 'chrome') {
      specs.warnings.unshift('⚠️ Elegiste "juegos exigentes" pero seleccionaste ChromeOS, que no soporta juegos avanzados. Recomendamos Windows si querés jugar títulos como GTA, FIFA o similares.')
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
  // BUG-02 FIX: Removed dead idealRam warning — specs.ram is calculated with identical
  // logic so the condition specs.ram !== idealRam can never trigger under normal flow.
  // The only exception (RTX GPU override → 16 GB) is already explained by rationale.

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

  const bestModels = matchLaptopClass(specs)
  specs.laptopClass = bestModels

  let approximateModels = []
  if (bestModels.length === 0 || (bestModels.length === 1 && bestModels[0].name === 'Clase genérica')) {
    approximateModels = matchLaptopClassRelaxed(specs).map(m => ({ ...m, isApproximate: true }))
  }
  specs.approximateClass = approximateModels


  const osFilter = specs.os.toLowerCase()
  const osFiltered = bestModels.filter(m => {
      // Exclude generic class
      if (m.name === 'Clase genérica' || m.isGeneric) return false

      if (osFilter.includes('chrome') && !isChromeOS(m.name)) return false
      if (osFilter.includes('macos') && !isMac(m.name, m.gpu)) return false
      if (osFilter.includes('windows') && !isWindows(m.name, m.gpu)) return false
      return true
    })

  // T1.5/T1.14: When OS filter returns empty, don't fallback to unfiltered models
  if (osFiltered.length === 0) {
    let fallbackMsg = '⚠️ No encontramos laptops con ';

    if (specs.os === 'ChromeOS') fallbackMsg += 'ChromeOS ';
    else if (specs.os === 'macOS') fallbackMsg += 'macOS ';
    else fallbackMsg += 'el sistema operativo deseado ';

    fallbackMsg += 'para tus necesidades. Mostramos opciones similares con Windows.';

    specs.warnings.push(fallbackMsg);
    specs.laptopClass = [];
  } else {
    specs.laptopClass = osFiltered;
  }

  // Also filter approximate models by OS
  if (specs.approximateClass && specs.approximateClass.length > 0) {
    const osFilterApprox = specs.os.toLowerCase()
    specs.approximateClass = specs.approximateClass.filter(m => {
      if (osFilterApprox.includes('chrome') && !isChromeOS(m.name)) return false
      if (osFilterApprox.includes('macos') && !isMac(m.name, m.gpu)) return false
      if (osFilterApprox.includes('windows') && !isWindows(m.name, m.gpu)) return false
      return true
    })
  }

  // T1.15: Proper fallback when no models match — generate generic spec profile
  if (specs.laptopClass.length === 0 && (!specs.approximateClass || specs.approximateClass.length === 0)) {
    specs.laptopClass = [{
      id: 'generic-recommendation',
      name: `Laptop recomendada: ${specs.processor}, ${specs.ram} RAM, ${specs.gpu}`,
      specs: `${specs.processor}, ${specs.ram} RAM, ${specs.storage}, ${specs.gpu}`,
      gpu: specs.gpu,
      price: 'Consultar precio',
      portability: specs.portability,
      image: '',
      link: `https://www.google.com/search?q=${encodeURIComponent(`laptop ${specs.processor} ${specs.ram} ${specs.gpu}`)}`,
      isGeneric: true
    }]
  }


  // Verificación si el modelo tiene menos RAM que la recomendada
  if (
    Array.isArray(bestModels) &&
    specs.ram === '12 GB' &&
    bestModels.some(m => m.specs.toLowerCase().includes('8 gb'))
  ) {
    specs.warnings.push('Uno de los modelos sugeridos tiene 8 GB de RAM, que puede ser justo si hacés mucha multitarea.')
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


  if (answers.budget === 'low' && (
    scores.performance >= 4 ||
    scores.graphics >= 2 ||
    scores.multitasking >= 4 ||
    uses.includes('creating')
  )) {
    specs.warnings.push('⚠️ Tu presupuesto bajo puede limitar el rendimiento que necesitás. Considerá ajustar prioridades o aumentar presupuesto.')
  }

  // === VALIDACIÓN DE USO CONTRADICTORIO ===
  const isBasicUseOnly = Array.isArray(answers.mainUse)
    ? answers.mainUse.length === 1 && answers.mainUse[0] === 'entertainment'
    : answers.mainUse === 'entertainment'

  const isDemandingUser =
    answers.workload === 'heavy' ||
    answers.photoVideo === 'pro' ||
    scores.performance >= 4 ||
    scores.multitasking >= 4 ||
    scores.graphics >= 2.5

  if (isBasicUseOnly && isDemandingUser) {
    specs.warnings.unshift('⚠️ Elegiste un uso simple como "ver videos", pero tus respuestas indican tareas exigentes como edición o multitarea pesada. Considerá ajustar tu selección inicial para mejorar la recomendación.')
  }

  // T1.3: Add missing flags
  specs.flags = {
    prioritizePortability: answers.importance === 'portability',
    prioritizeSecurity: answers.importance === 'security',
    prioritizeGaming: answers.gamesType === 'complex' || uses.includes('gaming'),
    prioritizeScreenQuality: answers.importance === 'screen'
  }



  return specs
}

export default convertToSpecs
