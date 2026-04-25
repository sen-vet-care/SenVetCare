import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const [formData, setFormData] = useState({
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
    <footer className="w-full pt-32 pb-12 bg-black border-t border-white/5 relative z-20 overflow-hidden font-inter">
      {/* Refined Ambient Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/5 rounded-full blur-[120px] -z-10 opacity-50"></div>

      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32 mb-32">
          
          {/* Identity & Mission */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link to="/" className="w-24 h-24 mb-8 block drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              <img src="https://ik.imagekit.io/senvetcare/Logo/Logo%20Trans.webp" alt="SenVetCare Logo" className="w-full h-full object-contain" />
            </Link>
            <h3 className="font-manrope font-extrabold text-4xl text-white mb-6 tracking-tighter">SenVetCare</h3>
            <p className="text-zinc-400 text-[15px] leading-relaxed max-w-sm mb-10 font-inter">
              An institution dedicated to the legacy of Prof. Dr. Tamal Baran Sen. We bridge empirical wisdom with modern veterinary science to deliver uncompromising care.
            </p>
          </div>

          {/* Contact Integration - Premium Sleek Form */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
              <div className="space-y-12">
                <div>
                  <h4 className="text-[10px] font-black tracking-[0.25em] text-primary uppercase mb-8">Clinical HQ</h4>
                  <div className="space-y-8">
                    <div className="group cursor-default">
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-zinc-300 transition-colors">Coordinates</p>
                      <p className="text-white text-sm font-medium leading-relaxed">69 Dr Suresh Sarkar Road, Entally-14<br/>Kolkata, West Bengal</p>
                    </div>
                    <div className="group cursor-default">
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-zinc-300 transition-colors">Direct Line</p>
                      <a href="tel:+919871155162" className="text-white text-lg font-bold hover:text-primary transition-colors tracking-tight">+91 98711 55162</a>
                    </div>
                    <div className="group cursor-default">
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-zinc-300 transition-colors">WhatsApp 24/7</p>
                      <a href="https://wa.me/message/EOOITVOJLIHNO1" className="text-emerald-500 text-sm font-bold hover:brightness-125 transition-all flex items-center gap-2">
                        Message Dispatch
                        <span className="material-symbols-outlined text-sm">north_east</span>
                      </a>
                    </div>
                    <div className="group cursor-default">
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-zinc-300 transition-colors">Clinical Liaison</p>
                      <a href="mailto:contact@senvetcare.com" className="text-white text-sm font-medium hover:text-primary transition-colors">contact@senvetcare.com</a>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black tracking-[0.25em] text-zinc-600 uppercase mb-8">Navigation</h4>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <Link to="/treatments" className="text-zinc-500 text-xs hover:text-white transition-colors">Treatments</Link>
                    <Link to="/preventions" className="text-zinc-500 text-xs hover:text-white transition-colors">Preventions</Link>
                    <Link to="/diagnostics" className="text-zinc-500 text-xs hover:text-white transition-colors">Diagnostics</Link>
                    <Link to="/pharmacy" className="text-zinc-500 text-xs hover:text-white transition-colors">Pharmacy</Link>
                    <Link to="/stories" className="text-zinc-500 text-xs hover:text-white transition-colors">Stories</Link>
                    <Link to="/dr-lily" className="text-zinc-500 text-xs hover:text-white transition-colors">Instant Consultation</Link>
                    <Link to="/privacy-policy" className="text-zinc-500 text-xs hover:text-white transition-colors">Privacy Policy</Link>
                    <Link to="/pet-safety-guide" className="text-zinc-500 text-xs hover:text-white transition-colors">Pet Safety Guide</Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <h4 className="text-[10px] font-black tracking-[0.25em] text-zinc-600 uppercase mb-8">Inquiry Dispatch</h4>
                {status === 'success' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-zinc-900/30 rounded-3xl border border-white/5">
                    <span className="material-symbols-outlined text-emerald-500 text-4xl mb-4">verified</span>
                    <p className="text-white text-sm font-bold uppercase tracking-widest mb-2">Message Dispatched</p>
                    <p className="text-zinc-500 text-xs">A clinical agent will contact you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="relative group">
                      <input 
                        required
                        type="text" 
                        placeholder="NAME"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full bg-transparent border-b border-zinc-800 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="relative group">
                      <input 
                        required
                        type="email" 
                        placeholder="EMAIL"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-transparent border-b border-zinc-800 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="relative group">
                      <textarea 
                        required
                        placeholder="MESSAGE"
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-transparent border-b border-zinc-800 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary transition-colors resize-none"
                      ></textarea>
                    </div>
                    <button 
                      disabled={status === 'loading'}
                      className="w-full py-5 border border-zinc-800 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-white hover:border-white transition-all duration-500 disabled:opacity-30 active:scale-[0.98]"
                    >
                      {status === 'loading' ? 'Encrypting...' : 'Initiate Dispatch'}
                    </button>
                    {status === 'error' && <p className="text-[10px] text-red-500 font-bold uppercase text-center mt-4">System Link Failed</p>}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Credits Line */}
        <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">© {new Date().getFullYear()} SEN-MEMORIAL-UNIT</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
            <Link to="/portal-login" className="text-[10px] font-bold text-zinc-600 hover:text-primary transition-colors uppercase tracking-[0.2em]">Protocol Login</Link>
          </div>
          
          <div className="flex items-center gap-8">
            <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-[0.25em]">
              Curated by <span className="text-zinc-400 text-xs italic font-serif lowercase tracking-normal">Lily AI Unit</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

