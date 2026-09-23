import { useState } from 'react';
import { PRICE_TIERS, PRODUCTS } from '../data/products';

const WA_NUMBER = '573185165656';

export default function PriceGuide({ onOrder }) {
  const [selectedItems, setSelectedItems] = useState([PRODUCTS[0].id, PRODUCTS[5].id]);

  const toggleItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const chosenProducts = PRODUCTS.filter(p => selectedItems.includes(p.id));
  const subtotal = chosenProducts.reduce((sum, p) => sum + p.price, 0);

  // Bundle perk
  const discountRate = selectedItems.length >= 3 ? 0.10 : 0;
  const discountAmount = Math.round(subtotal * discountRate);
  const total = subtotal - discountAmount;

  const handleOrderCalculatorWA = () => {
    if (chosenProducts.length === 0) return;
    const names = chosenProducts.map(p => `• ${p.name} ($${p.price.toLocaleString('es-CO')} COP)`).join('\n');
    let text = `*🧶 ¡HOLA! QUIERO REALIZAR UN PEDIDO MÚLTIPLE*\n`;
    text += `==================================\n\n`;
    text += `📦 *Muñecos seleccionados:*\n${names}\n\n`;
    if (discountRate > 0) {
      text += `🎁 *Descuento Especial (10%):* -$${discountAmount.toLocaleString('es-CO')} COP\n`;
    }
    text += `💰 *Total Estimado:* $${total.toLocaleString('es-CO')} COP\n`;
    text += `💜 *Método de Pago:* Nequi o Contraentrega\n`;
    text += `⏰ *Tiempo de Elaboración:* 7 a 10 días hábiles\n\n`;
    text += `==================================\n`;
    text += `¿Tienen disponibilidad para comenzar mi pedido? ¡Gracias! ❤️`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?phone=${WA_NUMBER}&text=${encoded}`, '_blank', 'noopener');
  };

  return (
    <section className="price-guide-cinematic container" aria-labelledby="price-heading">
      {/* Header */}
      <div className="price-header-center">
        <span className="section-label">✦ TRANSPARENCIA Y COTIZACIÓN ✦</span>
        <h1 className="section-title" id="price-heading">Guía de Inversión</h1>
        <p className="section-sub">
          Nuestros muñecos categorizados por complejidad de tejido. Utiliza la calculadora interactiva para simular tu pedido y obtener beneficios.
        </p>
      </div>

      {/* Interactive Budget Calculator */}
      <div className="budget-calculator-card">
        <div className="calc-header-row">
          <div className="calc-title-box">
            <span className="calc-badge">SIMULADOR EN VIVO</span>
            <h3>Calculadora de Pedidos & Combos</h3>
            <p>Selecciona los muñecos que deseas para calcular el presupuesto en tiempo real:</p>
          </div>

          <div className="calc-total-box">
            <span className="total-label">TOTAL ESTIMADO:</span>
            <span className="total-number">${total.toLocaleString('es-CO')}</span>
            {discountRate > 0 && (
              <span className="discount-applied-badge">¡10% OFF Aplicado por combo! 🎉</span>
            )}
          </div>
        </div>

        {/* Quick Item Picker Cloud */}
        <div className="calc-items-picker">
          {PRODUCTS.slice(0, 12).map(prod => {
            const isChecked = selectedItems.includes(prod.id);
            return (
              <button
                key={prod.id}
                className={`calc-chip-btn ${isChecked ? 'active' : ''}`}
                onClick={() => toggleItem(prod.id)}
              >
                <span className="chip-check">{isChecked ? '✓' : '+'}</span>
                <span className="chip-name">{prod.name}</span>
                <span className="chip-price">${prod.price.toLocaleString('es-CO')}</span>
              </button>
            );
          })}
        </div>

        {/* Calculator Bottom Footer */}
        <div className="calc-footer-row">
          <div className="calc-perks-list">
            <span>🎁 Empaque para regalo incluido</span>
            <span>💜 Nequi & Contraentrega disponible</span>
            <span>✈️ Envíos a todo el país</span>
          </div>

          <button
            className="calc-order-wa-btn"
            disabled={chosenProducts.length === 0}
            onClick={handleOrderCalculatorWA}
          >
            <span>Pedir estos {chosenProducts.length} muñecos a WhatsApp 💬</span>
          </button>
        </div>
      </div>

      {/* Full Tier List Table */}
      <div className="price-tiers-wrapper">
        <h3 className="tiers-block-title">Lista Oficial de Categorías de Precio</h3>
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
                  <button
                    key={item}
                    className="price-item-chip"
                    onClick={() => onOrder?.(item)}
                    title={`Pedir ${item}`}
                  >
                    <span>{item}</span>
                    <small>Pedir ↗</small>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
