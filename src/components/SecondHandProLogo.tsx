import React from 'react';

interface SecondHandProLogoProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

const SecondHandProLogo: React.FC<SecondHandProLogoProps> = ({ 
  width = "160", 
  height = "auto", 
  className = "" 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="לוגו SecondHandPro"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c5fdc" />
          <stop offset="100%" stopColor="#5449DF" />
        </linearGradient>
      </defs>
      
      {/* אייקון יד עם מעגל */}
      <circle cx="22" cy="25" r="20" fill="url(#logoGradient)" />
      <g fill="white" transform="translate(12, 15)">
        <path d="M4 8c0-1.1.9-2 2-2s2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2V8z" opacity="0.9"/>
        <path d="M9 5c0-1.1.9-2 2-2s2 .9 2 2v9c0 1.1-.9 2-2 2s-2-.9-2-2V5z" opacity="0.95"/>
        <path d="M14 7c0-1.1.9-2 2-2s2 .9 2 2v7c0 1.1-.9 2-2 2s-2-.9-2-2V7z"/>
      </g>
      
      {/* טקסט */}
      <text
        x="52"
        y="30"
        fill="currentColor"
        style={{
          fontFamily: 'Rubik, sans-serif',
          fontSize: '18px',
          fontWeight: 600,
        }}
      >
        SecondHand
        <tspan fill="url(#logoGradient)" fontWeight="700">Pro</tspan>
      </text>
    </svg>
  );
};

export default SecondHandProLogo;
