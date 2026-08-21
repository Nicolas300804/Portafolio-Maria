import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import CinemaShowcase from './components/CinemaShowcase';
import ProductCarousel from './components/ProductCarousel';
import Catalog from './components/Catalog';
import PriceGuide from './components/PriceGuide';
import WhyUs from './components/WhyUs';
import Contact from './components/Contact';
import Footer from './components/Footer';

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
      aria-label="Volver al inicio"
    >
      ↑
    </button>
  );
}

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState('');

  const handleSelectProduct = (name) => {
    setSelectedProduct(name);
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="cinematic-app">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <CinemaShowcase onOrder={handleSelectProduct} />
        <ProductCarousel onOrder={handleSelectProduct} />
        <Catalog onOrder={handleSelectProduct} />
        <PriceGuide />
        <WhyUs />
        <Contact selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
