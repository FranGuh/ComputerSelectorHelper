import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <BrowserRouter>
      <h1>Computer Selector <span className='title__alter'>Helper</span></h1>
      <AppRoutes />
          <Analytics/>
      <h5>Coded by @Fran</h5>
    </BrowserRouter>

  )
}

export default App
