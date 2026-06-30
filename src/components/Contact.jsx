import { useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';

const WA_NUMBER = '573185165656'; // Colombia: 57 + 3185165656

export default function Contact({ selectedProduct, setSelectedProduct }) {
  const [form, setForm] = useState({ name: '', phone: '', product: '', payment: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedProduct) {
      setForm(f => ({ ...f, product: selectedProduct }));
      setErrors(prev => ({ ...prev, product: false }));
      setSelectedProduct('');
    }
  }, [selectedProduct, setSelectedProduct]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = true;
    if (!form.phone.trim())   e.phone   = true;
    if (!form.product)        e.product = true;
    if (!form.payment)        e.payment = true;
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSending(true);

    const paymentLabel = form.payment === 'nequi' 
      ? `${String.fromCodePoint(0x1F49C)} Nequi` 
      : `${String.fromCodePoint(0x1F4E6)} Contraentrega`;
    const selectedProd = PRODUCTS.find(p => p.name === form.product);
    
    // Replace spaces with %20 so WhatsApp parses the entire URL as a single highlighted link
    const imageUrl = selectedProd ? `${window.location.origin}/${selectedProd.image.replace(/ /g, '%20')}` : '';

    let textMessage = `*${String.fromCodePoint(0x1F9F6)} NUEVO PEDIDO - TEJIDOS CON AMOR*\n`;
    textMessage += `==================================\n\n`;
    textMessage += `${String.fromCodePoint(0x1F464)} *Cliente:* ${form.name}\n`;
    textMessage += `${String.fromCodePoint(0x1F4DE)} *Contacto:* ${form.phone}\n`;
    textMessage += `${String.fromCodePoint(0x1F9F8)} *Producto:* ${form.product}\n`;
    textMessage += `${String.fromCodePoint(0x1F4B3)} *Método de pago:* ${paymentLabel}\n`;
    textMessage += `${String.fromCodePoint(0x23F0)} *Elaboración:* 7 a 10 días hábiles\n\n`;
    
    if (form.message.trim()) {
      textMessage += `${String.fromCodePoint(0x1F4DD)} *Notas:* ${form.message}\n\n`;
    }
    
    textMessage += `==================================\n`;
    if (imageUrl) {
      textMessage += `${String.fromCodePoint(0x1F517)} *Ver foto:* ${imageUrl}\n`;
    }

    const txt = encodeURIComponent(textMessage);

    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      window.open(`https://api.whatsapp.com/send?phone=${WA_NUMBER}&text=${txt}`, '_blank', 'noopener');
      setTimeout(() => {
        setSuccess(false);
        setForm({ name: '', phone: '', product: '', payment: '', message: '' });
      }, 4500);
    }, 900);
  };

  // Group products by price for the select
  const groups = [
    { label: '$10.000', prices: [10000] },
    { label: '$12.000', prices: [12000] },
    { label: '$15.000', prices: [15000] },
    { label: '$20.000', prices: [20000] },
    { label: '$35.000', prices: [35000] },
  ];

  const fieldStyle = (field) =>
    errors[field] ? { border: '1px solid hsl(0,70%,55%)', boxShadow: '0 0 0 3px hsla(0,70%,55%,0.15)' } : {};

  return (
    <section className="contact-section" id="contacto" aria-labelledby="contact-heading">
      <div className="container">
        <div className="contact-inner">

          {/* ── Left info ── */}
          <div className="contact-left">
            <span className="section-label" style={{ color: 'var(--pink-light)' }}>¡Hablemos!</span>
            <h2 className="section-title" id="contact-heading">
              ¿Te gustó alguno?
            </h2>
            <p className="contact-desc">
              Escríbenos, cuéntanos cuál muñeco quieres y cómo prefieres pagar.
              ¡Cada pedido lo elaboramos con mucho amor!
            </p>

            <div className="contact-methods">

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-method whatsapp-method"
                id="whatsapp-link"
                aria-label="Contactar por WhatsApp 3185165656"
              >
                <span className="method-icon">💬</span>
                <div className="method-info">
                  <strong>WhatsApp</strong>
                  <span>318 516 5656 — escríbenos directo</span>
                </div>
              </a>

              {/* Nequi */}
              <div className="contact-method" id="nequi-info">
                <span className="method-icon">💜</span>
                <div className="method-info">
                  <strong>Pago por Nequi</strong>
                  <span>Transferencia fácil y segura</span>
                </div>
              </div>

              {/* Contraentrega */}
              <div className="contact-method" id="contraentrega-info">
                <span className="method-icon">📦</span>
                <div className="method-info">
                  <strong>Pago Contraentrega</strong>
                  <span>Pagas al recibir tu pedido</span>
                </div>
              </div>

              {/* Tiempo */}
              <div className="contact-method" id="time-info">
                <span className="method-icon">🕐</span>
                <div className="method-info">
                  <strong>Tiempo de elaboración</strong>
                  <span>7 a 10 días hábiles</span>
                </div>
              </div>

            </div>
          </div>

          {/* ── Form ── */}
          <div className="contact-form-box">
            <h3 className="form-title">Envíanos tu pedido</h3>

            <form id="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Tu nombre *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Ej: María García"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    style={fieldStyle('name')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">WhatsApp / Teléfono *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Ej: 318 516 5656"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    style={fieldStyle('phone')}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="form-product">¿Qué muñeco te interesa? *</label>
                <select
                  id="form-product"
                  name="product"
                  value={form.product}
                  onChange={handleChange}
                  style={fieldStyle('product')}
                  required
                >
                  <option value="">— Selecciona un muñeco —</option>
                  {groups.map(g => (
                    <optgroup key={g.label} label={g.label}>
                      {PRODUCTS.filter(p => g.prices.includes(p.price)).map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="Pedido personalizado">✨ Pedido personalizado</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="payment">Forma de pago *</label>
                <select
                  id="payment"
                  name="payment"
                  value={form.payment}
                  onChange={handleChange}
                  style={fieldStyle('payment')}
                  required
                >
                  <option value="">— Selecciona cómo pagar —</option>
                  <option value="nequi">💜 Nequi</option>
                  <option value="contraentrega">📦 Contraentrega</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Mensaje adicional</label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="Color preferido, cantidad, ocasión especial..."
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              {/* Info banner */}
              <div className="form-info-banner" aria-label="Información del pedido">
                <span>🕐</span>
                <p>El tiempo de elaboración es de <strong>7 a 10 días hábiles</strong> desde la confirmación del pedido.</p>
              </div>

              <button
                type="submit"
                className="form-submit"
                id="form-submit-btn"
                disabled={sending}
                aria-busy={sending}
              >
                <span>{sending ? 'Abriendo WhatsApp... 🧶' : '¡Quiero este muñeco! 💬'}</span>
              </button>

              {success && (
                <div className="form-success" role="alert">
                  ✅ ¡Genial! Se abrió WhatsApp con tu pedido. ¡Esperamos tu mensaje!
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
