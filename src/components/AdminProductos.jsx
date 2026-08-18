import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseclient'
import { formatMoney } from './adminUtils'
import { comprimirImagen } from '../lib/imageCompress'

const productoVacio = { id: null, numero: '', nombre: '', descripcion: '', precio: '', categoria_id: '', disponible: true, imagen_url: '' }

export default function AdminProductos() {
  const [view, setView] = useState('list')
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [producto, setProducto] = useState(productoVacio)
  const [foto, setFoto] = useState(null)
  const [procesandoIA, setProcesandoIA] = useState(false)
  const [previewIA, setPreviewIA] = useState(null)
  const [loadingAction, setLoadingAction] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  // Galería
  const [galeria, setGaleria] = useState([])
  const [subiendoGaleria, setSubiendoGaleria] = useState(false)

  // Secciones (muchos a muchos)
  const [secciones, setSecciones] = useState([])
  const [productoSecciones, setProductoSecciones] = useState([])

  // Toggle de estado directo desde la lista
  const [actualizandoEstadoId, setActualizandoEstadoId] = useState(null)

  useEffect(() => { cargarProductos(); cargarCategorias(); cargarSecciones() }, [])

  const cargarProductos = async () => {
    setLoadingData(true)
    const { data, error } = await supabase.from('products').select('*, categories(nombre)').order('created_at', { ascending: false })
    if (!error) setProductos(data)
    setLoadingData(false)
  }

  const cargarCategorias = async () => {
    const { data, error } = await supabase.from('categories').select('*').eq('activa', true).order('orden')
    if (!error) setCategorias(data)
  }

  const cargarGaleria = async (productId) => {
    const { data, error } = await supabase.from('product_images').select('*').eq('product_id', productId).order('orden')
    if (!error) setGaleria(data)
  }

  const cargarSecciones = async () => {
    const { data, error } = await supabase.from('sections').select('*').eq('activa', true).order('orden')
    if (!error) setSecciones(data)
  }

  const cargarProductoSecciones = async (productId) => {
    const { data, error } = await supabase.from('product_sections').select('section_id').eq('product_id', productId)
    if (!error) setProductoSecciones(data.map(r => r.section_id))
  }

  const toggleSeccion = (id) => {
    setProductoSecciones(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const guardarSeccionesProducto = async (productId) => {
    const { error: delError } = await supabase.from('product_sections').delete().eq('product_id', productId)
    if (delError) throw delError
    if (productoSecciones.length > 0) {
      const filas = productoSecciones.map(section_id => ({ product_id: productId, section_id }))
      const { error: insError } = await supabase.from('product_sections').insert(filas)
      if (insError) throw insError
    }
  }

  const resetForm = () => {
    setProducto(productoVacio)
    setFoto(null)
    setGaleria([])
    setProductoSecciones([])
  }

  const handleNuevo = () => { resetForm(); setMensaje(null); setView('form') }

  const handleEditar = (prod) => {
    setProducto({ ...prod, categoria_id: prod.categoria_id || '' })
    setFoto(null)
    setMensaje(null)
    cargarGaleria(prod.id)
    cargarProductoSecciones(prod.id)
    setView('form')
  }

  const handleGuardarProducto = async (e) => {
    e.preventDefault()
    setLoadingAction(true)
    setMensaje(null)

    try {
      let imagen_url = producto.imagen_url

      if (foto) {
            const fotoComprimida = await comprimirImagen(foto, { maxWidth: 1600, calidad: 0.8 })
            const fileName = `${Math.random()}.webp`
            const { error: uploadError } = await supabase.storage.from('productos').upload(fileName, fotoComprimida)
            if (uploadError) throw uploadError
            const { data: { publicUrl } } = supabase.storage.from('productos').getPublicUrl(fileName)
            imagen_url = publicUrl
        }

      const payload = {
        numero: producto.numero,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio ? parseFloat(producto.precio) : null,
        categoria_id: producto.categoria_id || null,
        disponible: producto.disponible,
        imagen_url,
      }

      if (producto.id) {
        const { error } = await supabase.from('products').update(payload).eq('id', producto.id)
        if (error) throw error
        await guardarSeccionesProducto(producto.id)
        setProducto({ ...producto, imagen_url })
        setFoto(null)
        setMensaje({ tipo: 'exito', texto: 'Producto actualizado.' })
      } else {
        const { data, error } = await supabase.from('products').insert([payload]).select().single()
        if (error) throw error
        await guardarSeccionesProducto(data.id)
        setProducto({ ...data, categoria_id: data.categoria_id || '' })
        setFoto(null)
        setMensaje({ tipo: 'exito', texto: 'Producto publicado. Ya puedes agregar fotos a la galería abajo.' })
      }
      cargarProductos()
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message })
    } finally {
      setLoadingAction(false)
    }
  }
  const handleMejorarFondo = async () => {
  if (!foto) {
    setMensaje({ tipo: 'error', texto: 'Primero selecciona una foto.' })
    return
  }
  setProcesandoIA(true)
  setMensaje(null)
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const formData = new FormData()
    formData.append('image_file', foto)

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mejorar-fondo`,
      { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}` }, body: formData }
    )

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'No se pudo procesar la imagen')
    }

    const blob = await res.blob()
    const archivoProcesado = new File([blob], 'fondo-ia.png', { type: blob.type })
    setFoto(archivoProcesado)
    setPreviewIA(URL.createObjectURL(blob))
    setMensaje({ tipo: 'exito', texto: 'Fondo mejorado. Revisa la vista previa antes de guardar.' })
  } catch (error) {
    setMensaje({ tipo: 'error', texto: error.message })
  } finally {
    setProcesandoIA(false)
  }
}
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto? También se borrará su galería de fotos.')) return
    setLoadingData(true)
    await supabase.from('products').delete().eq('id', id)
    cargarProductos()
  }

  // --- Estado (activo / agotado) directo desde la lista ---
  const handleToggleDisponible = async (prod) => {
    const nuevoValor = !prod.disponible
    setActualizandoEstadoId(prod.id)
    // Actualización optimista: se ve el cambio al instante en la tabla
    setProductos(prev => prev.map(p => p.id === prod.id ? { ...p, disponible: nuevoValor } : p))

    const { error } = await supabase.from('products').update({ disponible: nuevoValor }).eq('id', prod.id)

    if (error) {
      // Si falla, revertimos el cambio visual y avisamos
      setProductos(prev => prev.map(p => p.id === prod.id ? { ...p, disponible: prod.disponible } : p))
      setMensaje({ tipo: 'error', texto: 'No se pudo actualizar el estado: ' + error.message })
    }
    setActualizandoEstadoId(null)
  }

  // --- Galería ---
  const handleSubirGaleria = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0 || !producto.id) return
    setSubiendoGaleria(true)
    try {
      let orden = galeria.length > 0 ? Math.max(...galeria.map(g => g.orden)) + 1 : 0
      for (const file of files) {
  const fileComprimido = await comprimirImagen(file, { maxWidth: 1200, calidad: 0.8 })
  const fileName = `galeria/${producto.id}/${Math.random()}.webp`
  const { error: uploadError } = await supabase.storage.from('productos').upload(fileName, fileComprimido)
  if (uploadError) throw uploadError
  const { data: { publicUrl } } = supabase.storage.from('productos').getPublicUrl(fileName)
  const { error } = await supabase.from('product_images').insert([{ product_id: producto.id, imagen_url: publicUrl, orden }])
  if (error) throw error
  orden++
}
      cargarGaleria(producto.id)
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message })
    } finally {
      setSubiendoGaleria(false)
      e.target.value = ''
    }
  }

  const handleEliminarGaleria = async (img) => {
    await supabase.from('product_images').delete().eq('id', img.id)
    cargarGaleria(producto.id)
  }

  const moverGaleria = async (img, direccion) => {
    const idx = galeria.findIndex(g => g.id === img.id)
    const otro = galeria[idx + direccion]
    if (!otro) return
    await Promise.all([
      supabase.from('product_images').update({ orden: otro.orden }).eq('id', img.id),
      supabase.from('product_images').update({ orden: img.orden }).eq('id', otro.id),
    ])
    cargarGaleria(producto.id)
  }

  // ------------------ VISTA LISTA ------------------
  if (view === 'list') {
    return (
      <div className="dash-card">
        {mensaje && (
          <div className={`auth-alert ${mensaje.tipo === 'exito' ? 'alert-success' : 'alert-error'}`}>{mensaje.texto}</div>
        )}
        <div className="card-header-row">
          <h2>Inventario de catálogo</h2>
          <button className="btn-submit btn-inline" onClick={handleNuevo}>➕ Agregar producto</button>
        </div>
        {loadingData ? <p>Cargando...</p> : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>N.º</th>
                <th>Foto</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td>{p.numero}</td>
                  <td><img src={p.imagen_url || 'https://via.placeholder.com/40'} alt={p.nombre} className="td-img" /></td>
                  <td>{p.nombre}</td>
                  <td>{p.categories?.nombre || <span style={{ color: '#aaa' }}>Sin categoría</span>}</td>
                  <td>{formatMoney(p.precio)}</td>
                  <td>
                    <button
                      type="button"
                      className={`estado-toggle ${p.disponible ? 'estado-activo' : 'estado-agotado'}`}
                      onClick={() => handleToggleDisponible(p)}
                      disabled={actualizandoEstadoId === p.id}
                      title="Click para cambiar el estado"
                    >
                      {actualizandoEstadoId === p.id ? '⏳ ...' : (p.disponible ? '🟢 Activo' : '🔴 Agotado')}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleEditar(p)} className="btn-icon edit">Editar</button>
                    <button onClick={() => handleEliminar(p.id)} className="btn-icon delete">Borrar</button>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>Aún no tienes productos.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    )
  }

  // ------------------ VISTA FORMULARIO ------------------
  return (
    <div className="dash-card">
      <div className="card-header-row">
        <h2>{producto.id ? 'Editar producto' : 'Crear nuevo producto'}</h2>
        <button type="button" className="btn-secondary" onClick={() => { resetForm(); setView('list') }}>← Volver al inventario</button>
      </div>
      {mensaje && (
        <div className={`auth-alert ${mensaje.tipo === 'exito' ? 'alert-success' : 'alert-error'}`}>{mensaje.texto}</div>
      )}
      <form onSubmit={handleGuardarProducto} className="dash-form">
        <div className="form-row">
          <div className="form-col">
            <label>N.º Catálogo</label>
            <input type="text" value={producto.numero} onChange={e => setProducto({ ...producto, numero: e.target.value })} required />
          </div>
          <div className="form-col">
            <label>Nombre</label>
            <input type="text" value={producto.nombre} onChange={e => setProducto({ ...producto, nombre: e.target.value })} required />
          </div>
        </div>
        <label>Descripción</label>
        <textarea value={producto.descripcion} onChange={e => setProducto({ ...producto, descripcion: e.target.value })} />

        <div className="form-row">
          <div className="form-col">
            <label>Precio (S/)</label>
            <input type="number" step="0.01" value={producto.precio} onChange={e => setProducto({ ...producto, precio: e.target.value })} />
          </div>
          <div className="form-col">
            <label>Categoría</label>
            <select value={producto.categoria_id} onChange={e => setProducto({ ...producto, categoria_id: e.target.value })}>
              <option value="">Sin categoría</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
        </div>

        <label>Secciones (elige una o varias, ej. "Elige por ocasión")</label>
        <div className="secciones-grid">
          {secciones.map(s => (
            <label key={s.id} className="checkbox-label checkbox-inline">
              <input
                type="checkbox"
                checked={productoSecciones.includes(s.id)}
                onChange={() => toggleSeccion(s.id)}
              />
              {s.nombre}
            </label>
          ))}
          {secciones.length === 0 && (
            <p className="hint-text">No hay secciones creadas todavía. Ve a "Secciones" en el menú para crearlas.</p>
          )}
        </div>

        <label>Foto principal {producto.imagen_url && '(sube una nueva para reemplazarla)'}</label>
<input type="file" accept="image/*" onChange={e => { setFoto(e.target.files[0]); setPreviewIA(null) }} />

{foto && (
  <button type="button" className="btn-secondary" onClick={handleMejorarFondo} disabled={procesandoIA} style={{ marginTop: 8 }}>
    {procesandoIA ? '✨ Generando fondo...' : '✨ Mejorar fondo con IA'}
  </button>
)}

{(previewIA || (producto.imagen_url && !foto)) && (
  <img
    src={previewIA || producto.imagen_url}
    alt="Vista previa"
    style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: 8, marginTop: 8 }}
  />
)}

        <label className="checkbox-label">
          <input type="checkbox" checked={producto.disponible} onChange={e => setProducto({ ...producto, disponible: e.target.checked })} />
          Producto disponible para la venta
        </label>

        <button type="submit" disabled={loadingAction} className="btn-submit">
          {loadingAction ? 'Guardando...' : 'Guardar producto'}
        </button>
      </form>

      <h3 className="form-section-title" style={{ marginTop: '2rem' }}>Galería de fotos adicionales</h3>
      {!producto.id ? (
        <p className="hint-text">Guarda el producto primero para poder agregarle más fotos.</p>
      ) : (
        <>
          <p className="hint-text">Estas fotos se muestran junto a la foto principal en la página del producto.</p>
          <input type="file" accept="image/*" multiple onChange={handleSubirGaleria} disabled={subiendoGaleria} />
          {subiendoGaleria && <p>Subiendo...</p>}
          <div className="gallery-grid">
            {galeria.map((img, idx) => (
              <div key={img.id} className="gallery-item">
                <img src={img.imagen_url} alt="" />
                <div className="gallery-item-actions">
                  <button type="button" onClick={() => moverGaleria(img, -1)} disabled={idx === 0}>↑</button>
                  <button type="button" onClick={() => moverGaleria(img, 1)} disabled={idx === galeria.length - 1}>↓</button>
                  <button type="button" onClick={() => handleEliminarGaleria(img)} className="delete">✕</button>
                </div>
              </div>
            ))}
            {galeria.length === 0 && <p className="hint-text">Sin fotos adicionales todavía.</p>}
          </div>
        </>
      )}
    </div>
  )
}