import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const TESTIMONIALS = [
  {
    name: "Azder Ali Mirza",
    text: "Thanks for being there. We are proud of u DrSen Memorial. U have helped in times of real Emergency when I bought injured cats to u. U are a ray of hope for so many. U can Reduce the rates a bit. Very polite staff. 👍 Wish u all the Best.\n-Adv. Azder Ali Mirza (Park Circus); Kol17",
    link: "https://maps.app.goo.gl/oHww9sFYDn9BbSro9"
  },
  {
    name: "Rafia Khatoon",
    text: "The best clinic in kolkata for your pet. The staff are very cooperative and experienced, your pet will get the best care and treatment here. Its been more than 7 year since I am taking my cat to their clinic for checkups I strongly recommend this clinic to all the pet owners who are looking for a better clinic.",
    link: "https://maps.app.goo.gl/EZ7oYjGfPwArN6N96"
  },
  {
    name: "Rupak Dey Sarkar",
    text: "A good number of staff and doctors, but gross mismanagement of queues leading to congestion of both cats and dogs in one single room leading to stress of all animals. Not expected from veterinarians. I am only providing 4 stars as it is centrally accessible and they are doing a lot of low cost benefits",
    link: "https://maps.app.goo.gl/Eh9G1nz7WEz2WG5c9"
  },
  {
    name: "Mitlesh Kumar",
    text: "Best clinic....visited here for very first time and got the best treatment highly recommended for the pet owner's who wants there pets healthy life.... very cooperative staff and doctor's and their behaviour was also good...",
    link: "https://maps.app.goo.gl/MLoJMMmMF83Fb78x9"
  },
  {
    name: "ANANYA BHATTACHARYA",
    text: "My pet got a very good treatment from Dr. Sen and all the staffs behaviour was absolutely amazing! The veterinary clinic is a well known one and I should suggest every pet owner should visit this place",
    link: "https://maps.app.goo.gl/a1tdG5Tbog2Ju1uy7"
  },
  {
    name: "Arzoo Sajjad",
    text: "After my cat doctor directed me to government hospital i landed to them for emergency first of all Dr Samim Hossain perform which my cat famous dr could’nt do and my cat life was saved and today Dr Rupam Bala rushed immediately after my call to the chamber did complete inspection and assured me that the issue is that not big and can be cured along with the help of Mr Imran my cat was treated well … I felt so relief after putting my cat’s life in their hand … finally i got good and prompt doctors for every medical needs and emergencies plus no waiting just a prompt promising treatment…",
    link: "https://maps.app.goo.gl/VNWn4vTK5S3zqix78"
  },
  {
    name: "Nandini Rai",
    text: "Doctors are quite experienced and patiently listens to your pet's problems. Your pets are in safe hands here.",
    link: "https://maps.app.goo.gl/jJYTeZYAEbjAmevN6"
  },
  {
    name: "Rakhi Sahani",
    text: "Very good clinic and they provide the best service my baby has got the treatment from here and he is very much better now...",
    link: "https://maps.app.goo.gl/wJuxouurEktuuB977"
  }
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    if (!isPaused) {
      timeoutRef.current = setInterval(next, 5000);
    }
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [isPaused, currentIndex]);

  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-manrope font-black text-4xl md:text-5xl text-ink-depth tracking-tight">
            See and verify what <span className="text-primary italic">People</span> says about us
          </h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
        </div>

        <div 
          className="relative px-4 md:px-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Buttons */}
          <button 
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass-panel border border-outline-variant/30 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-lg"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          
          <button 
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass-panel border border-outline-variant/30 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-lg"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>

          <div className="overflow-hidden min-h-[400px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="w-full max-w-4xl mx-auto"
              >
                <div className="bg-surface-container-low p-8 md:p-12 rounded-[2.5rem] border border-outline-variant/30 shadow-xl relative">
                  <div className="absolute top-8 right-8 opacity-10">
                    <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-8 flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="material-symbols-outlined text-waiting-gold" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                    
                    <p className="font-inter text-lg md:text-xl text-on-surface-variant leading-relaxed mb-10 italic">
                      "{TESTIMONIALS[currentIndex].text}"
                    </p>
                    
                    <div className="space-y-6">
                      <h4 className="font-manrope font-bold text-2xl text-ink-depth">
                        {TESTIMONIALS[currentIndex].name}
                      </h4>
                      
                      <a 
                        href={TESTIMONIALS[currentIndex].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-inter font-black text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-primary hover:text-white group relative shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-primary/40 active:scale-95"
                      >
                        {/* Glowing effect */}
                        <div className="absolute -inset-1 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        
                        <span className="relative z-10">Verify</span>
                        <span className="material-symbols-outlined text-sm relative z-10 group-hover:translate-x-1 transition-transform">open_in_new</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-12">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  currentIndex === i ? 'w-12 bg-primary' : 'w-2.5 bg-outline-variant/50 hover:bg-outline-variant'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
