export const DiagnosticsLab = () => {
  return (
    <section id="diagnostics" className="py-[120px] px-4 md:px-8 max-w-[1280px] mx-auto w-full">
      {/* Hero Section */}
      <div className="mb-[120px]">
        <div className="mb-8">
            <span className="font-inter font-bold text-[12px] tracking-widest text-primary uppercase block mb-2">Command Center</span>
            <h2 className="font-manrope font-black text-[48px] leading-[1.1] tracking-[-0.02em] text-ink-depth mb-4">Diagnostics Lab</h2>
            <p className="font-inter text-[18px] text-on-surface-variant max-w-2xl">Precision analysis powered by advanced veterinary technology. Real-time insights for optimal care.</p>
        </div>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm grayscale hover:grayscale-0 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>vital_signs</span>
                        <h3 className="font-manrope font-semibold text-[24px] text-on-surface">24/7 Monitoring</h3>
                    </div>
                    <div className="font-manrope font-black text-[48px] text-ink-depth mb-2">99.9%</div>
                    <p className="font-inter text-[16px] text-on-surface-variant">Uptime for critical patient vitals.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm grayscale hover:grayscale-0 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary-fixed/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
                        <h3 className="font-manrope font-semibold text-[24px] text-on-surface">Lab Turnaround</h3>
                    </div>
                    <div className="font-manrope font-black text-[48px] text-ink-depth mb-2">&lt; 2h</div>
                    <p className="font-inter text-[16px] text-on-surface-variant">Average time for comprehensive panels.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm grayscale hover:grayscale-0 transition-all duration-500 group relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-pharmacy-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined text-pharmacy-green text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
                        <h3 className="font-manrope font-semibold text-[24px] text-on-surface">Equipment</h3>
                    </div>
                    <div className="font-manrope font-black text-[48px] text-ink-depth mb-2">Tier 1</div>
                    <p className="font-inter text-[16px] text-on-surface-variant">State-of-the-art diagnostic machinery.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Lab Results Viewer Simulation */}
      <div className="mb-[120px]">
        <h3 className="font-manrope font-semibold text-[32px] text-ink-depth mb-6">Recent Analysis</h3>
        <div className="bg-white rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="grid grid-cols-4 gap-4 p-4 bg-surface-container-low border-b border-outline-variant font-inter font-bold text-[12px] tracking-widest text-on-surface-variant uppercase">
                <div>Patient ID</div>
                <div>Test Type</div>
                <div>Status</div>
                <div>Priority</div>
            </div>
            
            <div className="divide-y divide-outline-variant">
                <div className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-white/50 transition-colors grayscale hover:grayscale-0 group cursor-pointer">
                    <div className="font-inter text-[16px] font-medium text-on-surface">#PT-8892</div>
                    <div className="font-inter text-[16px] text-on-surface-variant">Complete Blood Count</div>
                    <div><span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-medium"><span className="material-symbols-outlined text-[14px]">check_circle</span> Completed</span></div>
                    <div className="font-inter text-[16px] text-on-surface-variant">Routine</div>
                </div>
                <div className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-white/50 transition-colors grayscale hover:grayscale-0 group cursor-pointer relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-waiting-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="font-inter text-[16px] font-medium text-on-surface">#PT-8893</div>
                    <div className="font-inter text-[16px] text-on-surface-variant">Urinalysis Panel</div>
                    <div><span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-surface-container-high text-on-surface text-xs font-medium"><span className="material-symbols-outlined text-[14px] animate-spin">sync</span> Processing</span></div>
                    <div className="font-inter text-[16px] text-waiting-gold font-medium">Elevated</div>
                </div>
                <div className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-white/50 transition-colors grayscale hover:grayscale-0 group cursor-pointer relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-error opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="font-inter text-[16px] font-medium text-on-surface">#PT-8894</div>
                    <div className="font-inter text-[16px] text-on-surface-variant">Digital Radiography</div>
                    <div><span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-medium"><span className="material-symbols-outlined text-[14px]">check_circle</span> Completed</span></div>
                    <div className="font-inter text-[16px] text-error font-bold">Critical</div>
                </div>
            </div>
        </div>
      </div>

    </section>
  );
};
