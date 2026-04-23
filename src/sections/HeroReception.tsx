export const HeroReception = () => {
  return (
    <section id="reception" className="relative min-h-screen pt-24 pb-[120px] flex flex-col items-center justify-center group overflow-hidden">
      {/* Background Environmental Image */}
      <div className="absolute inset-0 z-0 bg-clinical-bg">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCI8BbQcY8sGSF2HvNMTPxOHAVaiXgB8JLKVDNJgBxNRI5g0tzbuBL7pWdN2yYhXH-HksvfydB_GJ5fyakjb62Mc91shuNgu_DFZNMVTgkhO_jxDpSMOiIN3c_d4cj3CovSo-6v2T2Jni3I1iBSAyMEI_cWGpk_lsIZVPG-2qXLhdkdo3G5x0vrbl21DLweUJ0zLcoeLDTARbRIFNGFt3W8lyNt-kJpHrP2CiaVkbEe1Aklbvp2dGS3zrJJ6i8qr0fGPBSPNPLHJbI" 
          alt="Modern veterinary clinic reception desk" 
          className="w-full h-full object-cover grayscale-transition"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-clinical-bg via-clinical-bg/80 to-clinical-bg/30"></div>
      </div>

      {/* Content Canvas */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center gap-16 mt-20">
        
        {/* Left: Typography & Actions */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <p className="font-inter font-bold text-[12px] uppercase tracking-widest text-primary">ESTABLISHED 1990</p>
            <h1 className="font-manrope font-black text-[48px] leading-[1.1] tracking-[-0.02em] text-ink-depth">
              Your Pet! We Care. <br/>
              <span className="text-outline">Prof. Dr. Tamal Baran Sen.</span>
            </h1>
            <p className="font-inter text-[18px] leading-[1.6] text-on-surface-variant max-w-xl">
              Welcome to the immersive clinic experience. A legacy of clinical precision blending seamlessly with empathetic warmth for your furry family members.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 pt-4">
            <a href="#services" className="bg-primary text-on-primary px-8 py-4 rounded-full font-manrope font-semibold text-[18px] shadow-lg shadow-primary/20 hover:bg-primary-container hover:text-on-primary-container transition-all hover:-translate-y-1 flex items-center gap-3">
              Start Visit
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-waiting-gold" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
              <span className="font-inter text-[16px]">Walk-ins Welcome</span>
            </div>
          </div>
        </div>

        {/* Right: Interactive Zone Card (Reception Desk) */}
        <div className="flex-1 w-full max-w-md">
          <div className="bg-surface/90 backdrop-blur-md border border-outline-variant/30 rounded-3xl p-8 shadow-xl shadow-ink-depth/5 group-hover:shadow-primary/10 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity text-primary">
              <span className="material-symbols-outlined text-4xl">local_hospital</span>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-3xl">desk</span>
              </div>
              
              <div>
                <h3 className="font-manrope font-bold text-[32px] leading-[1.2] text-on-surface mb-2">Reception Zone</h3>
                <p className="font-inter text-[16px] text-on-surface-variant">Check in, schedule follow-ups, or speak with our care coordinators.</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-outline-variant/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-inter text-[16px] text-on-surface-variant">Current Wait Time:</span>
                  <span className="font-manrope font-semibold text-[16px] text-pharmacy-green flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">schedule</span> 5 mins
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-inter text-[16px] text-on-surface-variant">Staff on Duty:</span>
                  <span className="font-manrope font-semibold text-[16px] text-on-surface">Dr. Sen & Team</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
