import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';

const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

function VelocityText({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="parallax" style={{ overflow: 'hidden', margin: 0, whiteSpace: 'nowrap', display: 'flex', flexWrap: 'nowrap' }}>
      <motion.div className="scroller" style={{ x, display: 'flex', whiteSpace: 'nowrap', gap: '4rem', alignItems: 'center' }}>
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export default function LoadingScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Lock scroll while loading
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = 'auto';
      setTimeout(onComplete, 1000); // Wait for fade out
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, background: 'var(--bg-primary)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <div style={{ position: 'absolute', top: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--kalyan-red)', letterSpacing: '3px', margin: 0, lineHeight: 1 }}>KALYAN</h1>
        <span style={{ color: 'var(--text-primary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '4px', marginTop: '12px', fontWeight: 600 }}>Jewellers</span>
      </div>

      {/* Loading Indicator at Bottom */}
      <div style={{ position: 'absolute', bottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', zIndex: 10 }}>
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ width: '32px', height: '32px', border: '3px solid rgba(139,0,0,0.2)', borderTop: '3px solid var(--kalyan-red)', borderRadius: '50%' }}
        />
        <span style={{ fontFamily: 'serif', fontSize: '1rem', color: 'var(--kalyan-red)', letterSpacing: '2px', textTransform: 'uppercase' }}>Loading Experience...</span>
      </div>

      <div style={{ width: '100vw', overflow: 'hidden', padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <VelocityText baseVelocity={-2}>
          <span style={{ fontSize: '4rem', fontFamily: 'serif', color: 'var(--kalyan-gold)', fontStyle: 'italic' }}>Curated Masterpieces</span>
          <img src="/assets/model_bridal_1785599341489.png" alt="Bridal Model" style={{ height: '300px', width: '250px', objectFit: 'cover', borderRadius: '4px' }} />
          <span style={{ fontSize: '4rem', fontFamily: 'serif', color: 'var(--kalyan-red)' }}>A Legacy of Trust</span>
          <img src="/assets/model_saree_1785599364258.png" alt="Saree Model" style={{ height: '300px', width: '250px', objectFit: 'cover', borderRadius: '4px' }} />
        </VelocityText>
        
        <VelocityText baseVelocity={2}>
          <img src="/assets/model_necklace_1785599375851.png" alt="Necklace Model" style={{ height: '300px', width: '250px', objectFit: 'cover', borderRadius: '4px' }} />
          <span style={{ fontSize: '4rem', fontFamily: 'serif', color: 'var(--text-primary)' }}>Bridal Collection</span>
          <img src="/assets/model_earrings_1785599388070.png" alt="Earrings Model" style={{ height: '300px', width: '250px', objectFit: 'cover', borderRadius: '4px' }} />
          <span style={{ fontSize: '4rem', fontFamily: 'serif', color: 'var(--kalyan-gold)' }}>Exquisite Craftsmanship</span>
        </VelocityText>
      </div>
    </motion.div>
  );
}
