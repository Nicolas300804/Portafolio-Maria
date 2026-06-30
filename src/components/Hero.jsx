export default function Hero() {
  return (
    <section className="hero" id="hero">
      {/* Content side */}
      <div className="hero-content">
        <div className="hero-eyebrow">Hecho a mano con amor</div>

        <h1 className="hero-title">
          Muñecos de<br />
          <em>Crochet</em><br />
          Artesanales
        </h1>

        <p className="hero-desc">
          Cada pieza es única, tejida con dedicación y mucho cariño.
          Encuentra el compañero perfecto o regala algo especial e irrepetible.
        </p>

        <div className="hero-actions">
          <a href="#catalogo" className="btn-primary" id="hero-explore-btn">
            <span>Ver colección</span>
          </a>
          <a href="#contacto" className="btn-outline" id="hero-order-btn">
            Pedir a medida
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-num">19+</span>
            <span className="stat-lbl">Diseños únicos</span>
          </div>
          <div className="stat-div" aria-hidden="true" />
          <div className="stat-item">
            <span className="stat-num">100%</span>
            <span className="stat-lbl">Artesanal</span>
          </div>
          <div className="stat-div" aria-hidden="true" />
          <div className="stat-item">
            <span className="stat-num">❤️</span>
            <span className="stat-lbl">Con amor</span>
          </div>
        </div>
      </div>

      {/* Visual side */}
      <div className="hero-visual" aria-label="Muñecos de crochet destacados">
        <img
          src="Images/WhatsApp Image 2026-06-30 at 3.19.02 PM (2).jpeg"
          alt="Colección de perritos de crochet artesanales"
          className="hero-img-main"
          loading="eager"
        />
        <div className="hero-visual-overlay" aria-hidden="true" />

        {/* Floating badge */}
        <div className="hero-badge-float" aria-label="Tejidos artesanales">
          <span className="badge-float-icon">🏆</span>
          <div className="badge-float-text">
            <strong>100% Artesanal</strong>
            <span>Tejido con amor ✨</span>
          </div>
        </div>
      </div>
    </section>
  );
}
