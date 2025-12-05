import React from 'react';

interface SecondHandProLogoProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

const SecondHandProLogo: React.FC<SecondHandProLogoProps> = ({ 
  width = "300", 
  height = "auto", 
  className = "" 
}) => {
  const primaryColor = "#3C319C";
  const secondaryColor = "#5449DF";
  const textColor = "#ffffff";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 250"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="לוגו SecondHandPro"
    >
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur" />
          <feOffset in="blur" dx="4" dy="8" result="offsetBlur" />
          <feFlood floodColor="#2a226b" floodOpacity="0.5" result="offsetColor" />
          <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur" />
          <feMerge>
            <feMergeNode in="offsetBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* שכבה אחורית */}
      <path
        fill={primaryColor}
        filter="url(#shadow)"
        d="M523.6,164.8c-25.1,38.5-73.1,58.9-118.1,46.2c-45.1-12.7-76.4-57.2-118.3-75.9c-41.9-18.8-94.3-10.9-130.5,15.5
        c-36.2,26.4-56.9,69.5-94.2,82.3c-37.2,12.8-82-7.6-108.5-41.9C-32.4,156.6-38.6,108,3.1,71.9c41.7-36.1,105.3-28.4,145.4-4.4
        c40,24,58.4,69.3,99.1,84.5c40.7,15.3,104.1-0.5,146-29.8c41.9-29.2,62.3-72.5,97.4-86.2c35.2-13.7,85,2.6,118.9,33.9
        C643.8,99.9,548.7,126.3,523.6,164.8z"
        transform="translate(20, 20)"
      />

      {/* שכבה אמצעית */}
      <path
        fill={secondaryColor}
        filter="url(#shadow)"
        opacity="0.9"
        d="M498.1,173.8c-22.6,34.7-65.9,53-106.4,41.6c-40.6-11.4-68.8-51.5-106.6-68.3c-37.7-16.9-84.9-9.8-117.5,13.9
        c-32.6,23.7-51.2,62.6-84.9,74.1c-33.5,11.5-73.8-6.8-97.7-37.8c-23.8-30.9-29.4-74.7,8.1-107.2c37.6-32.5,94.8-25.6,130.9-3.9
        c36.1,21.6,52.6,62.4,89.2,76.1c36.7,13.7,93.7-0.5,131.4-26.8c37.7-26.3,56.1-65.3,87.7-77.6c31.6-12.3,76.6,2.3,107.1,30.5
        C606.3,115.3,520.7,139.1,498.1,173.8z"
        transform="translate(10, 10)"
      />

      {/* שכבה קדמית */}
      <path
        fill={secondaryColor}
        filter="url(#shadow)"
        d="M476.5,193.7c-33.2-20.5-55-58.3-47.6-97.8c7.1-38.1,39.7-67.8,76.6-81.5c37.8-14,81.3-12.9,119.5,4.1
        c31.4,14,58.4,38.9,91.8,52c35.6,14,77.8,14.8,114.4,1.1c44.1-16.6,80.8-52.5,126.1-43.6c42.7,8.4,75.6,46.6,83.4,89.5
        c8.1,44.4-12.2,91.1-50.1,116.9c-38.7,26.4-89.9,29.4-135.4,21.9c-45.2-7.5-87.9-33.3-133.2-39.3
        c-47.8-6.3-97.7,12.5-142.2,14.6C542.4,233.5,508.9,213.7,476.5,193.7z"
        transform="translate(-400, 0)"
      />

      {/* טקסט */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={textColor}
        style={{
          fontFamily: '"Nunito", "Varela Round", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          fontSize: '72px',
          fontWeight: 'bold',
          letterSpacing: '0.5px',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
        }}
      >
        SecondHandPro
      </text>
    </svg>
  );
};

export default SecondHandProLogo;
