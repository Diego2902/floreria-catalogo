// El "sello" es el elemento firma del catálogo: como el timbre que se
// estampa en un pedido de florería para marcar si hay stock o no.
export default function StampBadge({ disponible }) {
  const text = disponible ? 'Disponible' : 'Agotado'
  return (
    <span
      className={`stamp ${disponible ? 'stamp-ok' : 'stamp-out'}`}
      aria-label={`Estado: ${text}`}
    >
      {text}
    </span>
  )
}