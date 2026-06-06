import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Disclaimer from './components/Disclaimer'
import Landing from './pages/Landing'
import Roadmap from './pages/Roadmap'
import ComingSoon from './pages/ComingSoon'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/roadmap/:routeId" element={<Roadmap />} />
        <Route path="*" element={<ComingSoon />} />
      </Routes>
      <Disclaimer />
    </>
  )
}
