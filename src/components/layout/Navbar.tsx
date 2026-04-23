export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-slate-200/40 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center h-20 px-4 md:px-8 max-w-[1280px] mx-auto w-full">
        <div className="text-xl font-black text-slate-900 tracking-tighter">
          Dr. Tamal B. Sen Memorial
        </div>
        <div className="hidden lg:flex items-center gap-6 font-manrope tracking-tight text-sm uppercase font-semibold">
          <a href="#reception" className="text-slate-500 hover:text-slate-900 hover:bg-slate-50/50 transition-all duration-300 px-3 py-2 rounded-md">Reception</a>
          <a href="#pharmacy" className="text-slate-500 hover:text-slate-900 hover:bg-slate-50/50 transition-all duration-300 px-3 py-2 rounded-md">Pharmacy</a>
          <a href="#diagnostics" className="text-slate-500 hover:text-slate-900 hover:bg-slate-50/50 transition-all duration-300 px-3 py-2 rounded-md">Diagnostics</a>
          <a href="#emergency" className="text-slate-500 hover:text-slate-900 hover:bg-slate-50/50 transition-all duration-300 px-3 py-2 rounded-md">Emergency</a>
          <a href="#blog" className="text-slate-500 hover:text-slate-900 hover:bg-slate-50/50 transition-all duration-300 px-3 py-2 rounded-md">Blog</a>
          <a href="#contact" className="text-slate-500 hover:text-slate-900 hover:bg-slate-50/50 transition-all duration-300 px-3 py-2 rounded-md">Bookings</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:block font-manrope text-sm font-semibold text-slate-500 hover:text-slate-900 px-4 py-2 rounded-full border border-outline-variant hover:bg-surface-variant transition-colors">
            Patient Portal
          </button>
          <a href="#emergency" className="bg-emergency-pulse text-white px-4 py-2 rounded-full font-manrope text-sm font-bold tracking-wide shadow-md shadow-emergency-pulse/20 hover:bg-rose-800 transition-colors flex items-center gap-2 hover:scale-95 duration-200">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
            <span className="hidden sm:inline">Emergency SOS</span>
            <span className="sm:hidden">SOS</span>
          </a>
        </div>
      </div>
    </nav>
  );
};
