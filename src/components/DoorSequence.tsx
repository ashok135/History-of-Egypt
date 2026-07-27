import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Mummy3D from './Mummy3D';

gsap.registerPlugin(ScrollTrigger);

const START_FRAME = 70;
const END_FRAME = 101;
const TOTAL_FRAMES = END_FRAME - START_FRAME + 1; // 32 frames
const IMAGE_DIR = '/door-seq';
const IMAGE_PREFIX = 'Reference_the_uploaded_ancient-';

export default function DoorSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Preload door-seq images (frames 0070 to 0101)
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const handleImageLoad = () => {
      loadedCount++;
      const progress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      setLoadingProgress(progress);

      if (loadedCount === TOTAL_FRAMES) {
        imagesRef.current = loadedImages;
        setIsPreloaded(true);
      }
    };

    // Load only from START_FRAME to END_FRAME
    for (let i = START_FRAME; i <= END_FRAME; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(4, '0');
      img.src = `${IMAGE_DIR}/${IMAGE_PREFIX}${frameNum}.png`;
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Continue even on failure
      loadedImages.push(img);
    }
  }, []);

  // Set up canvas drawing and GSAP scroll timeline
  useEffect(() => {
    if (!isPreloaded || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(0); // Draw first frame on resize
    };

    const renderFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (!img || !context) return;

      // Cover scaling (object-fit: cover equivalent)
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.naturalWidth || img.width || 1920;
      const imgHeight = img.naturalHeight || img.height || 1080;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
      } else {
        drawHeight = canvasWidth / imgRatio;
        offsetY = (canvasHeight - drawHeight) / 2;
      }

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Sequence state object for GSAP to animate (0 to 31)
    const sequenceObj = { frame: 0 };

    // GSAP ScrollTrigger timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=6000', // Slower and smoother scroll travel height
        scrub: 0.5,
        pin: true,
        anticipatePin: 1
      },
      onUpdate: () => {
        // Draw the frame corresponding to the current state of sequenceObj
        renderFrame(Math.floor(sequenceObj.frame));
      }
    });

    // Animate the image sequence frame index (0 to 31) from timeline time 0 to 3.0
    tl.to(sequenceObj, {
      frame: TOTAL_FRAMES - 1,
      duration: 3,
      ease: 'none'
    }, 0);

    // 3D Mummy entrance (starts at 2.0, grows balanced to 100% size/opacity by 3.0)
    tl.fromTo('.door-mummy-container',
      { opacity: 0, scale: 0.1 },
      { opacity: 1, scale: 1, duration: 1.0, ease: 'power1.out' },
      2.0
    );

    // Zoom & Stick Effect: slight camera zoom-in/depth effect on the mummy from 3.0 to 4.0
    tl.to('.door-mummy-container',
      { scale: 1.25, duration: 1.0, ease: 'sine.inOut' },
      3.0
    );

    // Telemetry caption fade-in from 3.0 to 3.4
    tl.fromTo('.door-mummy-caption',
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power1.out' },
      3.0
    );

    // White background shift transition (starts at 4.0, fully white at 4.8)
    tl.fromTo('.door-exit-white',
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power1.inOut' },
      4.0
    );

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [isPreloaded]);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#0e0d0c] overflow-hidden z-10">
      {/* Loading Overlay */}
      {!isPreloaded && (
        <div className="absolute inset-0 bg-[#0e0d0c] flex flex-col justify-center items-center z-50 text-[#FAF9F6]">
          <div className="flex flex-col items-center gap-4 max-w-xs w-full px-6">
            <span className="font-serif text-lg tracking-[6px] text-gold uppercase animate-pulse">Aligning Portal Scans</span>
            <div className="w-full h-[1px] bg-[rgba(197,168,128,0.2)] relative overflow-hidden">
              <div 
                className="h-full bg-gold transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="font-mono text-[10px] tracking-[2px] text-text-muted mt-2">{loadingProgress}% COMPLETE</span>
          </div>
        </div>
      )}

      {/* Full-Screen Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" 
      />

      {/* Grid overlay lines to keep the telemetry look */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[length:50px_50px] bg-center pointer-events-none z-[1]"></div>
      
      {/* Vignette shadow gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(14,13,12,0.85)_100%)] pointer-events-none z-[1]"></div>

      {/* Full-Screen White Exit Transition Overlay - z-5 to cover mummy on fade */}
      <div className="door-exit-white absolute inset-0 bg-[#FAF9F6] opacity-0 pointer-events-none z-[5]" />

      {/* 3D Mummy Overlay */}
      <div className="mummy-3d-container absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-[4] px-6">
        <div className="door-mummy-container w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] flex items-center justify-center opacity-0 transform scale-[0.1] pointer-events-auto">
          <Mummy3D />
        </div>
        
        {/* Dynamic scroll telemetry caption */}
        <div className="door-mummy-caption flex flex-col items-center gap-1 font-mono text-[8px] sm:text-[10px] tracking-[3px] text-gold-dark mt-2 select-none animate-pulse opacity-0">
          <span>THE PHARAOH'S SANCTUM UNLOCKED</span>
          <span>SCROLL DOWN TO ACCESS CHRONICLES</span>
        </div>
      </div>

      {/* Bottom telemetry indicators */}
      {isPreloaded && (
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center font-mono text-[8px] tracking-[2px] text-[rgba(197,168,128,0.4)] z-[2] pointer-events-none">
          <span>SEQUENCE PLAYBACK: PORTAL ACTIVE</span>
          <span>{TOTAL_FRAMES} FRAMES INDEXED (0070 - 0101)</span>
          <span>SYS // GPR_RESOLVE_ONLINE</span>
        </div>
      )}
    </div>
  );
}
