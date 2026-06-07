'use client';

import React from 'react';

export function ThreeDParticles() {
  // Generate 25 particles with randomized variables for CSS 3D translation
  const particles = Array.from({ length: 25 }).map((_, idx) => {
    const size = Math.random() * 8 + 4; // 4px to 12px
    const left = Math.random() * 100; // 0% to 100%
    const top = Math.random() * 100;
    const duration = Math.random() * 20 + 15; // 15s to 35s
    const delay = Math.random() * -15; // starts immediately
    const depth = Math.random() * 300 - 150; // Z-axis translate range

    return {
      id: idx,
      style: {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: `${top}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        transform: `translate3d(0, 0, ${depth}px)`,
      } as React.CSSProperties
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" style={{ perspective: '800px' }}>
      <style>{`
        @keyframes float3d {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translate3d(100px, -80px, 150px) rotate(180deg);
            opacity: 0.45;
          }
          100% {
            transform: translate3d(-50px, -150px, -100px) rotate(360deg);
            opacity: 0.1;
          }
        }
        .particle-node {
          animation-name: float3d;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>
      
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 blur-[1px] opacity-20 particle-node"
          style={p.style}
        />
      ))}
    </div>
  );
}
export default ThreeDParticles;
