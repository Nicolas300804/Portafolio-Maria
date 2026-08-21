import { useState, useEffect } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);

  const links = [
    { href: '#hero',      label: 'Inicio' },
    { href: '#cine-reel', label: '🎬 Cine Reel', highlight: true },
    { href: '#catalogo',  label: 'Catálogo' },
    { href: '#precios',   label: 'Precios' },
    { href: '#contacto',  label: 'Contacto' },
  ];

  return (
    <>
      {/* Cinematic Top Ticker Announcement */}
      <div className="announcement-bar" role="banner">
        <div className="announcement-ticker">
          <span>🎬 EXPERIENCIA CINEMATOGRÁFICA 2026</span>
          <span className="ticker-sep">✦</span>
          <span>🧶 100% HECHO A MANO CON AMOR</span>
          <span className="ticker-sep">✦</span>
          <span>🚚 ENVÍOS DISPONIBLES & CONTRAENTREGA</span>
          <span className="ticker-sep">✦</span>
          <span>💜 PAGA FÁCIL CON NEQUI</span>
          <span className="ticker-sep">✦</span>
          <span>🎁 EL REGALO MÁS TIERNO Y ESPECIAL</span>
        </div>
      </div>

      {/* Navbar */}
      <header className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
        <div className="nav-inner">
          <a href="#hero" className="nav-logo" onClick={close} aria-label="Tejidos con Amor - Inicio">
            <span className="yarn-glow">🧶</span>
            <span className="brand-text">Tejidos con <span className="accent">Amor</span></span>
            <span className="cinema-badge">CINEMA</span>
          </a>

          {/* Desktop links */}
          <nav className="nav-links" aria-label="Navegación principal">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className={`nav-link ${l.highlight ? 'nav-link-cinema' : ''}`}
              >
                {l.label}
              </a>
            ))}
            <a href="#contacto" className="nav-cta-glow" id="nav-cta">
              <span>¡Pedir ya! 💬</span>
            </a>
          </nav>

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <nav className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-label="Menú móvil">
        <button className="close-menu" onClick={close} aria-label="Cerrar menú">✕</button>
        {links.map(l => (
          <a key={l.href} href={l.href} className="nav-link" onClick={close}>{l.label}</a>
        ))}
        <a href="#contacto" className="nav-cta-glow" onClick={close}>¡Pedir ya! 💬</a>
      </nav>
    </>
  );
}
