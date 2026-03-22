/**
 * SphereGallery.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactive 3D spherical image gallery built with React Three Fiber + Drei.
 *
 * Features
 * ────────
 * • Fibonacci-sphere distribution — evenly spaces N images across a sphere
 * • Billboard effect — each card always faces the camera (via Drei <Billboard>)
 * • Mouse-parallax rotation — moving the mouse tilts the sphere
 * • Click + drag — full drag-to-rotate with inertia / momentum damping
 * • Idle auto-rotation — when the user isn't interacting
 * • Hover scale — card scales up + emits a soft glow ring on hover
 * • Depth-of-field — distant cards are slightly smaller (perspective effect)
 * • Performance — geometries/materials memoized; no per-frame allocations
 *
 * Install deps (if not already in your project):
 *   npm install three @react-three/fiber @react-three/drei
 *
 * Usage
 * ─────
 *   import SphereGallery from './SphereGallery';
 *
 *   // Default (20 placeholder images)
 *   <SphereGallery />
 *
 *   // Custom images and sphere radius
 *   <SphereGallery
 *     images={['/img/a.jpg', '/img/b.jpg', ...]}
 *     radius={3.2}
 *     cardWidth={0.9}
 *     cardHeight={1.15}
 *   />
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
  MeshDistortMaterial,
} from '@react-three/drei';
import * as THREE from 'three';

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const TWO_PI       = Math.PI * 2;

// ─── Fibonacci sphere distribution ───────────────────────────────────────────
// Places N points as uniformly as possible across a unit sphere.
function fibonacciSphere(count, radius) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / count);      // polar
    const phi   = TWO_PI * i / GOLDEN_RATIO;                    // azimuthal
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

  // Smooth scale spring — manual lerp for zero extra deps
  const scaleRef = useRef(1);

  useFrame(() => {
    if (!groupRef.current) return;
    const target = hovered ? 1.18 : 1;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, target, 0.12);
    groupRef.current.scale.setScalar(scaleRef.current);

    // Glow opacity
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
    // Billboard ensures the card always faces the camera regardless of sphere rotation
    <Billboard position={position} follow lockX={false} lockY={false} lockZ={false}>
      <group ref={groupRef}>

        {/* Soft glow ring — rendered behind the card */}
        <mesh ref={glowRef} renderOrder={-1}>
          <planeGeometry args={[cardWidth * 1.5, cardHeight * 1.5]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Card border / frame */}
        <RoundedBox
          args={[cardWidth + 0.04, cardHeight + 0.04, 0.01]}
          radius={0.06}
          smoothness={4}
        >
          <meshStandardMaterial
            color={hovered ? '#f0ede8' : '#e8e4de'}
            roughness={0.4}
            metalness={0.05}
          />
        </RoundedBox>

        {/* Image plane — Drei <Image> handles texture loading + aspect correction */}
        <Image
          url={url}
          position={[0, 0, 0.012]}
          scale={[cardWidth - 0.04, cardHeight - 0.04, 1]}
          // Fit behaviour: cover
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          transparent
          radius={0.05}
        />

        {/* Subtle inner shadow at card bottom (vignette feel) */}
        <mesh position={[0, -(cardHeight / 2 - 0.08), 0.014]}>
          <planeGeometry args={[cardWidth - 0.04, 0.22]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={hovered ? 0 : 0.18}
            depthWrite={false}
          />
        </mesh>

      </group>
    </Billboard>
  );
});

// ─── Sphere group (rotation controller) ──────────────────────────────────────
function SphereGroup({ images, radius, cardWidth, cardHeight }) {
  const groupRef     = useRef();
  const isDragging   = useRef(false);
  const dragStart    = useRef({ x: 0, y: 0 });
  const rotation     = useRef({ x: 0.12, y: 0 });   // current euler angles
  const velocity     = useRef({ x: 0, y: 0 });       // inertia velocity
  const mouse        = useRef({ x: 0, y: 0 });       // normalised −1…1
  const isHovered    = useRef(false);                 // any card hovered?
  const lastDrag     = useRef({ x: 0, y: 0 });

  const { gl } = useThree();

  // Memoised sphere positions
  const positions = useMemo(
    () => fibonacciSphere(images.length, radius),
    [images.length, radius]
  );

  // ── Mouse / touch handlers ──────────────────────────────────────────────────

  const onPointerDown = useCallback((e) => {
    isDragging.current  = true;
    dragStart.current   = { x: e.clientX, y: e.clientY };
    lastDrag.current    = { x: e.clientX, y: e.clientY };
    velocity.current    = { x: 0, y: 0 };
    gl.domElement.style.cursor = 'grabbing';
  }, [gl]);

  const onPointerMove = useCallback((e) => {
    // Track normalised mouse for idle parallax
    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.current.y = ((e.clientY - rect.top)  / rect.height) * 2 - 1;

    if (!isDragging.current) return;

    const dx = e.clientX - lastDrag.current.x;
    const dy = e.clientY - lastDrag.current.y;
    lastDrag.current = { x: e.clientX, y: e.clientY };

    velocity.current.y += dx * 0.003;   // was 0.006 — halved drag sensitivity
    velocity.current.x += dy * 0.003;
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
    el.style.cursor = 'grab';
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

  // ── Cursor management from cards ───────────────────────────────────────────
  const handleCardHover = useCallback((hovering) => {
    isHovered.current = hovering;
    if (!isDragging.current) {
      gl.domElement.style.cursor = hovering ? 'pointer' : 'grab';
    }
  }, [gl]);

  // ── Animation loop ─────────────────────────────────────────────────────────
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const INERTIA_DAMPING = 0.88;    // velocity decay per frame (faster damping = shorter coast)
    const IDLE_SPEED      = 0.03;    // auto-rotate rad/s  ← was 0.08
    const MOUSE_STRENGTH  = 0.07;    // parallax influence  ← was 0.18

    if (isDragging.current) {
      // While dragging: apply velocity directly
      rotation.current.y += velocity.current.y;
      rotation.current.x += velocity.current.x;
    } else {
      // Not dragging: decay velocity (inertia) then apply
      velocity.current.x *= INERTIA_DAMPING;
      velocity.current.y *= INERTIA_DAMPING;
      rotation.current.y += velocity.current.y;
      rotation.current.x += velocity.current.x;

      // Idle auto-rotation — slows down when mouse is near centre
      const mouseActivity = Math.abs(mouse.current.x) + Math.abs(mouse.current.y);
      const idleFactor    = Math.max(0, 1 - mouseActivity * 1.2);
      rotation.current.y += IDLE_SPEED * delta * idleFactor;

      // Mouse parallax — nudge the sphere toward/away from mouse
      rotation.current.y += mouse.current.x * MOUSE_STRENGTH * delta;
      rotation.current.x += -mouse.current.y * MOUSE_STRENGTH * delta;
    }

    // Clamp X rotation so the sphere doesn't flip upside down
    rotation.current.x = THREE.MathUtils.clamp(
      rotation.current.x,
      -Math.PI * 0.45,
       Math.PI * 0.45
    );

    // Smooth lerp toward target rotation (easing)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, rotation.current.x, 0.08
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, rotation.current.y, 0.08
    );
  });

  return (
    <group ref={groupRef}>
      {images.map((url, i) => (
        <ImageCard
          key={url + i}
          url={url}
          position={positions[i]}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          onHover={handleCardHover}
        />
      ))}
    </group>
  );
}

// ─── Background particle field ────────────────────────────────────────────────
// Adds depth and atmosphere without impacting main performance
function ParticleField({ count = 180 }) {
  const ref = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r     = 6 + Math.random() * 8;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi   = TWO_PI * Math.random();
      pos[i * 3]     = r * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = r * Math.cos(theta);
      pos[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);
      // warm off-white tones
      col[i * 3]     = 0.88 + Math.random() * 0.12;
      col[i * 3 + 1] = 0.86 + Math.random() * 0.10;
      col[i * 3 + 2] = 0.82 + Math.random() * 0.10;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Scene wrapper ────────────────────────────────────────────────────────────
function Scene({ images, radius, cardWidth, cardHeight }) {
  return (
    <>
      {/* Soft ambient + directional light for card material */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]}  intensity={0.6} />
      <directionalLight position={[-3, -4, -2]} intensity={0.2} color="#c8bfb0" />

      {/* Environment for reflections on card borders */}
      <Environment preset="sunset" background={false} />

      <ParticleField />

      <SphereGroup
        images={images}
        radius={radius}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
      />
    </>
  );
}

// ─── SphereGallery (exported) ─────────────────────────────────────────────────

/**
 * @param {string[]}  images      Array of image URLs. Defaults to 22 placeholders.
 * @param {number}    radius      Sphere radius in 3-units. Default 2.8.
 * @param {number}    cardWidth   Card width in 3-units. Default 0.85.
 * @param {number}    cardHeight  Card height in 3-units. Default 1.1.
 * @param {string}    bg          CSS background of the canvas wrapper. Default '#0d0c0b'.
 * @param {string}    className   Optional class on the wrapper div.
 */
export default function SphereGallery({
  images = Array.from({ length: 22 }, (_, i) =>
    `https://picsum.photos/seed/sg${i + 1}/480/640`
  ),
  radius      = 2.8,
  cardWidth   = 0.85,
  cardHeight  = 1.1,
  bg          = '#0d0c0b',
  className   = '',
}) {
  return (
    <div
      className={className}
      style={{
        width:    '100%',
        height:   '100vh',
        background: bg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Instruction overlay */}
      <div style={{
        position:   'absolute',
        bottom:     '2rem',
        left:       '50%',
        transform:  'translateX(-50%)',
        zIndex:     10,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300,
        fontSize:   '0.65rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color:      'rgba(240,237,232,0.32)',
        pointerEvents: 'none',
        display:    'flex',
        alignItems: 'center',
        gap:        '0.8rem',
      }}>
        <span style={{ width: '24px', height: '1px', background: 'rgba(240,237,232,0.32)' }} />
        Drag to rotate
        <span style={{ width: '24px', height: '1px', background: 'rgba(240,237,232,0.32)' }} />
      </div>

      <Canvas
        camera={{
          position: [0, 0, 7],
          fov:      50,
          near:     0.1,
          far:      50,
        }}
        dpr={[1, 2]}                   // Limit pixel ratio for performance
        gl={{
          antialias:        true,
          alpha:            false,
          powerPreference:  'high-performance',
        }}
        frameloop="always"
      >
        <color attach="background" args={[bg]} />

        {/* Slight fog adds depth — distant cards fade into background */}
        <fog attach="fog" args={[bg, 9, 22]} />

        <Scene
          images={images}
          radius={radius}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
        />
      </Canvas>
    </div>
  );
}
