import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const ContactSupport = () => {
  const { scrollYProgress } = useScroll();

  const cardsY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const formY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const [formData, setFormData] = useState({
    // ...
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-[120px] max-w-[1280px] mx-auto px-6 w-full">
      <div className="mb-16 max-w-2xl">
        <h2 className="font-manrope font-black text-[48px] text-ink-depth mb-4">Contact & Support</h2>
        <p className="font-inter text-[18px] text-on-surface-variant">Reach out to our clinical team for inquiries, appointments, or immediate assistance. We are here to help.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Left Side: Contact Info */}
        <motion.div 
          style={{ y: cardsY }}
          className="lg:col-span-5 flex flex-col gap-8"
        >
            <div className="grid grid-cols-1 gap-6">
                {/* Phone */}
                {/* ... */}
                <div className="group p-6 rounded-3xl bg-surface border border-outline-variant/30 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300 shrink-0">
                            <span className="material-symbols-outlined">call</span>
                        </div>
                        <div>
                            <h3 className="font-manrope font-semibold text-[24px] text-ink-depth mb-1">Telephone</h3>
                            <p className="font-inter text-[16px] text-on-surface-variant mb-3">For immediate assistance during clinical hours.</p>
                            <a href="tel:+919871155162" className="font-manrope font-bold text-2xl text-primary hover:text-primary-container transition-colors">+91 98711 55162</a>
                        </div>
                    </div>
                </div>

                {/* WhatsApp */}
                <div className="group p-6 rounded-3xl bg-surface border border-outline-variant/30 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                     <div className="absolute inset-0 bg-pharmacy-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-pharmacy-green group-hover:bg-pharmacy-green group-hover:text-on-primary transition-colors duration-300 shrink-0">
                            <span className="material-symbols-outlined">chat</span>
                        </div>
                        <div>
                            <h3 className="font-manrope font-semibold text-[24px] text-ink-depth mb-1">WhatsApp</h3>
                            <p className="font-inter text-[16px] text-on-surface-variant mb-3">Send us reports, queries, or book appointments instantly.</p>
                            <a href="https://wa.me/message/EOOITVOJLIHNO1" className="inline-flex font-inter font-bold text-[12px] tracking-widest uppercase bg-pharmacy-green text-on-primary px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors items-center gap-2">
                                Message Us Now
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 rounded-3xl bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <h3 className="font-manrope font-semibold text-[24px] text-ink-depth">Location</h3>
                </div>
                <p className="font-inter text-[16px] text-on-surface-variant leading-relaxed">
                    69 Dr Suresh Sarkar Road,<br/>
                    Kolkata - 700014
                </p>
                <p className="font-inter font-bold text-[12px] tracking-widest text-outline mt-3 uppercase tracking-wider">Landmark: Near Entally Post Office</p>
            </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div 
          style={{ y: formY }}
          className="lg:col-span-7 flex flex-col gap-8"
        >
            <div className="p-8 rounded-3xl bg-surface/60 backdrop-blur-md border border-outline-variant/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                <h2 className="font-manrope font-bold text-[32px] text-ink-depth mb-2 relative z-10">Send a Message</h2>
                <p className="font-inter text-[16px] text-on-surface-variant mb-8 relative z-10">Fill out the form below and our reception team will get back to you shortly. You can also reach us directly at contact@senvetcare.com.</p>
                
                {status === 'success' ? (
                  <div className="bg-pharmacy-green/10 border border-pharmacy-green/30 text-pharmacy-green p-8 rounded-2xl text-center relative z-10 animate-fade-in">
                    <span className="material-symbols-outlined text-6xl mb-4 block">check_circle</span>
                    <h3 className="font-manrope font-bold text-2xl mb-2">Message Sent!</h3>
                    <p className="font-inter">Your inquiry has been sent to our clinical team. We will get back to you shortly.</p>
                    <button onClick={() => setStatus('idle')} className="mt-6 text-sm font-bold uppercase tracking-widest text-pharmacy-green hover:underline">Send another message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-inter font-bold text-[12px] tracking-widest text-on-surface-variant mb-2 uppercase" htmlFor="firstName">First Name</label>
                            <input 
                              required
                              type="text" 
                              id="firstName" 
                              placeholder="John" 
                              value={formData.firstName}
                              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                              className="w-full bg-surface border border-outline-variant/50 rounded-2xl px-4 py-3 font-inter text-[16px] text-ink-depth focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block font-inter font-bold text-[12px] tracking-widest text-on-surface-variant mb-2 uppercase" htmlFor="lastName">Last Name</label>
                            <input 
                              required
                              type="text" 
                              id="lastName" 
                              placeholder="Doe" 
                              value={formData.lastName}
                              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                              className="w-full bg-surface border border-outline-variant/50 rounded-2xl px-4 py-3 font-inter text-[16px] text-ink-depth focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none" 
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-inter font-bold text-[12px] tracking-widest text-on-surface-variant mb-2 uppercase" htmlFor="email">Email</label>
                            <input 
                              required
                              type="email" 
                              id="email" 
                              placeholder="john@example.com" 
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full bg-surface border border-outline-variant/50 rounded-2xl px-4 py-3 font-inter text-[16px] text-ink-depth focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block font-inter font-bold text-[12px] tracking-widest text-on-surface-variant mb-2 uppercase" htmlFor="phone">Phone Number</label>
                            <input 
                              required
                              type="tel" 
                              id="phone" 
                              placeholder="+91 00000 00000" 
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full bg-surface border border-outline-variant/50 rounded-2xl px-4 py-3 font-inter text-[16px] text-ink-depth focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block font-inter font-bold text-[12px] tracking-widest text-on-surface-variant mb-2 uppercase" htmlFor="message">Message</label>
                        <textarea 
                          required
                          id="message" 
                          rows={4} 
                          placeholder="How can we help you today?" 
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          className="w-full bg-surface border border-outline-variant/50 rounded-2xl px-4 py-3 font-inter text-[16px] text-ink-depth focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-none"
                        ></textarea>
                    </div>
                    <button 
                      disabled={status === 'loading'}
                      type="submit" 
                      className="w-full bg-primary text-on-primary font-manrope font-semibold text-[18px] py-4 rounded-full hover:bg-primary-container disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 group"
                    >
                        {status === 'loading' ? 'Sending...' : 'Submit Inquiry'}
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
                    </button>
                    {status === 'error' && (
                      <p className="text-error text-center text-sm font-medium">Failed to send inquiry. Please try again or call us.</p>
                    )}
                  </form>
                )}
            </div>
        </motion.div>
      </div>
    </section>
  );
};
