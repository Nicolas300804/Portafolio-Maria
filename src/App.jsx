import { useEffect, useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import CinemaShowcase from './components/CinemaShowcase';
import ProductCarousel from './components/ProductCarousel';
import Catalog from './components/Catalog';
import CustomizerStudio from './components/CustomizerStudio';
import PriceGuide from './components/PriceGuide';
import WhyUs from './components/WhyUs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';

function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      className={`back-top${show ? ' show' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Volver arriba"
    >
      ↑
    </button>
  );
}

// Floating quick-actions widget
function FloatingQuickActions({ onNavigate }) {
  return (
    <aside className="floating-quick-dock" aria-label="Acciones rápidas flotantes">
      <button
        className="dock-btn dock-btn-custom"
        onClick={() => onNavigate('personalizar')}
        title="Diseñar muñeco personalizado"
        aria-label="Personalizador de muñecos"
      >
        <span className="dock-icon">🎨</span>
        <span className="dock-label">Crear Muñeco</span>
      </button>

      <a
        href="https://api.whatsapp.com/send?phone=573185165656&text=%C2%A1Hola!%20Quiero%20hacer%20un%20pedido%20en%20Tejidos%20con%20Amor%20%E2%9D%A4%EF%B8%8F"
        target="_blank"
        rel="noopener noreferrer"
        className="dock-btn dock-btn-wa"
        title="Chat directo en WhatsApp"
        aria-label="Contactar por WhatsApp"
      >
        <span className="dock-icon">💬</span>
        <span className="dock-label">WhatsApp</span>
      </a>
    </aside>
  );
}

export default function App() {
  // SPA View state: 'inicio' | 'cine' | 'catalogo' | 'personalizar' | 'precios' | 'contacto'
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const validViews = ['inicio', 'cine', 'catalogo', 'personalizar', 'precios', 'contacto'];
    return validViews.includes(hash) ? hash : 'inicio';
  });

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Sync hash with browser history
  const handleNavigate = useCallback((viewId) => {
    setCurrentView(viewId);
    window.location.hash = viewId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen to browser forward/backward buttons
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validViews = ['inicio', 'cine', 'catalogo', 'personalizar', 'precios', 'contacto'];
      if (validViews.includes(hash)) {
        setCurrentView(hash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleOrderProduct = (productName) => {
    setSelectedProduct(productName);
    handleNavigate('contacto');
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const handleCustomizeProduct = () => {
    handleNavigate('personalizar');
  };

  return (
    <div className="cinematic-app">
      {/* Dynamic SPA Navigation Bar */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Reactive Viewport */}
      <main className="spa-main-view">
        {/* VIEW 1: INICIO (Home Landing) */}
        {currentView === 'inicio' && (
          <div className="spa-page page-enter">
            <Hero onNavigate={handleNavigate} />
            <Marquee />
            <ProductCarousel onOrder={handleOrderProduct} onQuickView={handleQuickView} />
            
            {/* Interactive Feature Gateway Cards */}
            <section className="gateway-cards-section container">
              <div className="gateway-header">
                <span className="section-label">✦ EXPERIENCIAS DISPONIBLES ✦</span>
                <h2 className="section-title">Descubre Nuestro Universo</h2>
              </div>
              <div className="gateway-grid">
                <div className="gateway-card" onClick={() => handleNavigate('cine')}>
                  <div className="gateway-badge">VIDEOS 4K</div>
                  <span className="gateway-icon">🎬</span>
                  <h3>Cine Reel Theatrical</h3>
                  <p>Vive la experiencia audiovisual en alta definición con acercamiento a texturas y detalles de tejido.</p>
                  <span className="gateway-cta">Ver Experiencia Cine →</span>
                </div>

                <div className="gateway-card gateway-card-custom" onClick={() => handleNavigate('personalizar')}>
                  <div className="gateway-badge badge-custom">ESTUDIO INTERACTIVO</div>
                  <span className="gateway-icon">🎨</span>
                  <h3>Diseña tu Muñeco</h3>
                  <p>Elige personajes, colores de lana, accesorios y tamaño con cálculo de precio y cotización instantánea.</p>
                  <span className="gateway-cta">Abrir Estudio de Diseño →</span>
                </div>

                <div className="gateway-card" onClick={() => handleNavigate('catalogo')}>
                  <div className="gateway-badge">20+ MODELOS</div>
                  <span className="gateway-icon">🧶</span>
                  <h3>Catálogo Boutique</h3>
                  <p>Encuentra a Stitch, gatitos, perritos de colección, dinosaurios y personajes entrañables listos para pedir.</p>
                  <span className="gateway-cta">Explorar Galería →</span>
                </div>
              </div>
            </section>

            <WhyUs />
          </div>
        )}

        {/* VIEW 2: CINE REEL (Theater Experience) */}
        {currentView === 'cine' && (
          <div className="spa-page page-enter">
            <div className="cinema-page-hero">
              <CinemaShowcase onOrder={handleOrderProduct} />
              <div className="cinema-bottom-cta container">
                <div className="cinema-cta-glass">
                  <h3>¿Te encantaron las texturas de la película?</h3>
                  <p>Cada muñeco visto en este video puede ser elaborado para ti con empaque de regalo y envío a tu ciudad.</p>
                  <div className="cinema-cta-btns">
                    <button className="btn-glow-primary" onClick={() => handleNavigate('catalogo')}>
                      Ver Catálogo Completo 🧶
                    </button>
                    <button className="btn-glow-secondary" onClick={() => handleNavigate('personalizar')}>
                      Personalizar en Otro Color 🎨
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: CATÁLOGO (Interactive Boutique Store) */}
        {currentView === 'catalogo' && (
          <div className="spa-page page-enter">
            <Catalog
              onOrder={handleOrderProduct}
              onQuickView={handleQuickView}
              onCustomize={handleCustomizeProduct}
            />
          </div>
        )}

        {/* VIEW 4: PERSONALIZADOR (Interactive Doll Studio) */}
        {currentView === 'personalizar' && (
          <div className="spa-page page-enter">
            <CustomizerStudio onGoToContact={() => handleNavigate('contacto')} />
          </div>
        )}

        {/* VIEW 5: PRECIOS & GUÍA */}
        {currentView === 'precios' && (
          <div className="spa-page page-enter">
            <PriceGuide onOrder={handleOrderProduct} />
            <WhyUs />
          </div>
        )}

        {/* VIEW 6: CONTACTO & PEDIDOS */}
        {currentView === 'contacto' && (
          <div className="spa-page page-enter">
            <Contact
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />
          </div>
        )}
      </main>

      {/* Global Interactive Quick-View Modal */}
      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onOrder={handleOrderProduct}
          onCustomize={handleCustomizeProduct}
        />
      )}

      {/* Floating Action Dock */}
      <FloatingQuickActions onNavigate={handleNavigate} />

      {/* Footer & Back to top */}
      <Footer onNavigate={handleNavigate} />
      <BackToTop />
    </div>
  );
}
