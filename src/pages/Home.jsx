import { useState, useEffect } from 'react'
import ProductCard from '../components/Productcard'
import CategoryTabs from '../components/Categorytabs'
import Spinner from '../components/spinner'
import { supabase } from '../lib/supabaseclient'


export default function Home() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [secciones, setSecciones] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState('todas')
  const [seccionActiva, setSeccionActiva] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchDatos() }, [])

  const fetchDatos = async () => {
    setLoading(true)
    const [productosRes, categoriasRes, seccionesRes] = await Promise.all([
      supabase.from('products').select('*, categories(nombre), product_sections(section_id)').eq('disponible', true).order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('activa', true).order('orden', { ascending: true }),
      supabase.from('sections').select('*').eq('activa', true).order('orden', { ascending: true }),
    ])
    if (productosRes.error) console.error('Error al descargar productos:', productosRes.error)
    else setProductos(productosRes.data || [])
    if (categoriasRes.error) console.error('Error al descargar categorías:', categoriasRes.error)
    else setCategorias(categoriasRes.data || [])
    if (seccionesRes.error) console.error('Error al descargar secciones:', seccionesRes.error)
    else setSecciones(seccionesRes.data || [])
    setLoading(false)
  }

  const handleSeccionClick = (id) => {
    setSeccionActiva(prev => {
      const next = prev === id ? null : id
      if (!next) setCategoriaActiva('todas') // al quitar la ocasión, también se ocultan las categorías
      return next
    })
  }

  const limpiarFiltros = () => {
    setSeccionActiva(null)
    setCategoriaActiva('todas')
  }

  const nombresCategorias = ['todas', ...categorias.map(c => c.nombre)]

  const productosPorSeccion = seccionActiva
    ? productos.filter(p => (p.product_sections || []).some(ps => ps.section_id === seccionActiva))
    : productos

  const productosFiltrados = categoriaActiva === 'todas'
    ? productosPorSeccion
    : productosPorSeccion.filter(p => p.categories?.nombre === categoriaActiva)

  const nombreSeccionActiva = secciones.find(s => s.id === seccionActiva)?.nombre
  const hayFiltroActivo = seccionActiva || categoriaActiva !== 'todas'

  return (
    <>
      <style>{`
        /* Estilos para la nueva sección Personalizados */
        .personalizados-section {
          background: linear-gradient(135deg, #fdf5f7 0%, #fff0f5 100%);
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4rem 5rem;
          margin: 4rem auto;
          gap: 4rem;
          max-width: 1200px;
        }
        .personalizados-content {
          flex: 1;
          max-width: 450px;
        }
        .personalizados-subtitle {
          color: #ff6b81;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 4px;
          margin-bottom: 1rem;
          display: block;
          text-transform: uppercase;
        }
        .personalizados-title {
          font-size: 3.5rem;
          line-height: 1.1;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
          font-family: 'Georgia', serif; /* Tipografía serif para el toque elegante */
        }
        .personalizados-title-italic {
          font-style: italic;
          color: #ff4b72;
          font-weight: 400;
        }
        .personalizados-desc {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }
        .btn-design-pedido {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #ff3b6a;
          color: #ffffff !important;
          padding: 14px 28px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(255, 59, 106, 0.3);
        }
        .btn-design-pedido:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 59, 106, 0.4);
          background-color: #e6355f;
        }
        .personalizados-image-wrap {
          flex: 1;
          position: relative;
          background: #ffffff;
          padding: 15px;
          border-radius: 35px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.04);
        }
        .personalizados-img {
          width: 100%;
          height: auto;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          border-radius: 25px;
        }
        .personalizados-badge {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          background: #fdfaf7;
          padding: 20px 40px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 15px 35px rgba(0,0,0,0.08);
          width: 80%;
        }
        .personalizados-badge small {
          display: block;
          font-size: 0.7rem;
          letter-spacing: 3px;
          color: #888;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .personalizados-badge strong {
          display: block;
          font-family: 'Georgia', serif;
          font-size: 1.8rem;
          font-style: italic;
          color: #444;
          font-weight: 400;
          line-height: 1.1;
        }

        /* Filtro unificado: ocasión + categoría, todo bajo "Nuestra Colección" */
        .filtro-ocasiones {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
          margin: 1.25rem 0 0.5rem;
        }
        .ocasion-pill-btn {
  border: 1.5px solid #eee0e4;
  background: #fff;
  color: #555;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 12px 24px;
  border-radius: 999px;
  cursor: pointer;
  transition: all .15s ease;
}
.ocasion-pill-btn:hover {
  border-color: #e83e8c;
  color: #e83e8c;
}
.ocasion-pill-btn.active {
  background: #e83e8c;
  border-color: #e83e8c;
  color: #fff;
  box-shadow: 0 4px 12px rgba(232,62,140,.3);
}

        @keyframes desplegarFiltro {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .filtro-categorias-wrap {
          animation: desplegarFiltro 0.25s ease;
          margin-top: 0.75rem;
        }

        .filtro-activo {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          justify-content: center;
          margin: 1rem 0 0.5rem;
          font-size: 0.9rem;
          color: #555;
        }
        .filtro-activo button {
          border: none;
          background: #f1f1f1;
          color: #555;
          padding: 4px 12px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .filtro-activo button:hover { background: #e8e8e8; }

        /* Responsive para móviles */
        @media (max-width: 900px) {
          .personalizados-section {
            flex-direction: column;
            padding: 3rem 1.5rem;
            text-align: center;
            margin: 2rem 1rem;
          }
          .personalizados-content {
            margin: 0 auto;
          }
          .personalizados-image-wrap {
            width: 100%;
            margin-top: 1rem;
          }
          .personalizados-title {
            font-size: 2.8rem;
          }
          .ocasion-pill-btn {
            padding: 10px 18px;
            font-size: 0.85rem;
          }
        }
      `}</style>

      <main>
        {/* SECCIÓN HERO */}
        <section className="hero-section container">
          <div className="hero-text">
            <p className="hero-subtitle">FLORERÍA CON DELIVERY EN LIMA</p>
            <h1 className="hero-title">
              Detalles que <br />
              <span style={{ fontStyle: 'italic', fontWeight: '400', color: '#555' }}>Enamoran</span>
            </h1>
            <p className="hero-desc">
              Encuentra el arreglo perfecto y sorprende hoy mismo. <br/>
              <span style={{ color: '#e83e8c', fontWeight: '500' }}>Delivery express</span> en toda la ciudad.
            </p>
            <a href="#catalogo" className="btn-hero">Sorprender Ahora &gt;</a>
          </div>
          <div className="hero-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Ramo de rosas"
              className="hero-image"
              loading="lazy"
              width="500"
              height="500"
            />
            <div className="hero-badge">
              <small>CALIDAD PREMIUM</small>
              <strong>Flores Frescas Cada Día</strong>
            </div>
          </div>
        </section>

        {/* CATÁLOGO: título, filtro por ocasión, y luego categorías se despliegan */}
        <section id="catalogo" className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="catalogo-title">Nuestra Colección</h2>

          {secciones.length > 0 && (
            <div className="filtro-ocasiones">
              {secciones.map((sec, idx) => (
                <button
  key={sec.id}
  type="button"
  className={`ocasion-pill-btn ${seccionActiva === sec.id ? 'active' : ''}`}
  onClick={() => handleSeccionClick(sec.id)}
>
  {sec.nombre}
</button>
              ))}
            </div>
          )}

          {seccionActiva && (
            <div className="filtro-categorias-wrap">
              <CategoryTabs
                categories={nombresCategorias}
                active={categoriaActiva}
                onChange={setCategoriaActiva}
              />
            </div>
          )}

          {hayFiltroActivo && (
            <div className="filtro-activo">
              Mostrando:
              {seccionActiva && <strong>{nombreSeccionActiva}</strong>}
              {categoriaActiva !== 'todas' && <strong>{categoriaActiva}</strong>}
              <button type="button" onClick={limpiarFiltros}>✕ Quitar filtro</button>
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
              <Spinner label="Cargando catálogo..." />
            </div>
          ) : (
            <div className="products-grid">
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map(prod => (
                  <ProductCard key={prod.id} product={prod} />
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#666' }}>
                  <p>Aún no hay productos en esta categoría.</p>
                </div>
              )}
            </div>
          )}
        </section>


          {/* SECCIÓN PERSONALIZADOS (Reemplaza a Beneficios) */}
        <section id="personalizados" className="personalizados-section">
          <div className="personalizados-content">
            <span className="personalizados-subtitle">Exclusividad Total</span>
            <h2 className="personalizados-title">
              ¿Buscas algo <br />
              <span className="personalizados-title-italic">Realmente Único?</span>
            </h2>
            <p className="personalizados-desc">
              Tu visión, nuestra artesanía. Creamos piezas botánicas irrepetibles que capturan emociones en cada pétalo.
            </p>
            <a
              href={`https://wa.me/51968197112?text=${encodeURIComponent('Hola, me gustaría diseñar un pedido personalizado.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-design-pedido"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.09-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.6 0-3.1-.44-4.38-1.2l-.31-.19-3.02.79.8-2.94-.2-.31A7.94 7.94 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
              </svg>
              Diseñar mi Pedido
            </a>
          </div>
          
          <div className="personalizados-image-wrap">
            <img
              src="https://bayfreshflowers.ca/wp-content/uploads/2020/10/BSDU9503-e1603570167577.jpg"
              alt="Artesanía Personalizada"
              className="personalizados-img"
              loading="lazy"
            />
            <div className="personalizados-badge">
              <small>Artesanía de Lujo</small>
              <strong>100%<br/>Personalizado</strong>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}