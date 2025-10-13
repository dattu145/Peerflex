import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  life: number;
  vx: number;
  vy: number;
}

const ParticleCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  const particleColors = {
    default: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'],
    hover: ['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8']
  };

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });

      // Create trailing particles on mouse move
      const colors = isHovering ? particleColors.hover : particleColors.default;
      const newParticles: Particle[] = [];
      
      // Create 1-2 particles per movement
      const particleCount = Math.random() > 0.5 ? 2 : 1;
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 9 + 1, // 1-4px
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1,
          vx: (Math.random() - 0.5) * 8, // Random velocity
          vy: (Math.random() - 0.5) * 8,
        });
      }
      
      setParticles(prev => [...prev, ...newParticles]);
    };

    // Add hover event listeners
    const handleMouseEnter = () => {
      setIsHovering(true);
      
      // Create burst effect on hover
      const colors = particleColors.hover;
      const burstParticles: Particle[] = [];
      for (let i = 0; i < 6; i++) {
        burstParticles.push({
          id: Date.now() + i,
          x: mousePosition.x,
          y: mousePosition.y,
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1,
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.5) * 12,
        });
      }
      setParticles(prev => [...prev, ...burstParticles]);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    const interactiveElements = document.querySelectorAll(
      'button, a, input, textarea, select, [role="button"]'
    );

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [isHovering, mousePosition.x, mousePosition.y]);

  // Update particles animation
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 0.025, // Faster fade
            size: particle.size * 0.94, // Shrink faster
            vx: particle.vx * 0.92, // Slow down
            vy: particle.vy * 0.92,
          }))
          .filter(particle => particle.life > 0 && particle.size > 0.2)
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Particles only - no main cursor */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="fixed rounded-full pointer-events-none z-50"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: 0,
            top: 0,
            x: particle.x - particle.size / 2, // Perfect centering
            y: particle.y - particle.size / 2,
            opacity: particle.life,
          }}
          initial={{ 
            opacity: 1,
            scale: 1 
          }}
          animate={{ 
            opacity: 0,
            scale: 0.3
          }}
          transition={{ 
            duration: 0.6,
            ease: "easeOut"
          }}
        />
      ))}
    </>
  );
};

export default ParticleCursor;