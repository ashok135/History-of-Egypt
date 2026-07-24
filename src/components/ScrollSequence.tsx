import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 101;
const IMAGE_DIR = '/img-seq';
const IMAGE_PREFIX = 'Conversation_with_Gemini___Ref (1)-';

export default function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Text contents for the pinned storytelling
  const texts = [
    {
      title: "RECONSTRUCTING ANCIENT KHEMET",
      subtitle: "Radar scan surveys reveal hidden chambers under Giza, tracing structures buried for over four millennia.",
    },
    {
      title: "THE SACRED ARCHITECTURAL MATRIX",
      subtitle: "Each block aligns to cosmic constants and astronomical axes, calculating the geometry of the gods.",
    },
    {
      title: "ETERNAL CHRONOLOGY OF THE SOUL",
      subtitle: "Unlocking Dynastic calculations that mapped royal consciousness onto the path of the imperishable stars.",
    }
  ];

  // Preload images on mount
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

    // Load each frame from 0001 to 0101
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
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

    // Sequence state object for GSAP to animate
    const sequenceObj = { frame: 0 };

    // GSAP ScrollTrigger timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=6000', // Pinned scroll travel height (enlarged for slower scroll playback)
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Calculate frame index based on scroll progress
          const frameIndex = Math.floor(self.progress * (TOTAL_FRAMES - 1));
          renderFrame(frameIndex);
        }
      }
    });

    // Animate the image sequence frame index
    tl.to(sequenceObj, {
      frame: TOTAL_FRAMES - 1,
      duration: 3,
      ease: 'none'
    });

    // Fade out and translate the top entry blur overlay quickly as soon as scrolling starts
    tl.fromTo('.scroll-entry-blur', 
      { opacity: 1, y: 0 },
      { opacity: 0, y: -150, duration: 0.2, ease: 'power1.out' },
      0 // Starts immediately at 0% scroll progress and finishes at 6.6%
    );

    // Set initial state for story-text-0 elements so they are visible initially when scroll is 0
    gsap.set('.story-text-0', { opacity: 1 });
    gsap.set('.story-text-0 h2', { x: 0, opacity: 1, skewX: 0 });
    gsap.set('.story-text-0 p', { x: 0, opacity: 1 });
    gsap.set('.story-text-0 .divider-line', { scaleX: 1 });

    // Staggered exit animations for Text Block 0 (ends completely by 1.2)
    tl.to('.story-text-0 h2', { x: 80, opacity: 0, skewX: 8, duration: 0.4, ease: 'power2.in' }, 0.7)
      .to('.story-text-0 p', { x: -80, opacity: 0, duration: 0.4, ease: 'power2.in' }, 0.7)
      .to('.story-text-0 .divider-line', { scaleX: 0, duration: 0.4, ease: 'power2.in' }, 0.7)
      .to('.story-text-0', { opacity: 0, duration: 0.1 }, 1.1);

    // Staggered enter & exit animations for Text Block 1 (starts at 1.2, ends by 2.3)
    tl.fromTo('.story-text-1', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 1.2)
      .fromTo('.story-text-1 h2', { x: 80, opacity: 0, skewX: 8 }, { x: 0, opacity: 1, skewX: 0, duration: 0.4, ease: 'power2.out' }, 1.2)
      .fromTo('.story-text-1 p', { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 1.2)
      .fromTo('.story-text-1 .divider-line', { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, 1.2)
      .to('.story-text-1 h2', { x: -80, opacity: 0, skewX: -8, duration: 0.4, ease: 'power2.in' }, 1.9)
      .to('.story-text-1 p', { x: 80, opacity: 0, duration: 0.4, ease: 'power2.in' }, 1.9)
      .to('.story-text-1 .divider-line', { scaleX: 0, duration: 0.4, ease: 'power2.in' }, 1.9)
      .to('.story-text-1', { opacity: 0, duration: 0.1 }, 2.3);

    // Staggered enter & exit animations for Text Block 2 (starts at 2.4, ends at 3.0)
    tl.fromTo('.story-text-2', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 2.4)
      .fromTo('.story-text-2 h2', { x: -80, opacity: 0, skewX: -8 }, { x: 0, opacity: 1, skewX: 0, duration: 0.4, ease: 'power2.out' }, 2.4)
      .fromTo('.story-text-2 p', { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 2.4)
      .fromTo('.story-text-2 .divider-line', { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, 2.4)
      .to('.story-text-2 h2', { x: 80, opacity: 0, skewX: 8, duration: 0.4, ease: 'power2.in' }, 2.7)
      .to('.story-text-2 p', { x: -80, opacity: 0, duration: 0.4, ease: 'power2.in' }, 2.7)
      .to('.story-text-2 .divider-line', { scaleX: 0, duration: 0.4, ease: 'power2.in' }, 2.7)
      .to('.story-text-2', { opacity: 0, duration: 0.1 }, 3.0);

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
            <span className="font-serif text-lg tracking-[6px] text-gold uppercase animate-pulse">Loading Archives</span>
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

      {/* Top Blurry White Entry Transition Overlay - Non-linear feathered gradient for ultra-smooth fade */}
      <div className="scroll-entry-blur absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#FAF9F6] via-[#FAF9F6]/90 via-[#FAF9F6]/60 via-[#FAF9F6]/30 via-[#FAF9F6]/10 to-transparent pointer-events-none z-[3]" />

      {/* Grid overlay lines to keep the telemetry look */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[length:50px_50px] bg-center pointer-events-none z-[1]"></div>
      
      {/* Vignette shadow gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(14,13,12,0.85)_100%)] pointer-events-none z-[1]"></div>

      {/* Text overlays - positioned centered for visual impact */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2] px-6">
        <div className="max-w-2xl text-center flex flex-col items-center">
          {texts.map((text, idx) => (
            <div 
              key={idx} 
              className={`story-text-${idx} absolute select-none flex flex-col items-center gap-5 max-w-3xl`}
              style={{ opacity: idx === 0 ? 1 : 0 }}
            >
              <span className="font-mono text-[10px] sm:text-[12px] tracking-[6px] text-gold font-bold">01.0{idx + 1} // CHRONICLE VISUALIZATION</span>
              <h2 className="font-serif text-3xl sm:text-6xl font-black tracking-[3px] text-[#FAF9F6] uppercase leading-none">
                {text.title}
              </h2>
              <div className="divider-line w-20 h-[1px] bg-gold opacity-50 my-2"></div>
              <p className="text-sm sm:text-lg text-[#D0CFC9] leading-relaxed max-w-xl font-sans">
                {text.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom telemetry indicators */}
      {isPreloaded && (
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center font-mono text-[8px] tracking-[2px] text-[rgba(197,168,128,0.4)] z-[2] pointer-events-none">
          <span>SEQUENCE PLAYBACK: ACTIVE</span>
          <span>101 FRAMES INDEXED</span>
          <span>SYS // LENIS_GSAP_ACTIVE</span>
        </div>
      )}
    </div>
  );
}
