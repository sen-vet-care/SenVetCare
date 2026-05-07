import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const CAROUSEL_PHOTOS = [
  "https://ik.imagekit.io/senvetcare/2024-12-15.webp?updatedAt=1776251360726",
  "https://ik.imagekit.io/senvetcare/unnamed%20(4).webp?updatedAt=1776251360701",
  "https://ik.imagekit.io/senvetcare/unnamed.webp?updatedAt=1776251360661",
  "https://ik.imagekit.io/senvetcare/2023-12-17%20(3).webp?updatedAt=1776251360630",
  "https://ik.imagekit.io/senvetcare/2023-12-17%20(2).webp?updatedAt=1776251360389",
  "https://ik.imagekit.io/senvetcare/2024-12-15%20(1).webp?updatedAt=1776251360316",
  "https://ik.imagekit.io/senvetcare/2023-12-17.webp?updatedAt=1776251360247",
  "https://ik.imagekit.io/senvetcare/2023-12-17%20(8).webp?updatedAt=1776251360260",
];

export const HeroReception = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { scrollYProgress } = useScroll();

  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_PHOTOS.length);
    }, 5000); // Change image every 5 seconds for smoother feel
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="reception" 
      className="min-h-screen relative flex items-center overflow-hidden"
    >
      {/* Background Carousel */}
      <motion.div 
        className="absolute inset-0 z-0 h-[120%]"
        style={{ y: bgY, top: '-10%' }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Blurred background layer for depth and to cover empty space on mobile */}
            <img
              src={CAROUSEL_PHOTOS[currentImageIndex]}
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110"
              alt=""
            />
            {/* Main image with slow depth zoom */}
            <motion.img
              src={CAROUSEL_PHOTOS[currentImageIndex]}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-contain md:object-cover"
              alt="Hero Background"
            />
          </motion.div>
        </AnimatePresence>
        {/* Gradient overlays to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
      </motion.div>
      
      {/* Content */}
      <div className="px-4 md:px-8 max-w-[1280px] w-full mx-auto relative z-20 pt-24 pb-12">
        <motion.div 
          style={{ y: textY, opacity: contentOpacity }}
          className="w-full lg:w-2/3 flex flex-col items-start"
        >
          <div className="flex flex-col items-start gap-4 px-6 py-4 rounded-[2rem] sanctuary-card mb-8 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] bg-black/40 backdrop-blur-md">
            <h2 className="font-manrope font-extrabold text-3xl md:text-4xl text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              SenVetCare
            </h2>
            <div className="flex flex-col gap-1">
               <span className="font-inter font-bold text-xs tracking-[0.3em] text-waiting-gold uppercase drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">Legacy</span>
               <span className="font-inter font-bold text-xs tracking-[0.2em] text-emerald-400 uppercase drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">Dr. T. B. Sen Memorial Veterinary Clinic</span>
            </div>
          </div>
          
          <h1 className="font-manrope font-light text-[56px] lg:text-[80px] text-white leading-[1.05] tracking-tight mb-8 drop-shadow-2xl">
            <span className="font-bold text-gradient">Your Pet !</span> <br/>
            <span className="font-bold italic text-gradient-gold">We Care.</span>
          </h1>
          
          <p className="font-inter text-lg lg:text-xl text-white/90 leading-relaxed max-w-xl mb-12 font-light drop-shadow-md">
            Step into a haven designed for your pet's ultimate comfort and health. For over 30 years, Dr. TB Sen's legacy has been redefining veterinary excellence in Kolkata through empathy, precision, and state-of-the-art care.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
            <Link to="/dr-lily" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-inter font-bold text-sm tracking-widest uppercase hover:bg-waiting-gold hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] flex items-center justify-center gap-3">
              Book Clinic Appointment
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            
            <div className="flex items-center gap-4 text-white justify-center sm:justify-start">
              <div className="flex -space-x-4">
                <div className="w-12 h-12 rounded-full border-2 border-background bg-surface-container overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=150" alt="Dog" className="w-full h-full object-cover" />
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-background bg-surface-container overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=150" alt="Cat" className="w-full h-full object-cover" />
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-background sanctuary-card flex items-center justify-center text-xs font-bold text-waiting-gold z-10 bg-black/60 backdrop-blur-sm">
                    +10k
                </div>
              </div>
              <div className="flex flex-col text-sm drop-shadow-md">
                <span className="font-bold text-white tracking-wider">Lives Touched</span>
                <span className="text-xs opacity-90">Since 1990</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
