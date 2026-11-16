"use client";

export default function CeriaTitle() {
  // Letters data matching exact placement, overlap, and rotation of CERIA.png
  const letters = [
    { char: "C", x: 125, y: 110, rot: -4.5 },
    { char: "E", x: 216, y: 106, rot: -1.5 },
    { char: "R", x: 310, y: 104, rot: 0 },
    { char: "I", x: 394, y: 105, rot: 1.5 },
    { char: "A", x: 485, y: 109, rot: 4.5 },
  ];

  return (
    <div className="relative inline-block w-full max-w-2xl select-none py-2">
      {/* Text murni untuk SEO & Screen Reader Accessibility */}
      <h1 className="sr-only">CERIA</h1>

      {/* Teks SVG 3D yang 1000000000% persis dengan CERIA.png */}
      <svg
        viewBox="0 0 610 210"
        className="w-full h-auto overflow-visible"
        aria-hidden="true"
        style={{ filter: "drop-shadow(0 14px 20px rgba(0,0,0,0.22))" }}
      >
        <defs>
          {/* Top Face Cyan Sky Blue Gradient */}
          <linearGradient id="ceria-cyan-face" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3de2ff" />
            <stop offset="35%" stopColor="#25d3fa" />
            <stop offset="75%" stopColor="#00b5eb" />
            <stop offset="100%" stopColor="#009edc" />
          </linearGradient>

          {/* Top Face Inner Highlight */}
          <linearGradient id="ceria-cyan-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Vibrant Orange 3D Extrusion Gradient */}
          <linearGradient id="ceria-orange-side" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff9838" />
            <stop offset="50%" stopColor="#f07c16" />
            <stop offset="100%" stopColor="#e26605" />
          </linearGradient>

          {/* Dark Reddish Burnt Orange Bottom Shadow Gradient */}
          <linearGradient id="ceria-burnt-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d24813" />
            <stop offset="100%" stopColor="#b23202" />
          </linearGradient>
        </defs>

        <g
          fontFamily="'Lilita One', 'Titan One', 'Fredoka', sans-serif"
          fontWeight="900"
          fontSize="152"
          textAnchor="middle"
        >
          {/* LAYER 1: Deep Burnt Orange Shadow Layer */}
          <g>
            {letters.map((item, idx) => (
              <g key={`shadow-base-${idx}`} transform={`translate(${item.x}, ${item.y + 36}) rotate(${item.rot})`}>
                <text
                  x="0"
                  y="0"
                  fill="url(#ceria-burnt-shadow)"
                  stroke="url(#ceria-burnt-shadow)"
                  strokeWidth="36"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                >
                  {item.char}
                </text>
              </g>
            ))}
          </g>

          {/* LAYER 2: Solid 3D Orange Extrusion (Stepped downwards for smooth continuous 3D depth) */}
          {[28, 24, 20, 16, 12, 8, 4].map((stepY) => (
            <g key={`extrusion-step-${stepY}`}>
              {letters.map((item, idx) => (
                <g key={`ext-${stepY}-${idx}`} transform={`translate(${item.x}, ${item.y + stepY}) rotate(${item.rot})`}>
                  <text
                    x="0"
                    y="0"
                    fill="url(#ceria-orange-side)"
                    stroke="url(#ceria-orange-side)"
                    strokeWidth="30"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  >
                    {item.char}
                  </text>
                </g>
              ))}
            </g>
          ))}

          {/* LAYER 3: Outer Orange Outline */}
          <g>
            {letters.map((item, idx) => (
              <g key={`orange-border-${idx}`} transform={`translate(${item.x}, ${item.y}) rotate(${item.rot})`}>
                <text
                  x="0"
                  y="0"
                  fill="#fa9034"
                  stroke="#fa9034"
                  strokeWidth="28"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                >
                  {item.char}
                </text>
              </g>
            ))}
          </g>

          {/* LAYER 4: Crisp White Border */}
          <g>
            {letters.map((item, idx) => (
              <g key={`white-border-${idx}`} transform={`translate(${item.x}, ${item.y}) rotate(${item.rot})`}>
                <text
                  x="0"
                  y="0"
                  fill="#ffffff"
                  stroke="#ffffff"
                  strokeWidth="16"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                >
                  {item.char}
                </text>
              </g>
            ))}
          </g>

          {/* LAYER 5: Cyan Gradient Letter Face */}
          <g>
            {letters.map((item, idx) => (
              <g key={`cyan-face-${idx}`} transform={`translate(${item.x}, ${item.y}) rotate(${item.rot})`}>
                <text
                  x="0"
                  y="0"
                  fill="url(#ceria-cyan-face)"
                  stroke="url(#ceria-cyan-face)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                >
                  {item.char}
                </text>

                {/* Top Highlight overlay */}
                <text
                  x="0"
                  y="-1"
                  fill="url(#ceria-cyan-glow)"
                  style={{ mixBlendMode: "overlay" }}
                >
                  {item.char}
                </text>
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
