import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const CAROUSEL_PHOTOS = [
  "https://ik.imagekit.io/senvetcare/2025-12-14%20(1).webp?updatedAt=1776251360784",
  "https://ik.imagekit.io/senvetcare/2024-12-15.webp?updatedAt=1776251360726",
  "https://ik.imagekit.io/senvetcare/unnamed%20(4).webp?updatedAt=1776251360701",
  "https://ik.imagekit.io/senvetcare/unnamed.webp?updatedAt=1776251360661",
  "https://ik.imagekit.io/senvetcare/2023-12-17%20(3).webp?updatedAt=1776251360630",
  "https://ik.imagekit.io/senvetcare/2023-12-17%20(2).webp?updatedAt=1776251360389",
  "https://ik.imagekit.io/senvetcare/2024-12-15%20(1).webp?updatedAt=1776251360316",
  "https://ik.imagekit.io/senvetcare/2023-12-17.webp?updatedAt=1776251360247",
  "https://ik.imagekit.io/senvetcare/2023-12-17%20(8).webp?updatedAt=1776251360260",
  "https://ik.imagekit.io/senvetcare/2025-08-19.webp?updatedAt=1776251360197",
  "https://ik.imagekit.io/senvetcare/2025-08-21.webp?updatedAt=1776251360140",
  "https://ik.imagekit.io/senvetcare/2023-12-17%20(4).webp?updatedAt=1776251360049",
  "https://ik.imagekit.io/senvetcare/unnamed%20(3).webp?updatedAt=1776251360263",
  "https://ik.imagekit.io/senvetcare/2025-12-14.webp?updatedAt=1776251359990",
  "https://ik.imagekit.io/senvetcare/2022-12-22.webp?updatedAt=1776251359930",
  "https://ik.imagekit.io/senvetcare/2023-12-17%20(7).webp?updatedAt=1776251359971",
  "https://ik.imagekit.io/senvetcare/2024-12-15%20(2).webp?updatedAt=1776251359988",
  "https://ik.imagekit.io/senvetcare/2022-12-22%20(1).webp?updatedAt=1776251359940",
  "https://ik.imagekit.io/senvetcare/2023-12-17%20(6).webp?updatedAt=1776251359935",
  "https://ik.imagekit.io/senvetcare/2023-08-15.webp?updatedAt=1776251359933",
  "https://ik.imagekit.io/senvetcare/2023-12-17%20(9).webp?updatedAt=1776251360028",
  "https://ik.imagekit.io/senvetcare/unnamed%20(2).webp?updatedAt=1776251359679",
  "https://ik.imagekit.io/senvetcare/2024-12-15%20(3).webp?updatedAt=1776251359704",
  "https://ik.imagekit.io/senvetcare/unnamed.jpg?updatedAt=1776251359390",
  "https://ik.imagekit.io/senvetcare/unnamed%20(6).webp?updatedAt=1776251359456",
  "https://ik.imagekit.io/senvetcare/2025-12-14%20(3).webp?updatedAt=1776251359454",
  "https://ik.imagekit.io/senvetcare/unnamed%20(7).webp?updatedAt=1776251359480",
  "https://ik.imagekit.io/senvetcare/2024-12-15%20(5).webp?updatedAt=1776251359610",
  "https://ik.imagekit.io/senvetcare/2025-12-14%20(2).webp?updatedAt=1776251359477",
  "https://ik.imagekit.io/senvetcare/2025-12-14%20(4).webp?updatedAt=1776251359435",
  "https://ik.imagekit.io/senvetcare/unnamed%20(1).jpg?updatedAt=1776251359375",
  "https://ik.imagekit.io/senvetcare/2022-12-22%20(2).webp?updatedAt=1776251359440",
  "https://ik.imagekit.io/senvetcare/unnamed%20(8).webp?updatedAt=1776251359467",
  "https://ik.imagekit.io/senvetcare/2024-12-15%20(6).webp?updatedAt=1776251359574",
  "https://ik.imagekit.io/senvetcare/2023-12-17%20(5).webp?updatedAt=1776251359382"
];

export const HeroReception = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { scrollYProgress } = useScroll();

  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const imageY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_PHOTOS.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="reception" 
      className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-[1280px] mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 relative z-10"
    >
      
      {/* Left: Divine Messaging */}
      <motion.div 
        style={{ y: textY }}
        className="w-full lg:w-1/2 flex flex-col items-start pt-10 lg:pt-0"
      >
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full sanctuary-card mb-8 border border-waiting-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
          <span className="w-2.5 h-2.5 rounded-full bg-waiting-gold animate-pulse"></span>
          <span className="font-inter font-bold text-[11px] tracking-[0.25em] text-waiting-gold uppercase">A Sanctuary of Healing</span>
        </div>
        
        <h1 className="font-manrope font-light text-[56px] lg:text-[80px] text-white leading-[1.05] tracking-tight mb-8">
          <span className="font-bold text-gradient">Your Pet !</span> <br/>
          <span className="font-bold italic text-gradient-gold">We Care.</span>
        </h1>
        
        <p className="font-inter text-lg lg:text-xl text-on-surface-variant leading-relaxed max-w-xl mb-12 font-light">
          Step into a haven designed for your pet's ultimate comfort and health. For over 30 years, Dr. TB Sen's legacy has been redefining veterinary excellence in Kolkata through empathy, precision, and state-of-the-art care.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
          <a href="/#contact" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-inter font-bold text-sm tracking-widest uppercase hover:bg-waiting-gold hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:scale-105 flex items-center justify-center gap-3">
            Book a Journey
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>
          
          <div className="flex items-center gap-4 text-on-surface-variant justify-center sm:justify-start">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full border-2 border-background bg-surface-container overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=150" alt="Dog" className="w-full h-full object-cover" />
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-background bg-surface-container overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=150" alt="Cat" className="w-full h-full object-cover" />
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-background sanctuary-card flex items-center justify-center text-xs font-bold text-waiting-gold z-10">
                  +10k
              </div>
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-bold text-white tracking-wider">Lives Touched</span>
              <span className="text-xs opacity-70">Since 1990</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right: Immersive Visuals */}
      <motion.div 
        style={{ y: imageY }}
        className="w-full lg:w-1/2 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl -z-10 rounded-full mix-blend-screen animate-breathe"></div>
        
        <div className="grid grid-cols-2 gap-4 lg:gap-6 relative z-10 w-full">
          {/* Main Visual */}
          <div className="col-span-2 relative h-[300px] lg:h-[400px] rounded-[2rem] overflow-hidden group">
            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none"></div>
            
            {/* Vignette Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_0_100px_50px_rgba(0,0,0,0.85)] mix-blend-multiply"></div>
            <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.6)_100%)]"></div>

            {CAROUSEL_PHOTOS.map((src, idx) => (
              <img 
                key={src}
                loading={idx === 0 ? "eager" : "lazy"} 
                decoding="async" 
                src={src} 
                alt="Moments of Care" 
                className={`absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 ${
                  idx === currentImageIndex ? 'z-10' : 'z-0'
                }`}
                style={{
                  opacity: idx === currentImageIndex ? 1 : 0,
                  transform: idx === currentImageIndex ? 'scale(1)' : 'scale(1.15)',
                  transition: 'opacity 1.5s ease-in-out, transform 4.5s ease-out'
                }}
              />
            ))}
            <div className="absolute bottom-6 left-6 z-20">
              <div className="glass-panel px-4 py-2 rounded-full inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-white text-[16px]">favorite</span>
                <span className="text-xs font-bold text-white tracking-widest uppercase">Moments of Care</span>
              </div>
            </div>
          </div>

          {/* Sub Visuals */}
          <div className="sanctuary-card rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between hover:-translate-y-2 group w-full transition-transform duration-300">
            <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <span className="material-symbols-outlined text-[24px]">science</span>
            </div>
            <div>
              <h3 className="font-manrope font-bold text-white text-lg lg:text-xl mb-1">Advanced Lab</h3>
              <p className="text-[10px] lg:text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Tier-1 Diagnostics</p>
            </div>
          </div>

          <div className="sanctuary-card rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between hover:-translate-y-2 group w-full transition-transform duration-300">
            <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-waiting-gold mb-6 group-hover:bg-waiting-gold group-hover:text-black transition-all duration-300">
              <span className="material-symbols-outlined text-[24px]">favorite</span>
            </div>
            <div>
              <h3 className="font-manrope font-bold text-white text-lg lg:text-xl mb-1">Intensive Care</h3>
              <p className="text-[10px] lg:text-xs text-on-surface-variant uppercase tracking-widest font-semibold">24/7 Monitoring</p>
            </div>
          </div>
        </div>
      </motion.div>
      
    </section>
  );
};
