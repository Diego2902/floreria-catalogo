import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseclient'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMensaje(null)

    try {
      // 1. Registramos al usuario en Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.nombre } // Guardamos su nombre
        }
      })

      if (error) throw error

      setMensaje({ tipo: 'exito', texto: '¡Registro exitoso! Ya puedes iniciar sesión.' })
      setTimeout(() => navigate('/login'), 2000) // Lo mandamos al login después de 2 seg
      
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Crear Cuenta</h1>
        <p className="auth-subtitle">Únete para gestionar tus pedidos y favoritos</p>

        {mensaje && (
          <div className={`auth-alert ${mensaje.tipo === 'exito' ? 'alert-success' : 'alert-error'}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nombre completo</label>
            <input 
              type="text" 
              required 
              placeholder="Ej: Juan Pérez"
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input 
              type="email" 
              required 
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              required 
              placeholder="Mínimo 6 caracteres"
              minLength="6"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear mi cuenta'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </main>
  )
}