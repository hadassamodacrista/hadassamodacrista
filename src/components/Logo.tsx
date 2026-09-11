export function Logo({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Hadassa">
      <circle cx="60" cy="60" r="58" fill="none" stroke="#8a5a42" strokeWidth="1.2" />
      <text
        x="60"
        y="52"
        textAnchor="middle"
        fontFamily="Playfair Display, Georgia, serif"
        fontWeight={700}
        fontSize="34"
        fill="#8a5a42"
      >
        H
      </text>
      <text
        x="60"
        y="78"
        textAnchor="middle"
        fontFamily="Playfair Display, Georgia, serif"
        fontWeight={600}
        fontSize="15"
        letterSpacing="2"
        fill="#8a5a42"
      >
        HADASSA
      </text>
      <line x1="30" y1="88" x2="52" y2="88" stroke="#8a5a42" strokeWidth="0.8" />
      <line x1="68" y1="88" x2="90" y2="88" stroke="#8a5a42" strokeWidth="0.8" />
      <path d="M58 82v10M55 85h6" stroke="#8a5a42" strokeWidth="1" strokeLinecap="round" />
      <text
        x="60"
        y="100"
        textAnchor="middle"
        fontFamily="Poppins, sans-serif"
        fontWeight={400}
        fontSize="6.5"
        letterSpacing="1.5"
        fill="#8a5a42"
      >
        MODA COM PROPÓSITO
      </text>
    </svg>
  );
}
