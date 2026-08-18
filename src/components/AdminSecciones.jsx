import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseclient'

export default function AdminSecciones() {
  const [secciones, setSecciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [mensaje, setMensaje] = useState(null)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ nombre: '', orden: 0, activa: true })
  const [guardando, setGuardando] = useState(false)

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('sections').select('*').order('orden', { ascending: true })
    if (!error) setSecciones(data)
    setLoading(false)
  }

  const resetForm = () => {
    setEditId(null)
    setForm({ nombre: '', orden: secciones.length, activa: true })
  }

  const handleEditar = (sec) => {
    setEditId(sec.id)
    setForm({ nombre: sec.nombre, orden: sec.orden, activa: sec.activa })
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje(null)
    try {
      if (editId) {
        const { error } = await supabase.from('sections')
          .update({ nombre: form.nombre, orden: Number(form.orden), activa: form.activa })
          .eq('id', editId)
        if (error) throw error
        setMensaje({ tipo: 'exito', texto: 'Sección actualizada.' })
      } else {
        const { error } = await supabase.from('sections')
          .insert([{ nombre: form.nombre, orden: Number(form.orden), activa: form.activa }])
        if (error) throw error
        setMensaje({ tipo: 'exito', texto: 'Sección creada.' })
      }
      resetForm()
      cargar()
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message.includes('duplicate') ? 'Ya existe una sección con ese nombre.' : error.message })
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminar = async (sec) => {
    if (!window.confirm(`¿Eliminar la sección "${sec.nombre}"? Los productos que la tengan asignada quedarán sin ella.`)) return
    const { error } = await supabase.from('sections').delete().eq('id', sec.id)
    if (error) {
      setMensaje({ tipo: 'error', texto: error.message })
    } else {
      cargar()
    }
  }

  const moverOrden = async (sec, direccion) => {
    const idx = secciones.findIndex(s => s.id === sec.id)
    const otro = secciones[idx + direccion]
    if (!otro) return
    await Promise.all([
      supabase.from('sections').update({ orden: otro.orden }).eq('id', sec.id),
      supabase.from('sections').update({ orden: sec.orden }).eq('id', otro.id),
    ])
    cargar()
  }

  return (
    <div className="dash-card">
      <h2>Secciones del catálogo</h2>
      <p className="hint-text">Estas son las vitrinas del home (ej. "Elige por ocasión"). Un producto puede aparecer en varias a la vez.</p>
      {mensaje && (
        <div className={`auth-alert ${mensaje.tipo === 'exito' ? 'alert-success' : 'alert-error'}`}>{mensaje.texto}</div>
      )}

      <form onSubmit={handleGuardar} className="inline-form">
        <input
          type="text"
          placeholder="Nombre de la sección"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          required
        />
        <label className="checkbox-label checkbox-inline">
          <input type="checkbox" checked={form.activa} onChange={e => setForm({ ...form, activa: e.target.checked })} />
          Activa
        </label>
        <button type="submit" className="btn-submit btn-inline" disabled={guardando}>
          {editId ? 'Guardar cambios' : 'Agregar sección'}
        </button>
        {editId && (
          <button type="button" className="btn-secondary" onClick={resetForm}>Cancelar</button>
        )}
      </form>

      {loading ? <p>Cargando...</p> : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Orden</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {secciones.map((sec, idx) => (
              <tr key={sec.id}>
                <td>
                  <div className="orden-controls">
                    <button className="btn-icon" onClick={() => moverOrden(sec, -1)} disabled={idx === 0} title="Subir">↑</button>
                    <button className="btn-icon" onClick={() => moverOrden(sec, 1)} disabled={idx === secciones.length - 1} title="Bajar">↓</button>
                  </div>
                </td>
                <td>{sec.nombre}</td>
                <td>
                  <span className={`badge-pill ${sec.activa ? 'badge-success' : 'badge-muted'}`}>
                    {sec.activa ? 'Activa' : 'Oculta'}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEditar(sec)} className="btn-icon edit">Editar</button>
                  <button onClick={() => handleEliminar(sec)} className="btn-icon delete">Borrar</button>
                </td>
              </tr>
            ))}
            {secciones.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>Aún no tienes secciones.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}