'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';

const CYAN    = '#00f2fe';
const MAGENTA = '#f355da';
const LIME    = '#00ff87';
const AMBER   = '#ffb300';
const PURPLE  = '#a855f7';
const BLUE    = '#3b82f6';

const circlePoints = (r, n = 96) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [Math.cos(a) * r, Math.sin(a) * r, 0];
  });

function Glow({ color, intensity = 1 }) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={intensity}
      toneMapped={false}
    />
  );
}

export default function UnitCircleScene({ angle, setAngle, sin, cos, tan, setDragging }) {
  const dragRef   = useRef(false);
  const haloRef   = useRef();
  const ringRefs  = useRef([]);
  const orbitRefs = useRef([]);

  const sg   = cos >= 0 ? 1 : -1;
  const tanY = Math.max(-3.8, Math.min(3.8, sg * tan));

  const arcPoints = useMemo(() => {
    const n = 48;
    return Array.from({ length: n + 1 }, (_, i) => {
      const a = (angle * i) / n;
      return [Math.cos(a) * 0.38, Math.sin(a) * 0.38, 0];
    });
  }, [angle]);

  const unit   = useMemo(() => circlePoints(1),   []);
  const ring15 = useMemo(() => circlePoints(1.5), []);
  const ring2  = useMemo(() => circlePoints(2),   []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (haloRef.current) haloRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.15);
    ringRefs.current.forEach((r, i) => {
      if (r) { r.rotation.x = t * (0.2 + i * 0.1); r.rotation.y = t * (0.15 + i * 0.07); }
    });
    orbitRefs.current.forEach((o, i) => {
      if (o) {
        const a = t * 1.5 + (i * Math.PI * 2) / 6;
        o.position.set(cos + Math.cos(a) * 0.22, sin + Math.sin(a) * 0.22, 0);
      }
    });
  });

  const updateFromPoint = (p) => {
    let a = Math.atan2(p.y, p.x);
    if (a < 0) a += Math.PI * 2;
    setAngle(a);
  };

  const stopDrag = () => { dragRef.current = false; setDragging(false); };
  const minorTicks = [-2, -1.5, -0.5, 0.5, 1.5, 2];

  return (
    <group>
      {/* Invisible drag plane */}
      <mesh
        position={[0, 0, -0.01]}
        onPointerMove={e => { if (dragRef.current) updateFromPoint(e.point); }}
        onPointerUp={stopDrag}
        onPointerLeave={stopDrag}
      >
        <planeGeometry args={[18, 18]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Reference circles */}
      <Line points={unit}   color={CYAN}   lineWidth={2.5} />
      <Line points={ring15} color={PURPLE} lineWidth={1} transparent opacity={0.3} />
      <Line points={ring2}  color={BLUE}   lineWidth={1} transparent opacity={0.25} />

      {/* Axes */}
      <Line points={[[-2.6, 0, 0], [2.6, 0, 0]]} color={MAGENTA} lineWidth={1.5} />
      <Line points={[[0, -2.6, 0], [0, 2.6, 0]]} color={CYAN}    lineWidth={1.5} />

      {/* Axis arrows */}
      <mesh position={[ 2.72, 0, 0]} rotation={[0,0,-Math.PI/2]}><coneGeometry args={[0.07,0.2,12]} /><Glow color={MAGENTA} /></mesh>
      <mesh position={[-2.72, 0, 0]} rotation={[0,0, Math.PI/2]}><coneGeometry args={[0.07,0.2,12]} /><Glow color={MAGENTA} /></mesh>
      <mesh position={[0,  2.72, 0]}                             ><coneGeometry args={[0.07,0.2,12]} /><Glow color={CYAN}    /></mesh>
      <mesh position={[0, -2.72, 0]} rotation={[0,0, Math.PI]}  ><coneGeometry args={[0.07,0.2,12]} /><Glow color={CYAN}    /></mesh>

      {/* Tick marks */}
      {minorTicks.map(v => (
        <mesh key={`tx${v}`} position={[v,0,0]}><boxGeometry args={[0.025,0.12,0.025]}/><Glow color={MAGENTA} intensity={0.6}/></mesh>
      ))}
      {minorTicks.map(v => (
        <mesh key={`ty${v}`} position={[0,v,0]}><boxGeometry args={[0.12,0.025,0.025]}/><Glow color={CYAN} intensity={0.6}/></mesh>
      ))}

      {/* Cardinal nodes */}
      {[0,1,2,3].map(i => (
        <mesh key={`node${i}`} position={[Math.cos(i*Math.PI/2), Math.sin(i*Math.PI/2), 0]}>
          <octahedronGeometry args={[0.07]} />
          <Glow color={LIME} intensity={0.8} />
        </mesh>
      ))}

      {/* Origin dot */}
      <mesh><sphereGeometry args={[0.06,24,24]}/><Glow color="#ffffff" /></mesh>

      {/* Triangle vectors */}
      <Line points={[[0,0,0],[cos,0,0]]}     color={MAGENTA} lineWidth={4} />
      <Line points={[[cos,0,0],[cos,sin,0]]} color={CYAN}    lineWidth={4} />
      <Line points={[[0,0,0],[cos,sin,0]]}   color={PURPLE}  lineWidth={2.5} />

      {/* Tangent */}
      <Line points={[[sg,0,0],[sg,tanY,0]]}         color={LIME} lineWidth={4} />
      <Line points={[[cos,sin,0],[sg,tanY,0]]}       color={LIME} lineWidth={1.5} dashed dashSize={0.1} gapSize={0.08} />
      <mesh position={[sg,tanY,0]}>
        <sphereGeometry args={[0.06,16,16]} /><Glow color={LIME} />
      </mesh>

      {/* Angle arc */}
      {angle > 0.02 && <Line points={arcPoints} color={AMBER} lineWidth={3} />}

      {/* Draggable knob */}
      <mesh
        position={[cos,sin,0]}
        onPointerDown={e => { e.stopPropagation(); dragRef.current=true; setDragging(true); }}
        onPointerUp={stopDrag}
        onPointerOver={() => (document.body.style.cursor='grab')}
        onPointerOut={()  => (document.body.style.cursor='auto')}
      >
        <sphereGeometry args={[0.13,32,32]} />
        <Glow color={AMBER} intensity={1.2} />
      </mesh>
      <mesh ref={haloRef} position={[cos,sin,0]}>
        <torusGeometry args={[0.21,0.013,12,48]} />
        <Glow color={AMBER} intensity={0.9} />
      </mesh>

      {/* Orbiting particles */}
      {[0,1,2,3,4,5].map(i => (
        <mesh key={`orb${i}`} ref={el => (orbitRefs.current[i]=el)}>
          <sphereGeometry args={[0.025,8,8]} />
          <Glow color={AMBER} />
        </mesh>
      ))}

      {/* Rotating decorative rings */}
      {[CYAN,MAGENTA,LIME].map((c,i) => (
        <mesh key={`ring${i}`} ref={el => (ringRefs.current[i]=el)} scale={2.2+i*0.4}>
          <torusGeometry args={[1,0.004,8,96]} />
          <meshBasicMaterial color={c} transparent opacity={0.3} toneMapped={false} />
        </mesh>
      ))}

      {/* Live 3D labels */}
      <Text position={[cos/2,-0.19,0.05]}                        fontSize={0.15} color={MAGENTA} anchorX="center">{`cos ${cos.toFixed(2)}`}</Text>
      <Text position={[cos+(cos>=0?.35:-.35),sin/2,0.05]}        fontSize={0.15} color={CYAN}    anchorX="center">{`sin ${sin.toFixed(2)}`}</Text>
      <Text position={[sg*1.46,tanY/2,0.05]}                     fontSize={0.15} color={LIME}    anchorX="center">{Math.abs(cos)<0.02?'tan ∞':`tan ${tan.toFixed(2)}`}</Text>
      <Text position={[0.62,0.22,0.05]}                          fontSize={0.15} color={AMBER}   anchorX="center">{`θ ${((angle*180)/Math.PI).toFixed(0)}°`}</Text>
    </group>
  );
}
