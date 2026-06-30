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
          <span className="section-label">Destacados</span>
          <h2 className="section-title" id="carousel-heading">
            Los más queridos
          </h2>
          <p className="section-sub">
            Una selección de nuestros muñecos favoritos, amados por todos
          </p>
        </div>

        <div className="carousel-nav" role="group" aria-label="Navegación del carrusel">
          <button
            ref={prevRef}
            className="swiper-btn"
            aria-label="Anterior"
            onClick={() => swiperInst?.slidePrev()}
          >
            ←
          </button>
          <button
            ref={nextRef}
            className="swiper-btn"
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
        spaceBetween={16}
        loop={true}
        autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        breakpoints={{
          480:  { slidesPerView: 2.1, spaceBetween: 16 },
          768:  { slidesPerView: 3.1, spaceBetween: 18 },
          1024: { slidesPerView: 4,   spaceBetween: 20 },
          1200: { slidesPerView: 4.5, spaceBetween: 20 },
        }}
        onSwiper={setSwiperInst}
      >
        {CAROUSEL_ITEMS.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="slide-card" role="article" aria-label={item.name}>
              <div className="slide-img-wrap">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                />
                {item.badge && (
                  <span className={`slide-badge ${item.badge.cls}`}>
                    {item.badge.text}
                  </span>
                )}
              </div>

              <div className="slide-body">
                <span className="slide-cat">{item.category}</span>
                <h3 className="slide-name">{item.name}</h3>
                <span className={`slide-price ${priceColor(item.price)}`}>
                  {fmtPrice(item.price)}
                </span>
                <button
                  className="slide-quick-add"
                  onClick={() => onOrder?.(item.name)}
                  aria-label={`Pedir ${item.name}`}
                >
                  + Pedir este
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
