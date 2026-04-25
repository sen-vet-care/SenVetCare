import { motion } from 'motion/react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export const PreventionPage = () => {
  return (
    <>
      <Helmet>
        <title>Pet Vaccination in Kolkata | Dog & Cat Vaccine Cost & Schedule</title>
        <meta name="description" content="Affordable dog & cat vaccination in Kolkata. Check vaccine schedules, costs, deworming & preventive care plans for long-term pet health." />
      </Helmet>
      
      <main className="flex-grow pt-32 pb-20 px-6 max-w-[1280px] mx-auto w-full relative">
        <header className="mb-20 text-center relative z-10 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-manrope font-extrabold text-[48px] md:text-[64px] tracking-tight text-white leading-tight mb-6"
          >
            Prevent Today, <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-waiting-gold to-white">Protect Tomorrow.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-inter text-xl text-on-surface-variant font-light leading-relaxed"
          >
            Preventive care is the foundation of a long and healthy life for your pet. We offer comprehensive vaccination and preventive plans tailored to your companion's specific needs.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
             <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-6">
               <span className="material-symbols-outlined text-3xl">vaccines</span>
             </div>
             <h3 className="font-manrope font-bold text-2xl text-white mb-4">Dog Vaccination</h3>
             <ul className="space-y-3 font-inter text-on-surface-variant flex-grow">
               <li className="flex justify-between border-b border-white/5 pb-2"><span>DHPPi (7-in-1 / 9-in-1)</span> <span className="font-bold text-white text-right">₹700 – ₹1500</span></li>
               <li className="flex justify-between border-b border-white/5 pb-2"><span>Anti-Rabies</span> <span className="font-bold text-white text-right">₹300 – ₹800</span></li>
               <li className="flex justify-between pb-2"><span>Annual Booster Packages</span> <span className="font-bold text-white text-right">₹1500 – ₹3000</span></li>
             </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
             <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
               <span className="material-symbols-outlined text-3xl">pets</span>
             </div>
             <h3 className="font-manrope font-bold text-2xl text-white mb-4">Cat Vaccination</h3>
             <ul className="space-y-3 font-inter text-on-surface-variant flex-grow">
               <li className="flex justify-between border-b border-white/5 pb-2"><span>FVRCP</span> <span className="font-bold text-white text-right">₹700 – ₹1500</span></li>
               <li className="flex justify-between border-b border-white/5 pb-2"><span>Anti-Rabies</span> <span className="font-bold text-white text-right">₹300 – ₹800</span></li>
             </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
             <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
               <span className="material-symbols-outlined text-3xl">medication</span>
             </div>
             <h3 className="font-manrope font-bold text-2xl text-white mb-4">Deworming & Parasites</h3>
             <ul className="space-y-3 font-inter text-on-surface-variant flex-grow">
               <li className="flex justify-between border-b border-white/5 pb-2"><span>Deworming (per dose)</span> <span className="font-bold text-white text-right">₹100 – ₹500</span></li>
               <li className="flex justify-between pb-2"><span>Tick & Flea Prevention</span> <span className="font-bold text-white text-right text-xs">₹300 – ₹1500<br/><span className="text-[10px] font-normal text-on-surface-variant">(depending on product & size)</span></span></li>
             </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
             <div className="w-14 h-14 bg-waiting-gold/10 text-waiting-gold rounded-2xl flex items-center justify-center mb-6">
               <span className="material-symbols-outlined text-3xl">verified_user</span>
             </div>
             <h3 className="font-manrope font-bold text-2xl text-white mb-4">Annual Preventive Plans</h3>
             <p className="font-inter text-on-surface-variant mb-4 flex-grow">Comprehensive annual plans including vaccinations, deworming & basic health checkups for peace of mind.</p>
             <div className="flex justify-between items-center border-t border-white/5 pt-4">
                 <span className="font-inter text-on-surface-variant">Annual Plans Start From</span>
                 <span className="font-bold text-white text-xl">₹2000 – ₹6000</span>
             </div>
          </motion.div>

        </div>

        <div className="mt-16 text-center text-sm text-on-surface-variant italic relative z-10 max-w-2xl mx-auto bg-surface py-6 px-8 rounded-full border border-outline-variant/30">
          * Vaccination plans are also available for rabbits, birds, and other pets upon consultation.
        </div>
        
        <div className="mt-12 flex justify-center">
          <Link to="/dr-lily" className="px-8 py-4 bg-white text-black rounded-full font-inter font-bold text-sm tracking-widest uppercase hover:bg-waiting-gold hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3">
             Book Clinic Appointment
             <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </main>
    </>
  );
};
