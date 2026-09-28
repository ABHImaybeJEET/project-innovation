'use client';

import { useEffect, useRef } from 'react';
import './ParticleText.css';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

const hexToRgb = hex => {
  const clean = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return { r: parseInt(clean.slice(0, 2), 16), g: parseInt(clean.slice(2, 4), 16), b: parseInt(clean.slice(4, 6), 16) };
};

const ParticleText = ({
  text = 'React Bits', particleSize = 2, density = 4, color = '#ffffff', highlightColor = '#8b5cf6',
  scatter = 180, gatherDuration = 1600, stagger = 420, pointerRepel = 40, repelRadius = 120,
  idleDrift = 0.7, trigger = 'mount', fontSize = 'clamp(3rem, 12vw, 8rem)', fontWeight = 800,
  fontFamily = 'inherit', glow = true, className = '', style
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!container || !canvas || !ctx) return undefined;

    let particles = [], frame, resizeFrame, buildId = 0, gathering = false, gatherStart = 0;
    let width = 0, height = 0;
    let lastWidth = 0, lastHeight = 0;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const pointer = { active: false, x: 0, y: 0, smoothX: 0, smoothY: 0 };
    let currentScale = 1.0;

    const gather = (scatterFirst = true) => {
      const now = performance.now();
      particles.forEach(p => {
        if (scatterFirst) {
          const angle = p.seed * Math.PI * 2;
          const distance = scatter * (0.35 + p.depth * 0.75);
          p.x = p.targetX + Math.cos(angle) * distance + (p.depth - 0.5) * scatter * 0.55;
          p.y = p.targetY + Math.sin(angle) * distance + (p.seed - 0.5) * scatter * 0.55;
        }
        p.startX = p.x; p.startY = p.y; p.delay = reducedMotion ? 0 : p.seed * stagger;
      });
      gatherStart = now; gathering = true;
    };

    const render = now => {
      ctx.clearRect(0, 0, width, height);
      ctx.shadowBlur = glow && !reducedMotion ? particleSize * 3 : 0;
      ctx.shadowColor = highlightColor;
      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.18;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.18;
      
      const targetScale = (pointer.active && trigger === 'hover') ? 1.05 : 1.0;
      
      // Optimize scale easing
      if (Math.abs(targetScale - currentScale) < 0.001) {
        currentScale = targetScale;
      } else {
        currentScale += (targetScale - currentScale) * 0.1;
      }
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      let complete = true;
      particles.forEach(p => {
        let x = p.targetX, y = p.targetY, progress = 1;
        if (gathering) {
          progress = clamp((now - gatherStart - p.delay) / Math.max(1, gatherDuration), 0, 1);
          const eased = easeOutCubic(progress);
          x = p.startX + (p.targetX - p.startX) * eased;
          y = p.startY + (p.targetY - p.startY) * eased;
          if (progress < 1) complete = false;
        } else if (!reducedMotion && idleDrift) {
          x += Math.sin(now * .0009 + p.seed * 10) * idleDrift * p.depth;
          y += Math.cos(now * .00075 + p.depth * 10) * idleDrift * p.depth;
        }
        
        // Apply scale (zoom effect) only if necessary
        if (currentScale !== 1.0) {
          x = centerX + (x - centerX) * currentScale;
          y = centerY + (y - centerY) * currentScale;
        }
        
        if (pointer.active && !reducedMotion) {
          const dx = x - pointer.smoothX;
          const dy = y - pointer.smoothY;
          
          // Fast bounding box check to optimize performance
          if (Math.abs(dx) < repelRadius && Math.abs(dy) < repelRadius) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < repelRadius) { 
              const safeDistance = Math.max(distance, 0.5);
              const force = Math.pow(1 - distance / repelRadius, 2) * pointerRepel; 
              x += (dx / safeDistance) * force; 
              y += (dy / safeDistance) * force; 
            }
          }
        }
        
        p.x += (x - p.x) * (reducedMotion ? 1 : .14); 
        p.y += (y - p.y) * (reducedMotion ? 1 : .14);
        
        ctx.globalAlpha = .35 + progress * .65; 
        ctx.fillStyle = p.color;
        
        const scaledSize = p.size * currentScale;
        
        if (scaledSize <= 4.0) {
          ctx.fillRect(p.x - scaledSize / 2, p.y - scaledSize / 2, scaledSize, scaledSize);
        } else { 
          ctx.beginPath(); 
          ctx.arc(p.x, p.y, scaledSize / 2, 0, Math.PI * 2); 
          ctx.fill(); 
        }
      });
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      if (complete) gathering = false;
      frame = requestAnimationFrame(render);
    };

    const sampleText = async () => {
      const rect = container.getBoundingClientRect();
      const newWidth = Math.floor(rect.width); 
      const newHeight = Math.floor(rect.height); 
      if (!newWidth || !newHeight) return;
      
      if (newWidth === lastWidth && newHeight === lastHeight) return;
      
      const currentBuild = ++buildId;
      width = newWidth; height = newHeight;
      lastWidth = width; lastHeight = height;
      
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const computed = getComputedStyle(container), family = fontFamily === 'inherit' ? computed.fontFamily : fontFamily;
      const probe = document.createElement('span'); probe.style.cssText = `position:absolute;visibility:hidden;font-size:${fontSize};font-weight:${fontWeight};font-family:${family}`; probe.textContent = 'M'; container.appendChild(probe);
      let size = parseFloat(getComputedStyle(probe).fontSize) || 96; probe.remove();
      const offscreen = document.createElement('canvas'), offCtx = offscreen.getContext('2d', { willReadFrequently: true }); if (!offCtx) return;
      let font = `${fontWeight} ${size}px ${family}`; offCtx.font = font;
      const content = String(text || ' '); let metrics = offCtx.measureText(content);
      if (metrics.width > width * .92) { size = Math.max(18, size * width * .92 / metrics.width); font = `${fontWeight} ${size}px ${family}`; offCtx.font = font; metrics = offCtx.measureText(content); }
      if (currentBuild !== buildId) return;
      const ascent = Math.ceil(metrics.actualBoundingBoxAscent || size * .78), descent = Math.ceil(metrics.actualBoundingBoxDescent || size * .22), padding = Math.ceil(size * .08) + 12;
      offscreen.width = Math.ceil(metrics.width) + padding * 2; offscreen.height = ascent + descent + padding * 2;
      offCtx.font = font; offCtx.fillStyle = '#fff'; offCtx.fillText(content, padding, padding + ascent);
      const data = offCtx.getImageData(0, 0, offscreen.width, offscreen.height).data, targets = [], step = Math.max(2, Math.floor(density));
      for (let y = 0; y < offscreen.height; y += step) for (let x = 0; x < offscreen.width; x += step) if (data[(y * offscreen.width + x) * 4 + 3] > 40) targets.push({ x: width / 2 - offscreen.width / 2 + x, y: height / 2 - offscreen.height / 2 + y });
      const stride = Math.max(1, Math.ceil(targets.length / Math.max(900, Math.min(5200, width * height / 90)))), base = hexToRgb(color), highlight = hexToRgb(highlightColor);
      particles = targets.filter((_, i) => i % stride === 0).map((target, i) => { const seed = ((i * 9301 + 49297) % 233280) / 233280, depth = .45 + ((i * 233 + 97) % 1000) / 1000 * .9, mix = clamp(target.x / width + (seed - .5) * .35, 0, 1); return { ...target, targetX: target.x, targetY: target.y, x: target.x, y: target.y, startX: target.x, startY: target.y, size: particleSize * (.75 + .45), color: base && highlight ? `rgb(${Math.round(base.r + (highlight.r - base.r) * mix)}, ${Math.round(base.g + (highlight.g - base.g) * mix)}, ${Math.round(base.b + (highlight.b - base.b) * mix)})` : color, seed, depth }; });
      pointer.x = pointer.smoothX = width / 2; pointer.y = pointer.smoothY = height / 2; if (reducedMotion) { gathering = false; } else { gather(true); }
      if (!frame) frame = requestAnimationFrame(render);
    };
    const queueSample = () => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(sampleText); };
    const move = event => { const rect = canvas.getBoundingClientRect(); pointer.x = event.clientX - rect.left; pointer.y = event.clientY - rect.top; pointer.active = true; };
    const enter = event => { move(event); };
    const observer = new ResizeObserver(queueSample); observer.observe(container); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerenter', enter); canvas.addEventListener('pointerleave', () => { pointer.active = false; }); canvas.addEventListener('click', () => { if (trigger === 'click') gather(true); }); sampleText();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); cancelAnimationFrame(resizeFrame); };
  }, [text, particleSize, density, color, highlightColor, scatter, gatherDuration, stagger, pointerRepel, repelRadius, idleDrift, trigger, fontSize, fontWeight, fontFamily, glow]);
  return <div ref={containerRef} className={`particle-text ${className}`} style={style} aria-label={text}><canvas ref={canvasRef} className="particle-text__canvas" aria-hidden="true" /><span className="particle-text__sr">{text}</span></div>;
};

export default ParticleText;

