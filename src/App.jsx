import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import WhatsAppFloat from './components/WhatsAppFloat'

// Importamos las páginas
import Home from './pages/Home'
import AdminPanel from './components/AdminPanel'


export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminPanel />} />
      </Routes>
      <WhatsAppFloat />

    </>
  )
}