import React from 'react';
import { motion } from 'framer-motion';

export default function Text3DFlip({ 
  children, 
  className = "", 
  textClassName = "", 
  flipTextClassName = "",
  staggerDuration = 0.03,
  rotateDirection = "top",
  transition = { type: "spring", damping: 25, stiffness: 160 }
}) {
  const text = typeof children === 'string' ? children : '';
  const letters = text.split('');

  const dirMultiplier = rotateDirection === "top" ? 1 : -1;

  return (
    <motion.div 
      className={className}
      initial="initial"
      whileHover="hover"
      style={{ perspective: "1000px", position: 'relative', display: 'inline-flex', overflow: 'hidden' }}
    >
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        {letters.map((letter, i) => (
          <span key={i} style={{ position: 'relative', display: 'inline-block', whiteSpace: 'pre' }}>
            {/* Original Text */}
            <motion.span 
              className={textClassName}
              style={{ display: 'inline-block', transformOrigin: rotateDirection === "top" ? "50% 100%" : "50% 0%" }}
              variants={{
                initial: { rotateX: 0, opacity: 1, y: 0 },
                hover: { rotateX: 90 * dirMultiplier, opacity: 0, y: -10 * dirMultiplier }
              }}
              transition={{ ...transition, delay: i * staggerDuration }}
            >
              {letter}
            </motion.span>
            
            {/* Flipping In Text */}
            <motion.span 
              className={flipTextClassName}
              style={{ position: 'absolute', top: 0, left: 0, display: 'inline-block', transformOrigin: rotateDirection === "top" ? "50% 0%" : "50% 100%" }}
              variants={{
                initial: { rotateX: -90 * dirMultiplier, opacity: 0, y: 10 * dirMultiplier },
                hover: { rotateX: 0, opacity: 1, y: 0 }
              }}
              transition={{ ...transition, delay: i * staggerDuration }}
            >
              {letter}
            </motion.span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}
