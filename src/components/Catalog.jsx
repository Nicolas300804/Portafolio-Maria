import { useState, useEffect, useRef } from 'react';
import { PRODUCTS, fmtPrice, priceColor } from '../data/products';

const FILTERS = [
  { label: 'Todos',    value: 'all',   dot: null },
  { label: '$10.000',  value: 10000,   dot: 'var(--p10)' },
  { label: '$12.000',  value: 12000,   dot: 'var(--p12)' },
  { label: '$15.000',  value: 15000,   dot: 'var(--p15)' },
  { label: '$20.000',  value: 20000,   dot: 'var(--p20)' },
  { label: '$35.000',  value: 35000,   dot: 'var(--p35)' },
];

function ProductCard({ product, onOrder }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className="product-card-cinematic fade-in"
      id={`product-${product.id}`}
      role="article"
      aria-label={product.name}
    >
      {product.badge && (
        <span className={`card-badge-glow ${product.badge.cls}`} aria-label={product.badge.text}>
          {product.badge.text}
        </span>
      )}

      <div className="card-img-wrap">
        <img
          src={product.image}
          alt={`${product.name} - muñeco de crochet artesanal`}
          loading="lazy"
        />
        <div className="card-lens-flare" aria-hidden="true" />
        <div className="card-overlay-cinematic" aria-hidden="true">
          <button className="btn-quick-glow" onClick={() => onOrder(product.name)}>
            <span>¡Lo quiero! 🧶</span>
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="card-meta-line">
          <span className="card-cat">{product.category}</span>
          <span className="card-edition-tag">HECHO A MANO</span>
        </div>
        <h3 className="card-name">{product.name}</h3>
        <p className="card-desc">{product.desc}</p>

        <div className="card-footer">
          <div className="price-stack">
            <span className="price-tag-label">PRECIO</span>
            <span className={`card-price ${priceColor(product.price)}`}>
              {fmtPrice(product.price)}
            </span>
          </div>
          <button
            className="card-order-btn-cinematic"
            onClick={() => onOrder(product.name)}
            aria-label={`Pedir ${product.name}`}
          >
            <span>Pedir</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Catalog({ onOrder }) {
  const [active, setActive] = useState('all');

  const filtered = active === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.price === active);

  return (
    <section id="catalogo" aria-labelledby="catalog-heading" className="catalog-section">
      <div className="filter-section container" id="precios">
        <div className="catalog-header-wrap">
          <span className="section-label">✦ CATÁLOGO COMPLETO ✦</span>
          <h2 className="section-title" id="catalog-heading">Galería de Personajes</h2>
          <p className="section-sub">Filtra por categoría de precio y encuentra tu muñeco ideal</p>
        </div>

        <div className="filter-bar-cinematic" role="group" aria-label="Filtros de precio">
          {FILTERS.map(f => (
            <button
              key={f.value}
              className={`filter-chip-cinematic${active === f.value ? ' active' : ''}`}
              onClick={() => setActive(f.value)}
              aria-pressed={active === f.value}
              id={`filter-${f.value}`}
            >
              {f.dot && (
                <span
                  className="price-dot-glow"
                  style={{ background: f.dot, boxShadow: `0 0 10px ${f.dot}` }}
                  aria-hidden="true"
                />
              )}
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state" role="status">
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}>🔍</span>
            <p style={{ color: 'var(--txt-2)' }}>No hay productos en esta categoría</p>
          </div>
        ) : (
          <div className="product-grid-cinematic" role="list" aria-label="Catálogo de muñecos">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onOrder={onOrder} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
