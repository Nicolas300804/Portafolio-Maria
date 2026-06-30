import { PRICE_TIERS } from '../data/products';

export default function PriceGuide() {
  return (
    <section className="price-guide" aria-labelledby="price-heading">
      <div className="container">
        <span className="section-label">Transparencia total</span>
        <h2 className="section-title" id="price-heading">Guía de precios</h2>
        <p className="section-sub">
          Todos nuestros muñecos organizados por rango de precio
        </p>

        <div className="price-table" role="list">
          {PRICE_TIERS.map((tier) => (
            <div
              key={tier.price}
              className="price-row"
              role="listitem"
              id={`tier-${tier.price}`}
            >
              <div className="price-label">
                <span className={`price-amount ${tier.colorClass}`}>
                  {tier.label}
                </span>
                <span className="price-tier-label">{tier.tier}</span>
              </div>

              <div className="price-items">
                {tier.items.map((item) => (
                  <span key={item} className="price-item-tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
