import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full z-50 px-4 md:px-8 pt-4 pb-2 transition-all duration-500">
      <nav className="glass-panel mx-auto max-w-[1280px] rounded-full shadow-2xl shadow-black/50 border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-waiting-gold/5 pointer-events-none"></div>
        <div className="flex justify-between items-center h-16 md:h-20 px-6 md:px-8 w-full relative z-10">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center animate-float shrink-0">
               <img src="https://ik.imagekit.io/senvetcare/Logo/Logo%20Trans.webp" alt="SenVetCare Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-manrope font-bold text-white tracking-tight leading-tight">
                SenVetCare
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/90 font-bold hidden sm:block leading-relaxed mt-0.5">
                <span className="text-waiting-gold">Legacy</span> Dr. Tamal B. Sen Memorial Veterinary Clinic
              </span>
            </div>
          </Link>
          
          <div className="hidden lg:flex items-center gap-1 font-inter text-xs tracking-widest uppercase font-semibold">
            <a href="/#services" className="text-on-surface-variant hover:text-white hover:bg-white/5 transition-all duration-300 px-4 py-2.5 rounded-full">Services</a>
            <Link to="/pharmacy" className="text-on-surface-variant hover:text-white hover:bg-white/5 transition-all duration-300 px-4 py-2.5 rounded-full">Pharmacy</Link>
            <Link to="/dr-lily" className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300 px-4 py-2.5 rounded-full flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Dr. Lily AI
            </Link>
            <Link to="/diagnostics" className="text-on-surface-variant hover:text-white hover:bg-white/5 transition-all duration-300 px-4 py-2.5 rounded-full">Diagnostics</Link>
            <Link to="/stories" className="text-on-surface-variant hover:text-white hover:bg-white/5 transition-all duration-300 px-4 py-2.5 rounded-full">Stories</Link>
          </div>

          <div className="flex items-center gap-3">
            <a href="/#emergency" className="flex bg-error/10 border border-error/30 text-error px-4 sm:px-5 py-2 md:py-2.5 rounded-full font-inter text-[10px] sm:text-xs font-bold tracking-widest uppercase hover:bg-error hover:text-white transition-all duration-300 items-center gap-2 group">
              <span className="material-symbols-outlined text-[16px] group-hover:animate-pulse">emergency</span>
              <span>SOS</span>
            </a>
            <Link to="/portal-login" className="bg-white text-black px-4 sm:px-6 py-2 md:py-2.5 rounded-full font-inter text-[10px] sm:text-xs font-bold tracking-widest uppercase hover:bg-primary hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500 hover:scale-105 active:scale-95">
              Portal
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};
