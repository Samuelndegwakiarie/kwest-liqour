"use client";

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, MeshDistortMaterial, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Fragment({ position, rotation, speed, factor }: { position: [number, number, number], rotation: [number, number, number], speed: number, factor: number }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [exploded, setExploded] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (exploded) {
      mesh.current.position.x += Math.sin(t * speed) * factor;
      mesh.current.position.y += Math.cos(t * speed) * factor;
      mesh.current.position.z += Math.sin(t * speed) * factor;
      mesh.current.rotation.x += speed * 0.01;
      mesh.current.rotation.y += speed * 0.01;
    } else {
      // Gentle floating before explosion
      mesh.current.position.y += Math.sin(t * 0.5) * 0.001;
    }
  });

  return (
    <mesh 
      ref={mesh} 
      position={position} 
      rotation={rotation}
      onPointerOver={() => setExploded(true)}
      onPointerOut={() => setTimeout(() => setExploded(false), 2000)}
    >
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color="#c41e3a" roughness={0.05} metalness={0.9} />
    </mesh>
  );
}

function Bottle() {
  const group = useRef<THREE.Group>(null!);
  
  // Create fragments in a bottle shape
  const fragments = useMemo(() => {
    const frags = [];
    // Body
    for (let i = 0; i < 50; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 0.5 + Math.random() * 0.1;
      const y = (Math.random() - 0.5) * 2;
      frags.push({
        pos: [Math.cos(theta) * r, y, Math.sin(theta) * r] as [number, number, number],
        rot: [Math.random(), Math.random(), Math.random()] as [number, number, number],
        speed: Math.random() * 2,
        factor: 0.02 + Math.random() * 0.03
      });
    }
    // Neck
    for (let i = 0; i < 20; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 0.2 + Math.random() * 0.05;
      const y = 1 + Math.random() * 0.8;
      frags.push({
        pos: [Math.cos(theta) * r, y, Math.sin(theta) * r] as [number, number, number],
        rot: [Math.random(), Math.random(), Math.random()] as [number, number, number],
        speed: Math.random() * 2,
        factor: 0.02 + Math.random() * 0.03
      });
    }
    return frags;
  }, []);

  useFrame((state) => {
    group.current.rotation.y += 0.005;
  });

  return (
    <group ref={group}>
      {fragments.map((props, i) => (
        <Fragment key={i} position={props.pos} rotation={props.rot} speed={props.speed} factor={props.factor} />
      ))}
      {/* Central glow */}
      <pointLight position={[0, 0, 0]} intensity={3} color="#c41e3a" />
    </group>
  );
}

export function BottleExplosion() {
  return (
    <div className="w-full h-[600px] relative">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Bottle />
        </Float>
        
        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
        <Environment preset="night" />
      </Canvas>
      
      {/* Overlay Text for interaction hint */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-white/10 font-sans text-[10px] font-bold uppercase tracking-[0.5em] mt-[500px]">
          Hover to Fragment
        </div>
      </div>
    </div>
  );
}
