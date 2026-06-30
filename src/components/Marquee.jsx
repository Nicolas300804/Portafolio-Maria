// Scrolling text marquee — editorial brand element
const MARQUEE_ITEMS = [
  "Hecho a mano",
  "Con amor",
  "Tejido artesanal",
  "Único e irrepetible",
  "El regalo perfecto",
  "Amigurumi",
  "Crochet",
  "Muñecos únicos",
];

export default function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="marquee-section" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((text, i) => (
          <span key={i} className="marquee-item">
            <span className="dot">✦</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
