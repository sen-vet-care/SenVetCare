import { motion } from 'motion/react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export const DiagnosticsPage = () => {
  return (
    <>
      <Helmet>
        <title>Pet Lab Tests & Diagnostics in Kolkata | Blood Test, X-Ray, USG</title>
        <meta name="description" content="Accurate pet diagnostics in Kolkata – blood tests, health packages, X-ray, ultrasound, ECG & more. Reliable reports for better treatment decisions." />
      </Helmet>
      
      <section id="diagnostics" className="pt-32 pb-20 px-6 max-w-[1280px] mx-auto w-full relative">
        {/* Background Effect */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none"></div>

        <header className="mb-20 text-center relative z-10 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-manrope font-extrabold text-[48px] md:text-[64px] tracking-tight text-white leading-tight mb-6"
          >
            Accurate Diagnosis, <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-waiting-gold to-white">Better Treatment.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-inter text-xl text-on-surface-variant font-light leading-relaxed"
          >
            We offer a full range of diagnostic services to ensure timely and precise treatment decisions. Our state-of-the-art facilities analyze critical health markers with exceptional speed.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-8">
            <div className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 hover:shadow-xl transition-all duration-500">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center">
                   <span className="material-symbols-outlined text-2xl">bloodtype</span>
                 </div>
                 <h3 className="font-manrope font-bold text-2xl text-white">Blood Tests & Profiles</h3>
               </div>
               <ul className="space-y-3 font-inter text-on-surface-variant">
                 <li className="flex justify-between border-b border-white/5 pb-2"><span>Complete Blood Count (CBC)</span> <span className="font-bold text-white">₹300 – ₹800</span></li>
                 <li className="flex justify-between border-b border-white/5 pb-2"><span>Liver Function Test (LFT)</span> <span className="font-bold text-white">₹800 – ₹2000</span></li>
                 <li className="flex justify-between border-b border-white/5 pb-2"><span>Kidney Function Test (KFT)</span> <span className="font-bold text-white">₹800 – ₹2000</span></li>
                 <li className="flex justify-between border-b border-white/5 pb-2"><span>Thyroid Profile</span> <span className="font-bold text-white">₹1500 – ₹3500</span></li>
                 <li className="flex justify-between pb-2"><span>Blood Parasite Tests</span> <span className="font-bold text-white">₹500 – ₹1500</span></li>
               </ul>
            </div>

            <div className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 hover:shadow-xl transition-all duration-500">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center">
                   <span className="material-symbols-outlined text-2xl">biotech</span>
                 </div>
                 <h3 className="font-manrope font-bold text-2xl text-white">Advanced Testing</h3>
               </div>
               <ul className="space-y-3 font-inter text-on-surface-variant">
                 <li className="flex justify-between border-b border-white/5 pb-2"><span>PCR / ELISA Tests</span> <span className="font-bold text-white">₹1500 – ₹5000</span></li>
                 <li className="flex justify-between pb-2"><span>Allergy Testing</span> <span className="font-bold text-white">₹3000 – ₹8000</span></li>
               </ul>
            </div>
            
            <div className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 hover:shadow-xl transition-all duration-500">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                   <span className="material-symbols-outlined text-2xl">health_and_safety</span>
                 </div>
                 <h3 className="font-manrope font-bold text-2xl text-white">Health Packages</h3>
               </div>
               <ul className="space-y-3 font-inter text-on-surface-variant">
                 <li className="flex justify-between border-b border-white/5 pb-2"><span>Basic Wellness Panel</span> <span className="font-bold text-white">₹1500 – ₹3000</span></li>
                 <li className="flex justify-between border-b border-white/5 pb-2"><span>Adult Health Package</span> <span className="font-bold text-white">₹3000 – ₹6000</span></li>
                 <li className="flex justify-between pb-2"><span>Senior Pet Panel</span> <span className="font-bold text-white">₹5000 – ₹10000</span></li>
               </ul>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-8">
            <div className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 hover:shadow-xl transition-all duration-500">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                   <span className="material-symbols-outlined text-2xl">radiology</span>
                 </div>
                 <h3 className="font-manrope font-bold text-2xl text-white">Imaging & Radiology</h3>
               </div>
               <ul className="space-y-3 font-inter text-on-surface-variant">
                 <li className="flex justify-between border-b border-white/5 pb-2"><span>X-Ray</span> <span className="font-bold text-white">₹500 – ₹1500</span></li>
                 <li className="flex justify-between border-b border-white/5 pb-2"><span>Ultrasonography (USG)</span> <span className="font-bold text-white">₹1000 – ₹3000</span></li>
                 <li className="flex justify-between border-b border-white/5 pb-2"><span>Echocardiography (ECHO)</span> <span className="font-bold text-white">₹2500 – ₹5000</span></li>
                 <li className="flex justify-between pb-2"><span>ECG</span> <span className="font-bold text-white">₹500 – ₹1500</span></li>
               </ul>
            </div>

            <div className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 hover:shadow-xl transition-all duration-500">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                   <span className="material-symbols-outlined text-2xl">science</span>
                 </div>
                 <h3 className="font-manrope font-bold text-2xl text-white">Other Diagnostics</h3>
               </div>
               <ul className="space-y-3 font-inter text-on-surface-variant">
                 <li className="flex justify-between border-b border-white/5 pb-2"><span>Urine Analysis</span> <span className="font-bold text-white">₹300 – ₹800</span></li>
                 <li className="flex justify-between border-b border-white/5 pb-2"><span>Stool Examination</span> <span className="font-bold text-white">₹300 – ₹800</span></li>
                 <li className="flex justify-between border-b border-white/5 pb-2"><span>Cytology / Biopsy</span> <span className="font-bold text-white">₹1500 – ₹5000</span></li>
                 <li className="flex justify-between pb-2"><span>Culture & Sensitivity</span> <span className="font-bold text-white">₹1500 – ₹4000</span></li>
               </ul>
            </div>
          </motion.div>

        </div>

        <div className="mt-16 text-center text-sm text-error bg-error/10 py-6 px-8 rounded-full border border-error/30 italic relative z-10 max-w-3xl mx-auto shadow-lg shadow-error/10">
          Prices are indicative and may vary depending on species, breed, condition, and clinical requirements.
        </div>
        
        <div className="mt-12 flex justify-center">
          <Link to="/dr-lily" className="px-8 py-4 bg-white text-black rounded-full font-inter font-bold text-sm tracking-widest uppercase hover:bg-waiting-gold hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3">
             Book Clinic Appointment
             <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </section>
    </>
  );
};
