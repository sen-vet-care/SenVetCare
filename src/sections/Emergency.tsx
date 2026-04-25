import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const EmergencyBooking = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const circle1Y = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const circle2Y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} id="emergency" className="py-[100px] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-error-container/30 to-background">
      {/* Decorative Background Elements */}
      <motion.div 
        style={{ y: circle1Y }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-error-container/40 rounded-full blur-3xl -z-10 mix-blend-multiply"
      ></motion.div>
      <motion.div 
        style={{ y: circle2Y }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary-fixed/30 rounded-full blur-3xl -z-10 mix-blend-multiply"
      ></motion.div>
      
      {/* ... rest of the content */}
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-8 relative z-10 flex flex-col items-center text-center mt-12">
        <div className="mb-8 inline-flex items-center justify-center p-4 bg-error-container rounded-full text-error">
            <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
        </div>
        <h2 className="font-manrope font-black text-[48px] leading-[1.1] tracking-[-0.02em] text-on-background mb-4">Veterinary Emergency</h2>
        <p className="font-inter text-[18px] text-on-surface-variant max-w-2xl mx-auto mb-12">
            If your pet is experiencing a life-threatening emergency, tap the button below to call our emergency line immediately. We are standing by to assist.
        </p>

        {/* Large Pulsing CTA */}
        <div className="relative group cursor-pointer mb-16">
            <a href="tel:+919871155162" className="relative z-10 flex flex-col items-center justify-center w-72 h-72 rounded-full bg-emergency-pulse text-on-error shadow-[0_20px_50px_-12px_rgba(190,18,60,0.5)] pulse-animation border-4 border-on-surface/20 hover:scale-105 transition-transform duration-300">
                <span className="material-symbols-outlined text-6xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                <span className="font-manrope font-semibold text-[24px] font-bold">Call Now</span>
                <span className="font-inter text-[18px] mt-1 tracking-wider">9871155162</span>
            </a>
        </div>

        {/* Bento Grid Info Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto text-left">
            {/* Hours Card */}
            <div className="col-span-1 lg:col-span-2 bg-surface rounded-3xl p-8 shadow-sm border border-outline-variant/30 flex flex-col h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="material-symbols-outlined text-9xl">schedule</span>
                </div>
                
                <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2 bg-secondary-container rounded-2xl text-on-secondary-container">
                         <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                    </div>
                    <h3 className="font-manrope font-semibold text-[24px] text-on-surface">Operating Hours</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 relative z-10">
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                        <span className="font-inter text-[16px] text-on-surface-variant">Morning</span>
                        <span className="font-inter font-bold text-[12px] tracking-widest text-on-surface">11:00 AM – 2:30 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                        <span className="font-inter text-[16px] text-on-surface-variant">Afternoon</span>
                        <span className="font-inter font-bold text-[12px] tracking-widest text-on-surface">3:00 PM – 5:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                        <span className="font-inter text-[16px] text-on-surface-variant">Evening</span>
                        <span className="font-inter font-bold text-[12px] tracking-widest text-on-surface">6:30 PM – 9:30 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2 bg-error-container/30 px-3 rounded-md">
                        <span className="font-inter text-[16px] text-error font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                            Emergency
                        </span>
                        <span className="font-inter font-bold text-[12px] tracking-widest text-error">24/7 Available</span>
                    </div>
                </div>
            </div>

            {/* Location Card */}
            <div className="col-span-1 bg-surface rounded-3xl p-8 shadow-sm border border-outline-variant/30 flex flex-col h-full group hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary-container rounded-2xl text-on-primary-container">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                    </div>
                    <h3 className="font-manrope font-semibold text-[24px] text-on-surface">Location</h3>
                </div>
                <div className="space-y-4">
                  <p className="font-inter text-[16px] text-on-surface-variant leading-relaxed">
                      Dr. Tamal B. Sen Memorial Veterinary Clinic<br/>
                      69 Dr Suresh Sarkar Road, Entally-14<br/>
                      Kolkata, West Bengal 700014
                  </p>
                  <a 
                    href="https://maps.app.goo.gl/gGsjrYXAFf4AofRZA" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-bold uppercase text-[12px] tracking-widest hover:gap-3 transition-all"
                  >
                    Open in Maps <span className="material-symbols-outlined text-[16px]">north_east</span>
                  </a>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};
