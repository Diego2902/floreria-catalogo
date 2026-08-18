import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseclient'
import AdminProductos from './AdminProductos'
import AdminCategorias from './AdminCategorias'
import AdminAccesos from './AdminAccesos'
import './admin-extra.css'
import AdminSecciones from './AdminSecciones'

const NAV = [
  { id: 'productos', label: '📦 Inventario' },
  { id: 'categorias', label: '🏷️ Categorías' },
  { id: 'secciones', label: '🗂️ Secciones' },
  { id: 'accesos', label: '🔑 Accesos admin' },
]

export default function AdminPanel() {
  const [session, setSession] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [view, setView] = useState('productos')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loadingAction, setLoadingAction] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setCheckingSession(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoadingAction(true)
    setMensaje(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMensaje({ tipo: 'error', texto: 'Credenciales incorrectas' })
    setLoadingAction(false)
  }

  if (checkingSession) {
    return <main className="admin-app auth-container"><p>Cargando...</p></main>
  }

  if (!session) {
    return (
      <main className="admin-app auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Dashboard Admin</h2>
          {mensaje && <div className="auth-alert alert-error">{mensaje.texto}</div>}
          <form onSubmit={handleLogin} className="auth-form">
            <input className="admin-input" type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className="admin-input" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="auth-btn" disabled={loadingAction}>Ingresar</button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <div className="admin-app dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <h3>Florería</h3>
          <p>{session.user.email}</p>
        </div>
        <nav className="dash-nav">
          {NAV.map(item => (
            <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => setView(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <button className="dash-logout" onClick={() => supabase.auth.signOut()}>Cerrar Sesión</button>
      </aside>

      <main className="dash-content">
        {view === 'productos' && <AdminProductos />}
        {view === 'categorias' && <AdminCategorias />}
        {view === 'secciones' && <AdminSecciones />}
        {view === 'accesos' && <AdminAccesos session={session} />}
      </main>
    </div>
  )
}