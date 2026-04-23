'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useScroll, useSpring, useTransform, motion, useMotionValueEvent } from 'framer-motion';

interface MatchaAnimationProps {
  frameCount?: number;
}

const MatchaAnimation: React.FC<MatchaAnimationProps> = ({ frameCount = 168 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Map progress to frame index
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, frameCount - 1]);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const preloadImages = async () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        // Zero padding for filenames like ezgif-frame-001.jpg
        const paddedIndex = i.toString().padStart(3, '0');
        img.src = `/macha/ezgif-frame-${paddedIndex}.jpg`;
        
        await new Promise((resolve, reject) => {
          img.onload = () => {
            loadedCount++;
            setLoadProgress(Math.floor((loadedCount / frameCount) * 100));
            resolve(img);
          };
          img.onerror = reject;
        });
        
        loadedImages[i - 1] = img;
      }
      
      setImages(loadedImages);
      setIsLoading(false);
    };

    preloadImages().catch(console.error);

    return () => {
      // Cleanup if needed
    };
  }, [frameCount]);

  // Render loop
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || images.length === 0) return;

    const img = images[Math.floor(index)];
    if (!img) return;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Scaling logic: "contain"
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawHeight = canvas.height;
      drawWidth = img.width * (canvas.height / img.height);
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = canvas.width;
      drawHeight = img.height * (canvas.width / img.width);
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Update canvas when frameIndex changes
  useMotionValueEvent(frameIndex, "change", (latest) => {
    renderFrame(latest);
  });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // Initial render after resize
        renderFrame(frameIndex.get());
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [images]);

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full">
      {/* Sticky Canvas Wrapper */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-contain"
          style={{ width: '100vw', height: '100vh' }}
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="#1a1a1a"
                  strokeWidth="4"
                  fill="transparent"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="#A8C69F"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="377"
                  initial={{ strokeDashoffset: 377 }}
                  animate={{ strokeDashoffset: 377 - (377 * loadProgress) / 100 }}
                  transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                />
              </svg>
              <span className="absolute text-white font-mono text-xl">{loadProgress}%</span>
            </div>
            <p className="mt-6 text-[#A8C69F] tracking-[0.2em] uppercase text-sm font-light">
              Crafting Your Brew
            </p>
          </div>
        )}

        {/* Narrative Beats */}
        {!isLoading && (
          <OverlayProgress progress={scrollYProgress} />
        )}
      </div>
    </div>
  );
};

const OverlayProgress = ({ progress }: { progress: any }) => {
  // Beat A: 0-20%
  const beatAOpacity = useTransform(progress, [0, 0.05, 0.15, 0.2], [0, 1, 1, 0]);
  // Beat B: 25-45%
  const beatBOpacity = useTransform(progress, [0.25, 0.3, 0.4, 0.45], [0, 1, 1, 0]);
  // Beat C: 50-70%
  const beatCOpacity = useTransform(progress, [0.5, 0.55, 0.65, 0.7], [0, 1, 1, 0]);
  // Beat D: 75-95%
  const beatDOpacity = useTransform(progress, [0.75, 0.8, 0.9, 0.95], [0, 1, 1, 0]);

  return (
    <>
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-center px-6">
        {/* Beat A */}
        <motion.div style={{ opacity: beatAOpacity }} className="max-w-xl">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-[#A8C69F]">
            THE ART OF THE POUR
          </h2>
          <p className="text-xl md:text-2xl text-white/60 font-light">
            Where ceremonial tradition meets modern energy.
          </p>
        </motion.div>

        {/* Beat B */}
        <motion.div style={{ opacity: beatBOpacity }} className="max-w-xl absolute">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-[#A8C69F]">
            CEREMONIAL MATCHA
          </h2>
          <p className="text-xl md:text-2xl text-white/60 font-light">
            Vibrantly earth-grounded, whisked to perfection.
          </p>
        </motion.div>

        {/* Beat C */}
        <motion.div style={{ opacity: beatCOpacity }} className="max-w-xl absolute">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-[#A8C69F]">
            BOLD ESPRESSO
          </h2>
          <p className="text-xl md:text-2xl text-white/60 font-light">
            A deep, roasted wake-up call in every sip.
          </p>
        </motion.div>

        {/* Beat D */}
        <motion.div style={{ opacity: beatDOpacity }} className="max-w-xl absolute">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-[#A8C69F]">
            EXPERIENCE THE UNION
          </h2>
          <p className="text-xl md:text-2xl text-white/60 font-light">
            Refreshment, elevated.
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        style={{ opacity: useTransform(progress, [0, 0.1], [1, 0]) }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-white/40">Scroll to Explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </>
  );
};

export default MatchaAnimation;
