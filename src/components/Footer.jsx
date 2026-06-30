export default function Footer() {
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
              y mucho cariño. Cada pieza cuenta una historia especial.
            </p>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h4>Navegación</h4>
            <a href="#hero">Inicio</a>
            <a href="#catalogo">Catálogo</a>
            <a href="#precios">Precios</a>
            <a href="#contacto">Contacto</a>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Categorías</h4>
            <p>Disney (Stitch)</p>
            <p>Personajes</p>
            <p>Animales</p>
            <p>Perros Premium</p>
            <p>Parejas</p>
          </div>

          {/* CTA */}
          <div className="footer-col">
            <h4>¿Listo para pedir?</h4>
            <div className="footer-cta-box">
              <p>
                Escríbenos por WhatsApp y cuéntanos qué muñeco
                te robo el corazón.
              </p>
              <a
                href="#contacto"
                id="footer-cta-btn"
                aria-label="Ir al formulario de contacto"
              >
                🧶 Pedir ahora
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© {year} Tejidos con Amor. Todos los derechos reservados.</p>
          <p>Hecho con ❤️ y mucho hilo.</p>
        </div>
      </div>
    </footer>
  );
}
