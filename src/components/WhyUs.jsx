const FEATURES = [
  {
    icon: '🧶',
    title: '100% Hecho a Mano',
    desc: 'Cada puntada es tejida con precisión milimétrica usando hilos hipoalergénicos de la más alta calidad.',
    tag: 'TÉCNICA MAESTRA'
  },
  {
    icon: '✨',
    title: 'Piezas de Colección Únicas',
    desc: 'Al ser piezas artesanales irrepetibles, cada muñeco tiene su propia personalidad y detalles mágicos.',
    tag: 'EXCLUSIVIDAD'
  },
  {
    icon: '🎁',
    title: 'El Regalo Inolvidable',
    desc: 'Empacados con delicadeza, listos para sorprender en cumpleaños, aniversarios y momentos especiales.',
    tag: 'EMPAQUE PREMIUM'
  },
  {
    icon: '🎨',
    title: '100% Personalizable',
    desc: '¿Quieres colores especiales o un personaje a medida? Lo diseñamos y tejemos especialmente para ti.',
    tag: 'CUSTOM EDITIONS'
  },
];

export default function WhyUs() {
  return (
    <section className="why-section-cinematic" aria-labelledby="why-heading">
      <div className="container">
        <div className="why-header-center">
          <span className="section-label">✦ LA PROMESA ARTESANAL ✦</span>
          <h2 className="section-title" id="why-heading">¿Por Qué Elegirnos?</h2>
          <p className="section-sub">
            Más que un muñeco en crochet, creamos un compañero de vida con alma y amor.
          </p>
        </div>

        <div className="features-grid-cinematic" role="list">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="feature-card-cinematic"
              role="listitem"
              id={`feature-${i}`}
            >
              <div className="feature-top-row">
                <span className="feature-icon-glow" aria-hidden="true">{f.icon}</span>
                <span className="feature-tag-pill">{f.tag}</span>
              </div>
              <h3 className="feature-title-cinematic">{f.title}</h3>
              <p className="feature-desc-cinematic">{f.desc}</p>
              <div className="feature-corner-glow" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
