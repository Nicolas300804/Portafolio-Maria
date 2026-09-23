export default function Footer({ onNavigate }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="logo-wrap">
              <span className="yarn">🧶</span>
              Tejidos con <span className="accent">Amor</span>
            </div>
            <p>
              Muñecos de crochet artesanales, tejidos con dedicación
              y mucho cariño en Colombia. Cada pieza cuenta una historia única.
            </p>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h4>Páginas</h4>
            <button className="footer-nav-link" onClick={() => onNavigate?.('inicio')}>Inicio</button>
            <button className="footer-nav-link" onClick={() => onNavigate?.('cine')}>🎬 Cine Reel 4K</button>
            <button className="footer-nav-link" onClick={() => onNavigate?.('catalogo')}>Catálogo Boutique</button>
            <button className="footer-nav-link" onClick={() => onNavigate?.('personalizar')}>🎨 Estudio Personalizar</button>
            <button className="footer-nav-link" onClick={() => onNavigate?.('precios')}>Guía de Precios</button>
            <button className="footer-nav-link" onClick={() => onNavigate?.('contacto')}>Contacto & WhatsApp</button>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Colecciones</h4>
            <p>🌟 Disney & Amigos</p>
            <p>📺 Personajes TV</p>
            <p>🐾 Animales del Bosque</p>
            <p>🐶 Perros y Gatos</p>
            <p>❤️ Parejas & San Valentín</p>
          </div>

          {/* CTA */}
          <div className="footer-col">
            <h4>¿Listo para pedir?</h4>
            <div className="footer-cta-box">
              <p>
                Escríbenos por WhatsApp y tejeremos tu muñeco ideal en 7 a 10 días hábiles.
              </p>
              <button
                className="footer-btn-order"
                onClick={() => onNavigate?.('contacto')}
                aria-label="Ir a la estación de pedidos"
              >
                🧶 Hacer Pedido
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© {year} Tejidos con Amor — Colección Cinematográfica 2026.</p>
          <p>Hecho con ❤️ y mucho hilo en Colombia.</p>
        </div>
      </div>
    </footer>
  );
}
