import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { CAROUSEL_ITEMS, fmtPrice, priceColor } from '../data/products';

export default function ProductCarousel({ onOrder }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInst, setSwiperInst] = useState(null);

  return (
    <section className="carousel-section container" aria-labelledby="carousel-heading">
      <div className="carousel-header">
        <div>
          <span className="section-label">✦ ESTRENOS & FAVORITOS ✦</span>
          <h2 className="section-title" id="carousel-heading">
            Los Más Aclamados
          </h2>
          <p className="section-sub">
            Las creaciones estelares más pedidas por nuestra comunidad.
          </p>
        </div>

        <div className="carousel-nav" role="group" aria-label="Navegación del carrusel">
          <button
            ref={prevRef}
            className="swiper-btn-cinematic"
            aria-label="Anterior"
            onClick={() => swiperInst?.slidePrev()}
          >
            ←
          </button>
          <button
            ref={nextRef}
            className="swiper-btn-cinematic"
            aria-label="Siguiente"
            onClick={() => swiperInst?.slideNext()}
          >
            →
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1.2}
        spaceBetween={18}
        loop={true}
        autoplay={{ delay: 3800, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{
          480:  { slidesPerView: 2.1, spaceBetween: 18 },
          768:  { slidesPerView: 3.1, spaceBetween: 20 },
          1024: { slidesPerView: 4,   spaceBetween: 22 },
          1200: { slidesPerView: 4.4, spaceBetween: 24 },
        }}
        onSwiper={setSwiperInst}
      >
        {CAROUSEL_ITEMS.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="slide-card-cinematic" role="article" aria-label={item.name}>
              <div className="slide-img-wrap">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                />
                <div className="card-lens-shine" aria-hidden="true" />
                {item.badge && (
                  <span className={`slide-badge ${item.badge.cls}`}>
                    {item.badge.text}
                  </span>
                )}
              </div>

              <div className="slide-body">
                <div className="slide-meta-row">
                  <span className="slide-cat">{item.category}</span>
                  <span className="slide-film-tag">EDICIÓN ESPECIAL</span>
                </div>
                <h3 className="slide-name">{item.name}</h3>
                
                <div className="slide-footer-row">
                  <span className={`slide-price ${priceColor(item.price)}`}>
                    {fmtPrice(item.price)}
                  </span>
                  <button
                    className="slide-quick-add-glow"
                    onClick={() => onOrder?.(item.name)}
                    aria-label={`Pedir ${item.name}`}
                  >
                    <span>Pedir 🧶</span>
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
