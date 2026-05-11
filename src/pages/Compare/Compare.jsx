import React, { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import laptopModels from '../../utils/laptopModels'
import { parseModelSpecs, getBestIndices } from '../../utils/parseSpecs'
import './Compare.css'
import { FaPlus, FaTimes, FaSearch, FaArrowLeft, FaChevronUp, FaChevronDown } from 'react-icons/fa'

const MAX_COMPARE = 3
const LS_KEY = 'csh_compare_ids'

function Compare() {
  const navigate = useNavigate()
  const [selectedIds, setSelectedIds] = useState(() => {
    // 1. Prioridad: URL param
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const raw = params.get('models')
      if (raw) {
        const ids = raw.split(',').filter(id => laptopModels.some(m => m.id === id))
        if (ids.length > 0) return ids.slice(0, MAX_COMPARE)
      }
    }
    // 2. Fallback: localStorage
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) {
        const ids = JSON.parse(saved)
        if (Array.isArray(ids) && ids.length > 0) {
          const valid = ids.filter(id => laptopModels.some(m => m.id === id))
          return valid.slice(0, MAX_COMPARE)
        }
      }
    } catch { /* ignore */ }
    return []
  })
  
  const [search, setSearch] = useState('')
  const [filterOS, setFilterOS] = useState('all')
  const [sortBy, setSortBy] = useState('price')
  const [shareCopied, setShareCopied] = useState(false)
  
  const [gridCollapsed, setGridCollapsed] = useState(() => {
    // Si viene directo con modelos seleccionados (ej: desde Quiz), por defecto colapsamos la grilla para que vea la tabla directo
    const urlParams = new URLSearchParams(window.location.search)
    const hasModelsInUrl = urlParams.get('models')
    
    try {
      const saved = localStorage.getItem('csh_compare_grid_collapsed')
      if (saved !== null) {
        // Si hay una preferencia guardada y no venimos recién del Quiz, respetamos la preferencia
        if (!hasModelsInUrl) return JSON.parse(saved)
      }
    } catch { /* ignore */ }
    
    // Si llegamos de la recomendación con modelos, forzar colapso inicial.
    // Si no, arrancar expandido (false).
    return hasModelsInUrl ? true : false
  })
  const tableRef = useRef(null)
  const prevTableVisible = useRef(false)

  // Persist grid collapse state
  useEffect(() => {
    localStorage.setItem('csh_compare_grid_collapsed', JSON.stringify(gridCollapsed))
  }, [gridCollapsed])

  // Persist selection to localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(selectedIds))
  }, [selectedIds])

  // Keep URL in sync with selection
  useEffect(() => {
    const url = new URL(window.location.href)
    if (selectedIds.length > 0) {
      url.searchParams.set('models', selectedIds.join(','))
    } else {
      url.searchParams.delete('models')
    }
    window.history.replaceState({}, '', url.toString())
  }, [selectedIds])

  // FIX-3: auto-expand grid when all models are removed (except on initial load)
  const isInitialMount = useRef(true)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (selectedIds.length === 0) setGridCollapsed(false)
  }, [selectedIds])

  // Scroll comparison table into view when it first appears (2 → 3 models or 1 → 2)
  useEffect(() => {
    const tableVisible = selectedIds.length >= 2
    if (tableVisible && !prevTableVisible.current && tableRef.current) {
      setTimeout(() => tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    }
    prevTableVisible.current = tableVisible
  }, [selectedIds])

  const toggleModel = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= MAX_COMPARE) return prev
      const next = [...prev, id]
      // Auto-collapse grid when 2+ models are selected
      if (next.length >= 2) setGridCollapsed(true)
      return next
    })
  }

  const removeModel = (id) => setSelectedIds(prev => prev.filter(x => x !== id))

  // Filter + sort the catalog
  const displayModels = laptopModels
    .filter(m => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.specs.toLowerCase().includes(search.toLowerCase()) ||
        m.gpu.toLowerCase().includes(search.toLowerCase())
      if (!matchSearch) return false
      if (filterOS === 'all') return true
      const { os } = parseModelSpecs(m)
      return (
        (filterOS === 'windows' && os === 'Windows') ||
        (filterOS === 'mac' && os === 'macOS') ||
        (filterOS === 'chrome' && os === 'ChromeOS')
      )
    })
    .sort((a, b) => {
      const pa = parseModelSpecs(a)
      const pb = parseModelSpecs(b)
      if (sortBy === 'price') return pa.price - pb.price
      if (sortBy === 'ram') return pb.ram - pa.ram
      if (sortBy === 'gpu') return pb.gpuTier - pa.gpuTier
      return a.name.localeCompare(b.name)
    })

  const selectedModels = selectedIds
    .map(id => laptopModels.find(m => m.id === id))
    .filter(Boolean)

  // Pre-compute parsed specs & best-value highlights
  const parsedModels = selectedModels.map(m => parseModelSpecs(m))
  const bestPrice = getBestIndices(parsedModels.map(p => p.price), false)
  const bestRam = getBestIndices(parsedModels.map(p => p.ram), true)
  const bestStorage = getBestIndices(parsedModels.map(p => p.storageGB), true)
  const bestGPU = getBestIndices(parsedModels.map(p => p.gpuTier), true)

  const handleShare = () => {
    const url = `${window.location.origin}/compare?models=${selectedIds.join(',')}`
    navigator.clipboard?.writeText(url)
      .then(() => { setShareCopied(true); setTimeout(() => setShareCopied(false), 2500) })
      .catch(() => prompt('Copiá este link de comparación:', url))
  }

  return (
    <div className="ComparePage">
      <Helmet>
        <title>Comparar laptops — Computer Selector Helper</title>
        <meta name="description" content="Compará hasta 3 laptops lado a lado: procesador, RAM, almacenamiento, GPU y precio." />
        <meta property="og:title" content="Comparar laptops — Computer Selector Helper" />
        <meta property="og:url" content="https://computerselectorhelper.vercel.app/compare" />
      </Helmet>

      {/* Header */}
      <div className="CompareHeader">
        <button className="CompareBackBtn" onClick={() => navigate(-1)} aria-label="Volver">
          <FaArrowLeft aria-hidden="true" /> <span className="CompareBackBtn__text">Volver</span>
        </button>
        <h2>Comparar laptops</h2>
        <p className="CompareSubtitle">
          Seleccioná hasta {MAX_COMPARE} laptops para comparar sus especificaciones
        </p>
      </div>

      {/* Filters */}
      <div className="CompareFilters">
        <div className="CompareSearch">
          <FaSearch className="CompareSearchIcon" aria-hidden="true" />
          <input
            id="compare-search"
            type="search"
            placeholder="Buscar por nombre, specs o GPU…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="CompareSearchInput"
            aria-label="Buscar laptops"
          />
        </div>
        <select
          value={filterOS}
          onChange={e => setFilterOS(e.target.value)}
          className="CompareSelect"
          aria-label="Filtrar por sistema operativo"
        >
          <option value="all">Todos los sistemas</option>
          <option value="windows">Windows</option>
          <option value="mac">macOS</option>
          <option value="chrome">ChromeOS</option>
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="CompareSelect"
          aria-label="Ordenar modelos"
        >
          <option value="price">Precio: menor primero</option>
          <option value="ram">RAM: mayor primero</option>
          <option value="gpu">GPU: mejor primero</option>
          <option value="name">Nombre A–Z</option>
        </select>
      </div>

      {/* Selection counter + toggle */}
      <div className="CompareSelectionBar">
        <p className="CompareSelectionStatus" aria-live="polite">
          {selectedIds.length === 0
            ? 'Hacé click en una laptop para agregarla a la comparación'
            : `${selectedIds.length}/${MAX_COMPARE} laptops seleccionadas${selectedIds.length < 2 ? ' — seleccioná al menos una más para comparar' : ''}`
          }
        </p>
        {selectedIds.length > 0 && (
          <button
            className="CompareGridToggleBtn"
            onClick={() => setGridCollapsed(c => !c)}
            aria-expanded={!gridCollapsed}
            aria-controls="compare-model-grid"
          >
            {gridCollapsed
              ? <><FaChevronDown aria-hidden="true" /> Mostrar catálogo</>
              : <><FaChevronUp aria-hidden="true" /> Ocultar catálogo</>
            }
          </button>
        )}
      </div>

      {/* Mini strip of selected models when grid is collapsed */}
      {gridCollapsed && selectedIds.length > 0 && (
        <div className="CompareSelectedStrip" role="list" aria-label="Modelos seleccionados">
          {selectedIds.map(id => {
            const m = laptopModels.find(x => x.id === id)
            if (!m) return null
            return (
              <div key={id} className="CompareSelectedChip" role="listitem">
                <img
                  src={m.image}
                  alt={m.name}
                  className="CompareSelectedChip__img"
                  onError={e => { e.target.src = '/help.svg'; e.target.onerror = null }}
                />
                <span className="CompareSelectedChip__name">{m.name}</span>
                <button
                  className="CompareSelectedChip__remove"
                  onClick={() => removeModel(id)}
                  aria-label={`Quitar ${m.name}`}
                >
                  <FaTimes />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Model picker grid */}
      {displayModels.length === 0 && !gridCollapsed && (
        <div className="CompareEmpty">
          <p>No hay laptops que coincidan con tu búsqueda.</p>
          <button className="CompareEmpty__clearBtn" onClick={() => { setSearch(''); setFilterOS('all'); }}>Limpiar filtros</button>
        </div>
      )}
      <div
        id="compare-model-grid"
        className={`CompareModelGrid${gridCollapsed ? ' CompareModelGrid--collapsed' : ''}`}
        role="list"
        aria-label="Catálogo de laptops"
        aria-hidden={gridCollapsed}
      >
        {displayModels.map(model => {
          const isSelected = selectedIds.includes(model.id)
          const isDisabled = !isSelected && selectedIds.length >= MAX_COMPARE
          return (
            <button
              key={model.id}
              role="listitem"
              className={`CompareModelCard${isSelected ? ' selected' : ''}${isDisabled ? ' disabled' : ''}`}
              onClick={() => toggleModel(model.id)}
              disabled={isDisabled}
              aria-pressed={isSelected}
              aria-label={`${isSelected ? 'Quitar' : 'Agregar'} ${model.name}`}
            >
              <img
                src={model.image}
                alt={model.name}
                className="CompareModelCard__img"
                onError={e => { e.target.src = '/help.svg'; e.target.onerror = null }}
              />
              <div className="CompareModelCard__info">
                <span className="CompareModelCard__name">{model.name}</span>
                <span className="CompareModelCard__price">{model.price}</span>
              </div>
              <div className="CompareModelCard__badge" aria-hidden="true">
                {isSelected ? <FaTimes /> : <FaPlus />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Comparison table — only when 2+ selected */}
      {selectedModels.length >= 2 && (
        <div className="CompareTableSection" ref={tableRef}>
          <h3>Comparación de especificaciones</h3>
          <div className="CompareTableWrapper">
            <table className="CompareTable" aria-label="Tabla comparativa de laptops">
              <thead>
                <tr>
                  <th scope="col" className="CompareTable__label">Especificación</th>
                  {selectedModels.map(m => (
                    <th key={m.id} scope="col" className="CompareTable__modelHeader">
                      <button
                        className="CompareTable__removeBtn"
                        onClick={() => removeModel(m.id)}
                        aria-label={`Quitar ${m.name}`}
                      >
                        <FaTimes />
                      </button>
                      <img
                        src={m.image}
                        alt={m.name}
                        className="CompareTable__modelImg"
                        onError={e => { e.target.src = '/help.svg'; e.target.onerror = null }}
                      />
                      <span className="CompareTable__modelName">{m.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price */}
                <tr>
                  <th scope="row" className="CompareTable__label">💰 Precio</th>
                  {selectedModels.map((m, i) => (
                    <td key={m.id} className={`CompareTable__cell${bestPrice[i] ? ' best' : ''}`}>
                      {m.price}
                      {bestPrice[i] && <span className="BestBadge">Menor precio</span>}
                    </td>
                  ))}
                </tr>
                {/* RAM */}
                <tr>
                  <th scope="row" className="CompareTable__label">🧠 RAM</th>
                  {parsedModels.map((p, i) => (
                    <td key={selectedModels[i].id} className={`CompareTable__cell${bestRam[i] ? ' best' : ''}`}>
                      {p.ram > 0 ? `${p.ram} GB` : 'N/A'}
                      {bestRam[i] && <span className="BestBadge">Mayor RAM</span>}
                    </td>
                  ))}
                </tr>
                {/* Storage */}
                <tr>
                  <th scope="row" className="CompareTable__label">💾 Almacenamiento</th>
                  {parsedModels.map((p, i) => (
                    <td key={selectedModels[i].id} className={`CompareTable__cell${bestStorage[i] ? ' best' : ''}`}>
                      {p.storageLabel}
                      {bestStorage[i] && <span className="BestBadge">Mayor storage</span>}
                    </td>
                  ))}
                </tr>
                {/* GPU */}
                <tr>
                  <th scope="row" className="CompareTable__label">🎮 GPU</th>
                  {selectedModels.map((m, i) => (
                    <td key={m.id} className={`CompareTable__cell${bestGPU[i] ? ' best' : ''}`}>
                      {m.gpu}
                      {bestGPU[i] && <span className="BestBadge">Mejor GPU</span>}
                    </td>
                  ))}
                </tr>
                {/* Processor */}
                <tr>
                  <th scope="row" className="CompareTable__label">⚙️ Procesador</th>
                  {parsedModels.map((p, i) => (
                    <td key={selectedModels[i].id} className="CompareTable__cell">
                      {p.processor}
                    </td>
                  ))}
                </tr>
                {/* Screen */}
                <tr>
                  <th scope="row" className="CompareTable__label">🖥️ Pantalla</th>
                  {parsedModels.map((p, i) => (
                    <td key={selectedModels[i].id} className="CompareTable__cell">
                      {p.screenLabel}
                    </td>
                  ))}
                </tr>
                {/* OS */}
                <tr>
                  <th scope="row" className="CompareTable__label">💻 Sistema</th>
                  {parsedModels.map((p, i) => (
                    <td key={selectedModels[i].id} className="CompareTable__cell">
                      {p.os}
                    </td>
                  ))}
                </tr>
                {/* Portability */}
                <tr>
                  <th scope="row" className="CompareTable__label">🎒 Portabilidad</th>
                  {selectedModels.map(m => (
                    <td key={m.id} className="CompareTable__cell">
                      {m.portability}
                    </td>
                  ))}
                </tr>
                {/* Ideal for */}
                <tr>
                  <th scope="row" className="CompareTable__label">✅ Ideal para</th>
                  {selectedModels.map(m => (
                    <td key={m.id} className="CompareTable__cell CompareTable__cell--muted">
                      {m.use}
                    </td>
                  ))}
                </tr>
                {/* Store links */}
                <tr>
                  <th scope="row" className="CompareTable__label">🔗 Ver</th>
                  {selectedModels.map(m => (
                    <td key={m.id} className="CompareTable__cell">
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="CompareTable__storeLink"
                        aria-label={`Buscar ${m.name} en Google`}
                      >
                        Buscar →
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Share comparison */}
          <div className="CompareShareRow">
            <button
              id="share-compare-btn"
              className="CompareShareBtn"
              onClick={handleShare}
              aria-label="Copiar link de esta comparación"
            >
              {shareCopied ? '✅ Link copiado!' : '📋 Compartir esta comparación'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Compare
