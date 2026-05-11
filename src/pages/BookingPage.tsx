import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const isEmergency = searchParams.get('emergency') === 'true';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    petDetails: '',
    date: '',
    time: '',
    doctorId: '',
  });

  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    // Set minimum date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setMinDate(`${yyyy}-${mm}-${dd}`);
    
    // Fetch doctors
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDoctors(docs);
      } catch (err) {
        console.warn("Failed to fetch doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmergency && !formData.time) {
      alert("Please select a time slot.");
      return;
    }
    
    setStatus('loading');
    
    try {
      await addDoc(collection(db, 'appointments'), {
        ownerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        petDetails: formData.petDetails,
        date: isEmergency ? new Date().toISOString() : formData.date || new Date().toISOString(),
        time: isEmergency ? 'Immediate' : formData.time,
        doctorId: formData.doctorId || null,
        status: isEmergency ? 'Pending Emergency' : 'Scheduled',
        isEmergency: isEmergency,
        createdAt: new Date().toISOString()
      });
      
      // Send notification email
      await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           firstName: formData.name,
           lastName: '',
           email: formData.email,
           phone: formData.phone,
           message: `Booking Request: Date: ${isEmergency ? 'Immediate' : formData.date}, Time: ${isEmergency ? 'Immediate' : formData.time}, Pet: ${formData.petDetails}`
        })
      });

      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('idle');
      alert("Failed to submit booking. Please try again.");
    }
  };

  return (
    <main className={`flex-grow pt-24 pb-20 px-4 md:px-8 max-w-[800px] mx-auto w-full relative z-10 transition-colors duration-1000`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`sanctuary-card rounded-[2rem] p-8 md:p-12 relative overflow-hidden ${isEmergency ? 'border border-error/50 shadow-[0_0_50px_rgba(255,0,0,0.15)] bg-red-950/10' : ''}`}
      >
        {isEmergency && (
          <div className="absolute top-0 left-0 w-full bg-error/20 border-b border-error/50 p-4 text-center backdrop-blur-md z-20">
            <span className="text-red-400 font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping absolute"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 relative"></span>
              Critical Emergency Routing Active
            </span>
          </div>
        )}

        {isEmergency && (
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 animate-pulse"></div>
        )}

        <div className={`mt-${isEmergency ? '16' : '0'} mb-10 text-center relative z-10`}>
          <h1 className={`font-manrope font-extrabold text-[32px] md:text-[40px] tracking-tight mb-4 ${isEmergency ? 'text-red-400' : 'text-white'}`}>
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
            className="flex flex-col items-center justify-center text-center py-10 relative z-10"
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] ${isEmergency ? 'bg-error text-white shadow-[0_0_30px_rgba(255,0,0,0.4)]' : 'bg-primary text-white shadow-[0_0_30px_rgba(212,175,55,0.2)]'}`}>
              <span className="material-symbols-outlined text-[40px]">
                {isEmergency ? 'warning' : 'check_circle'}
              </span>
            </div>
            <h2 className={`font-manrope font-bold text-2xl mb-4 tracking-tight ${isEmergency ? 'text-red-400' : 'text-white'}`}>
              {isEmergency ? 'Emergency Dispatched' : 'Request Dispatched'}
            </h2>
            <p className="text-on-surface-variant mb-8 max-w-sm text-sm">
              An email confirmation has been triggered. Our dispatch team is reviewing your details.
            </p>

            {isEmergency && (
              <div className="bg-error/20 border border-error/50 rounded-2xl p-6 w-full mb-8 backdrop-blur-sm">
                <h3 className="text-red-400 font-bold tracking-widest uppercase text-xs mb-2">Critical Action Required</h3>
                <p className="text-red-100 text-sm mb-4">You are mapped to a priority slot. Call us directly on your way to the clinic.</p>
                <a href="tel:+919871155162" className="inline-flex w-full justify-center bg-error text-white font-bold tracking-widest uppercase text-xs py-4 rounded-full hover:bg-red-600 transition-colors shadow-lg shadow-error/30 animate-pulse">
                  Call Now : +91 98711 55162
                </a>
              </div>
            )}

            <Link to="/" className="text-on-surface-variant hover:text-white transition-colors text-xs font-bold uppercase tracking-widest underline decoration-white/20 underline-offset-4">
              Return to Reception
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-[10px] uppercase tracking-widest font-black ${isEmergency ? 'text-red-300' : 'text-on-surface-variant'}`}>Owner Name <span className="text-error">*</span></label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full bg-surface-container border ${isEmergency ? 'border-red-900/50 focus:border-red-500 focus:ring-red-500' : 'border-outline-variant focus:border-primary focus:ring-primary'} rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors focus:ring-1 shadow-inner`}
                  placeholder="John Doe"
                  minLength={2}
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] uppercase tracking-widest font-black ${isEmergency ? 'text-red-300' : 'text-on-surface-variant'}`}>Phone Number <span className="text-error">*</span></label>
                <input 
                  required
                  type="tel" 
                  pattern="^\+?[0-9\s\-]{10,15}$"
                  title="Please enter a valid phone number (min 10 digits)"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={`w-full bg-surface-container border ${isEmergency ? 'border-red-900/50 focus:border-red-500 focus:ring-red-500' : 'border-outline-variant focus:border-primary focus:ring-primary'} rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors focus:ring-1 shadow-inner`}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-[10px] uppercase tracking-widest font-black ${isEmergency ? 'text-red-300' : 'text-on-surface-variant'}`}>Email Address <span className="text-error">*</span></label>
              <input 
                required
                type="email" 
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                title="Please enter a valid email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full bg-surface-container border ${isEmergency ? 'border-red-900/50 focus:border-red-500 focus:ring-red-500' : 'border-outline-variant focus:border-primary focus:ring-primary'} rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors focus:ring-1 shadow-inner`}
                placeholder="john@example.com"
              />
            </div>

            <div className={`space-y-2 ${isEmergency ? 'hidden' : ''}`}>
              <label className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant">Preferred Doctor (Optional)</label>
              <div className="relative">
                <select 
                  value={formData.doctorId}
                  onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl py-3 px-4 pr-10 text-sm text-white focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary shadow-inner appearance-none"
                >
                  <option value="">Any Available Doctor</option>
                  {doctors.filter(d => d.isPresent).map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialty}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-zinc-500">
                   <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </div>
              </div>
            </div>

            <div className={`space-y-4 ${isEmergency ? 'hidden' : ''}`}>
              <label className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant">Select Date & Time { !isEmergency && <span className="text-error">*</span>}</label>
              <div className="bg-surface-container border border-outline-variant rounded-xl p-4 shadow-inner">
                <input 
                  type="date"
                  required={!isEmergency}
                  min={minDate}
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value, time: ''})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary mb-4"
                />
                
                {formData.date && (
                   <div className="grid grid-cols-3 gap-2">
                     {(() => {
                        // Mock availability logic based on doctorId and date
                        const availableTimes = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:30 PM', '5:00 PM', '6:30 PM'];
                        const pseudoSeed = (formData.date.charCodeAt(formData.date.length - 1) + (formData.doctorId || '1').charCodeAt(0)) % 2;
                        const times = pseudoSeed === 0 ? availableTimes : availableTimes.slice(2, 6);
                        
                        return times.map(time => (
                           <button
                             key={time}
                             type="button"
                             onClick={() => setFormData({...formData, time})}
                             className={`py-2 rounded-lg text-xs font-bold transition-all border ${formData.time === time ? 'bg-primary text-black border-primary shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                           >
                             {time}
                           </button>
                        ))
                     })()}
                   </div>
                )}
                {!formData.date && (
                  <p className="text-center text-xs text-zinc-500 italic py-4">Please select a date to view available slots.</p>
                )}
              </div>
            </div>

            {isEmergency && (
              <div className="text-center py-2">
                <p className="text-red-400 font-bold text-xs uppercase tracking-widest bg-red-950/40 py-2 px-4 rounded-lg border border-red-900/50">
                  Immediate intake slot will be allocated
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className={`text-[10px] uppercase tracking-widest font-black ${isEmergency ? 'text-red-300' : 'text-on-surface-variant'}`}>Patient Details & Symptoms {isEmergency && <span className="text-error">*</span>}</label>
              <textarea 
                required={isEmergency}
                rows={3}
                value={formData.petDetails}
                onChange={(e) => setFormData({...formData, petDetails: e.target.value})}
                className={`w-full bg-surface-container border ${isEmergency ? 'border-red-900/50 focus:border-red-500 focus:ring-red-500' : 'border-outline-variant focus:border-primary focus:ring-primary'} rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors focus:ring-1 shadow-inner resize-none`}
                placeholder="Species, Breed, Age, and reason for visit..."
              ></textarea>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button 
                type="submit"
                disabled={status === 'loading'}
                className={`w-full py-4 rounded-full font-inter font-bold text-sm tracking-widest uppercase transition-all duration-300 flex justify-center items-center gap-2 ${
                  isEmergency 
                    ? 'bg-error text-white hover:bg-red-600 shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)]' 
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
              
              {!isEmergency && (
                <button
                  type="button"
                  onClick={() => navigate('/booking?emergency=true')}
                  className="w-full sm:w-auto py-4 px-8 rounded-full font-inter font-bold text-xs tracking-widest uppercase transition-all duration-300 flex justify-center items-center gap-2 bg-transparent text-error hover:bg-error/10 border border-error/50 whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  Mark as Emergency
                </button>
              )}
            </div>
          </form>
        )}
      </motion.div>
    </main>
  );
};
