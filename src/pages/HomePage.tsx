import { Suspense, lazy, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { HeroReception } from '../sections/HeroReception';
import { OurDoctors } from '../sections/OurDoctors';
import { Services } from '../sections/Services';
import { AboutLegacy } from '../sections/AboutLegacy';
import { EmergencyBooking } from '../sections/Emergency';
import { ContactSupport } from '../sections/ContactSupport';
import { Link } from 'react-router-dom';

const SectionLoader = () => (
  <div className="w-full py-20 flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
  </div>
);

export const HomePage = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <main ref={containerRef} className="flex-grow relative overflow-hidden">
      {/* Dynamic Parallax Background Elements */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute top-0 left-0 w-full h-[200%] pointer-events-none -z-20 opacity-30"
      >
        <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-primary/10 blur-[150px] rounded-full"></div>
        <div className="absolute top-[40%] right-[5%] w-[35vw] h-[35vw] bg-waiting-gold/10 blur-[150px] rounded-full"></div>
        <div className="absolute top-[70%] left-[15%] w-[45vw] h-[45vw] bg-secondary/10 blur-[150px] rounded-full"></div>
      </motion.div>

      <HeroReception />
      
      <Suspense fallback={<SectionLoader />}>
        <AboutLegacy />
        <Services />
        <OurDoctors />
        <EmergencyBooking />
        
        {/* Stories Teaser */}
        <section className="py-20 max-w-[1280px] mx-auto px-6 text-center">
            <h2 className="font-manrope font-extrabold text-[40px] text-ink-depth mb-6">SenVetCare <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-waiting-gold">Stories.</span></h2>
            <p className="font-inter text-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
                Read the latest daily news tailored for Kolkata pet parents, heartwarming pet stories, and clinical tips directly from our veterinary board.
            </p>
            <Link to="/stories" className="inline-flex items-center gap-2 bg-surface border border-outline-variant/50 text-ink-depth font-inter font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm group">
                Read More Stories
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
        </section>
      </Suspense>
    </main>
  );
};
