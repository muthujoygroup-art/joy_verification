import React, { useEffect, useRef } from 'react';

export const Running3DBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates for interactive 3D parallax & magnetic field
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isHovering: false,
    };

    // Click Shockwaves & Particle Burst System
    const shockwaves = [];
    const clickSparkles = [];

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovering = false;
    };

    const handleWindowClick = (e) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      // 1. Add expanding dual shockwave rings
      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 5,
        maxRadius: 240,
        alpha: 0.75,
        lineWidth: 2.5,
        color: 'rgba(245, 158, 11, ', // Golden Amber
      });
      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 2,
        maxRadius: 320,
        alpha: 0.5,
        lineWidth: 1.5,
        color: 'rgba(249, 115, 22, ', // Sunset Orange
      });

      // 2. Spawn golden burst sparkles
      const numSparkles = 14;
      for (let i = 0; i < numSparkles; i++) {
        const angle = (Math.PI * 2 * i) / numSparkles + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 4 + 2;
        clickSparkles.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 2.5 + 1.2,
          alpha: 1,
          decay: Math.random() * 0.025 + 0.02,
          color: i % 2 === 0 ? 'rgba(254, 240, 138, ' : 'rgba(245, 158, 11, ',
        });
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleWindowClick);
    window.addEventListener('resize', handleResize);

    // 1. 3D Particle Constellation Nodes (Warm Golden Amber, Coral & Sunset Glow)
    const numParticles = Math.min(width < 768 ? 45 : 90, 110);
    const particles = [];
    const colors = [
      'rgba(245, 158, 11, ',   // Golden Amber
      'rgba(249, 115, 22, ',   // Sunset Orange
      'rgba(244, 63, 94, ',    // Warm Coral/Rose
      'rgba(253, 230, 138, ',  // Champagne Gold
      'rgba(16, 185, 129, ',   // Verification Emerald
    ];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 + 100, // 3D depth
        origZ: Math.random() * 800 + 100,
        radius: Math.random() * 2.2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        vz: (Math.random() - 0.5) * 0.4,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // 2. Rotating 3D Geometric Polyhedrons (Floating Verification Amber Crystals)
    const polyhedrons = [
      { x: -width * 0.35, y: -height * 0.25, z: 350, size: 55, rotX: 0, rotY: 0, rotZ: 0, speedX: 0.008, speedY: 0.012, color: 'rgba(245, 158, 11, 0.45)' },
      { x: width * 0.38, y: -height * 0.15, z: 400, size: 65, rotX: 0.5, rotY: 0.2, rotZ: 0, speedX: 0.006, speedY: 0.009, color: 'rgba(244, 63, 94, 0.45)' },
      { x: -width * 0.3, y: height * 0.35, z: 300, size: 50, rotX: 0.2, rotY: 0.8, rotZ: 0, speedX: 0.01, speedY: 0.007, color: 'rgba(16, 185, 129, 0.4)' },
      { x: width * 0.32, y: height * 0.3, z: 450, size: 60, rotX: 0.9, rotY: 0.4, rotZ: 0, speedX: 0.007, speedY: 0.011, color: 'rgba(249, 115, 22, 0.45)' },
    ];

    // Simple 3D projection helper
    const fov = 500;
    const project3D = (x, y, z) => {
      const scale = fov / (fov + z);
      const projX = x * scale + width / 2;
      const projY = y * scale + height / 2;
      return { x: projX, y: projY, scale };
    };

    // Polyhedron 3D vertices for an octahedron
    const octaVertices = [
      { x: 0, y: -1, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 0, z: -1 },
      { x: 0, y: 1, z: 0 },
    ];

    const octaEdges = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [5, 1], [5, 2], [5, 3], [5, 4],
      [1, 2], [2, 3], [3, 4], [4, 1]
    ];

    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const mouseOffsetX = ((mouse.x - width / 2) / width) * 60;
      const mouseOffsetY = ((mouse.y - height / 2) / height) * 60;

      ctx.clearRect(0, 0, width, height);

      // 1. Dynamic Cursor Proximity Aura (Subtle golden glow around mouse)
      if (mouse.isHovering) {
        const cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
        cursorGlow.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
        cursorGlow.addColorStop(0.5, 'rgba(249, 115, 22, 0.03)');
        cursorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = cursorGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 220, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Fluid Ambient Neon Waveforms
      const waveGradient = ctx.createLinearGradient(0, 0, width, height);
      waveGradient.addColorStop(0, 'rgba(245, 158, 11, 0.035)');
      waveGradient.addColorStop(0.5, 'rgba(249, 115, 22, 0.03)');
      waveGradient.addColorStop(1, 'rgba(244, 63, 94, 0.035)');

      ctx.beginPath();
      for (let x = 0; x <= width; x += 15) {
        const y = height * 0.65 + Math.sin(x * 0.003 + time * 0.8) * 45 + Math.cos(x * 0.005 - time * 0.5) * 25;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = waveGradient;
      ctx.fill();

      // Second counter wave
      ctx.beginPath();
      for (let x = 0; x <= width; x += 15) {
        const y = height * 0.35 + Math.cos(x * 0.0025 - time * 0.7) * 40 + Math.sin(x * 0.004 + time * 0.6) * 30;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.06)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 3. Render and Connect 3D Particles with Mouse Hover Magnetic Physics
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update 3D movement
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Wrap around boundaries in 3D
        if (p.x < -width * 0.75) p.x = width * 0.75;
        if (p.x > width * 0.75) p.x = -width * 0.75;
        if (p.y < -height * 0.75) p.y = height * 0.75;
        if (p.y > height * 0.75) p.y = -height * 0.75;
        if (p.z < 50) p.z = 900;
        if (p.z > 900) p.z = 50;

        // Project with mouse parallax offset
        const proj = project3D(p.x - mouseOffsetX * (p.z / 320), p.y - mouseOffsetY * (p.z / 320), p.z);

        // MOUSE HOVER REPULSION: compute distance between cursor and projected 2D node
        if (mouse.isHovering) {
          const mdx = proj.x - mouse.x;
          const mdy = proj.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          const hoverRadius = 160;

          if (mdist < hoverRadius && mdist > 0.1) {
            const force = (1 - mdist / hoverRadius) * 2.2;
            proj.x += (mdx / mdist) * force * 12;
            proj.y += (mdy / mdist) * force * 12;
            p.vx += (mdx / mdist) * force * 0.08;
            p.vy += (mdy / mdist) * force * 0.08;
          }
        }

        projected.push({ ...proj, particle: p });

        // Draw particle node with smooth pulse
        const pulse = 0.65 + 0.35 * Math.sin(time * 3 + p.pulseOffset);
        const alpha = Math.max(0.12, (1 - p.z / 900) * 0.75 * pulse);
        const radius = p.radius * proj.scale * (0.9 + 0.2 * pulse);

        // Core dot
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.fill();

        // Subtle glow halo
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha * 0.25})`;
        ctx.fill();
      }

      // Connect closest particle nodes with glowing filaments
      const maxDistance = 135;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.2 * Math.min(p1.scale, p2.scale);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(245, 158, 11, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // 4. Render 3D Rotating Geometric Polyhedrons (Verification Polyhedra)
      polyhedrons.forEach((poly) => {
        poly.rotX += poly.speedX;
        poly.rotY += poly.speedY;

        // Rotate vertices in 3D
        const rotated = octaVertices.map((v) => {
          let x = v.x * poly.size;
          let y = v.y * poly.size;
          let z = v.z * poly.size;

          // Rotation around X
          const cosX = Math.cos(poly.rotX);
          const sinX = Math.sin(poly.rotX);
          const y1 = y * cosX - z * sinX;
          const z1 = y * sinX + z * cosX;

          // Rotation around Y
          const cosY = Math.cos(poly.rotY);
          const sinY = Math.sin(poly.rotY);
          const x2 = x * cosY + z1 * sinY;
          const z2 = -x * sinY + z1 * cosY;

          // World position with parallax
          const worldX = poly.x + x2 - mouseOffsetX * 0.5;
          const worldY = poly.y + y1 - mouseOffsetY * 0.5;
          const worldZ = poly.z + z2;

          return project3D(worldX, worldY, worldZ);
        });

        // Draw Polyhedron Wireframe Edges
        ctx.strokeStyle = poly.color;
        ctx.lineWidth = 1.1;
        octaEdges.forEach(([i, j]) => {
          const v1 = rotated[i];
          const v2 = rotated[j];
          ctx.beginPath();
          ctx.moveTo(v1.x, v1.y);
          ctx.lineTo(v2.x, v2.y);
          ctx.stroke();
        });

        // Draw Polyhedron Vertex Crystals
        rotated.forEach((v) => {
          ctx.beginPath();
          ctx.arc(v.x, v.y, 2.0 * v.scale, 0, Math.PI * 2);
          ctx.fillStyle = poly.color.replace('0.45', '0.85').replace('0.4', '0.85');
          ctx.fill();
        });
      });

      // 5. Render Interactive Click Shockwave Ripples
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.08 + 2.5;
        sw.alpha *= 0.94;

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${sw.color}${sw.alpha})`;
        ctx.lineWidth = sw.lineWidth * (sw.alpha / 0.75);
        ctx.stroke();

        if (sw.alpha < 0.01 || sw.radius >= sw.maxRadius - 2) {
          shockwaves.splice(i, 1);
        }
      }

      // 6. Render Interactive Click Sparkles
      for (let i = clickSparkles.length - 1; i >= 0; i--) {
        const sp = clickSparkles[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.92;
        sp.vy *= 0.92;
        sp.alpha -= sp.decay;

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius * sp.alpha, 0, Math.PI * 2);
        ctx.fillStyle = `${sp.color}${sp.alpha})`;
        ctx.fill();

        if (sp.alpha <= 0.02) {
          clickSparkles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 3D WebGL / Canvas Stream */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Luminous Warm Amber & Sunset Coral Aurora Background Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-rose-600/12 rounded-full blur-[140px] animate-aurora-1 pointer-events-none"></div>
      <div className="absolute top-[35%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-bl from-orange-600/14 via-rose-500/12 to-amber-500/10 rounded-full blur-[160px] animate-aurora-2 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[25%] w-[650px] h-[650px] bg-gradient-to-tr from-amber-500/12 via-rose-500/10 to-emerald-400/8 rounded-full blur-[140px] animate-aurora-1 pointer-events-none"></div>

      {/* Subtle Precision Grid Overlay with warm amber tint */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,158,11,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,158,11,0.035)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40 pointer-events-none"></div>
    </div>
  );
};

export default Running3DBackground;
