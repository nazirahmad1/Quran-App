"use client";

interface IslamicPatternProps {
  className?: string;
  opacity?: number;
}

// An 8-pointed star motif common in Islamic geometric art
export default function IslamicPattern({
  className = "",
  opacity = 0.15,
}: IslamicPatternProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      <defs>
        <pattern id="islamic-star" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          {/* 8-pointed star */}
          <g fill="none" stroke="#d4af37" strokeWidth="0.8">
            {/* Outer octagon */}
            <polygon points="50,5 71,14 86,35 86,65 71,86 50,95 29,86 14,65 14,35 29,14" />
            {/* Inner star */}
            <polygon points="50,15 60,30 78,30 65,42 70,60 50,50 30,60 35,42 22,30 40,30" />
            {/* Center diamond */}
            <polygon points="50,35 62,50 50,65 38,50" />
            {/* Connecting lines */}
            <line x1="50" y1="5" x2="50" y2="35" />
            <line x1="86" y1="50" x2="62" y2="50" />
            <line x1="50" y1="95" x2="50" y2="65" />
            <line x1="14" y1="50" x2="38" y2="50" />
          </g>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#islamic-star)" />
    </svg>
  );
}

// Arch / mihrab shape for decorative headers
export function IslamicArch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="arch-gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="#d4af37" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      {/* Main arch */}
      <path
        d="M 30,75 L 30,40 Q 30,10 150,5 Q 270,10 270,40 L 270,75"
        fill="none"
        stroke="url(#arch-gold)"
        strokeWidth="1.5"
      />
      {/* Inner arch */}
      <path
        d="M 55,75 L 55,45 Q 55,25 150,20 Q 245,25 245,45 L 245,75"
        fill="none"
        stroke="#d4af37"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      {/* Column bases */}
      <rect x="20" y="70" width="20" height="6" fill="#d4af37" fillOpacity="0.3" rx="1" />
      <rect x="260" y="70" width="20" height="6" fill="#d4af37" fillOpacity="0.3" rx="1" />
      {/* Star at apex */}
      <polygon
        points="150,2 152,7 157,7 153,10 155,15 150,12 145,15 147,10 143,7 148,7"
        fill="#d4af37"
        fillOpacity="0.7"
      />
    </svg>
  );
}
