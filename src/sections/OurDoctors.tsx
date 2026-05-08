import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doc, idx }: { doc: any, idx: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const navigate = useNavigate();

  return (
    <motion.div 
      ref={cardRef}
      style={{ y, opacity }}
      key={idx} 
      onClick={() => navigate('/book')}
      className="group relative bg-surface rounded-3xl overflow-hidden border border-outline-variant/30 hover:border-primary/50 hover:shadow-lg transition-all duration-500 ease-in-out flex flex-col cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden bg-surface-container">
          {doc.image_url ? (
            <img loading="lazy" decoding="async" src={doc.image_url} alt={doc.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-105" />
          ) : (
            <div className="w-full h-full bg-surface-container-high flex justify-center items-center">
              <span className="material-symbols-outlined text-[48px] text-outline-variant">person</span>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-outline-variant">
              <span className={`w-2 h-2 rounded-full ${doc.isPresent ? 'bg-emerald-500' : 'bg-zinc-400'}`}></span>
              <span className="font-inter font-bold text-[10px] tracking-widest text-ink-depth">{doc.isPresent ? 'Available' : 'Unavailable'}</span>
          </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
          <div className="mb-4">
              <h3 className="font-manrope font-extrabold text-[22px] text-ink-depth leading-tight mb-1.5 group-hover:text-primary transition-colors">{doc.name}</h3>
              <p className="font-inter font-bold text-primary tracking-widest uppercase text-[10px] mb-1">{doc.primary_specialty || doc.specialty}</p>
              {doc.title && <p className="font-inter font-bold text-on-surface-variant tracking-widest uppercase text-[10px] mb-1">{doc.title}</p>}
              {doc.qualifications && <p className="font-inter font-semibold text-outline text-[12px]">{doc.qualifications}</p>}
          </div>
          <div className="w-6 h-1 bg-gradient-to-r from-primary to-transparent mb-4 opacity-30 group-hover:w-full group-hover:opacity-100 transition-all duration-500 ease-out"></div>
          <p className="font-inter text-on-surface-variant text-[13px] leading-relaxed mb-6 flex-grow line-clamp-3">
              {doc.bio || doc.description || doc.desc}
          </p>
          <div className="flex items-center gap-2 text-primary font-manrope font-bold text-[12px] uppercase tracking-widest mt-auto group-hover:tracking-widest transition-all duration-300">
              <span>Book</span>
              <span className="material-symbols-outlined text-[16px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
      </div>
    </motion.div>
  );
};

export const OurDoctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDoctors(data || []);
      } catch (err) {
        console.warn("Error fetching doctors collection:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);



  return (
    <section className="py-[120px] px-6 max-w-[1280px] mx-auto w-full overflow-hidden">
      <div className="mb-16">
        <h2 className="font-manrope font-black text-[48px] tracking-tight text-ink-depth mb-4">Doctor Schedule <span className="text-on-surface-variant font-medium text-[24px] tracking-normal">(Tentative)</span></h2>
        <p className="font-inter text-[18px] text-on-surface-variant max-w-2xl mb-10">
          Meet the dedicated team providing immersive clinical excellence. Check our weekly roster to plan your visit or walk-in consultation.
        </p>

        {/* Team Photo Banner */}
        <div className="w-full bg-surface-container rounded-3xl overflow-hidden relative group shadow-2xl mb-16 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none"></div>
            <img 
                loading="lazy"
                decoding="async"
                src="https://ik.imagekit.io/senvetcare/Logo/Team%20SenVetCare.webp" 
                alt="SenVetCare Team" 
                className="w-full h-auto max-h-[600px] object-contain transition-all duration-1000 transform scale-95 group-hover:scale-100"
            />
            <div className="absolute bottom-6 left-6 z-20 sanctuary-card px-6 py-3 rounded-full inline-flex items-center gap-3 backdrop-blur-md">
                <span className="material-symbols-outlined text-waiting-gold text-[24px]">groups</span>
                <span className="text-white font-manrope font-bold tracking-widest uppercase text-sm">The Collective of Care</span>
            </div>
        </div>

        {/* Doctors Grid (From Supabase) */}
        {!loading && doctors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-20">
            {doctors.map((doc, idx) => (
              <DoctorCard key={idx} doc={doc} idx={idx} />
            ))}
          </div>
        )}

        {/* Schedule Interface */}
        <div className="bg-surface border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 bg-surface-container-low border-b border-outline-variant/30">
             <h3 className="font-manrope font-bold text-2xl text-ink-depth">Current Schedule & Availability</h3>
          </div>
          <div className="p-0 sm:p-6 bg-surface">
            <div className="grid grid-cols-1 divide-y divide-outline-variant/30 border border-outline-variant/30 sm:rounded-2xl overflow-hidden">
               <div className="hidden sm:grid sm:grid-cols-12 bg-surface-container-low p-4 text-xs font-bold font-inter tracking-widest uppercase text-on-surface-variant">
                  <div className="col-span-3">Doctor Name</div>
                  <div className="col-span-3">Specialty</div>
                  <div className="col-span-2">Days</div>
                  <div className="col-span-2">Timings</div>
                  <div className="col-span-2 text-right">Status</div>
               </div>
               {!loading && doctors.length > 0 ? doctors.map((doctor, idx) => (
                  <div key={idx} className="sm:grid sm:grid-cols-12 p-4 sm:items-center hover:bg-surface-container-low/50 transition-colors bg-white">
                     <div className="col-span-3 mb-2 sm:mb-0 font-manrope font-bold text-ink-depth text-[16px]">
                        {doctor.name}
                     </div>
                     <div className="col-span-3 mb-2 sm:mb-0 font-inter text-on-surface-variant text-[15px]">
                        {doctor.primary_specialty || doctor.specialty}
                     </div>
                     <div className="col-span-2 mb-2 sm:mb-0 font-inter text-on-surface-variant font-medium text-[15px]">
                        {doctor.days || "Contact Clinic"}
                     </div>
                     <div className="col-span-2 mb-2 sm:mb-0 font-inter text-on-surface-variant text-[15px] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px] opacity-70">nest_clock_farsight_analog</span>
                        {doctor.timings || "Contact Clinic"}
                     </div>
                     <div className="col-span-2 flex sm:justify-end">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${doctor.isPresent ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
                           <span className={`w-1.5 h-1.5 rounded-full ${doctor.isPresent ? 'bg-emerald-500' : 'bg-zinc-400'}`}></span>
                           {doctor.isPresent ? 'Available' : 'Unavailable'}
                        </span>
                     </div>
                  </div>
               )) : (
                  <div className="p-8 text-center text-on-surface-variant bg-white">No schedule data available.</div>
               )}
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-surface-container-low border-t border-outline-variant/30 text-sm text-on-surface-variant font-inter flex gap-2 items-start">
            <span className="material-symbols-outlined text-[18px] text-waiting-gold shrink-0">info</span>
            <p><strong>Note:</strong> This schedule reflects current availability. We still recommend calling ahead to confirm your preferred doctor's presence.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
