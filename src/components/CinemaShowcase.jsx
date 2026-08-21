import { useState, useRef, useEffect } from 'react';
import { CINEMATIC_VIDEOS } from '../data/videos';

export default function CinemaShowcase({ onOrder }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:15');
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);

  const activeVideo = CINEMATIC_VIDEOS[currentIdx];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      const p = videoRef.current.play();
      if (p !== undefined) {
        p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, [currentIdx]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 15;
      setProgress((current / total) * 100);
      
      const format = (t) => {
        const mins = Math.floor(t / 60);
        const secs = Math.floor(t % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      };
      setCurrentTime(format(current));
      if (!isNaN(videoRef.current.duration)) {
        setDuration(format(videoRef.current.duration));
      }
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = pos * videoRef.current.duration;
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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (playerContainerRef.current) {
      if (!document.fullscreenElement) {
        playerContainerRef.current.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    }
  };

  return (
    <section className="cinema-showcase-section" id="cine-reel" aria-labelledby="cinema-heading">
      
      {/* Background Ambience */}
      <div className="cinema-ambient-glow" aria-hidden="true" />

      <div className="container">
        
        {/* Section Header */}
        <div className="cinema-header-center">
          <span className="section-label">✦ TEATRO DE EXHIBICIÓN ✦</span>
          <h2 className="section-title" id="cinema-heading">
            Experiencia Cinematográfica
          </h2>
          <p className="section-sub">
            Descubre en alta definición cada textura, color y detalle artesanal.
            La magia del crochet cobra vida en video.
          </p>
        </div>

        {/* Main Cinema Theater Stage */}
        <div className="cinema-theater-wrapper">
          
          {/* Cinema Screen Frame */}
          <div className="cinema-screen-frame" ref={playerContainerRef}>
            
            {/* Ambient Dynamic Backlight */}
            <div className="screen-backlight-halo" aria-hidden="true" />

            <video
              ref={videoRef}
              className="cinema-main-video"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
            >
              <source src={activeVideo.src} type="video/mp4" />
            </video>

            {/* Cinema Letterbox Bar Top & Bottom */}
            <div className="letterbox-bar letterbox-top">
              <div className="film-reel-meta">
                <span className="rec-dot" />
                <span className="reel-title">{activeVideo.title.toUpperCase()}</span>
                <span className="reel-tag-badge">{activeVideo.tag}</span>
              </div>
              <div className="film-resolution">4K ULTRA HD · 60 FPS</div>
            </div>

            {/* Cinema Controls Overlay (Hover or Always Visible) */}
            <div className="cinema-controls-bar">
              
              {/* Progress Scrubber */}
              <div className="cinema-timeline" onClick={handleSeek} role="slider" aria-valuenow={progress} aria-label="Progreso de video">
                <div className="timeline-track">
                  <div className="timeline-filled" style={{ width: `${progress}%` }}>
                    <span className="timeline-thumb" />
                  </div>
                </div>
              </div>

              <div className="controls-row">
                <div className="ctrl-left">
                  <button
                    className="cinema-btn cinema-play-btn"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                  >
                    {isPlaying ? '❚❚' : '▶'}
                  </button>
                  <button
                    className="cinema-btn cinema-mute-btn"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                  >
                    {isMuted ? '🔇' : '🔊'}
                  </button>
                  <span className="cinema-time-display">
                    {currentTime} / {duration}
                  </span>
                </div>

                <div className="ctrl-right">
                  <span className="cinema-clip-label">
                    Escena {currentIdx + 1} de {CINEMATIC_VIDEOS.length}
                  </span>
                  <button
                    className="cinema-btn cinema-fs-btn"
                    onClick={toggleFullscreen}
                    title="Pantalla Completa"
                    aria-label="Pantalla Completa"
                  >
                    ⛶
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Film Reels Selector Strip */}
          <div className="film-reels-strip">
            {CINEMATIC_VIDEOS.map((vid, idx) => (
              <div
                key={vid.id}
                className={`film-reel-card ${currentIdx === idx ? 'reel-active' : ''}`}
                onClick={() => setCurrentIdx(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setCurrentIdx(idx)}
                aria-label={`Ver clip: ${vid.title}`}
              >
                <div className="reel-card-thumb">
                  <img src={vid.poster} alt={vid.title} loading="lazy" />
                  <div className="reel-play-icon">▶</div>
                  <span className="reel-duration">{vid.duration}</span>
                </div>
                <div className="reel-card-info">
                  <span className="reel-category">{vid.tag}</span>
                  <h4 className="reel-name">{vid.title}</h4>
                  <p className="reel-summary">{vid.subtitle}</p>
                </div>
                {currentIdx === idx && <div className="reel-active-glow" />}
              </div>
            ))}
          </div>

        </div>

        {/* Cinematic Craftsmanship Banner */}
        <div className="cinema-features-banner">
          <div className="feature-pill-item">
            <span className="pill-icon">✨</span>
            <div className="pill-text">
              <strong>Hilos 100% Algodón</strong>
              <span>Suavidad hipoalergénica de lujo</span>
            </div>
          </div>
          <div className="feature-pill-item">
            <span className="pill-icon">🔒</span>
            <div className="pill-text">
              <strong>Ojos de Seguridad Térmicos</strong>
              <span>100% seguros para niños y bebés</span>
            </div>
          </div>
          <div className="feature-pill-item">
            <span className="pill-icon">☁️</span>
            <div className="pill-text">
              <strong>Relleno Siliconado Premium</strong>
              <span>Mantiene su forma esponjosa por años</span>
            </div>
          </div>
          <div className="feature-pill-item">
            <span className="pill-icon">🎁</span>
            <div className="pill-text">
              <strong>Empaque de Regalo</strong>
              <span>Listo para sorprender a quien amas</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
