import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import AppRoutes from './routes/AppRoutes'
import { Analytics } from "@vercel/analytics/react"
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <header>
          <h1>Computer Selector <span className='title__alter'>Helper</span></h1>
        </header>
        <main>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </main>
        <footer>
          <a href="https://redirect-link-flame.vercel.app/" target="_blank" rel="noopener noreferrer">
            <h5>Coded by @Fran</h5>
          </a>
        </footer>
        <Analytics />
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
