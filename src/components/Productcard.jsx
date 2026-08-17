import { whatsappLink } from '../config'
import StampBadge from './StampBadge'

export default function ProductCard({ product }) {
  const { nombre, descripcion, precio, categoria, imagen_url, disponible, numero } = product

  const mensaje = `Hola! Me interesa: ${nombre} (Catálogo N.º ${numero}). ¿Podrían darme más información?`

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        {imagen_url ? (
          <img src={imagen_url} alt={nombre} loading="lazy" />
        ) : (
          <div className="product-image-empty" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--color-line)" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 13l2.2-2.2a1 1 0 0 1 1.4 0L14 13" />
            </svg>
          </div>
        )}
        <StampBadge disponible={disponible} />
      </div>

      <div className="product-body">
        <p className="product-number">N.º {numero}</p>
        <h3 className="product-name">{nombre}</h3>
        <p className="product-category">{categoria}</p>
        {descripcion && <p className="product-desc">{descripcion}</p>}

        <div className="product-footer">
          <span className="product-price">
            {precio != null ? `S/ ${Number(precio).toFixed(2)}` : 'Precio a consultar'}
          </span>
          <a
            href={whatsappLink(mensaje)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent product-cta"
          >
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}