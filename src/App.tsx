import { Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import DataRoom from './DataRoom'
import DocumentSharing from './DocumentSharing'
import ViewDocument from './ViewDocument'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dataroom" element={<DataRoom />} />
      <Route path="/document-sharing" element={<DocumentSharing />} />
      <Route path="/view/:shareLink" element={<ViewDocument />} />
    </Routes>
  )
}

export default App
