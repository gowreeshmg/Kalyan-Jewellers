import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2000&auto=format&fit=crop",
    title: "Timeless Elegance",
    subtitle: "Discover",
  },
  {
    image: "https://images.unsplash.com/photo-1599643478524-fb66f7f6f1c7?q=80&w=2000&auto=format&fit=crop",
    title: "Bridal Masterpieces",
    subtitle: "Muhurat",
  },
  {
    image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=2000&auto=format&fit=crop",
    title: "Crafted for You",
    subtitle: "Tradition",
  }
];

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        >
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <img 
              src={slides[current].image} 
              alt={slides[current].title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            {/* Dark overlay for text readability */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%)' }} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
