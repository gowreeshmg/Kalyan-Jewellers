import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls } from '@react-three/drei';

function Diamond(props) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.5;
  });

  return (
    <mesh ref={meshRef} {...props}>
      {/* Octahedron provides a basic diamond-like shape */}
      <octahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial 
        color="#ffffff"
        transmission={0.9}
        opacity={1}
        metalness={0.1}
        roughness={0}
        ior={2.4}
        thickness={0.5}
        specularIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <div style={{ height: '600px', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0, opacity: 0.8 }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Environment preset="city" />
        
        <PresentationControls 
          global 
          config={{ mass: 2, tension: 500 }} 
          snap={{ mass: 4, tension: 1500 }} 
          rotation={[0, 0.3, 0]} 
          polar={[-Math.PI / 3, Math.PI / 3]} 
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Diamond scale={1.2} />
          </Float>
        </PresentationControls>
      </Canvas>
    </div>
  );
}
