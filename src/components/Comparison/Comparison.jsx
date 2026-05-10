import LaptopCard from '../LaptopCard/LaptopCard'

export default function Comparison({ laptops, onBack }) {
  const specs = ['processor', 'ram', 'storage', 'gpu', 'os', 'portability', 'battery']
  const specLabels = {
    processor: 'Procesador',
    ram: 'RAM',
    storage: 'Almacenamiento',
    gpu: 'Gráficos',
    os: 'Sistema operativo',
    portability: 'Portabilidad',
    battery: 'Batería',
  }

  const parseNum = (str) => {
    if (!str) return 0
    const nums = str.match(/\d+/g)
    return nums ? nums.reduce((a, b) => a + parseInt(b), 0) : 0
  }

  const getBetter = (spec, a, b) => {
    const va = a[spec] || ''
    const vb = b[spec] || ''
    if (va === vb) return 'equal'
    const na = parseNum(va)
    const nb = parseNum(vb)
    if (spec === 'ram' || spec === 'storage' || spec === 'processor') {
      return na > nb ? 'a' : na < nb ? 'b' : 'equal'
    }
    return 'equal'
  }

  return (
    <div className="ComparisonContainer">
      <button className="ComparisonBack" onClick={onBack}>
        ← Volver a resultados
      </button>
      <h2>Comparación de laptops</h2>
      <div className="ComparisonGrid">
        <div className="ComparisonLabels">
          <div className="ComparisonLabelHeader">Especificación</div>
          {laptops.map((l, i) => (
            <div key={i} className="ComparisonLaptopHeader">
              <img src={l.image} alt={l.name} loading="lazy" />
              <h3>{l.name}</h3>
              <p className="ComparisonPrice">{l.price}</p>
            </div>
          ))}
        </div>
        {specs.map((spec) => {
          const better = laptops.length === 2 ? getBetter(spec, laptops[0], laptops[1]) : 'equal'
          return (
            <div key={spec} className="ComparisonRow">
              <div className="ComparisonSpecLabel">{specLabels[spec]}</div>
              {laptops.map((l, i) => {
                const isBetter = better === 'a' && i === 0 || better === 'b' && i === 1
                return (
                  <div key={i} className={`ComparisonValue ${isBetter ? 'better' : ''}`}>
                    {l[spec] || '—'}
                    {isBetter && <span className="BetterBadge">✓ Mejor</span>}
                  </div>
                )
              })}
            </div>
          )
        })}
        <div className="ComparisonRow">
          <div className="ComparisonSpecLabel">Uso recomendado</div>
          {laptops.map((l, i) => (
            <div key={i} className="ComparisonValue">{l.use}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
