import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Running3DBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId;
    let renderer;
    let scene;
    let camera;
    let pointsMesh;
    let linesMesh;

    // Mouse coordinates tracking for 3D parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX) * 0.4;
      mouseY = (event.clientY - windowHalfY) * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    try {
      // 1. Scene setup
      scene = new THREE.Scene();

      // 2. Camera setup
      camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        1,
        2000
      );
      camera.position.z = 650;

      // 3. WebGL Renderer with transparent background (alpha: true)
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0); // Transparent so radiant CSS aurora glows through
      container.appendChild(renderer.domElement);

      // 4. Create particle constellation
      const particleCount = Math.min(130, Math.floor(window.innerWidth / 12));
      const r = 750;
      const rHalf = r / 2;

      const particlePositions = new Float32Array(particleCount * 3);
      const particleVelocities = [];

      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * r - rHalf;
        const y = Math.random() * r - rHalf;
        const z = Math.random() * r - rHalf;

        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;

        particleVelocities.push({
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          vz: (Math.random() - 0.5) * 0.45
        });
      }

      // Generate circular glowing point texture programmatically for light theme
      const createCircleTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(180, 83, 9, 1)'); // Deep Rich Amber
        gradient.addColorStop(0.35, 'rgba(217, 119, 6, 0.85)'); // Warm Amber
        gradient.addColorStop(0.7, 'rgba(245, 158, 11, 0.4)'); // Light Amber
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
      };

      // Points geometry & material
      const pointGeo = new THREE.BufferGeometry();
      pointGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(particlePositions, 3)
      );

      const pointMat = new THREE.PointsMaterial({
        color: 0xd97706, // Rich Amber-600
        size: 7.5,
        map: createCircleTexture(),
        transparent: true,
        blending: THREE.NormalBlending,
        opacity: 0.85,
        depthWrite: false
      });

      pointsMesh = new THREE.Points(pointGeo, pointMat);
      scene.add(pointsMesh);

      // Connecting lines geometry & material
      const maxConnections = particleCount * 6;
      const linePositions = new Float32Array(maxConnections * 6);
      const lineColors = new Float32Array(maxConnections * 6);

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage)
      );
      lineGeo.setAttribute(
        'color',
        new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage)
      );

      const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.NormalBlending,
        opacity: 0.35,
        depthWrite: false
      });

      linesMesh = new THREE.LineSegments(lineGeo, lineMat);
      scene.add(linesMesh);

      // Connection threshold distance
      const minDistance = 120;

      // 5. Animation loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Smooth camera parallax easing
        targetX += (mouseX - targetX) * 0.04;
        targetY += (-mouseY - targetY) * 0.04;

        camera.position.x = targetX * 0.5;
        camera.position.y = targetY * 0.5;
        camera.lookAt(scene.position);

        // Slowly rotate constellation
        scene.rotation.y += 0.0008;
        scene.rotation.x += 0.0004;

        const positions = pointGeo.attributes.position.array;
        let lineVertexIndex = 0;
        let colorVertexIndex = 0;
        let numConnected = 0;

        // Update positions and velocities
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += particleVelocities[i].vx;
          positions[i * 3 + 1] += particleVelocities[i].vy;
          positions[i * 3 + 2] += particleVelocities[i].vz;

          // Soft boundary reflection
          if (positions[i * 3] < -rHalf || positions[i * 3] > rHalf) {
            particleVelocities[i].vx = -particleVelocities[i].vx;
          }
          if (positions[i * 3 + 1] < -rHalf || positions[i * 3 + 1] > rHalf) {
            particleVelocities[i].vy = -particleVelocities[i].vy;
          }
          if (positions[i * 3 + 2] < -rHalf || positions[i * 3 + 2] > rHalf) {
            particleVelocities[i].vz = -particleVelocities[i].vz;
          }

          // Build dynamic connection lines
          for (let j = i + 1; j < particleCount; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < minDistance && numConnected < maxConnections) {
              const alpha = (1.0 - dist / minDistance) * 0.42;

              // Line start vertex
              linePositions[lineVertexIndex++] = positions[i * 3];
              linePositions[lineVertexIndex++] = positions[i * 3 + 1];
              linePositions[lineVertexIndex++] = positions[i * 3 + 2];

              // Line end vertex
              linePositions[lineVertexIndex++] = positions[j * 3];
              linePositions[lineVertexIndex++] = positions[j * 3 + 1];
              linePositions[lineVertexIndex++] = positions[j * 3 + 2];

              // Amber-gold line color fading with distance
              const rCol = 0.98 * alpha;
              const gCol = 0.65 * alpha;
              const bCol = 0.15 * alpha;

              lineColors[colorVertexIndex++] = rCol;
              lineColors[colorVertexIndex++] = gCol;
              lineColors[colorVertexIndex++] = bCol;

              lineColors[colorVertexIndex++] = rCol;
              lineColors[colorVertexIndex++] = gCol;
              lineColors[colorVertexIndex++] = bCol;

              numConnected++;
            }
          }
        }

        pointGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.color.needsUpdate = true;
        lineGeo.setDrawRange(0, numConnected * 2);

        renderer.render(scene, camera);
      };

      animate();

      // 6. Responsive resize handler
      const handleResize = () => {
        if (!container) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        if (pointGeo) pointGeo.dispose();
        if (pointMat) pointMat.dispose();
        if (lineGeo) lineGeo.dispose();
        if (lineMat) lineMat.dispose();

        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('Native Three.js initialization fallback:', err);
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Native Three.js WebGL Interactive 60FPS Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Luminous Warm Amber, Sunset Coral & Gold Ambient Glow Orbs for Light Theme */}
      <div className="absolute top-[-10%] left-[-5%] w-[750px] h-[750px] bg-gradient-to-br from-amber-400/25 via-orange-300/20 to-rose-300/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] right-[-10%] w-[850px] h-[850px] bg-gradient-to-bl from-orange-300/20 via-amber-300/20 to-rose-300/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[25%] w-[700px] h-[700px] bg-gradient-to-tr from-amber-300/20 via-rose-300/15 to-emerald-300/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Modern B2B Fine Dot / Subtle Grid Matrix Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(217,119,6,0.08)_1px,transparent_1px)] bg-[size:32px_32px] opacity-70 pointer-events-none" />
    </div>
  );
};

export default Running3DBackground;
