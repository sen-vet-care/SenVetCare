export const DiagnosticsPage = () => {
  const tests = [
    { name: 'Complete Blood Count (CBC)', desc: 'Rapidly evaluates overall health, measuring red and white blood cell levels to detect anemia, infections, or inflammation.', price: '₹450' },
    { name: 'Digital Radiography (X-Ray)', desc: 'Instant, high-resolution internal imaging for orthopedic and organ assessment with minimal radiation exposure.', price: '₹900' },
    { name: 'Comprehensive Biochemistry', desc: 'Detailed evaluation of kidney, liver, and pancreatic function using advanced automated analyzers.', price: '₹1,200' },
    { name: 'Urinalysis & Microscopy', desc: 'Detects early signs of kidney issues, infections, and metabolic abnormalities usually missed by primary checks.', price: '₹350' },
    { name: 'Vector-Borne Disease Panel', desc: 'Rapid screening for common tick-borne diseases endemic to Kolkata including Ehrlichia and Babesia.', price: '₹850' },
    { name: 'Ultrasonography', desc: 'Non-invasive, real-time imaging of abdominal organs and cardiovascular health using specialized probes.', price: '₹1,500' }
  ];

  return (
    <section id="diagnostics" className="py-32 px-6 max-w-[1280px] mx-auto w-full relative">
      {/* Background Effect */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none"></div>

      <header className="mb-20 text-center relative z-10 max-w-3xl mx-auto">
        <h2 className="font-manrope font-extrabold text-[48px] md:text-[64px] tracking-tight text-ink-depth leading-tight mb-6">
          Advanced <span className="bg-clip-text text-transparent bg-gradient-to-r from-waiting-gold to-white">Diagnostics.</span>
        </h2>
        <p className="font-inter text-xl text-on-surface-variant font-light leading-relaxed">
          The SenVetCare Command Center. 
          Precision analysis powered by advanced veterinary technology, providing a "10-minute head start" in critical emergencies.
        </p>
      </header>

      {/* Why We Are Better */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 relative z-10">
        <div className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
           <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-6">
             <span className="material-symbols-outlined text-3xl">electric_bolt</span>
           </div>
           <h3 className="font-manrope font-bold text-2xl text-ink-depth mb-3">Instant-Triage Ecosystem</h3>
           <p className="font-inter text-on-surface-variant flex-grow">While others wait days for external lab results, our AI-assisted diagnostic scanning provides immediate critical flags before manual review is even complete.</p>
        </div>
        <div className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
           <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
             <span className="material-symbols-outlined text-3xl">network_intelligence</span>
           </div>
           <h3 className="font-manrope font-bold text-2xl text-ink-depth mb-3">Unified Command Center</h3>
           <p className="font-inter text-on-surface-variant flex-grow">Cross-referencing lab results directly with pharmacy inventory in real-time, completely eliminating manual errors common in compartmentalized clinics.</p>
        </div>
        <div className="bg-surface p-8 rounded-[2rem] border border-outline-variant/30 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
           <div className="w-14 h-14 bg-waiting-gold/10 text-waiting-gold rounded-2xl flex items-center justify-center mb-6">
             <span className="material-symbols-outlined text-3xl">verified</span>
           </div>
           <h3 className="font-manrope font-bold text-2xl text-ink-depth mb-3">Tier 1 Accuracy</h3>
           <p className="font-inter text-on-surface-variant flex-grow">Equipped with state-of-the-art machinery that operates continuously 24/7, maintaining a strict &lt;2h turnaround on comprehensive panels.</p>
        </div>
      </div>

      {/* Pricing List */}
      <div className="bg-surface-container-low rounded-[3rem] border border-outline-variant/30 overflow-hidden relative z-10 shadow-lg">
         <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-outline-variant/30">
            {tests.map((test, index) => (
              <div key={index} className="p-8 hover:bg-surface transition-colors duration-300 flex flex-col h-full border-b border-outline-variant/30 lg:border-b-[1px_solid_red] first-of-type:border-t-0 last-of-type:border-b-0">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <h4 className="font-manrope font-bold text-xl text-ink-depth">{test.name}</h4>
                  <span className="px-4 py-1.5 bg-surface text-secondary border border-secondary/20 rounded-full font-inter font-bold text-sm shrink-0 shadow-sm">{test.price}</span>
                </div>
                <p className="font-inter text-on-surface-variant text-base leading-relaxed">{test.desc}</p>
              </div>
            ))}
         </div>
      </div>
    </section>
  );
};
