import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css' // Tus estilos globales

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter es obligatorio porque tu Navbar usa <Link> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)