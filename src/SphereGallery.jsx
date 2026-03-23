/**
 * SphereGallery.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactive 3D spherical image gallery built with React Three Fiber + Drei.
 */

import {
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
  memo,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Billboard,
  Image,
  RoundedBox,
  Environment,
} from '@react-three/drei';
import * as THREE from 'three';

// ─── Constants ────────────────────────────────────────────────────────────────
const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const TWO_PI       = Math.PI * 2;

function fibonacciSphere(count, radius) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / count);
    const phi   = TWO_PI * i / GOLDEN_RATIO;
    positions.push(
      new THREE.Vector3(
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.cos(theta),
        radius * Math.sin(theta) * Math.sin(phi),
      )
    );
  }
  return positions;
}

// ─── Image card ───────────────────────────────────────────────────────────────
const ImageCard = memo(function ImageCard({
  url,
  position,
  cardWidth  = 0.85,
  cardHeight = 1.1,
  onHover,
}) {
  const groupRef  = useRef();
  const glowRef   = useRef();
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(1);

  useFrame(() => {
    if (!groupRef.current) return;
    const target = hovered ? 1.18 : 1;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, target, 0.12);
    groupRef.current.scale.setScalar(scaleRef.current);

    if (glowRef.current) {
      glowRef.current.material.opacity = THREE.MathUtils.lerp(
        glowRef.current.material.opacity,
        hovered ? 0.35 : 0,
        0.1
      );
    }
  });

  const handlePointerOver = useCallback((e) => {
    e.stopPropagation();
    setHovered(true);
    onHover(true);
  }, [onHover]);

  const handlePointerOut = useCallback((e) => {
    e.stopPropagation();
    setHovered(false);
    onHover(false);
  }, [onHover]);

  return (
    <Billboard position={position} follow lockX={false} lockY={false} lockZ={false}>
      <group ref={groupRef}>
        <mesh ref={glowRef} renderOrder={-1}>
          <planeGeometry args={[cardWidth * 1.5, cardHeight * 1.5]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>

        <RoundedBox args={[cardWidth + 0.04, cardHeight + 0.04, 0.01]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color={hovered ? '#f0ede8' : '#e8e4de'} roughness={0.4} metalness={0.05} />
        </RoundedBox>

        <Image
          url={url}
          position={[0, 0, 0.012]}
          scale={[cardWidth - 0.04, cardHeight - 0.04, 1]}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          transparent
          radius={0.05}
        />
      </group>
    </Billboard>
  );
});

// ─── Sphere group (rotation controller) ──────────────────────────────────────
function SphereGroup({ images, radius, cardWidth, cardHeight }) {
  const groupRef     = useRef();
  const isDragging   = useRef(false);
  const rotation     = useRef({ x: 0.12, y: 0 });
  const velocity     = useRef({ x: 0, y: 0 });
  const mouse        = useRef({ x: 0, y: 0 });
  const isHovered    = useRef(false);
  const lastDrag     = useRef({ x: 0, y: 0 });

  const { gl } = useThree();

  const positions = useMemo(
    () => fibonacciSphere(images.length, radius),
    [images.length, radius]
  );

  const onPointerDown = useCallback((e) => {
    isDragging.current  = true;
    lastDrag.current    = { x: e.clientX, y: e.clientY };
    velocity.current    = { x: 0, y: 0 };
    gl.domElement.style.cursor = 'grabbing';
  }, [gl]);

  const onPointerMove = useCallback((e) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.current.y = ((e.clientY - rect.top)  / rect.height) * 2 - 1;

    if (!isDragging.current) return;

    const dx = e.clientX - lastDrag.current.x;
    const dy = e.clientY - lastDrag.current.y;
    lastDrag.current = { x: e.clientX, y: e.clientY };

    // FIX: Apply sensitivity and clamp velocity to prevent "spinning out of control"
    const SENSITIVITY = 0.002;
    const MAX_VELOCITY = 0.05; 

    velocity.current.y = THREE.MathUtils.clamp(velocity.current.y + dx * SENSITIVITY, -MAX_VELOCITY, MAX_VELOCITY);
    velocity.current.x = THREE.MathUtils.clamp(velocity.current.x + dy * SENSITIVITY, -MAX_VELOCITY, MAX_VELOCITY);
  }, [gl]);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    gl.domElement.style.cursor = isHovered.current ? 'pointer' : 'grab';
  }, [gl]);

  const onPointerLeave = useCallback(() => {
    isDragging.current = false;
    mouse.current      = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const el = gl.domElement;
    el.addEventListener('pointerdown',  onPointerDown);
    el.addEventListener('pointermove',  onPointerMove);
    el.addEventListener('pointerup',    onPointerUp);
    el.addEventListener('pointerleave', onPointerLeave);
    return () => {
      el.removeEventListener('pointerdown',  onPointerDown);
      el.removeEventListener('pointermove',  onPointerMove);
      el.removeEventListener('pointerup',    onPointerUp);
      el.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [gl, onPointerDown, onPointerMove, onPointerUp, onPointerLeave]);

  const handleCardHover = useCallback((hovering) => {
    isHovered.current = hovering;
    if (!isDragging.current) {
      gl.domElement.style.cursor = hovering ? 'pointer' : 'grab';
    }
  }, [gl]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // FIX: Updated Damping (0.92) and Idle Speed (0.05) for smoother physics
    const INERTIA_DAMPING = 0.92;
    const IDLE_SPEED      = 0.05;
    const MOUSE_STRENGTH  = 0.01;

    if (isDragging.current) {
      rotation.current.y += velocity.current.y;
      rotation.current.x += velocity.current.x;
      // Bleed off velocity while dragging to prevent massive accumulation
      velocity.current.x *= 0.8;
      velocity.current.y *= 0.8;
    } else {
      rotation.current.y += velocity.current.y;
      rotation.current.x += velocity.current.x;
      velocity.current.x *= INERTIA_DAMPING;
      velocity.current.y *= INERTIA_DAMPING;

      const mouseActivity = Math.abs(mouse.current.x) + Math.abs(mouse.current.y);
      const idleFactor    = Math.max(0, 1 - mouseActivity * 1.2);
      rotation.current.y += IDLE_SPEED * delta * idleFactor;

      rotation.current.y += mouse.current.x * MOUSE_STRENGTH * delta;
      rotation.current.x += -mouse.current.y * MOUSE_STRENGTH * delta;
    }

    rotation.current.x = THREE.MathUtils.clamp(rotation.current.x, -Math.PI * 0.45, Math.PI * 0.45);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rotation.current.x, 0.1);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotation.current.y, 0.1);
  });

  return (
    <group ref={groupRef}>
      {images.map((url, i) => (
        <ImageCard key={url + i} url={url} position={positions[i]} cardWidth={cardWidth} cardHeight={cardHeight} onHover={handleCardHover} />
      ))}
    </group>
  );
}

// ─── Scene and Background ─────────────────────────────────────────────────────
function ParticleField({ count = 180 }) {
  const ref = useRef();
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 8;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = TWO_PI * Math.random();
      pos[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = r * Math.cos(theta);
      pos[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);
      col[i * 3] = 0.88 + Math.random() * 0.12;
      col[i * 3 + 1] = 0.86 + Math.random() * 0.10;
      col[i * 3 + 2] = 0.82 + Math.random() * 0.10;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.015; });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} vertexColors transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Scene({ images, radius, cardWidth, cardHeight }) {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]}  intensity={0.6} />
      <Environment preset="sunset" background={false} />
      <ParticleField />
      <SphereGroup images={images} radius={radius} cardWidth={cardWidth} cardHeight={cardHeight} />
    </>
  );
}

export default function SphereGallery({
  images = Array.from({ length: 22 }, (_, i) => `https://picsum.photos/seed/sg${i + 1}/480/640`),
  radius = 2.8,
  cardWidth = 0.85,
  cardHeight = 1.1,
  bg = '#0d0c0b',
  className = '',
}) {
  return (
    <div className={className} style={{ width: '100%', height: '100vh', background: bg, position: 'relative', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 50, near: 0.1, far: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
        <color attach="background" args={[bg]} />
        <fog attach="fog" args={[bg, 9, 22]} />
        <Scene images={images} radius={radius} cardWidth={cardWidth} cardHeight={cardHeight} />
      </Canvas>
    </div>
  );
}