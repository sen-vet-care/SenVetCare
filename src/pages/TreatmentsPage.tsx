import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  rate: string | number;
  unit: string;
  category: string;
  group?: string;
}

export const TreatmentsPage = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'services'), where('category', '==', 'Treatments'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceItem));
        setServices(data);
      } catch (err) {
        console.warn('Error fetching treatments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Group services by 'group' field
  const groupedServices = services.reduce((acc, curr) => {
    const groupName = curr.group || 'Other Treatments';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(curr);
    return acc;
  }, {} as Record<string, ServiceItem[]>);

  const getIconForGroup = (group: string) => {
    const lower = group.toLowerCase();
    if (lower.includes('consult')) return { icon: 'stethoscope', color: 'text-secondary', bg: 'bg-secondary/10' };
    if (lower.includes('prevent') || lower.includes('well')) return { icon: 'health_metrics', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    if (lower.includes('emerg') || lower.includes('critic')) return { icon: 'emergency', color: 'text-error', bg: 'bg-error/10' };
    if (lower.includes('surg')) return { icon: 'content_cut', color: 'text-blue-500', bg: 'bg-blue-500/10' };
    if (lower.includes('ortho')) return { icon: 'bone', color: 'text-waiting-gold', bg: 'bg-waiting-gold/10' };
    if (lower.includes('dent')) return { icon: 'dentistry', color: 'text-purple-500', bg: 'bg-purple-500/10' };
    return { icon: 'medical_services', color: 'text-teal-500', bg: 'bg-teal-500/10' };
  };

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
          {!loading && Object.entries(groupedServices).map(([groupName, items], idx) => {
             const style = getIconForGroup(groupName);
             return (
              <motion.div key={groupName} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (idx * 0.1) }} className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                <div className={`w-14 h-14 ${style.bg} ${style.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <span className="material-symbols-outlined text-3xl">{style.icon}</span>
                </div>
                <h3 className="font-manrope font-bold text-2xl text-white mb-4">{groupName}</h3>
                <ul className="space-y-3 font-inter text-on-surface-variant flex-grow">
                  {items.map((item, idxx) => (
                    <li key={item.id} className={`flex justify-between ${idxx !== items.length - 1 ? 'border-b border-white/5 pb-2' : 'pb-2'}`}>
                      <div className="flex flex-col">
                         <span>{item.name}</span>
                         {item.description && <span className="text-[10px] text-on-surface-variant mt-0.5">{item.description}</span>}
                      </div>
                      <span className="font-bold text-white text-right shrink-0 ml-4">₹{item.rate} <span className="text-[10px] font-normal text-on-surface-variant block md:inline">{item.unit}</span></span>
                    </li>
                  ))}
                </ul>
              </motion.div>
             )
          })}
          {!loading && Object.keys(groupedServices).length === 0 && (
             <div className="col-span-1 md:col-span-2 text-center py-12 bg-surface rounded-[2rem] border border-outline-variant/30">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 opacity-50">medical_services</span>
                <p className="text-on-surface-variant">Treatment services are currently being updated by the administration.</p>
             </div>
          )}
        </div>

        <div className="mt-16 text-center text-sm text-on-surface-variant italic relative z-10 max-w-2xl mx-auto bg-surface py-6 px-8 rounded-full border border-outline-variant/30">
          * All procedure costs vary depending on the condition, severity, and individual patient requirements.
        </div>
        
        <div className="mt-12 flex justify-center">
          <Link to="/book" className="px-8 py-4 bg-white text-black rounded-full font-inter font-bold text-sm tracking-widest uppercase hover:bg-waiting-gold hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3">
             Book Clinic Appointment
             <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </main>
    </>
  );
};
