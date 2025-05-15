import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <BrowserRouter>
      <h1>Computer Selector <span className='title__alter'>Helper</span></h1>
      <AppRoutes />
      <Analytics />
      <a href="https://redirect-link-flame.vercel.app/" target="_blank" rel="noopener noreferrer">
        <h5>Coded by @Fran</h5>
      </a>


    </BrowserRouter>

  )
}

export default App
