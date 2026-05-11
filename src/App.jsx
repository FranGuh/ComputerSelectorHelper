import './App.css'
import { BrowserRouter, NavLink } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import AppRoutes from './routes/AppRoutes'
import { Analytics } from "@vercel/analytics/react"
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <header className="AppHeader">
          <div className="AppHeader__brand">
            <h1>Computer Selector <span className='title__alter'>Helper</span></h1>
          </div>
          <nav className="AppNav" aria-label="Navegación principal">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'AppNav__link active' : 'AppNav__link'}>Inicio</NavLink>
            <NavLink to="/quiz" className={({ isActive }) => isActive ? 'AppNav__link active' : 'AppNav__link'}>Quiz</NavLink>
            <NavLink to="/compare" className={({ isActive }) => isActive ? 'AppNav__link active' : 'AppNav__link'}>Comparar</NavLink>
          </nav>
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
