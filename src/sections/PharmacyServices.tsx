export const PharmacyServices = () => {
  return (
    <section id="pharmacy" className="pt-28 pb-[120px] px-6 md:px-8 max-w-[1280px] mx-auto w-full relative">
      <header className="mb-16">
        <h2 className="font-manrope font-black text-[48px] leading-[1.1] tracking-[-0.02em] text-ink-depth mb-4">Pharmacy & Services</h2>
        <p className="font-inter text-[18px] text-on-surface-variant max-w-2xl leading-[1.6]">
          Interactive service shelf. Hover over items to explore treatments and pricing in detail.
        </p>
      </header>

      {/* The Shelf Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Service Item: General OPD */}
        <div className="grayscale-card bg-surface rounded-3xl p-6 border border-outline-variant/30 flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stethoscope</span>
            </div>
            <span className="font-inter font-bold text-[12px] tracking-widest text-outline bg-surface-variant px-3 py-1 rounded-full group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">15-20 MIN</span>
          </div>
          
          <h3 className="font-manrope font-semibold text-[24px] text-on-background mb-2 relative z-10">General OPD Consultation</h3>
          <p className="font-inter text-[16px] text-on-surface-variant mb-6 flex-grow relative z-10">Comprehensive preliminary examination and diagnosis for common ailments.</p>
          
          <div className="flex justify-between items-center relative z-10 pt-4 border-t border-outline-variant/30">
            <span className="font-manrope font-semibold text-[24px] text-primary">₹600 - ₹800</span>
            <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
               <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Service Item: Preventive Care */}
        <div className="grayscale-card bg-surface rounded-3xl p-6 border border-outline-variant/30 flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-pharmacy-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-pharmacy-green group-hover:text-white transition-colors">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>vaccines</span>
            </div>
            <span className="font-inter font-bold text-[12px] tracking-widest text-outline bg-surface-variant px-3 py-1 rounded-full group-hover:bg-pharmacy-green/20 group-hover:text-pharmacy-green transition-colors">15 MIN</span>
          </div>
          
          <h3 className="font-manrope font-semibold text-[24px] text-on-background mb-2 relative z-10">Preventive Care</h3>
          <p className="font-inter text-[16px] text-on-surface-variant mb-6 flex-grow relative z-10">Vaccinations, deworming, and routine health checks to ensure long-term wellness.</p>
          
          <div className="flex justify-between items-center relative z-10 pt-4 border-t border-outline-variant/30">
            <span className="font-manrope font-semibold text-[24px] text-primary">From ₹400</span>
            <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-pharmacy-green group-hover:text-white transition-colors">
               <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Service Item: Diagnostics Planning */}
        <div className="grayscale-card bg-surface rounded-3xl p-6 border border-outline-variant/30 flex flex-col relative overflow-hidden group lg:col-span-1 md:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
            </div>
            <span className="font-inter font-bold text-[12px] tracking-widest text-outline bg-surface-variant px-3 py-1 rounded-full group-hover:bg-secondary-container/20 group-hover:text-secondary transition-colors">20 MIN</span>
          </div>
          
          <h3 className="font-manrope font-semibold text-[24px] text-on-background mb-2 relative z-10">Diagnostics Planning</h3>
          <p className="font-inter text-[16px] text-on-surface-variant mb-6 flex-grow relative z-10">Detailed review of symptoms and formulation of a targeted diagnostic testing plan.</p>
          
          <div className="flex justify-between items-center relative z-10 pt-4 border-t border-outline-variant/30">
            <span className="font-manrope font-semibold text-[24px] text-primary">₹800</span>
            <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-colors">
               <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
