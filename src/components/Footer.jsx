export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <>
      <style>{`
        .site-footer {
          background: #241b1e;
          color: #d9d0d2;
          padding: 4rem 1.5rem 2rem;
          margin-top: 4rem;
        }
        .footer-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
          gap: 2.5rem;
        }
        .footer-brand-title {
          font-family: 'Georgia', serif;
          font-style: italic;
          font-size: 1.6rem;
          color: #ffffff;
          margin-bottom: 0.75rem;
        }
        .footer-brand-desc {
          font-size: 0.92rem;
          line-height: 1.6;
          color: #b5abae;
          max-width: 320px;
        }
        .footer-col-title {
          color: #ffffff;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 1.1rem;
        }
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .footer-links a {
          color: #b5abae;
          text-decoration: none;
          font-size: 0.92rem;
          transition: color .15s ease;
        }
        .footer-links a:hover { color: #ff6b9d; }
        .footer-contact-item {
          display: flex;
          gap: 0.6rem;
          align-items: flex-start;
          font-size: 0.92rem;
          color: #b5abae;
          margin-bottom: 0.9rem;
        }
        .footer-contact-item svg { flex-shrink: 0; color: #ff6b9d; margin-top: 2px; }
        .footer-socials {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.2rem;
        }
        .footer-social-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d9d0d2;
          transition: all .15s ease;
        }
        .footer-social-btn:hover {
          background: #e83e8c;
          color: #fff;
          transform: translateY(-2px);
        }
        .footer-bottom {
          max-width: 1200px;
          margin: 3rem auto 0;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
          font-size: 0.82rem;
          color: #8a8082;
        }
        .footer-bottom a { color: #8a8082; text-decoration: none; }
        .footer-bottom a:hover { color: #ff6b9d; }

        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 560px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

      <footer className="site-footer">
        <div className="footer-grid">
          {/* Marca */}
          <div>
            {/* TODO: reemplaza por el nombre real de tu florería */}
            <div className="footer-brand-title">Tu Florería</div>
            <p className="footer-brand-desc">
              Arreglos frescos y personalizados, con delivery el mismo día en toda Lima.
              Cada pieza está pensada para acompañar tus momentos más importantes.
            </p>
            <div className="footer-socials">
              {/* TODO: reemplaza los href con tus redes reales */}
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.3c-.28-.04-1.23-.12-2.34-.12-2.3 0-3.87 1.4-3.87 4V10.5H8v3h2.4V21h3.1z" />
                </svg>
              </a>
              <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.5 2h2.6c.2 1.6 1.2 3 2.7 3.6v2.7c-1.4-.05-2.7-.5-3.8-1.3v6.8c0 3.1-2.5 5.6-5.6 5.6S4.8 16.9 4.8 13.8c0-3 2.3-5.4 5.2-5.6v2.7c-1.4.2-2.5 1.4-2.5 2.9 0 1.6 1.3 2.9 2.9 2.9s2.9-1.3 2.9-2.9V2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Enlaces */}
          <div>
            <div className="footer-col-title">Explorar</div>
            <ul className="footer-links">
              <li><a href="#catalogo">Catálogo</a></li>
              <li><a href="#personalizados">Personalizados</a></li>
              <li><a href="/login">Iniciar sesión</a></li>
              <li><a href="/register">Crear cuenta</a></li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <div className="footer-col-title">Ayuda</div>
            <ul className="footer-links">
              {/* TODO: ajusta o quita las que no apliquen todavía */}
              <li><a href="#">Preguntas frecuentes</a></li>
              <li><a href="#">Políticas de entrega</a></li>
              <li><a href="#">Términos y condiciones</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <div className="footer-col-title">Contacto</div>
            <div className="footer-contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.09-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
              </svg>
              <a
                href={`https://wa.me/51968197112?text=${encodeURIComponent('Hola, tengo una consulta sobre sus arreglos florales.')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                +51 968 197 112
              </a>
            </div>
            <div className="footer-contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {/* TODO: reemplaza por tu correo real */}
              <span>contacto@tuflorería.com</span>
            </div>
            <div className="footer-contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span>Delivery en Lima, Perú</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} Tu Florería. Todos los derechos reservados.</span>
          <span>Hecho con 🌸 en Lima</span>
        </div>
      </footer>
    </>
  )
}