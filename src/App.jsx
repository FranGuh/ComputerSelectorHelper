import './App.css'
import { BrowserRouter, NavLink, Link } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import AppRoutes from './routes/AppRoutes'
import { Analytics } from "@vercel/analytics/react"
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <header className="AppHeader">
          <div className="AppHeader__brand">
            <Link to="/" className="AppHeader__brandLink" aria-label="Computer Selector Helper — Inicio">
              Computer Selector <span className='title__alter'>Helper</span>
            </Link>
          </div>
          <div className="AppHeader__actions">
            <nav className="AppNav" aria-label="Navegación principal">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'AppNav__link active' : 'AppNav__link'}>Inicio</NavLink>
              <NavLink to="/quiz" className={({ isActive }) => isActive ? 'AppNav__link active' : 'AppNav__link'}>Quiz</NavLink>
              <NavLink to="/compare" className={({ isActive }) => isActive ? 'AppNav__link active' : 'AppNav__link'}>Comparar</NavLink>
            </nav>
            <ThemeToggle />
          </div>
        </header>
        <main>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </main>
        <footer>
          <a href="https://redirect-link-flame.vercel.app/" target="_blank" rel="noopener noreferrer" className="Footer__link">
            Coded by @Fran
          </a>
        </footer>
        <Analytics />
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
