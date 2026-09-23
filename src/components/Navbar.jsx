import { useState } from 'react';

const NAV_TABS = [
  { id: 'inicio',       label: 'Inicio',         badge: null },
  { id: 'cine',         label: 'Cine Reel',       badge: '4K' },
  { id: 'catalogo',     label: 'Catálogo',       badge: '20+' },
  { id: 'personalizar', label: 'Personalizar',   badge: 'NUEVO' },
  { id: 'precios',      label: 'Precios',        badge: null },
  { id: 'contacto',     label: 'Contacto',       badge: null },
];

export default function Navbar({ currentView, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleTabClick = (viewId) => {
    onNavigate(viewId);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Top Ticker Notification */}
      <div className="announcement-bar" role="region" aria-label="Aviso">
        <div className="announcement-ticker">
          <span>✨ ENVÍOS A TODA COLOMBIA</span>
          <span className="ticker-sep">✦</span>
          <span>🧶 100% TEJIDO A MANO EN CROCHET</span>
          <span className="ticker-sep">✦</span>
          <span>💜 PAGO POR NEQUI O CONTRAENTREGA</span>
          <span className="ticker-sep">✦</span>
          <span>⚡ ELABORACIÓN DE 7 A 10 DÍAS HÁBILES</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar" role="navigation" aria-label="Navegación principal">
        <div className="nav-inner">
          {/* Brand Logo */}
          <button
            className="nav-logo-btn"
            onClick={() => handleTabClick('inicio')}
            aria-label="Ir al inicio"
          >
            <span className="yarn-glow" aria-hidden="true">🧶</span>
            <span className="brand-text">
              Tejidos con <span className="accent">Amor</span>
            </span>
            <span className="cinema-badge">CINEMA</span>
          </button>

          {/* Desktop Navigation Tabs */}
          <div className="nav-links-spa" role="tablist">
            {NAV_TABS.map((tab) => {
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`nav-tab-btn ${isActive ? 'active' : ''} ${tab.id === 'cine' ? 'nav-tab-cine' : ''} ${tab.id === 'personalizar' ? 'nav-tab-custom' : ''}`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  <span className="tab-label">{tab.label}</span>
                  {tab.badge && (
                    <span className="tab-pill-badge">{tab.badge}</span>
                  )}
                  {isActive && <span className="active-glow-pill" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          {/* Right CTA */}
          <div className="nav-actions">
            <button
              className="nav-cta-glow"
              onClick={() => handleTabClick('contacto')}
              aria-label="Hacer un pedido"
            >
              <span>¡PEDIR YA! 💬</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="mobile-menu open" role="dialog" aria-modal="true">
          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            ✕
          </button>

          <div className="mobile-menu-header">
            <span className="yarn-glow">🧶</span>
            <span className="brand-text">Tejidos con Amor</span>
          </div>

          <div className="mobile-tabs-list">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`mobile-tab-btn ${currentView === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                <span>{tab.label}</span>
                {tab.badge && <span className="tab-pill-badge">{tab.badge}</span>}
              </button>
            ))}
          </div>

          <button
            className="mobile-cta-btn"
            onClick={() => handleTabClick('contacto')}
          >
            ¡Hacer Pedido por WhatsApp! 💬
          </button>
        </div>
      )}
    </>
  );
}
