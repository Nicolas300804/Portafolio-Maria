import { useState, useMemo } from 'react';
import { PRODUCTS, fmtPrice, priceColor } from '../data/products';

const CATEGORIES = ['Todos', 'Disney', 'Animales', 'Gatos', 'Marino', 'Personajes'];

const PRICE_FILTERS = [
  { label: 'Todos',    value: 'all',   dot: null },
  { label: '$10.000',  value: 10000,   dot: 'var(--p10)' },
  { label: '$12.000',  value: 12000,   dot: 'var(--p12)' },
  { label: '$15.000',  value: 15000,   dot: 'var(--p15)' },
  { label: '$20.000',  value: 20000,   dot: 'var(--p20)' },
  { label: '$35.000',  value: 35000,   dot: 'var(--p35)' },
];

export default function Catalog({ onOrder, onQuickView, onCustomize }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('Todos');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortOrder, setSortOrder] = useState('featured');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      // Search filter
      const matchesSearch = searchTerm.trim() === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCat = selectedCat === 'Todos' || p.category === selectedCat;

      // Price filter
      const matchesPrice = selectedPrice === 'all' || p.price === selectedPrice;

      return matchesSearch && matchesCat && matchesPrice;
    }).sort((a, b) => {
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      if (sortOrder === 'name') return a.name.localeCompare(b.name);
      return a.id - b.id; // default featured
    });
  }, [searchTerm, selectedCat, selectedPrice, sortOrder]);

  return (
    <section id="catalogo" aria-labelledby="catalog-heading" className="catalog-section container">
      {/* Header */}
      <div className="catalog-header-center">
        <span className="section-label">✦ BOUTIQUE ARTESANAL ✦</span>
        <h1 className="section-title" id="catalog-heading">Catálogo de Colección</h1>
        <p className="section-sub">
          Explora nuestra galería de muñecos de crochet tejidos a mano con materiales de la más alta calidad.
        </p>
      </div>

      {/* Interactive Toolbar: Search, Categories & Price Filters */}
      <div className="catalog-interactive-toolbar">
        {/* Search bar */}
        <div className="catalog-search-wrapper">
          <span className="search-icon-lens">🔍</span>
          <input
            type="text"
            className="catalog-search-input"
            placeholder="Buscar por nombre, personaje o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm('')} title="Limpiar búsqueda">
              ✕
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="category-chips-bar" role="group" aria-label="Filtrar por categoría">
          {CATEGORIES.map(cat => {
            const count = cat === 'Todos'
              ? PRODUCTS.length
              : PRODUCTS.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                className={`cat-pill-btn ${selectedCat === cat ? 'active' : ''}`}
                onClick={() => setSelectedCat(cat)}
              >
                <span>{cat}</span>
                <span className="cat-count-badge">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Bar: Price Filters & Sort */}
        <div className="catalog-subfilters-row">
          <div className="filter-bar-cinematic" role="group" aria-label="Filtros de precio">
            {PRICE_FILTERS.map(f => (
              <button
                key={f.value}
                className={`filter-chip-cinematic ${selectedPrice === f.value ? 'active' : ''}`}
                onClick={() => setSelectedPrice(f.value)}
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

          <div className="catalog-sort-wrapper">
            <label htmlFor="sort-select" className="sort-label">Ordenar por:</label>
            <select
              id="sort-select"
              className="catalog-sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="featured">✨ Destacados</option>
              <option value="price-asc">💵 Menor precio</option>
              <option value="price-desc">💎 Mayor precio</option>
              <option value="name">🔤 Nombre (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="catalog-counter-row">
          <span className="results-count">
            Mostrando <strong>{filteredProducts.length}</strong> de {PRODUCTS.length} muñecos únicos
          </span>
          {(searchTerm || selectedCat !== 'Todos' || selectedPrice !== 'all') && (
            <button
              className="btn-reset-filters"
              onClick={() => {
                setSearchTerm('');
                setSelectedCat('Todos');
                setSelectedPrice('all');
              }}
            >
              Restablecer filtros ✕
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state-cinematic">
          <span className="empty-emoji">🔍</span>
          <h3>No encontramos resultados</h3>
          <p>Intenta con otra palabra clave o restablece los filtros para ver la colección completa.</p>
          <button
            className="btn-glow-primary"
            onClick={() => {
              setSearchTerm('');
              setSelectedCat('Todos');
              setSelectedPrice('all');
            }}
          >
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="product-grid-cinematic" role="list" aria-label="Catálogo de muñecos">
          {filteredProducts.map(p => (
            <article
              key={p.id}
              className="product-card-cinematic"
              id={`product-${p.id}`}
              role="article"
            >
              {p.badge && (
                <span className={`card-badge-glow ${p.badge.cls}`}>
                  {p.badge.text}
                </span>
              )}

              <div className="card-img-wrap" onClick={() => onQuickView?.(p)}>
                <img
                  src={p.image}
                  alt={`${p.name} - muñeco de crochet artesanal`}
                  loading="lazy"
                />
                <div className="card-lens-flare" aria-hidden="true" />
                <div className="card-overlay-cinematic">
                  <button
                    className="btn-quick-glow"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickView?.(p);
                    }}
                  >
                    <span>👁️ Vista Rápida</span>
                  </button>
                </div>
              </div>

              <div className="card-body">
                <div className="card-meta-line">
                  <span className="card-cat">{p.category}</span>
                  <span className="card-edition-tag">HECHO A MANO</span>
                </div>

                <h3 className="card-name" onClick={() => onQuickView?.(p)}>
                  {p.name}
                </h3>
                <p className="card-desc">{p.desc}</p>

                <div className="card-footer">
                  <div className="price-stack">
                    <span className="price-tag-label">INVERSIÓN</span>
                    <span className={`card-price ${priceColor(p.price)}`}>
                      {fmtPrice(p.price)}
                    </span>
                  </div>

                  <div className="card-actions-row">
                    <button
                      className="card-order-btn-cinematic"
                      onClick={() => onOrder(p.name)}
                      aria-label={`Pedir ${p.name}`}
                    >
                      <span>Pedir 🧶</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
