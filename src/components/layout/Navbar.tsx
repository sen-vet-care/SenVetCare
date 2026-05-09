import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
  }, [location.pathname]);

  return (
    <div className="fixed top-0 w-full z-50 px-2 md:px-8 pt-4 pb-2 transition-all duration-500">
      <nav className="glass-panel mx-auto max-w-[1280px] rounded-[2rem] shadow-2xl shadow-black/50 border border-white/10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-waiting-gold/5 pointer-events-none rounded-[2rem]"></div>
        <div className="flex justify-between items-center h-16 md:h-20 px-3 md:px-8 w-full relative z-10">
          
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity shrink-0">
            <div className="w-10 h-10 md:w-20 md:h-20 flex items-center justify-center">
               <img src="https://ik.imagekit.io/senvetcare/Logo/Logo%20Trans.webp" alt="SenVetCare Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
            </div>
          </Link>
          
          <div className="flex items-center gap-1 md:gap-2 font-inter tracking-widest uppercase font-semibold">
            <Link to="/dr-lily" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all duration-300 px-2 md:px-4 py-2 rounded-full flex items-center gap-1 md:gap-1.5 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[8px] md:text-xs whitespace-nowrap">FREE Consultation</span>
            </Link>

            <Link to="/book?emergency=true" className="flex bg-error/10 border border-error/30 text-error px-2 md:px-4 py-2 rounded-full font-inter font-bold tracking-widest uppercase hover:bg-error hover:text-white transition-all duration-300 items-center gap-1 md:gap-1.5 group">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
              <span className="text-[8px] md:text-xs whitespace-nowrap">Emergency</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <div className="relative group">
                <button className={`hover:text-white hover:bg-white/5 transition-all duration-300 px-4 py-2.5 rounded-full flex items-center gap-1 ${['/treatments', '/preventions', '/diagnostics', '/pharmacy'].includes(location.pathname) ? 'text-white bg-white/10' : 'text-on-surface-variant'}`}>
                  Services
                  <span className="material-symbols-outlined text-[14px]">expand_more</span>
                </button>
                <div className="absolute top-full left-0 pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-[#1C1C22] border border-[#2A2A35] rounded-2xl shadow-xl shadow-black/50 flex flex-col py-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <Link to="/treatments" className={`px-4 py-2.5 hover:bg-white/5 transition-colors ${location.pathname === '/treatments' ? 'text-white bg-white/5' : 'text-[#A0A0B0]'}`}>Treatments</Link>
                    <Link to="/preventions" className={`px-4 py-2.5 hover:bg-white/5 transition-colors ${location.pathname === '/preventions' ? 'text-white bg-white/5' : 'text-[#A0A0B0]'}`}>Preventions</Link>
                    <Link to="/diagnostics" className={`px-4 py-2.5 hover:bg-white/5 transition-colors ${location.pathname === '/diagnostics' ? 'text-white bg-white/5' : 'text-[#A0A0B0]'}`}>Lab Tests & Diagnostics</Link>
                    <Link to="/pharmacy" className={`px-4 py-2.5 hover:bg-white/5 transition-colors ${location.pathname === '/pharmacy' ? 'text-white bg-white/5' : 'text-[#A0A0B0]'}`}>Pharmacy</Link>
                  </div>
                </div>
              </div>
              <Link to="/stories" className={`hover:text-white hover:bg-white/5 transition-all duration-300 px-4 py-2.5 rounded-full font-serif italic lowercase text-sm ${location.pathname === '/stories' ? 'text-white bg-white/5' : 'text-on-surface-variant'}`}>Stories</Link>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            {user ? (
              <Link to="/dashboard" className="hidden lg:block bg-white text-black px-6 py-2.5 rounded-full font-inter text-xs font-bold tracking-widest uppercase hover:bg-primary hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500 hover:scale-105 active:scale-95 ml-2 border border-white">
                Dashboard
              </Link>
            ) : (
              <Link to="/portal-login" className="hidden lg:block bg-[#14141A] border border-white/10 text-white px-6 py-2.5 rounded-full font-inter text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-500 hover:scale-105 active:scale-95 ml-2">
                Sign In
              </Link>
            )}
            
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
            >
                <span className="material-symbols-outlined text-2xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
           {isMobileMenuOpen && (
             <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="lg:hidden w-full overflow-hidden border-t border-white/5"
             >
                <div className="flex flex-col py-4 px-6 bg-surface-container font-inter text-sm font-semibold tracking-wider text-on-surface-variant uppercase overflow-y-auto max-h-[80vh]">
                   <div className="flex flex-col mb-2">
                     <button 
                       onClick={() => setIsServicesOpen(!isServicesOpen)}
                       className="flex items-center justify-between py-4 text-white border-b border-white/10"
                     >
                        Services
                        <span className={`material-symbols-outlined transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}>expand_more</span>
                     </button>
                     <AnimatePresence>
                        {isServicesOpen && (
                           <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden flex flex-col bg-black/20 rounded-b-xl"
                           >
                             <Link to="/treatments" className="py-3 px-6 border-b border-white/5 hover:text-white hover:bg-white/5">Treatments</Link>
                             <Link to="/preventions" className="py-3 px-6 border-b border-white/5 hover:text-white hover:bg-white/5">Preventions</Link>
                             <Link to="/diagnostics" className="py-3 px-6 border-b border-white/5 hover:text-white hover:bg-white/5">Lab Tests & Diagnostics</Link>
                             <Link to="/pharmacy" className="py-3 px-6 hover:text-white hover:bg-white/5">Pharmacy</Link>
                           </motion.div>
                        )}
                     </AnimatePresence>
                   </div>
                   
                   <Link to="/dr-lily" className="py-4 text-emerald-400 border-b border-white/10 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]"></span>
                     FREE Consultations
                   </Link>
                   <Link to="/book?emergency=true" className="py-4 text-error border-b border-white/10 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                     <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                     Emergency
                   </Link>
                   <Link to="/stories" className="py-4 text-white border-b border-white/10 font-serif italic lowercase tracking-normal">Stories</Link>
                   {user ? (
                     <Link to="/dashboard" className="py-4 text-white">Dashboard</Link>
                   ) : (
                     <Link to="/portal-login" className="py-4 text-white">Sign In</Link>
                   )}
                </div>
             </motion.div>
           )}
        </AnimatePresence>

      </nav>
    </div>
  );
};
