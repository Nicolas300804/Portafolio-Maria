const FEATURES = [
  {
    icon: '🧶',
    title: '100% Artesanal',
    desc: 'Cada muñeco es tejido a mano, uno por uno, con materiales de alta calidad y dedicación.',
  },
  {
    icon: '✨',
    title: 'Único e Irrepetible',
    desc: 'Al ser hecho a mano, cada pieza tiene pequeñas diferencias que la hacen especial.',
  },
  {
    icon: '🎁',
    title: 'Regalo Perfecto',
    desc: 'Ideal para cumpleaños, San Valentín, Navidad o cualquier fecha especial.',
  },
  {
    icon: '🎨',
    title: 'Personalizable',
    desc: '¿Colores especiales o diseños únicos? ¡Contáctanos y lo hacemos realidad!',
  },
];

export default function WhyUs() {
  return (
    <section className="why-section" aria-labelledby="why-heading">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 0 }}>
          <span className="section-label">Nuestra promesa</span>
          <h2 className="section-title" id="why-heading">¿Por qué elegirnos?</h2>
          <p className="section-sub" style={{ margin: '10px auto 0' }}>
            Más que un muñeco, entregamos un pedazo de corazón
          </p>
        </div>

        <div className="features-grid" role="list">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="feature-item"
              role="listitem"
              id={`feature-${i}`}
            >
              <span className="feature-icon" aria-hidden="true">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
