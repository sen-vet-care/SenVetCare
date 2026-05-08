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

export const PharmacyPage = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'services'), where('category', '==', 'Pharmacy'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceItem));
        setServices(data);
      } catch (err) {
        console.warn('Error fetching pharmacy items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const groupedServices = services.reduce((acc, curr) => {
    const groupName = curr.group || 'Pharmacy Items';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(curr);
    return acc;
  }, {} as Record<string, ServiceItem[]>);

  const getIconForGroup = (group: string) => {
    const lower = group.toLowerCase();
    if (lower.includes('med') || lower.includes('presc')) return { icon: 'prescriptions', color: 'text-pharmacy-green', bg: 'bg-pharmacy-green/10' };
    if (lower.includes('vacc')) return { icon: 'vaccines', color: 'text-blue-500', bg: 'bg-blue-500/10' };
    if (lower.includes('supp')) return { icon: 'health_metrics', color: 'text-amber-500', bg: 'bg-amber-500/10' };
    if (lower.includes('diet') || lower.includes('food')) return { icon: 'restaurant', color: 'text-orange-500', bg: 'bg-orange-500/10' };
    return { icon: 'medication', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
  };

  return (
    <>
      <Helmet>
        <title>Veterinary Pharmacy in Kolkata | Genuine Pet Medicines & Supplies</title>
        <meta name="description" content="Buy genuine pet medicines, vaccines, supplements & prescription diets from our Kolkata veterinary pharmacy. Trusted, vet-approved & convenient." />
      </Helmet>

      <section id="pharmacy" className="pt-32 pb-20 px-6 max-w-[1280px] mx-auto min-h-screen relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pharmacy-green/10 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="max-w-[1280px] mx-auto relative z-10">
          <header className="mb-20 text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-manrope font-extrabold text-[48px] md:text-[64px] tracking-tight text-white leading-tight mb-6"
            >
              In-House <span className="bg-clip-text text-transparent bg-gradient-to-r from-pharmacy-green to-white">Veterinary Pharmacy.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-inter text-xl text-on-surface-variant font-light max-w-2xl mx-auto leading-relaxed"
            >
              Our fully stocked pharmacy ensures that your pet receives the right medication at the right time—without delays or compromises.
            </motion.p>
          </header>

          {/* What We Offer */}
          <div className="mb-24">
            <h2 className="font-manrope font-bold text-3xl text-white mb-10 text-center">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { icon: 'prescriptions', title: 'Prescription Meds' },
                { icon: 'vaccines', title: 'Cold-Chain Vaccines' },
                { icon: 'health_metrics', title: 'Nutritional Supplements' },
                { icon: 'restaurant', title: 'Prescription Diets' },
                { icon: 'brush', title: 'Grooming & Wellness' }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-surface p-6 rounded-3xl border border-outline-variant/30 flex flex-col items-center text-center hover:bg-white/5 transition-colors"
                >
                  <div className="w-16 h-16 bg-pharmacy-green/10 text-pharmacy-green rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                  </div>
                  <h3 className="font-inter font-bold text-base text-white">{item.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 mb-24">
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
          </div>

          {/* Why Buy From Us */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-manrope font-bold text-4xl text-white mb-8 leading-tight">Why Buy From<br />Our Pharmacy?</h2>
              
              <div className="space-y-8">
                {[
                  { title: "Guaranteed Authenticity", desc: "All medicines are sourced from trusted manufacturers—no risk of counterfeit products." },
                  { title: "Vet-Guided Recommendations", desc: "Every product is prescribed and explained by qualified veterinarians." },
                  { title: "Immediate Availability", desc: "No waiting, no searching—get everything your pet needs instantly after consultation." },
                  { title: "Proper Storage & Handling", desc: "Vaccines and medicines are stored under ideal strict cold-chain conditions to maintain full effectiveness." },
                  { title: "Complete Convenience", desc: "Consultation, diagnosis, and medication—all seamlessly integrated under one roof." }
                ].map((adv, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1">
                      <div className="w-6 h-6 rounded-full bg-pharmacy-green/20 flex items-center justify-center text-pharmacy-green border border-pharmacy-green/30">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-manrope font-bold text-lg text-white mb-1">{adv.title}</h4>
                      <p className="font-inter text-sm text-on-surface-variant leading-relaxed">{adv.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[3rem] overflow-hidden aspect-square md:aspect-[4/3] lg:aspect-square border border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
              <img src="https://ik.imagekit.io/senvetcare/SenVetCare%20Logo.png?updatedAt=1727781358784" alt="SenVetCare Pharmacy" className="w-full h-full object-cover grayscale brightness-50 contrast-125" />
              <div className="absolute bottom-10 left-10 right-10 z-20">
                <blockquote className="font-manrope text-2xl text-white italic leading-snug">
                  "Authentic medication directly influences clinical outcomes. Our pharmacy ensures the highest efficacy."
                </blockquote>
              </div>
            </motion.div>
          </div>

          <div className="bg-surface-container-low border border-pharmacy-green/20 rounded-[3rem] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pharmacy-green/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-waiting-gold/10 rounded-full blur-3xl"></div>
            
            <h3 className="relative z-10 font-manrope font-bold text-3xl text-white mb-6">Need a specific prescription refill?</h3>
            <p className="relative z-10 font-inter text-on-surface-variant mb-10 max-w-lg mx-auto">
              Current patients can quickly schedule a pickup for their ongoing treatments through our automated booking system.
            </p>
            <div className="relative z-10 flex justify-center">
              <Link to="/book" className="px-8 py-4 bg-pharmacy-green text-black rounded-full font-inter font-bold text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(0,200,150,0.3)] flex items-center gap-3">
                 Restock Medicines
                 <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
              </Link>
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
};

