import { useState, useEffect } from 'react';

export default function Navbar({ onOrderClick }) {
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
    { href: '#catalogo',  label: 'Catálogo' },
    { href: '#precios',   label: 'Precios' },
    { href: '#contacto',  label: 'Contacto' },
  ];

  return (
    <>
      {/* Announcement bar */}
      <div className="announcement-bar" role="banner">
        <p>🧶 Hecho a mano con amor · Envíos disponibles · Pedidos personalizados · 🎁 El regalo perfecto</p>
      </div>

      {/* Navbar */}
      <header className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
        <div className="nav-inner">
          <a href="#hero" className="nav-logo" onClick={close} aria-label="Tejidos con Amor - Inicio">
            <span className="yarn">🧶</span>
            Tejidos con <span className="accent">Amor</span>
          </a>

          {/* Desktop links */}
          <nav className="nav-links" aria-label="Navegación principal">
            {links.map(l => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}
            <a href="#contacto" className="nav-cta" id="nav-cta">¡Pedir ya!</a>
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
        <a href="#contacto" className="nav-cta" onClick={close}>¡Pedir ya!</a>
      </nav>
    </>
  );
}
