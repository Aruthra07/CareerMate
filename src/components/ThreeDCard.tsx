'use client';

import React, { useState, useRef } from 'react';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // Tilt intensity (higher = more tilt)
}

export function ThreeDCard({ children, className = '', intensity = 15 }: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [reflectionStyle, setReflectionStyle] = useState({ opacity: 0, x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Calculate rotation angles (invert Y axis rotation to tilt correctly)
    const rotateX = -(mouseY / (height / 2)) * intensity;
    const rotateY = (mouseX / (width / 2)) * intensity;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);

    // Reflection coordinates
    const reflectX = ((e.clientX - rect.left) / width) * 100;
    const reflectY = ((e.clientY - rect.top) / height) * 100;
    setReflectionStyle({
      opacity: 0.15,
      x: reflectX,
      y: reflectY
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setReflectionStyle({ opacity: 0, x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl overflow-hidden transition-all duration-200 ease-out cursor-pointer select-none bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 p-6 backdrop-blur-xl shadow-lg ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: transformStyle
      }}
    >
      {/* 3D Parallax Reflection Layer */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: reflectionStyle.opacity,
          background: `radial-gradient(circle 120px at ${reflectionStyle.x}% ${reflectionStyle.y}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Content wrapper with translateZ to pop it out slightly */}
      <div style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
}
export default ThreeDCard;
