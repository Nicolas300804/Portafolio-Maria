import { useEffect } from 'react';
import { fmtPrice, priceColor } from '../data/products';

export default function ProductModal({ product, onClose, onOrder, onCustomize }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-window-glass" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
          ✕
        </button>

        <div className="modal-grid">
          {/* Left: Product Image */}
          <div className="modal-img-col">
            <div className="modal-img-frame">
              <img
                src={product.image}
                alt={product.name}
                className="modal-main-img"
              />
              {product.badge && (
                <span className={`modal-badge-glow ${product.badge.cls}`}>
                  {product.badge.text}
                </span>
              )}
            </div>
            <div className="modal-craft-guarantee">
              <span>🧵 100% Hilo de Algodón</span>
              <span>👁️ Ojos Térmicos de Seguridad</span>
              <span>☁️ Relleno Siliconado Hipoalergénico</span>
            </div>
          </div>

          {/* Right: Product Details & Actions */}
          <div className="modal-details-col">
            <div className="modal-header-line">
              <span className="modal-cat-tag">{product.category}</span>
              <span className="modal-edition-tag">EDICIÓN EXCLUSIVA</span>
            </div>

            <h2 className="modal-title" id="modal-title">
              {product.name}
            </h2>

            <div className="modal-price-box">
              <span className="modal-price-label">Inversión:</span>
              <span className={`modal-price-val ${priceColor(product.price)}`}>
                {fmtPrice(product.price)}
              </span>
              <span className="modal-cop-tag">COP</span>
            </div>

            <p className="modal-desc">{product.desc}</p>

            <div className="modal-specs-list">
              <div className="modal-spec-row">
                <span className="spec-lbl">Elaboración:</span>
                <span className="spec-val">7 a 10 días hábiles (a mano)</span>
              </div>
              <div className="modal-spec-row">
                <span className="spec-lbl">Medios de pago:</span>
                <span className="spec-val">Nequi o Contraentrega</span>
              </div>
              <div className="modal-spec-row">
                <span className="spec-lbl">Personalizable:</span>
                <span className="spec-val">Colores y accesorios a medida</span>
              </div>
            </div>

            <div className="modal-action-btns">
              <button
                className="modal-btn-order"
                onClick={() => {
                  onClose();
                  onOrder(product.name);
                }}
              >
                <span>¡Pedir este modelo! 💬</span>
              </button>

              <button
                className="modal-btn-customize"
                onClick={() => {
                  onClose();
                  onCustomize(product);
                }}
              >
                <span>🎨 Personalizar colores</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
