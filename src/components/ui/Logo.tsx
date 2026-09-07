import React from 'react'

export const Logo: React.FC<{ className?: string, width?: number, height?: number }> = ({ className = '', width = 240, height = 80 }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} style={{ width, height }}>
      {/* Visual Logo SVG */}
      <svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-sm">
        <defs>
          <style>
            {`
              .maroon { fill: #7C0A02; }
              .maroon-stroke { stroke: #7C0A02; fill: none; stroke-width: 4; stroke-miterlimit: 10; }
              .text-sub { font-family: sans-serif; fill: #7C0A02; font-size: 14px; letter-spacing: 0.25em; font-weight: 600; }
              .text-motto { font-family: sans-serif; fill: #7C0A02; font-size: 11px; letter-spacing: 0.35em; font-weight: 600; }
            `}
          </style>
        </defs>

        {/* Center Text (डोर) */}
        <g transform="translate(195, 20)">
          {/* Top horizontal bar */}
          <path d="M 0 35 L 145 35 L 140 45 L 5 45 Z" className="maroon" />
          
          {/* ड shape */}
          <path d="M 30 45 L 30 65 Q 20 65 20 75 Q 20 85 45 85 Q 70 85 70 105 Q 70 125 45 125 Q 25 125 15 115 L 20 105 Q 30 115 45 115 Q 60 115 60 105 Q 60 95 45 95 Q 10 95 10 75 Q 10 60 20 55 L 20 45 Z" className="maroon" />
          
          {/* Vertical bar for ो */}
          <path d="M 100 45 L 115 45 L 115 120 L 100 120 Z" className="maroon" />
          
          {/* Top stroke for ो */}
          <path d="M 60 10 Q 75 10 90 35 L 80 35 Q 70 20 60 25 Z" className="maroon" />
          <circle cx="60" cy="25" r="5" className="maroon" />

          {/* र shape */}
          <path d="M 130 45 Q 165 45 165 75 Q 165 95 140 105 Q 155 115 180 125 L 165 130 Q 135 120 125 105 L 125 100 Q 150 95 150 75 Q 150 55 130 55 Z" className="maroon" />
        </g>

        {/* Left Side: Artisan Woman & Thread Loop */}
        <g transform="translate(60, 25)">
          {/* Loop/Thread wrapping around */}
          <path d="M 115 25 C 100 0, 0 -10, 0 60 C 0 140, 115 140, 125 105" className="maroon-stroke" />
          <path d="M 0 60 C -10 130, 90 150, 130 115" className="maroon-stroke" strokeWidth="2" />
          
          {/* Woman Silhouette */}
          <path d="M 50 25 C 60 15, 75 25, 65 35 C 70 40, 60 50, 50 50 C 45 50, 40 45, 45 35 C 35 25, 40 15, 50 25 Z" className="maroon" />
          <path d="M 45 40 Q 30 55 15 85 L 15 100 Q 35 95 50 75 Z" className="maroon" />
          <path d="M 50 75 Q 70 115 75 115 L 60 115 Q 50 95 40 85 Z" className="maroon" />
          <path d="M 40 55 Q 60 70 85 60 L 80 55 Q 55 60 45 50 Z" className="maroon" />

          {/* Pot/Vase */}
          <path d="M 75 60 L 95 60 L 105 100 C 105 110, 65 110, 65 100 Z" className="maroon" />
          
          {/* Pattern on Pot */}
          <path d="M 70 70 L 100 70 M 67 80 L 103 80 M 66 90 L 104 90 M 75 80 L 80 90 L 85 80 L 90 90 L 95 80" stroke="#fff" fill="none" strokeWidth="2" />
        </g>

        {/* Right Side: Flower motif */}
        <g transform="translate(390, 85)">
          {/* Connecting thread line */}
          <path d="M -30 25 C 0 30, 0 -5, 10 -5" className="maroon-stroke" />
          
          {/* Flower petals */}
          <path d="M 10 -5 Q 20 -20 30 -5 Q 20 10 10 -5 Z" className="maroon" stroke="#fff" strokeWidth="2" />
          <path d="M 10 -5 Q -5 -15 10 -25 Q 25 -15 10 -5 Z" className="maroon" stroke="#fff" strokeWidth="2" />
          <path d="M 10 -5 Q 0 10 10 25 Q 20 10 10 -5 Z" className="maroon" stroke="#fff" strokeWidth="2" />
          <path d="M 10 -5 Q 25 5 40 -5 Q 25 -15 10 -5 Z" className="maroon" stroke="#fff" strokeWidth="2" />
        </g>

        {/* Text Below */}
        <text x="250" y="145" textAnchor="middle" className="text-sub">A DIGITAL THREAD FROM ARTISAN TO MARKET</text>
      </svg>
    </div>
  )
}
