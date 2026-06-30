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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className="product-card fade-in"
      id={`product-${product.id}`}
      role="article"
      aria-label={product.name}
    >
      {product.badge && (
        <span className={`card-badge ${product.badge.cls}`} aria-label={product.badge.text}>
          {product.badge.text}
        </span>
      )}

      <div className="card-img-wrap">
        <img
          src={product.image}
          alt={`${product.name} - muñeco de crochet artesanal`}
          loading="lazy"
        />
        <div className="card-overlay" aria-hidden="true">
          <button className="btn-quick" onClick={() => onOrder(product.name)}>
            ¡Lo quiero!
          </button>
        </div>
      </div>

      <div className="card-body">
        <span className="card-cat">{product.category}</span>
        <h3 className="card-name">{product.name}</h3>
        <p className="card-desc">{product.desc}</p>

        <div className="card-footer">
          <span className={`card-price ${priceColor(product.price)}`}>
            {fmtPrice(product.price)}
          </span>
          <button
            className="card-order"
            onClick={() => onOrder(product.name)}
            aria-label={`Pedir ${product.name}`}
          >
            Pedir
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
    <section id="catalogo" aria-labelledby="catalog-heading">
      {/* Filters */}
      <div className="filter-section container" id="precios">
        <div style={{ marginBottom: 40 }}>
          <span className="section-label">Catálogo completo</span>
          <h2 className="section-title" id="catalog-heading">Elige tu favorito</h2>
          <p className="section-sub">Filtra por precio para encontrar el muñeco perfecto</p>
        </div>

        <div className="filter-bar" role="group" aria-label="Filtros de precio">
          {FILTERS.map(f => (
            <button
              key={f.value}
              className={`filter-chip${active === f.value ? ' active' : ''}`}
              onClick={() => setActive(f.value)}
              aria-pressed={active === f.value}
              id={`filter-${f.value}`}
            >
              {f.dot && (
                <span
                  className="price-dot"
                  style={{ background: f.dot }}
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
          <div className="product-grid" role="list" aria-label="Catálogo de muñecos">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onOrder={onOrder} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
