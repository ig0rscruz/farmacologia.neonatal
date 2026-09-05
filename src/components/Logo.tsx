/**
 * Ícone do NeoDose: arco protetor (gradiente verde-água -> pêssego) ao redor de
 * um bebê enrolado, com cruz, coração e gota — reinterpretação em SVG (vetorial,
 * leve, escalável para qualquer tamanho) da identidade visual da marca.
 */
export function LogoIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <linearGradient id="neodose-arc" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4fb8ac" />
          <stop offset="1" stopColor="#f0a868" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="#ffffff" />
      <path
        d="M 22 68 A 34 34 0 1 1 78 68"
        fill="none"
        stroke="url(#neodose-arc)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M31 64 Q50 88 69 64 Q64 77 50 79 Q36 77 31 64 Z"
        fill="#fdeedd"
        stroke="#f0a868"
        strokeWidth="1.5"
      />
      <circle cx="50" cy="54" r="15" fill="#fbefe3" stroke="#e8b98a" strokeWidth="1.2" />
      <path d="M44 54 q3 3 6 0" stroke="#8a6a4a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M52 54 q3 3 6 0" stroke="#8a6a4a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M46.5 60 q3.5 2.6 7 0" stroke="#c47a56" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <g transform="translate(26,27)">
        <rect x="-2.2" y="-7.5" width="4.4" height="15" rx="1.6" fill="#4fb8ac" />
        <rect x="-7.5" y="-2.2" width="15" height="4.4" rx="1.6" fill="#4fb8ac" />
      </g>
      <path
        transform="translate(73,28)"
        d="M0 4.5 C -5 -1.5 -11.5 1.3 -11.5 6.8 C -11.5 11.5 -5.5 15.3 0 19.8 C 5.5 15.3 11.5 11.5 11.5 6.8 C 11.5 1.3 5 -1.5 0 4.5 Z"
        fill="#f0a868"
      />
      <path
        transform="translate(76,62)"
        d="M0 -9 C 5.5 -1.8 7.3 2.8 7.3 6.5 A7.3 7.3 0 1 1 -7.3 6.5 C -7.3 2.8 -5.5 -1.8 0 -9 Z"
        fill="#3f74ac"
      />
    </svg>
  )
}
