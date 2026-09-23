import { useState } from 'react';

const CHARACTERS = [
  { id: 'gato', name: 'Gatito Curioso', icon: '🐱', basePrice: 12000, desc: 'Con orejitas punteagudas y colita suave.' },
  { id: 'perro', name: 'Perrito Fiel', icon: '🐶', basePrice: 15000, desc: 'Con orejitas caídas y naricita bordada.' },
  { id: 'stitch', name: 'Stitch Espacial', icon: '👾', basePrice: 15000, desc: 'Orejotas grandes y detalles tiernos.' },
  { id: 'pollito', name: 'Pollito Gourmet', icon: '🐥', basePrice: 12000, desc: 'Cuerpito redondo con piquito naranja.' },
  { id: 'dino', name: 'Dino Prehistórico', icon: '🦖', basePrice: 15000, desc: 'Crestas dorsales y patitas firmes.' },
  { id: 'conejo', name: 'Conejita Mágica', icon: '🐰', basePrice: 15000, desc: 'Largas orejas tejidas en punto fino.' },
];

const YARN_COLORS = [
  { name: 'Rosa Pastel', hex: '#f472b6', border: '#ec4899' },
  { name: 'Azul Celeste', hex: '#60a5fa', border: '#3b82f6' },
  { name: 'Amarillo Sol', hex: '#fde047', border: '#eab308' },
  { name: 'Verde Menta', hex: '#4ade80', border: '#22c55e' },
  { name: 'Lila Cósmico', hex: '#c084fc', border: '#a855f7' },
  { name: 'Blanco Crema', hex: '#fef08a', border: '#e2e8f0' },
  { name: 'Café Caramelo', hex: '#d97706', border: '#b45309' },
  { name: 'Negro Azabache', hex: '#1e293b', border: '#0f172a' },
];

const ACCESSORIES = [
  { id: 'llavero', name: 'Argolla para Llavero', icon: '🔑', price: 2000 },
  { id: 'corazon', name: 'Corazón Tejido', icon: '❤️', price: 3000 },
  { id: 'sombrero', name: 'Sombrerito / Gorro', icon: '👒', price: 4000 },
  { id: 'mono', name: 'Moño o Corbata', icon: '🎀', price: 2000 },
  { id: 'bufanda', name: 'Bufanda Calientita', icon: '🧣', price: 3000 },
];

const SIZES = [
  { id: 'mini', name: 'Mini Llavero (8-10 cm)', factor: 1, label: 'Ideal para bolsos y llaves' },
  { id: 'mediano', name: 'Mediano (15-18 cm)', factor: 1.35, label: 'Tamaño estándar de colección' },
  { id: 'grande', name: 'Grande (22-25 cm)', factor: 1.8, label: 'Edición peluche para abrazar' },
];

const WA_NUMBER = '573185165656';

export default function CustomizerStudio({ onGoToContact }) {
  const [selectedChar, setSelectedChar] = useState(CHARACTERS[0]);
  const [primaryColor, setPrimaryColor] = useState(YARN_COLORS[0]);
  const [secondaryColor, setSecondaryColor] = useState(YARN_COLORS[5]);
  const [selectedAccessories, setSelectedAccessories] = useState(['llavero', 'corazon']);
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [notes, setNotes] = useState('');

  const toggleAccessory = (id) => {
    setSelectedAccessories(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Price Calculation
  const baseCost = selectedChar.basePrice * selectedSize.factor;
  const accessoriesCost = selectedAccessories.reduce((sum, accId) => {
    const item = ACCESSORIES.find(a => a.id === accId);
    return sum + (item ? item.price : 0);
  }, 0);
  const estimatedPrice = Math.round((baseCost + accessoriesCost) / 1000) * 1000;

  const handleOrderWhatsApp = () => {
    const accNames = selectedAccessories.map(id => ACCESSORIES.find(a => a.id === id)?.name).filter(Boolean);
    
    let text = `*🧶 ¡HOLA! QUIERO UN PEDIDO PERSONALIZADO*\n`;
    text += `==================================\n\n`;
    text += `✨ *Personaje Base:* ${selectedChar.name} (${selectedChar.icon})\n`;
    text += `🎨 *Color Principal:* ${primaryColor.name}\n`;
    text += `🧵 *Color Secundario / Detalles:* ${secondaryColor.name}\n`;
    text += `📏 *Tamaño:* ${selectedSize.name}\n`;
    text += `🎁 *Accesorios:* ${accNames.length > 0 ? accNames.join(', ') : 'Ninguno'}\n`;
    text += `💰 *Presupuesto Estimado:* $${estimatedPrice.toLocaleString('es-CO')} COP\n`;
    text += `⏰ *Tiempo de Elaboración:* 7 a 10 días hábiles\n\n`;
    
    if (notes.trim()) {
      text += `📝 *Detalles Adicionales:* ${notes}\n\n`;
    }
    text += `==================================\n`;
    text += `¿Podemos coordinar para elaborarlo? ¡Muchas gracias! ❤️`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?phone=${WA_NUMBER}&text=${encoded}`, '_blank', 'noopener');
  };

  return (
    <section className="customizer-section container" aria-labelledby="customizer-title">
      <div className="customizer-header-center">
        <span className="section-label">✦ ESTUDIO INTERACTIVO ✦</span>
        <h1 className="section-title" id="customizer-title">Diseña Tu Muñeco</h1>
        <p className="section-sub">
          Personaliza personaje, colores, accesorios y tamaño. Tejeremos tu creación única punto por punto con hilo de algodón antialérgico.
        </p>
      </div>

      <div className="customizer-workspace">
        {/* Left Interactive Canvas / Visualizer */}
        <div className="customizer-preview-box">
          <div className="preview-stage-glow">
            {/* Live Interactive Doll Avatar */}
            <div className="doll-avatar-card">
              <div
                className="doll-avatar-sphere"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${primaryColor.hex} 0%, ${secondaryColor.hex} 100%)`,
                  boxShadow: `0 20px 40px -10px ${primaryColor.hex}66, inset 0 0 30px rgba(0,0,0,0.3)`
                }}
              >
                <div className="doll-avatar-icon">{selectedChar.icon}</div>
                {/* Accessory badges floating */}
                {selectedAccessories.includes('sombrero') && (
                  <span className="avatar-accessory acc-sombrero" title="Sombrero">👒</span>
                )}
                {selectedAccessories.includes('corazon') && (
                  <span className="avatar-accessory acc-corazon" title="Corazón">❤️</span>
                )}
                {selectedAccessories.includes('mono') && (
                  <span className="avatar-accessory acc-mono" title="Moño">🎀</span>
                )}
                {selectedAccessories.includes('bufanda') && (
                  <span className="avatar-accessory acc-bufanda" title="Bufanda">🧣</span>
                )}
                {selectedAccessories.includes('llavero') && (
                  <span className="avatar-accessory acc-llavero" title="Llavero">🔑</span>
                )}
              </div>

              <div className="doll-avatar-info">
                <span className="doll-preview-name">{selectedChar.name}</span>
                <span className="doll-preview-colors">
                  {primaryColor.name} + {secondaryColor.name}
                </span>
                <span className="doll-preview-size">{selectedSize.name}</span>
              </div>
            </div>

            {/* Live Price Estimation Badge */}
            <div className="preview-price-card">
              <div className="price-card-header">
                <span className="price-sub-label">VALOR ESTIMADO:</span>
                <span className="price-tag-amount">
                  ${estimatedPrice.toLocaleString('es-CO')}
                  <small> COP</small>
                </span>
              </div>
              <p className="price-craft-note">
                ✨ Incluye empaque de regalo y elaboración 100% a mano (7 a 10 días).
              </p>
              <button className="btn-order-custom-wa" onClick={handleOrderWhatsApp}>
                <span>¡Pedir por WhatsApp! 💬</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Configuration Panels */}
        <div className="customizer-controls-box">
          {/* Step 1: Base Character */}
          <div className="control-step-card">
            <div className="step-badge">PASO 1</div>
            <h3 className="step-title">Elige la Base de tu Muñeco</h3>
            <div className="character-grid-picker">
              {CHARACTERS.map(c => (
                <button
                  key={c.id}
                  className={`char-pick-btn ${selectedChar.id === c.id ? 'active' : ''}`}
                  onClick={() => setSelectedChar(c)}
                >
                  <span className="char-emoji">{c.icon}</span>
                  <div className="char-text">
                    <strong>{c.name}</strong>
                    <span>Base: ${c.basePrice.toLocaleString('es-CO')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Primary Yarn Color */}
          <div className="control-step-card">
            <div className="step-badge">PASO 2</div>
            <h3 className="step-title">Color de Hilo Principal: <span className="highlight-color-name">{primaryColor.name}</span></h3>
            <div className="swatches-grid">
              {YARN_COLORS.map(color => (
                <button
                  key={color.name}
                  className={`swatch-btn ${primaryColor.name === color.name ? 'active' : ''}`}
                  style={{ background: color.hex, borderColor: color.border }}
                  onClick={() => setPrimaryColor(color)}
                  aria-label={color.name}
                  title={color.name}
                >
                  {primaryColor.name === color.name && <span className="swatch-check">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Secondary / Accent Color */}
          <div className="control-step-card">
            <div className="step-badge">PASO 3</div>
            <h3 className="step-title">Color de Detalles / Orejas: <span className="highlight-color-name">{secondaryColor.name}</span></h3>
            <div className="swatches-grid">
              {YARN_COLORS.map(color => (
                <button
                  key={color.name}
                  className={`swatch-btn ${secondaryColor.name === color.name ? 'active' : ''}`}
                  style={{ background: color.hex, borderColor: color.border }}
                  onClick={() => setSecondaryColor(color)}
                  aria-label={color.name}
                  title={color.name}
                >
                  {secondaryColor.name === color.name && <span className="swatch-check">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Size */}
          <div className="control-step-card">
            <div className="step-badge">PASO 4</div>
            <h3 className="step-title">Tamaño de la Pieza</h3>
            <div className="sizes-grid">
              {SIZES.map(s => (
                <button
                  key={s.id}
                  className={`size-pick-btn ${selectedSize.id === s.id ? 'active' : ''}`}
                  onClick={() => setSelectedSize(s)}
                >
                  <strong>{s.name}</strong>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 5: Accessories */}
          <div className="control-step-card">
            <div className="step-badge">PASO 5</div>
            <h3 className="step-title">Accesorios Opcionales</h3>
            <div className="accessories-grid">
              {ACCESSORIES.map(acc => {
                const isSelected = selectedAccessories.includes(acc.id);
                return (
                  <button
                    key={acc.id}
                    className={`acc-pick-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => toggleAccessory(acc.id)}
                  >
                    <span className="acc-icon">{acc.icon}</span>
                    <div className="acc-info">
                      <strong>{acc.name}</strong>
                      <span>+${acc.price.toLocaleString('es-CO')}</span>
                    </div>
                    <span className="acc-checkbox">{isSelected ? '✓' : '+'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 6: Custom Notes */}
          <div className="control-step-card">
            <div className="step-badge">PASO 6</div>
            <h3 className="step-title">Notas Especiales o Dedicatoria</h3>
            <textarea
              className="customizer-textarea"
              rows={3}
              placeholder="Ej: Me gustaría que lleve un bordado de inicial 'M' o una combinación especial..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
