interface AIADMKLogoProps {
  className?: string;
  animated?: boolean;
}

export function AIADMKLogo({ className = "w-16 h-16", animated = false }: AIADMKLogoProps) {
  return (
    <div className={`${className} ${animated ? "logo-glow" : ""} flex items-center justify-center`}>
      {/* AIADMK Double Leaf Logo SVG */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Leaf */}
        <path
          d="M30 50C30 35 35 20 45 15C40 25 35 35 35 50C35 65 40 75 45 85C35 80 30 65 30 50Z"
          fill="currentColor"
          className="text-neon drop-shadow-lg"
        />
        {/* Right Leaf */}
        <path
          d="M70 50C70 35 65 20 55 15C60 25 65 35 65 50C65 65 60 75 55 85C65 80 70 65 70 50Z"
          fill="currentColor"
          className="text-neon drop-shadow-lg"
        />
        {/* Center Stem */}
        <path
          d="M47 85L53 85L53 15L47 15Z"
          fill="currentColor"
          className="text-neon drop-shadow-lg"
        />
        {/* Neon glow effect */}
        <defs>
          <filter id="neon-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#neon-glow)">
          <path
            d="M30 50C30 35 35 20 45 15C40 25 35 35 35 50C35 65 40 75 45 85C35 80 30 65 30 50Z"
            fill="hsl(var(--neon-glow))"
            fillOpacity="0.6"
          />
          <path
            d="M70 50C70 35 65 20 55 15C60 25 65 35 65 50C65 65 60 75 55 85C65 80 70 65 70 50Z"
            fill="hsl(var(--neon-glow))"
            fillOpacity="0.6"
          />
          <path
            d="M47 85L53 85L53 15L47 15Z"
            fill="hsl(var(--neon-glow))"
            fillOpacity="0.6"
          />
        </g>
      </svg>
    </div>
  );
}