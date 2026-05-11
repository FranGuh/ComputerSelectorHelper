import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/Landing/Landing'
import Quiz from '../pages/Quiz/Quiz'
import Compare from '../pages/Compare/Compare'
import NotFound from '../pages/NotFound/NotFound'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/compare" element={<Compare />} />
      {/* DT-03: Proper 404 page instead of redirect to Landing */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
