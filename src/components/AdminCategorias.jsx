import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseclient'

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [mensaje, setMensaje] = useState(null)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ nombre: '', orden: 0, activa: true })
  const [guardando, setGuardando] = useState(false)

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('categories').select('*').order('orden', { ascending: true })
    if (!error) setCategorias(data)
    setLoading(false)
  }

  const resetForm = () => {
    setEditId(null)
    setForm({ nombre: '', orden: categorias.length, activa: true })
  }

  const handleEditar = (cat) => {
    setEditId(cat.id)
    setForm({ nombre: cat.nombre, orden: cat.orden, activa: cat.activa })
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje(null)
    try {
      if (editId) {
        const { error } = await supabase.from('categories')
          .update({ nombre: form.nombre, orden: Number(form.orden), activa: form.activa })
          .eq('id', editId)
        if (error) throw error
        setMensaje({ tipo: 'exito', texto: 'Categoría actualizada.' })
      } else {
        const { error } = await supabase.from('categories')
          .insert([{ nombre: form.nombre, orden: Number(form.orden), activa: form.activa }])
        if (error) throw error
        setMensaje({ tipo: 'exito', texto: 'Categoría creada.' })
      }
      resetForm()
      cargar()
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message.includes('duplicate') ? 'Ya existe una categoría con ese nombre.' : error.message })
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminar = async (cat) => {
    if (!window.confirm(`¿Eliminar la categoría "${cat.nombre}"? Los productos que la usan quedarán sin categoría.`)) return
    const { error } = await supabase.from('categories').delete().eq('id', cat.id)
    if (error) {
      setMensaje({ tipo: 'error', texto: error.message })
    } else {
      cargar()
    }
  }

  const moverOrden = async (cat, direccion) => {
    const idx = categorias.findIndex(c => c.id === cat.id)
    const otro = categorias[idx + direccion]
    if (!otro) return
    await Promise.all([
      supabase.from('categories').update({ orden: otro.orden }).eq('id', cat.id),
      supabase.from('categories').update({ orden: cat.orden }).eq('id', otro.id),
    ])
    cargar()
  }

  return (
    <div className="dash-card">
      <h2>Categorías del catálogo</h2>
      {mensaje && (
        <div className={`auth-alert ${mensaje.tipo === 'exito' ? 'alert-success' : 'alert-error'}`}>{mensaje.texto}</div>
      )}

      <form onSubmit={handleGuardar} className="inline-form">
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          required
        />
        <label className="checkbox-label checkbox-inline">
          <input type="checkbox" checked={form.activa} onChange={e => setForm({ ...form, activa: e.target.checked })} />
          Activa
        </label>
        <button type="submit" className="btn-submit btn-inline" disabled={guardando}>
          {editId ? 'Guardar cambios' : 'Agregar categoría'}
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
            {categorias.map((cat, idx) => (
              <tr key={cat.id}>
                <td>
                  <div className="orden-controls">
                    <button className="btn-icon" onClick={() => moverOrden(cat, -1)} disabled={idx === 0} title="Subir">↑</button>
                    <button className="btn-icon" onClick={() => moverOrden(cat, 1)} disabled={idx === categorias.length - 1} title="Bajar">↓</button>
                  </div>
                </td>
                <td>{cat.nombre}</td>
                <td>
                  <span className={`badge-pill ${cat.activa ? 'badge-success' : 'badge-muted'}`}>
                    {cat.activa ? 'Activa' : 'Oculta'}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEditar(cat)} className="btn-icon edit">Editar</button>
                  <button onClick={() => handleEliminar(cat)} className="btn-icon delete">Borrar</button>
                </td>
              </tr>
            ))}
            {categorias.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>Aún no tienes categorías.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}