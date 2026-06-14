import React from 'react'
import { getBarWidth } from '../../utils/parseSpecs'
import './SpecBar.css'

/**
 * Proportional spec bar for the comparison table.
 * Pure CSS, no charting dependency. The numeric value is shown in the cell
 * itself, so the bar is an `img` with a descriptive label for assistive tech.
 */
const SpecBar = ({ value, max, metric = 'ram', ariaLabel }) => {
  const width = getBarWidth(value, max)
  return (
    <div className={`SpecBar SpecBar--${metric}`} role="img" aria-label={ariaLabel}>
      <div className="SpecBar__fill" style={{ width: `${width}%` }} />
    </div>
  )
}

export default SpecBar
