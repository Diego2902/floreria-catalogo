import { Link } from 'react-router-dom'
import { shopConfig } from '../config'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--color-accent)">
              <circle cx="12" cy="6.5" r="3.2" />
              <circle cx="17" cy="10.6" r="3.2" />
              <circle cx="15" cy="16.6" r="3.2" />
              <circle cx="9" cy="16.6" r="3.2" />
              <circle cx="7" cy="10.6" r="3.2" />
              <circle cx="12" cy="12" r="2.4" fill="var(--color-gold)" />
            </svg>
          </span>
          <span className="navbar-name">{shopConfig.name}</span>
        </Link>
        <Link to="/admin/login" className="navbar-admin">
          Panel admin
        </Link>
      </div>
    </header>
  )
}