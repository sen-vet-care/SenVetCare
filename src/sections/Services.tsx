import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const SERVICES_DATA = [
  {
    id: 'consultation',
    name: 'Clinical Consultation',
    description: 'Comprehensive physical examination covering vital signs, nutritional assessment, and preventative health screenings.',
    price: 'Rs.600 - Rs.800',
    type: 'Single Service',
    features: ['Detailed history review', 'Vitals check', 'Customized care plan', 'Follow-up scheduling']
  },
  {
    id: 'vaccination',
    name: 'Annual Immunization Shield',
    description: 'Complete vaccination protocols safeguarding against Rabies, Parvovirus, Distemper, and regional endemic threats.',
    price: 'From Rs.1,200',
    type: 'Treatment Package',
    features: ['Multi-valent vaccines', 'Deworming included', 'Digital records update', 'Immunity certification']
  },
  {
    id: 'surgery',
    name: 'Advanced Soft-Tissue Surgery',
    description: 'State-of-the-art surgical interventions performed by senior specialists in our sterile, high-precision operation theater.',
    price: 'Consult for estimate',
    type: 'Advanced Care',
    features: ['Pre-anesthetic screening', 'Continuous vitals monitoring', 'Post-operative pain management', 'Dedicated recovery zone']
  },
  {
    id: 'dental',
    name: 'Ultrasonic Dental Prophylaxis',
    description: 'Premium dental scaling, polishing, and oral health assessment to prevent systemic diseases rooted in periodontal infections.',
    price: 'From Rs.2,500',
    type: 'Treatment Package',
    features: ['Ultrasonic scaling', 'Enamel polishing', 'Gingival health check', 'At-home care kit']
  }
];

const ServiceCard = ({ service, index }: { service: any, index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div 
      ref={cardRef}
      style={{ y, opacity }}
      className="group p-10 bg-surface-container-low rounded-[2rem] border border-outline-variant/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="px-3 py-1 rounded-full bg-surface border border-outline-variant/50 flex items-center gap-2 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          <span className="font-inter font-bold text-[10px] tracking-[0.2em] uppercase text-on-surface-variant group-hover:text-primary transition-colors">
            {service.type}
          </span>
        </div>
        <div className="font-manrope font-semibold text-lg text-ink-depth bg-surface px-4 py-1.5 rounded-full shadow-sm border border-outline-variant/20">
          {service.price}
        </div>
      </div>

      <h3 className="font-manrope font-bold text-3xl text-ink-depth mb-4 tracking-tight group-hover:text-primary transition-colors">
        {service.name}
      </h3>
      
      <p className="font-inter text-on-surface-variant text-base leading-relaxed mb-8 flex-grow">
        {service.description}
      </p>

      <div className="pt-8 border-t border-outline-variant/30">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {service.features.map((feature: string, i: number) => (
            <li key={i} className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[16px] text-primary/70">check_circle</span>
              <span className="font-inter text-sm text-ink-depth font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export const Services = () => {
  return (
    <section id="services" className="py-32 relative bg-surface overflow-hidden">
      {/* Premium Apple-like ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/5 blur-[120px] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <header className="text-center mb-24 max-w-2xl mx-auto">
          <h2 className="font-manrope font-extrabold text-[48px] md:text-[64px] tracking-tight text-ink-depth leading-tight mb-6">
            Clinical <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-waiting-gold">Services.</span>
          </h2>
          <p className="font-inter text-xl text-on-surface-variant font-light leading-relaxed">
            Uncompromising standards of veterinary excellence. Designed to provide your pet with world-class care at every stage of life.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES_DATA.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
