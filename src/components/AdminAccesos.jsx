import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseclient'

export default function AdminAccesos({ session }) {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    setLoading(true)
    const { data, error } = await supabase.rpc('admin_list_admins')
    if (!error) setAdmins(data)
    setLoading(false)
  }

  const [password, setPassword] = useState('')   // <-- agrega este estado arriba, junto a los demás useState

const handleAddAdmin = async (e) => {
  e.preventDefault()
  setBuscando(true)
  setMensaje(null)
  try {
    const { data, error } = await supabase.functions.invoke('create-admin', {
      body: { email: email.trim(), password },
    })
    if (error) throw error
    if (data?.error) {
      setMensaje({ tipo: 'error', texto: data.error })
    } else {
      setMensaje({ tipo: 'exito', texto: `Cuenta creada y acceso otorgado a ${email}.` })
      setEmail('')
      setPassword('')
      cargar()
    }
  } catch (error) {
    setMensaje({ tipo: 'error', texto: error.message })
  } finally {
    setBuscando(false)
  }
}

  const handleRemoveAdmin = async (uuid, correo) => {
    if (uuid === session.user.id) return
    if (!window.confirm(`¿Quitar permisos de administrador a ${correo}?`)) return
    await supabase.from('admins').delete().eq('user_id', uuid)
    cargar()
  }

  return (
    <div className="dash-card">
      <h2>Gestión de administradores</h2>
      <p className="hint-text">
  Crea la cuenta del nuevo administrador con su correo y una contraseña temporal. Se le otorgará acceso al panel de inmediato.
</p>

      {mensaje && (
        <div className={`auth-alert ${mensaje.tipo === 'exito' ? 'alert-success' : 'alert-error'}`}>{mensaje.texto}</div>
      )}

      <form onSubmit={handleAddAdmin} className="inline-form">
  <input
    type="email"
    placeholder="correo@ejemplo.com"
    value={email}
    onChange={e => setEmail(e.target.value)}
    required
  />
  <input
    type="text"
    placeholder="Contraseña temporal"
    value={password}
    onChange={e => setPassword(e.target.value)}
    required
    minLength={6}
  />
  <button type="submit" className="btn-submit btn-inline" disabled={buscando}>
    {buscando ? 'Creando...' : 'Crear y dar acceso'}
  </button>
</form>

      {loading ? <p>Cargando...</p> : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Correo</th>
              <th>Fecha de asignación</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.user_id}>
                <td>{a.email}{a.user_id === session.user.id && <span className="badge-pill badge-success" style={{ marginLeft: 8 }}>Tú</span>}</td>
                <td>{new Date(a.created_at).toLocaleDateString('es-PE')}</td>
                <td>
                  {a.user_id !== session.user.id && (
                    <button onClick={() => handleRemoveAdmin(a.user_id, a.email)} className="btn-icon delete">Revocar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}