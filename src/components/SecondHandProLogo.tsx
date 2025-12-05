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
  const brandColor = "#5449DF";
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
      {/* צורת הרקע (הענן/כתם) */}
      <path
        fill={brandColor}
        d="M76.5,193.7c-33.2-20.5-55-58.3-47.6-97.8c7.1-38.1,39.7-67.8,76.6-81.5c37.8-14,81.3-12.9,119.5,4.1c31.4,14,58.4,38.9,91.8,52c35.6,14,77.8,14.8,114.4,1.1c44.1-16.6,80.8-52.5,126.1-43.6c42.7,8.4,75.6,46.6,83.4,89.5c8.1,44.4-12.2,91.1-50.1,116.9c-38.7,26.4-89.9,29.4-135.4,21.9c-45.2-7.5-87.9-33.3-133.2-39.3c-47.8-6.3-97.7,12.5-142.2,14.6C142.4,233.5,108.9,213.7,76.5,193.7z"
      />

      {/* הטקסט */}
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
          letterSpacing: '0.5px'
        }}
      >
        SecondHandPro
      </text>
    </svg>
  );
};

export default SecondHandProLogo;
