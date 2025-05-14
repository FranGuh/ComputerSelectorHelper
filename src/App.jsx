import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <h1>Computer Selector <span className='title__alter'>Helper</span></h1>
      <AppRoutes />
      <h5>Coded by @Fran</h5>
    </BrowserRouter>
  )
}

export default App
