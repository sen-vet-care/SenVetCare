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

export const PreventionPage = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'services'), where('category', '==', 'Preventions'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceItem));
        setServices(data);
      } catch (err) {
        console.warn('Error fetching preventions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const groupedServices = services.reduce((acc, curr) => {
    const groupName = curr.group || 'Other Preventions';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(curr);
    return acc;
  }, {} as Record<string, ServiceItem[]>);

  const getIconForGroup = (group: string) => {
    const lower = group.toLowerCase();
    if (lower.includes('dog') || lower.includes('canine')) return { icon: 'vaccines', color: 'text-secondary', bg: 'bg-secondary/10' };
    if (lower.includes('cat') || lower.includes('feline')) return { icon: 'pets', color: 'text-primary', bg: 'bg-primary/10' };
    if (lower.includes('deworm') || lower.includes('parasit')) return { icon: 'medication', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    if (lower.includes('plan') || lower.includes('annual')) return { icon: 'verified_user', color: 'text-waiting-gold', bg: 'bg-waiting-gold/10' };
    return { icon: 'health_and_safety', color: 'text-blue-500', bg: 'bg-blue-500/10' };
  };

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
                      <span className="font-bold text-white text-right">₹{item.rate} <span className="text-[10px] font-normal text-on-surface-variant">{item.unit}</span></span>
                    </li>
                  ))}
                </ul>
              </motion.div>
             )
          })}
          {!loading && Object.keys(groupedServices).length === 0 && (
             <div className="col-span-1 md:col-span-2 text-center py-12 bg-surface rounded-[2rem] border border-outline-variant/30">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 opacity-50">health_and_safety</span>
                <p className="text-on-surface-variant">Preventive services are currently being updated by the administration.</p>
             </div>
          )}
        </div>

        <div className="mt-16 text-center text-sm text-on-surface-variant italic relative z-10 max-w-2xl mx-auto bg-surface py-6 px-8 rounded-full border border-outline-variant/30">
          * Vaccination plans are also available for rabbits, birds, and other pets upon consultation.
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
