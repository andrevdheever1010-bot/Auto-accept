'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      canvas.offsetWidth / canvas.offsetHeight,
      0.1,
      100
    );
    camera.position.z = 6;

    const count = 4500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    // Warm ember palette
    const palette: [number, number, number][] = [
      [1.0, 0.42, 0.21],   // #FF6B35
      [0.96, 0.64, 0.38],  // #F4A261
      [0.91, 0.36, 0.12],  // #E85D20
      [1.0,  0.55, 0.35],  // lighter orange
      [1.0,  0.82, 0.50],  // warm gold
      [0.85, 0.25, 0.06],  // deep ember
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;

      velocities[i] = 0.006 + Math.random() * 0.014;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let animId: number;
    let time = 0;
    let mouseX = 0;

    const handleMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouse);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.004;

      const pos = geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;

      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] += velocities[i];
        arr[i * 3]     += Math.sin(time * 0.8 + i * 0.13) * 0.002;

        if (arr[i * 3 + 1] > 9) {
          arr[i * 3 + 1] = -9;
          arr[i * 3]     = (Math.random() - 0.5) * 22;
        }
      }
      pos.needsUpdate = true;

      points.rotation.y = time * 0.015 + mouseX * 0.05;
      material.opacity = 0.55 + Math.sin(time * 0.5) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!canvas) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', handleMouse);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
