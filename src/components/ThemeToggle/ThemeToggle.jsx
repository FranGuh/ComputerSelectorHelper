import { FaMoon, FaSun } from 'react-icons/fa'
import useTheme from '../../hooks/useTheme'
import './ThemeToggle.css'

/**
 * Light/dark theme toggle button.
 *
 * Renders an accessible <button> whose label reflects the action it performs
 * (activating the opposite theme). The icon cross-fades between sun and moon.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Activar modo claro' : 'Activar modo oscuro'

  return (
    <button
      type="button"
      className="ThemeToggle"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      <span className="ThemeToggle__icon" aria-hidden="true">
        {isDark ? <FaSun /> : <FaMoon />}
      </span>
    </button>
  )
}
