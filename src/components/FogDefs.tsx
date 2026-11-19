/**
 * SVG filters used to distort letters. Animated turbulence makes the glyphs
 * waver like they are seen through drifting smoke, instead of a flat CSS blur.
 */
export default function FogDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="fog-easy" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.06" numOctaves="2" seed="3" result="noise">
            <animate attributeName="baseFrequency" dur="9s" values="0.035 0.06;0.05 0.04;0.035 0.06" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G" result="warp" />
          <feGaussianBlur in="warp" stdDeviation="2.6" />
        </filter>

        <filter id="fog-medium" x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.09" numOctaves="3" seed="8" result="noise">
            <animate attributeName="baseFrequency" dur="7s" values="0.05 0.09;0.08 0.05;0.05 0.09" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="B" result="warp" />
          <feGaussianBlur in="warp" stdDeviation="4.2" result="blur" />
          <feComponentTransfer in="blur">
            <feFuncA type="linear" slope="0.75" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
