import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const BookingPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isEmergency = searchParams.get('emergency') === 'true';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    petDetails: '',
    date: '',
    time: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call and email trigger
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <main className="flex-grow pt-24 pb-20 px-4 md:px-8 max-w-[800px] mx-auto w-full relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sanctuary-card rounded-[2rem] p-8 md:p-12 relative overflow-hidden"
      >
        {isEmergency && (
          <div className="absolute top-0 left-0 w-full bg-error/10 border-b border-error/30 p-4 text-center">
            <span className="text-error font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
              Emergency Processing
            </span>
          </div>
        )}

        <div className={`mt-${isEmergency ? '12' : '0'} mb-10 text-center`}>
          <h1 className="font-manrope font-extrabold text-[32px] md:text-[40px] text-white tracking-tight mb-4">
            {isEmergency ? 'Emergency Reception' : 'Book Clinic Appointment'}
          </h1>
          <p className="text-on-surface-variant text-sm max-w-lg mx-auto">
            {isEmergency 
              ? 'Please submit your details for immediate queue placement. A primary clinical agent will be notified instantly.' 
              : 'Select your preferred time slot to consult our veterinary specialists.'}
          </p>
        </div>

        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-10"
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] ${isEmergency ? 'bg-error text-white shadow-[0_0_30px_rgba(255,0,0,0.2)]' : 'bg-primary text-white shadow-[0_0_30px_rgba(212,175,55,0.2)]'}`}>
              <span className="material-symbols-outlined text-[40px]">
                {isEmergency ? 'warning' : 'check_circle'}
              </span>
            </div>
            <h2 className="font-manrope font-bold text-2xl text-white mb-4 tracking-tight">Request Dispatched</h2>
            <p className="text-on-surface-variant mb-8 max-w-sm text-sm">
              An email confirmation has been triggered. Our dispatch team is reviewing your details.
            </p>

            {isEmergency && (
              <div className="bg-error/10 border border-error/30 rounded-2xl p-6 w-full mb-8">
                <h3 className="text-error font-bold tracking-widest uppercase text-xs mb-2">Critical Action Required</h3>
                <p className="text-white text-sm mb-4">As this is marked as an emergency, please establish direct voice contact with the triage desk immediately.</p>
                <a href="tel:+919871155162" className="inline-flex w-full justify-center bg-error text-white font-bold tracking-widest uppercase text-xs py-4 rounded-full hover:bg-red-600 transition-colors shadow-lg shadow-error/20">
                  Call Now : +91 98711 55162
                </a>
              </div>
            )}

            <Link to="/" className="text-on-surface-variant hover:text-white transition-colors text-xs font-bold uppercase tracking-widest underline decoration-white/20 underline-offset-4">
              Return to Reception
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant">Owner Name <span className="text-error">*</span></label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary shadow-inner"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant">Phone Number <span className="text-error">*</span></label>
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary shadow-inner"
                  placeholder="+91"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant">Email Address <span className="text-error">*</span></label>
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-surface-container border border-outline-variant rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary shadow-inner"
                placeholder="john@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant">Date</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant">Preferred Time</label>
                <select 
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary shadow-inner appearance-none"
                >
                  <option value="">Select Time Slot</option>
                  <option value="morning">Morning (10 AM - 1 PM)</option>
                  <option value="afternoon">Afternoon (2 PM - 5 PM)</option>
                  <option value="evening">Evening (6 PM - 8 PM)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant">Patient Details & Symptoms</label>
              <textarea 
                rows={3}
                value={formData.petDetails}
                onChange={(e) => setFormData({...formData, petDetails: e.target.value})}
                className="w-full bg-surface-container border border-outline-variant rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary shadow-inner resize-none"
                placeholder="Species, Breed, Age, and reason for visit..."
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={status === 'loading'}
              className={`w-full py-4 rounded-full font-inter font-bold text-sm tracking-widest uppercase transition-all duration-300 flex justify-center items-center gap-2 mt-4 ${
                isEmergency 
                  ? 'bg-error text-white hover:bg-red-600 shadow-[0_0_20px_rgba(255,0,0,0.2)]' 
                  : 'bg-white text-black hover:bg-primary hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
              } disabled:opacity-50`}
            >
              {status === 'loading' ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  {isEmergency ? 'Submit Priority Request' : 'Confirm Appointment'}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </main>
  );
};
