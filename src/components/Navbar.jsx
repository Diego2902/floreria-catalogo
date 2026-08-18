import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { shopConfig } from '../config'
import { supabase } from '../lib/supabaseclient'

const WHATSAPP_NUMBER = '51968197112' // 968 197 112 con código de país

export default function Navbar() {
  const [session, setSession] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const enPanelAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Navegación suave a una sección del Home, funcione desde donde funcione
  const irASeccion = (e, id) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate(`/#${id}`)
    }
  }

  return (
    <>
      <style>{`
        .btn-whatsapp-nav {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #00a884;
          color: #ffffff !important;
          padding: 8px 20px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 500;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 168, 132, 0.3);
        }
        .btn-whatsapp-nav:hover {
          background-color: #008f6f;
          box-shadow: 0 6px 16px rgba(0, 168, 132, 0.5);
          transform: translateY(-2px);
        }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #333;
          padding: 5px;
        }
        
        /* Ajustes específicos del Navbar para celular dentro del componente */
        @media (max-width: 768px) {
          .navbar-inner {
            flex-wrap: wrap;
          }
          .mobile-menu-btn {
            display: block;
          }
          .navbar-links {
            display: ${isMobileMenuOpen ? 'flex' : 'none'} !important;
            width: 100%;
            flex-direction: column;
            gap: 15px;
            padding: 15px 0;
            border-top: 1px solid #eee;
            margin-top: 15px;
            align-items: center;
          }
          .btn-whatsapp-nav span {
             display: none; /* Oculta el número en móvil para ahorrar espacio */
          }
          .btn-whatsapp-nav {
             padding: 10px; /* Hace el botón redondo en móvil */
             border-radius: 50%;
          }
        }
      `}</style>

      <header className="navbar">
        <div className="container navbar-inner">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Botón menú hamburguesa (solo visible en móvil) */}
            {!enPanelAdmin && (
              <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Abrir menú">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isMobileMenuOpen ? (
                    <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></>
                  ) : (
                    <><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></>
                  )}
                </svg>
              </button>
            )}

            <Link to="/" className="navbar-brand">
              <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9z" fill="#ffe5f0" />
                <path d="M12 2C7.03 2 3 6.03 3 11c4.97 0 9-4.03 9-9z" fill="#ffe5f0" />
                <circle cx="12" cy="11.5" r="3" fill="#e83e8c" />
                <path d="M12 2.5c-1.5 3-1.5 7 0 9.5 1.5-2.5 1.5-6.5 0-9.5zM12 21.5c1.5-3 1.5-7 0-9.5-1.5 2.5-1.5 6.5 0 9.5zM21.5 11.5c-3-1.5-7-1.5-9.5 0 2.5 1.5 6.5 1.5 9.5 0zM2.5 11.5c3 1.5 7 1.5 9.5 0-2.5-1.5-6.5-1.5-9.5 0z" fill="#e83e8c" />
              </svg>
              <span className="navbar-name">{shopConfig.name}</span>
            </Link>
          </div>

          {!enPanelAdmin && (
            <nav className="navbar-links">
              <a href="/#catalogo" onClick={(e) => irASeccion(e, 'catalogo')}>Catálogo</a>
              <a href="/#personalizados" onClick={(e) => irASeccion(e, 'personalizados')}>Personalizados</a>
            </nav>
          )}

          <div className="navbar-auth">
            {enPanelAdmin ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {session && (
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>
                    {session.user.email}
                  </span>
                )}
                <Link to="/" className="btn-login">Volver</Link>
                {session && (
                  <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
                )}
              </div>
            ) : (
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-nav"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.09-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.6 0-3.1-.44-4.38-1.2l-.31-.19-3.02.79.8-2.94-.2-.31A7.94 7.94 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
                </svg>
                <span>968 197 112</span>
              </a>
            )}
          </div>

        </div>
      </header>
    </>
  )
}