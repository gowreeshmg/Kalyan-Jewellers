import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function HeroImage({ src }) {
  const ref = useRef(null);
  
  // Mouse position state
  const [hovered, setHovered] = useState(false);
  const mouseX = useSpring(0, { stiffness: 100, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Convert mouse position to 3D rotation
  const rotateX = useTransform(mouseY, [-1, 1], [10, -10]);
  const rotateY = useTransform(mouseX, [-1, 1], [-10, 10]);

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        perspective: 1200 
      }}
    >
      <motion.div
        style={{
          width: '80%',
          height: '80%',
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          position: 'relative'
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <motion.div 
          style={{ 
            width: '100%', 
            height: '100%', 
            borderRadius: '24px', 
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            transform: 'translateZ(50px)' // Creates depth from the container
          }}
        >
          <motion.img 
            src={src} 
            alt="Hero Jewelry" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }} 
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>
        
        {/* Floating elements for extra 3D effect */}
        <motion.div 
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '150px',
            height: '150px',
            background: 'var(--kalyan-gold)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            opacity: 0.5,
            transform: 'translateZ(-50px)'
          }}
        />
      </motion.div>
    </div>
  );
}
