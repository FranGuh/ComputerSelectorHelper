import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/Landing/Landing'
import Quiz from '../pages/Quiz/Quiz'


function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={<Landing />} />
      <Route path="/" element={<Landing />} />
      <Route path="/quiz" element={<Quiz />} />
    </Routes>
  )
}

export default AppRoutes
