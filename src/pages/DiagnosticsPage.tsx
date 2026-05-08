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

export const DiagnosticsPage = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'services'), where('category', '==', 'Lab Tests'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceItem));
        setServices(data);
      } catch (err) {
        console.warn('Error fetching diagnostics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const groupedServices = services.reduce((acc, curr) => {
    const groupName = curr.group || 'Other Diagnostics';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(curr);
    return acc;
  }, {} as Record<string, ServiceItem[]>);

  const getIconForGroup = (group: string) => {
    const lower = group.toLowerCase();
    if (lower.includes('blood')) return { icon: 'bloodtype', color: 'text-red-500', bg: 'bg-red-500/10' };
    if (lower.includes('advanc') || lower.includes('test')) return { icon: 'biotech', color: 'text-purple-500', bg: 'bg-purple-500/10' };
    if (lower.includes('health') || lower.includes('packag')) return { icon: 'health_and_safety', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    if (lower.includes('imag') || lower.includes('radio') || lower.includes('ray')) return { icon: 'radiology', color: 'text-secondary', bg: 'bg-secondary/10' };
    return { icon: 'science', color: 'text-blue-500', bg: 'bg-blue-500/10' };
  };

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
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 opacity-50">science</span>
                <p className="text-on-surface-variant">Diagnostics services are currently being updated by the administration.</p>
             </div>
          )}
        </div>

        <div className="mt-16 text-center text-sm text-error bg-error/10 py-6 px-8 rounded-full border border-error/30 italic relative z-10 max-w-3xl mx-auto shadow-lg shadow-error/10">
          Prices are indicative and may vary depending on species, breed, condition, and clinical requirements.
        </div>
        
        <div className="mt-12 flex justify-center">
          <Link to="/book" className="px-8 py-4 bg-white text-black rounded-full font-inter font-bold text-sm tracking-widest uppercase hover:bg-waiting-gold hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3">
             Book Clinic Appointment
             <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </section>
    </>
  );
};
