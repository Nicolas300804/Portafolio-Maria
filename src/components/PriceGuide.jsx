import { PRICE_TIERS } from '../data/products';

export default function PriceGuide() {
  return (
    <section className="price-guide-cinematic" aria-labelledby="price-heading">
      <div className="container">
        <div className="price-header-center">
          <span className="section-label">✦ TRANSPARENCIA TOTAL ✦</span>
          <h2 className="section-title" id="price-heading">Guía de Inversión</h2>
          <p className="section-sub">
            Todos nuestros muñecos categorizados por rango de precio y complejidad de tejido
          </p>
        </div>

        <div className="price-table-cinematic" role="list">
          {PRICE_TIERS.map((tier) => (
            <div
              key={tier.price}
              className="price-row-cinematic"
              role="listitem"
              id={`tier-${tier.price}`}
            >
              <div className="price-label-side">
                <span className={`price-amount-glow ${tier.colorClass}`}>
                  {tier.label}
                </span>
                <span className="price-tier-name">{tier.tier}</span>
                <span className="price-badge-cop">COP</span>
              </div>

              <div className="price-items-cloud">
                {tier.items.map((item) => (
                  <span key={item} className="price-item-chip">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
