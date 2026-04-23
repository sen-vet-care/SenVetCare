export const Footer = () => {
  return (
    <footer className="w-full py-16 border-t border-slate-200 bg-slate-50 relative z-20">
      <div className="max-w-[1280px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-manrope text-xs font-medium text-slate-500 text-center md:text-left">
          © {new Date().getFullYear()} Dr. Tamal B. Sen Memorial Veterinary Clinic. Immersive Clinical Excellence in Kolkata.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          <a href="#" className="font-manrope text-xs font-medium text-slate-400 hover:text-teal-500 transition-colors">Privacy Policy</a>
          <a href="#" className="font-manrope text-xs font-medium text-slate-400 hover:text-teal-500 transition-colors">Terms of Service</a>
          <a href="#" className="font-manrope text-xs font-medium text-slate-400 hover:text-teal-500 transition-colors">Pet Safety Guide</a>
          <a href="#" className="font-manrope text-xs font-medium text-slate-400 hover:text-teal-500 transition-colors">Careers</a>
          <a href="#contact" className="font-manrope text-xs font-medium text-slate-400 hover:text-teal-500 transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};
