'use client';

import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import UnitCircleScene from './UnitCircleScene';

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[ 5, 3, 5]} intensity={35} color="#00f2fe" distance={60} />
      <pointLight position={[-5, 2, 5]} intensity={28} color="#f355da" distance={60} />
      <pointLight position={[ 0, 5, 4]} intensity={18} color="#00ff87" distance={50} />
      <directionalLight position={[8,10,5]} intensity={0.7} color="#ffb300" />
    </>
  );
}

function Particles() {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(1500 * 3);
    for (let i = 0; i < arr.length; i++) arr[i] = (Math.random() - 0.5) * 60;
    return arr;
  }, []);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.018;
      ref.current.rotation.x += dt * 0.007;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#00f2fe" sizeAttenuation transparent opacity={0.45} depthWrite={false} />
    </points>
  );
}

export default function TrigCanvas({ angle, setAngle, sin, cos, tan }) {
  const [dragging, setDragging] = useState(false);

  return (
    <div className="relative w-full h-full" style={{ minHeight: 340 }}>
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 48 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#020617' }}
      >
        <color attach="background" args={['#020617']} />

        <SceneLights />

        <Grid
          position={[0, 0, -0.06]}
          rotation={[Math.PI / 2, 0, 0]}
          args={[40, 40]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#0e7490"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#6b21a8"
          fadeDistance={28}
          fadeStrength={1.8}
          infiniteGrid
        />

        <Particles />

        <Suspense fallback={null}>
          <UnitCircleScene
            angle={angle}
            setAngle={setAngle}
            sin={sin}
            cos={cos}
            tan={tan}
            setDragging={setDragging}
          />
        </Suspense>

        <OrbitControls
          enabled={!dragging}
          enableDamping
          dampingFactor={0.08}
          minDistance={3}
          maxDistance={15}
        />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.22}
            luminanceSmoothing={0.9}
            intensity={1.15}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      <div
        className="absolute bottom-0 left-0 right-0 py-2 text-center text-xs tracking-widest"
        style={{ fontFamily: 'Orbitron,monospace', color: 'rgba(0,242,254,.45)', background: 'rgba(2,6,23,.6)' }}
      >
        DRAG AMBER NODE · ORBIT BACKGROUND · SCROLL TO ZOOM
      </div>
    </div>
  );
}
