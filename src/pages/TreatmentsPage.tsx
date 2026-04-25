import { motion } from 'motion/react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export const TreatmentsPage = () => {
  return (
    <>
      <Helmet>
        <title>Veterinary Treatments & Surgery in Kolkata | Advanced Pet Care Clinic</title>
        <meta name="description" content="Expert veterinary treatments in Kolkata including OPD consultation, surgery, dental, orthopedic & emergency care. Affordable pricing with advanced facilities." />
      </Helmet>
      
      <main className="flex-grow pt-32 pb-20 px-6 max-w-[1280px] mx-auto w-full relative">
        <header className="mb-20 text-center relative z-10 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-manrope font-extrabold text-[48px] md:text-[64px] tracking-tight text-white leading-tight mb-6"
          >
            Comprehensive <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-waiting-gold to-white">Veterinary Care.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-inter text-xl text-on-surface-variant font-light leading-relaxed"
          >
            At our clinic, we provide advanced medical and surgical care tailored to your pet’s needs. Our facility is equipped to handle everything from routine consultations to complex procedures with precision and compassion.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
             <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-6">
               <span className="material-symbols-outlined text-3xl">stethoscope</span>
             </div>
             <h3 className="font-manrope font-bold text-2xl text-white mb-4">Consultations</h3>
             <ul className="space-y-3 font-inter text-on-surface-variant flex-grow">
               <li className="flex justify-between border-b border-white/5 pb-2"><span>General OPD</span> <span className="font-bold text-white text-right">₹300 – ₹800</span></li>
               <li className="flex justify-between border-b border-white/5 pb-2"><span>Specialist</span> <span className="font-bold text-white text-right">₹800 – ₹1500</span></li>
               <li className="flex justify-between pb-2"><span>Follow-up Visits</span> <span className="font-bold text-white text-right">₹200 – ₹500</span></li>
             </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
             <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
               <span className="material-symbols-outlined text-3xl">health_metrics</span>
             </div>
             <h3 className="font-manrope font-bold text-2xl text-white mb-4">Preventive & Wellness</h3>
             <ul className="space-y-3 font-inter text-on-surface-variant flex-grow">
               <li className="flex justify-between border-b border-white/5 pb-2"><span>Routine Health Check-ups</span> <span className="font-bold text-white text-right">₹500 – ₹1500</span></li>
               <li className="flex justify-between pb-2"><span>Senior Pet Screening</span> <span className="font-bold text-white text-right">₹1500 – ₹4000</span></li>
             </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-surface p-8 rounded-[2rem] border border-error/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-error"></div>
             <div className="w-14 h-14 bg-error/10 text-error rounded-2xl flex items-center justify-center mb-6">
               <span className="material-symbols-outlined text-3xl">emergency</span>
             </div>
             <h3 className="font-manrope font-bold text-2xl text-white mb-4">Emergency & Critical</h3>
             <ul className="space-y-3 font-inter text-on-surface-variant flex-grow">
               <li className="flex justify-between border-b border-white/5 pb-2"><span>Emergency Consultation</span> <span className="font-bold text-white text-right">₹1000 – ₹3000</span></li>
               <li className="flex justify-between pb-2"><span>ICU / Monitoring (per day)</span> <span className="font-bold text-white text-right">₹2000 – ₹8000</span></li>
             </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
             <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
               <span className="material-symbols-outlined text-3xl">content_cut</span>
             </div>
             <h3 className="font-manrope font-bold text-2xl text-white mb-4">Surgical Procedures</h3>
             <ul className="space-y-3 font-inter text-on-surface-variant flex-grow">
               <li className="flex justify-between border-b border-white/5 pb-2"><span>Spay/Neuter</span> <span className="font-bold text-white text-right">₹4000 – ₹15000</span></li>
               <li className="flex justify-between border-b border-white/5 pb-2"><span>Tumor Removal</span> <span className="font-bold text-white text-right">₹5000 – ₹25000+</span></li>
               <li className="flex justify-between pb-2"><span>Wound Management</span> <span className="font-bold text-white text-right">₹1500 – ₹8000</span></li>
             </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
             <div className="w-14 h-14 bg-waiting-gold/10 text-waiting-gold rounded-2xl flex items-center justify-center mb-6">
               <span className="material-symbols-outlined text-3xl">bone</span>
             </div>
             <h3 className="font-manrope font-bold text-2xl text-white mb-4">Orthopedic Care</h3>
             <ul className="space-y-3 font-inter text-on-surface-variant flex-grow">
               <li className="flex justify-between border-b border-white/5 pb-2"><span>Fracture Repair</span> <span className="font-bold text-white text-right">₹10000 – ₹50000+</span></li>
               <li className="flex justify-between pb-2"><span>Ligament Surgeries</span> <span className="font-bold text-white text-right">₹15000 – ₹60000+</span></li>
             </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
             <div className="w-14 h-14 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
               <span className="material-symbols-outlined text-3xl">dentistry</span>
             </div>
             <h3 className="font-manrope font-bold text-2xl text-white mb-4">Dental Care</h3>
             <ul className="space-y-3 font-inter text-on-surface-variant flex-grow">
               <li className="flex justify-between border-b border-white/5 pb-2"><span>Scaling & Polishing</span> <span className="font-bold text-white text-right">₹2000 – ₹6000</span></li>
               <li className="flex justify-between pb-2"><span>Tooth Extraction (per tooth)</span> <span className="font-bold text-white text-right">₹500 – ₹3000</span></li>
             </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500 md:col-span-2">
             <div className="w-14 h-14 bg-teal-500/10 text-teal-500 rounded-2xl flex items-center justify-center mb-6">
               <span className="material-symbols-outlined text-3xl">medical_services</span>
             </div>
             <h3 className="font-manrope font-bold text-2xl text-white mb-4">Specialized Treatments & Chronic Disease Management</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 font-inter text-on-surface-variant">
               <div className="flex justify-between border-b border-white/5 pb-2"><span>Dermatology (Skin Care)</span> <span className="font-bold text-white text-right">₹500 – ₹3000</span></div>
               <div className="flex justify-between border-b border-white/5 pb-2"><span>Ophthalmology (Eye Care)</span> <span className="font-bold text-white text-right">₹800 – ₹3000</span></div>
               <div className="flex justify-between border-b border-white/5 pb-2"><span>Cardiology Consultation</span> <span className="font-bold text-white text-right">₹1500 – ₹4000</span></div>
               <div className="flex justify-between border-b border-white/5 pb-2"><span>Oncology (Cancer Care)</span> <span className="font-bold text-white text-right">₹5000 – ₹50000+</span></div>
               <div className="flex justify-between border-b border-white/5 pb-2"><span>Physiotherapy (per session)</span> <span className="font-bold text-white text-right">₹500 – ₹2500</span></div>
               <div className="flex justify-between border-b border-white/5 pb-2"><span>Kidney, Liver, Diabetes Care</span> <span className="font-bold text-white text-right">₹1000 – ₹5000</span></div>
             </div>
          </motion.div>

        </div>

        <div className="mt-16 text-center text-sm text-on-surface-variant italic relative z-10 max-w-2xl mx-auto bg-surface py-6 px-8 rounded-full border border-outline-variant/30">
          * All procedure costs vary depending on the condition, severity, and individual patient requirements.
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
