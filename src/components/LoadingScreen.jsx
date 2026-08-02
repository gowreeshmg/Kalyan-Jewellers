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
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, [onComplete]);

  return (
    <>
      <style>{`
        .loading-text { font-size: 4rem; }
        .loading-image { height: 300px; width: 250px; }
        
        .loading-logo-container { top: 1rem; }
        .loading-logo-img-wrapper { height: 48px; margin-top: 8px; margin-right: -32px; }
        .loading-logo-img { height: 95px; }
        .loading-logo-title { font-size: 3rem; }
        .loading-logo-subtitle { font-size: 1rem; margin-top: 10px; }
        
        @media (max-width: 768px) {
          .loading-text { font-size: 2.2rem; }
          .loading-image { height: 180px; width: 150px; }
          
          .loading-logo-container { top: 2rem; }
          .loading-logo-img-wrapper { height: 32px; margin-top: 5px; margin-right: -22px; }
          .loading-logo-img { height: 65px; }
          .loading-logo-title { font-size: 1.8rem; }
          .loading-logo-subtitle { font-size: 0.7rem; margin-top: 6px; }
        }
      `}</style>
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
        <div className="loading-logo-container" style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '0' }}>
          <div className="loading-logo-img-wrapper" style={{ overflow: 'hidden', display: 'flex', alignItems: 'flex-start', zIndex: 2 }}>
            <img className="loading-logo-img" src="/logo.png" alt="Kalyan Jewellers Logo" style={{ objectFit: 'contain', objectPosition: 'top' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', zIndex: 1 }}>
            <h1 className="font-serif loading-logo-title" style={{ fontWeight: 'bold', color: 'var(--kalyan-red)', letterSpacing: '3px', margin: 0, lineHeight: 1 }}>KALYAN</h1>
            <span className="loading-logo-subtitle" style={{ color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 600 }}>Jewellers</span>
          </div>
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
            <span className="loading-text" style={{ fontFamily: 'serif', color: 'var(--kalyan-gold)', fontStyle: 'italic' }}>Curated Masterpieces</span>
            <img className="loading-image" src="/assets/model_bridal_1785599341489.png" alt="Bridal Model" style={{ objectFit: 'cover', borderRadius: '4px' }} />
            <span className="loading-text" style={{ fontFamily: 'serif', color: 'var(--kalyan-red)' }}>A Legacy of Trust</span>
            <img className="loading-image" src="/assets/model_saree_1785599364258.png" alt="Saree Model" style={{ objectFit: 'cover', borderRadius: '4px' }} />
          </VelocityText>
          
          <VelocityText baseVelocity={2}>
            <img className="loading-image" src="/assets/model_necklace_1785599375851.png" alt="Necklace Model" style={{ objectFit: 'cover', borderRadius: '4px' }} />
            <span className="loading-text" style={{ fontFamily: 'serif', color: 'var(--text-primary)' }}>Bridal Collection</span>
            <img className="loading-image" src="/assets/model_earrings_1785599388070.png" alt="Earrings Model" style={{ objectFit: 'cover', borderRadius: '4px' }} />
            <span className="loading-text" style={{ fontFamily: 'serif', color: 'var(--kalyan-gold)' }}>Exquisite Craftsmanship</span>
          </VelocityText>
        </div>
      </motion.div>
    </>
  );
}
