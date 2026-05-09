import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const AboutLegacy = () => {
  const { scrollYProgress } = useScroll();

  const founderY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [30, -30]);

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-[120px]">
      <motion.div 
        style={{ y: textY }}
        className="text-center max-w-3xl mx-auto space-y-6 mb-[80px]"
      >
        <h2 className="font-manrope font-black text-[48px] text-on-surface">A Legacy of <span className="text-primary">Care</span></h2>
        <p className="font-inter text-[18px] text-on-surface-variant">From a humble beginning to a state-of-the-art facility, our journey is rooted in unwavering compassion for animals and a commitment to clinical excellence.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:auto-rows-[300px]">
        {/* Founder Frame */}
        <motion.div 
          style={{ y: founderY }}
          className="flex flex-col md:flex-row min-h-[600px] md:min-h-0 md:h-full md:col-span-8 md:row-span-2 relative rounded-3xl overflow-hidden shadow-lg group bg-[#0d0d0d]"
        >
            <div className="relative w-full md:w-[50%] overflow-hidden h-[400px] md:h-auto shrink-0">
               <div className="absolute inset-0 bg-[rgba(112,66,20,0.15)] mix-blend-multiply z-10 pointer-events-none"></div>
               <img loading="lazy" decoding="async" src="https://ik.imagekit.io/senvetcare/Logo/BCE81C07-6463-4405-93AB-57A012E2C15C%20-%20Shakya%20Sen.webp" alt="Founder portrait" className="w-full h-full object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0" />
            </div>
            <div className="relative z-20 p-8 sm:p-10 lg:p-12 flex-1 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/5 bg-[#0d0d0d]">
                <span className="font-inter font-bold text-[12px] tracking-widest text-[#90d7c7] mb-2 block uppercase">The Founder</span>
                <h3 className="font-manrope font-bold text-[28px] sm:text-[32px] lg:text-[40px] mb-4 text-white leading-tight">Prof. Dr. Tamal Baran Sen</h3>
                <p className="font-inter text-[14px] sm:text-[16px] lg:text-[18px] max-w-2xl text-white/80 leading-relaxed mb-8">A visionary in veterinary medicine, Dr. Sen laid the foundation of this clinic in 1990 with a singular mission: to provide world-class, empathetic care to every animal in need.</p>
                <p className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#90d7c7]">"Pets are family."</p>
            </div>
        </motion.div>

        {/* 1990 Timeline */}
        <div className="md:col-span-4 md:row-span-1 rounded-3xl bg-surface-container shadow-sm border border-outline-variant p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
                <div className="flex items-center gap-2 text-primary mb-4">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
                    <span className="font-inter font-bold text-[12px] tracking-widest">1990</span>
                </div>
                <h4 className="font-manrope font-semibold text-[24px] text-on-surface mb-2">Inception</h4>
                <p className="font-inter text-[16px] text-on-surface-variant line-clamp-3">The first small clinic opens its doors in Kolkata, equipped with basic tools but boundless dedication.</p>
            </div>
        </div>

        {/* Current Management */}
        <div className="md:col-span-4 md:row-span-1 rounded-3xl bg-surface-container-low shadow-sm border border-outline-variant p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
           <div>
               <span className="font-inter font-bold text-[12px] tracking-widest text-primary uppercase">Current Leadership</span>
               <h4 className="font-manrope font-semibold text-[24px] text-on-surface mt-2 mb-1">Ld. Adv. Shakya Singha Sen</h4>
               <p className="font-inter text-[12px] uppercase text-on-surface-variant mb-3">Advocate & Managing Director</p>
               <p className="font-inter text-[14px] text-on-surface-variant line-clamp-3">Continuing the legacy with a modernized approach to clinical management and digital transformation.</p>
           </div>
        </div>
      </div>
    </section>
  );
};
