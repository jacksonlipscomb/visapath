import { Routes, Route } from 'react-router-dom'
import Disclaimer from './components/Disclaimer'
import Landing from './pages/Landing'
import Roadmap from './pages/Roadmap'
import ComingSoon from './pages/ComingSoon'

export default function App() {
  return (
    <>
      <Disclaimer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/roadmap/:routeId" element={<Roadmap />} />
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </>
  )
}
