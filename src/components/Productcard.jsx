import { useState } from 'react'

const WHATSAPP_NUMBER = '51968197112'

export default function ProductCard({ product }) {
  const [showModal, setShowModal] = useState(false)
  const [cantidad, setCantidad] = useState(1)
  const [envioDomicilio, setEnvioDomicilio] = useState(null) // true | false | null
  const [direccion, setDireccion] = useState('')
  const [dedicatoria, setDedicatoria] = useState('')

  const imagen = product.imagen_url || 'https://via.placeholder.com/500x500?text=Sin+imagen'

  const formValido =
    cantidad >= 1 &&
    envioDomicilio !== null &&
    (envioDomicilio === false || direccion.trim().length > 0)

  const construirMensaje = () => {
    let msg = `Hola! Quiero hacer un pedido 🌸\n\n`
    msg += `Producto: ${product.nombre} (N.° ${product.numero})\n`
    msg += `Precio unitario: S/ ${Number(product.precio).toFixed(2)}\n`
    msg += `Cantidad: ${cantidad}\n`
    msg += `Total aprox: S/ ${(Number(product.precio) * cantidad).toFixed(2)}\n\n`
    msg += `¿Envío a domicilio?: ${envioDomicilio ? 'Sí' : 'No, recojo en tienda'}\n`
    if (envioDomicilio) msg += `Dirección de entrega: ${direccion}\n`
    if (dedicatoria.trim()) msg += `Mensaje/dedicatoria: ${dedicatoria.trim()}\n`
    return msg
  }

  const linkWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(construirMensaje())}`

  const cerrarYResetear = () => {
    setShowModal(false)
    setCantidad(1)
    setEnvioDomicilio(null)
    setDireccion('')
    setDedicatoria('')
  }

  return (
    <>
      <div className="product-card">
        <div className="product-card-image-wrap" onClick={() => setShowModal(true)}>
          <img src={imagen} alt={product.nombre} className="product-card-image" loading="lazy" />
          <div className="product-card-overlay">
            <button className="btn-detalle" onClick={(e) => { e.stopPropagation(); setShowModal(true) }}>
              Ver detalle
            </button>
          </div>
          {product.categories?.nombre && (
            <span className="product-card-badge">{product.categories.nombre}</span>
          )}
        </div>

        <div className="product-card-body">
          <h3 className="product-card-name">{product.nombre}</h3>
          {product.descripcion && <p className="product-card-desc">{product.descripcion}</p>}
          <div className="product-card-footer">
            <span className="product-card-price">S/ {Number(product.precio).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="product-modal-backdrop" onClick={cerrarYResetear}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="product-modal-close" onClick={cerrarYResetear}>✕</button>

            <div className="product-modal-image-wrap">
              <img src={imagen} alt={product.nombre} />
            </div>

            <div className="product-modal-info">
              {product.categories?.nombre && <span className="product-modal-tag">{product.categories.nombre}</span>}
              <h2>{product.nombre}</h2>
              <p className="product-modal-price">S/ {Number(product.precio).toFixed(2)}</p>
              {product.descripcion && <p className="product-modal-desc">{product.descripcion}</p>}

              <div className="pedido-form">
                <label className="pedido-label">
                  Cantidad
                  <input
                    type="number"
                    min={1}
                    value={cantidad}
                    onChange={e => setCantidad(Math.max(1, Number(e.target.value)))}
                    className="pedido-input"
                  />
                </label>

                <div className="pedido-label">
                  ¿Envío a domicilio?
                  <div className="pedido-toggle">
                    <button
                      type="button"
                      className={envioDomicilio === true ? 'toggle-btn active' : 'toggle-btn'}
                      onClick={() => setEnvioDomicilio(true)}
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      className={envioDomicilio === false ? 'toggle-btn active' : 'toggle-btn'}
                      onClick={() => { setEnvioDomicilio(false); setDireccion('') }}
                    >
                      No, recojo
                    </button>
                  </div>
                </div>

                {envioDomicilio === true && (
                  <label className="pedido-label">
                    Dirección de entrega
                    <input
                      type="text"
                      placeholder="Calle, número, distrito"
                      value={direccion}
                      onChange={e => setDireccion(e.target.value)}
                      className="pedido-input"
                    />
                  </label>
                )}

                <label className="pedido-label">
                  Mensaje / dedicatoria (opcional)
                  <textarea
                    placeholder="Ej: Feliz cumpleaños, te quiero mucho"
                    value={dedicatoria}
                    onChange={e => setDedicatoria(e.target.value)}
                    className="pedido-input"
                    rows={2}
                  />
                </label>
              </div>

              {formValido ? (
                <a href={linkWhatsApp} target="_blank" rel="noopener noreferrer" className="btn-pedir-wsp-grande">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.09-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.6 0-3.1-.44-4.38-1.2l-.31-.19-3.02.79.8-2.94-.2-.31A7.94 7.94 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
                  </svg>
                  Pedir por WhatsApp
                </a>
              ) : (
                <button className="btn-pedir-wsp-grande disabled" disabled>
                  Completa los datos para pedir
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}