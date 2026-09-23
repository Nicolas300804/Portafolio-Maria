import { useState, useRef, useEffect } from 'react';
import { CINEMATIC_VIDEOS } from '../data/videos';

export default function Hero({ onNavigate }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const activeVideo = CINEMATIC_VIDEOS[activeIdx];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [activeIdx]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <section className="cinematic-hero" id="hero" aria-label="Sección Principal Cinematográfica">
      {/* Background Video Engine */}
      <div className="hero-video-wrapper" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video-bg"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster={activeVideo.poster}
        >
          <source src={activeVideo.src} type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>
        
        {/* Cinematic Overlays: Vignette, Scanlines & Gradient Glows */}
        <div className="cinematic-vignette" />
        <div className="cinematic-lens-flare" />
        <div className="cinematic-gradient-left" />
        <div className="cinematic-gradient-bottom" />
      </div>

      {/* Main Content Overlay */}
      <div className="container hero-container">
        <div className="hero-grid">
          
          {/* Left Column: Cinematic Info & Actions */}
          <div className="hero-main-content">
            
            {/* Top Film Badge */}
            <div className="film-badge-row">
              <div className="film-live-badge">
                <span className="live-dot" />
                <span className="live-text">CINEMATIC SHOWCASE 2026</span>
              </div>
              <div className="soundwave-indicator" aria-hidden="true">
                <span className="bar bar-1" />
                <span className="bar bar-2" />
                <span className="bar bar-3" />
                <span className="bar bar-4" />
              </div>
            </div>

            {/* Giant Cinematic Heading */}
            <h1 className="hero-title-cinematic">
              <span className="title-pre">COLECCIÓN EXCLUSIVA</span>
              <span className="title-gradient-block">MUÑECOS DE CROCHET</span>
              <span className="title-sub-cursive">Hechos con amor y magia</span>
            </h1>

            {/* Synopsis */}
            <p className="hero-synopsis">
              Cada creación es una obra de arte tejida a mano. Personajes entrañables,
              texturas suaves y acabados de película para regalar momentos inolvidables.
            </p>

            {/* Action Buttons connected to SPA navigation */}
            <div className="hero-btn-group">
              <button
                type="button"
                className="btn-glow-primary"
                id="hero-btn-catalog"
                onClick={() => onNavigate?.('catalogo')}
              >
                <span className="btn-icon">🧶</span>
                <span className="btn-txt">EXPLORAR CATÁLOGO</span>
                <span className="btn-flare" />
              </button>

              <button
                type="button"
                className="btn-glow-secondary"
                id="hero-btn-cinema"
                onClick={() => onNavigate?.('cine')}
              >
                <span className="btn-icon">🎬</span>
                <span className="btn-txt">VER EXPERIENCIA CINE</span>
              </button>

              <button
                type="button"
                className="btn-glow-accent"
                id="hero-btn-custom"
                onClick={() => onNavigate?.('personalizar')}
              >
                <span className="btn-icon">🎨</span>
                <span className="btn-txt">DISEÑAR A MEDIDA</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="hero-metrics-bar">
              <div className="metric-box">
                <span className="metric-val">19+</span>
                <span className="metric-lbl">Personajes</span>
              </div>
              <div className="metric-separator" />
              <div className="metric-box">
                <span className="metric-val">100%</span>
                <span className="metric-lbl">Artesanal</span>
              </div>
              <div className="metric-separator" />
              <div className="metric-box">
                <span className="metric-val">7-10</span>
                <span className="metric-lbl">Días Entrega</span>
              </div>
              <div className="metric-separator" />
              <div className="metric-box">
                <span className="metric-val">💜</span>
                <span className="metric-lbl">Nequi & Contraentrega</span>
              </div>
            </div>
          </div>

          {/* Right Column: Scene Control & Interactive Director Box */}
          <div className="hero-scene-controls">
            
            {/* Director's Slate Card */}
            <div className="scene-card-glass">
              <div className="scene-card-header">
                <span className="scene-tag">{activeVideo.tag}</span>
                <div className="video-action-btns">
                  <button
                    className="video-ctrl-btn"
                    onClick={togglePlay}
                    title={isPlaying ? 'Pausar video' : 'Reproducir video'}
                    aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <button
                    className={`video-ctrl-btn ${!isMuted ? 'active-audio' : ''}`}
                    onClick={toggleMute}
                    title={isMuted ? 'Activar sonido' : 'Silenciar'}
                    aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                  >
                    {isMuted ? '🔇' : '🔊'}
                  </button>
                </div>
              </div>

              <div className="scene-card-body">
                <h2 className="scene-title">{activeVideo.title}</h2>
                <p className="scene-desc">{activeVideo.description}</p>
                
                <div className="scene-highlights">
                  {activeVideo.highlights.map((h, i) => (
                    <span key={i} className="highlight-pill">✦ {h}</span>
                  ))}
                </div>
              </div>

              {/* Scene Switcher Tabs */}
              <div className="scene-switcher-container">
                <span className="scene-switcher-label">SELECCIONAR ESCENA:</span>
                <div className="scene-tabs-grid">
                  {CINEMATIC_VIDEOS.map((v, idx) => (
                    <button
                      key={v.id}
                      className={`scene-tab-btn ${activeIdx === idx ? 'tab-active' : ''}`}
                      onClick={() => setActiveIdx(idx)}
                      id={`scene-tab-${v.id}`}
                    >
                      <span className="tab-num">0{idx + 1}</span>
                      <span className="tab-title">{v.title}</span>
                      {activeIdx === idx && <span className="tab-glow-indicator" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Action Cue */}
      <button
        type="button"
        className="hero-scroll-cue"
        onClick={() => onNavigate?.('cine')}
        aria-label="Ir a la experiencia cine"
      >
        <span className="scroll-cue-text">EXPLORAR CINE REEL 4K</span>
        <div className="scroll-cue-mouse">
          <div className="mouse-wheel" />
        </div>
      </button>
    </section>
  );
}
