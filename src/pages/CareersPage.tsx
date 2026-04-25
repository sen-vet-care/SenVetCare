import React from 'react';

export const CareersPage = () => {
  return (
    <main className="py-32 max-w-[1280px] mx-auto px-6 relative flex-grow bg-surface-container-low min-h-screen">
      <header className="mb-20 text-center max-w-3xl mx-auto">
        <h1 className="font-manrope font-extrabold text-[48px] md:text-[64px] tracking-tight text-ink-depth leading-tight mb-6">
            Join Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-waiting-gold">Legacy.</span>
        </h1>
        <p className="font-inter text-xl text-on-surface-variant font-light leading-relaxed">
            We are always looking for passionate, highly-skilled professionals dedicated to advancing the standard of veterinary medicine in Kolkata.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        <div className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 flex flex-col hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 group">
           <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
             <span className="material-symbols-outlined text-3xl">stethoscope</span>
           </div>
           <h3 className="font-manrope font-bold text-2xl text-ink-depth mb-6">Veterinary Specialists</h3>
           
           <div className="space-y-6 mb-8 flex-grow">
             <div>
               <h4 className="font-inter font-bold text-[10px] tracking-[0.2em] text-primary uppercase mb-2">The Role</h4>
               <p className="font-inter text-sm text-on-surface-variant leading-relaxed">Dedicated practitioners for specialized surgery, internal medicine, or critical care. Directing complex case management.</p>
             </div>
             <div>
               <h4 className="font-inter font-bold text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">Key Responsibility Area (KRA)</h4>
               <ul className="list-disc list-inside text-xs text-on-surface-variant space-y-1 font-inter">
                 <li>Advanced surgical interventions</li>
                 <li>Multi-modal pain management</li>
                 <li>Mentoring junior clinical staff</li>
               </ul>
             </div>
             <div>
               <h4 className="font-inter font-bold text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">Key Performance Indicator (KPI)</h4>
               <p className="font-inter text-xs text-on-surface-variant italic">95% Success rate in acute triage; &lt;0.5% post-op complication rate.</p>
             </div>
           </div>

           <a href="mailto:contact@senvetcare.com?subject=Specialist Application" className="bg-ink-depth text-white text-center py-4 rounded-full font-inter font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-primary transition-all duration-300">
               Apply via Resume
           </a>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 flex flex-col hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 group">
           <div className="w-16 h-16 bg-secondary/5 text-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
             <span className="material-symbols-outlined text-3xl">medication</span>
           </div>
           <h3 className="font-manrope font-bold text-2xl text-ink-depth mb-6">Clinical Technicians</h3>
           
           <div className="space-y-6 mb-8 flex-grow">
             <div>
               <h4 className="font-inter font-bold text-[10px] tracking-[0.2em] text-secondary uppercase mb-2">The Role</h4>
               <p className="font-inter text-sm text-on-surface-variant leading-relaxed">Providing high-level support in diagnostics, patient monitoring, and pharmacological administration.</p>
             </div>
             <div>
               <h4 className="font-inter font-bold text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">Key Responsibility Area (KRA)</h4>
               <ul className="list-disc list-inside text-xs text-on-surface-variant space-y-1 font-inter">
                 <li>Diagnostic imaging & lab work</li>
                 <li>Patient stabilizing & monitoring</li>
                 <li>Assisting in sterile environments</li>
               </ul>
             </div>
             <div>
               <h4 className="font-inter font-bold text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">Key Performance Indicator (KPI)</h4>
               <p className="font-inter text-xs text-on-surface-variant italic">Zero errors in drug dosage; &lt;10min lab report turnaround time.</p>
             </div>
           </div>

           <a href="mailto:contact@senvetcare.com?subject=Technician Application" className="bg-ink-depth text-white text-center py-4 rounded-full font-inter font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-secondary transition-all duration-300">
               Apply via Resume
           </a>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-zinc-100 flex flex-col hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 group">
           <div className="w-16 h-16 bg-waiting-gold/5 text-waiting-gold rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
             <span className="material-symbols-outlined text-3xl">support_agent</span>
           </div>
           <h3 className="font-manrope font-bold text-2xl text-ink-depth mb-6">Client Experience</h3>
           
           <div className="space-y-6 mb-8 flex-grow">
             <div>
               <h4 className="font-inter font-bold text-[10px] tracking-[0.2em] text-waiting-gold uppercase mb-2">The Role</h4>
               <p className="font-inter text-sm text-on-surface-variant leading-relaxed">The front-line of our clinical empathy. Managing patient flow and pet parent anxiety with grace.</p>
             </div>
             <div>
               <h4 className="font-inter font-bold text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">Key Responsibility Area (KRA)</h4>
               <ul className="list-disc list-inside text-xs text-on-surface-variant space-y-1 font-inter">
                 <li>Client communication & triage</li>
                 <li>Scheduling & billing integrity</li>
                 <li>Maintaining empathetic clinic atmosphere</li>
               </ul>
             </div>
             <div>
               <h4 className="font-inter font-bold text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">Key Performance Indicator (KPI)</h4>
               <p className="font-inter text-xs text-on-surface-variant italic">90% NPS (Net Promoter Score); zero scheduling conflicts.</p>
             </div>
           </div>

           <a href="mailto:contact@senvetcare.com?subject=Client Experience Application" className="bg-ink-depth text-white text-center py-4 rounded-full font-inter font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-waiting-gold transition-all duration-300">
               Apply via Resume
           </a>
        </div>
      </div>

      <div className="bg-surface border border-outline-variant/30 rounded-3xl p-10 text-center max-w-4xl mx-auto">
          <h2 className="font-manrope font-bold text-3xl text-ink-depth mb-4">Don't see a perfect fit?</h2>
          <p className="font-inter text-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
              We are constantly expanding. Send your resume and a cover letter detailing how you can contribute to Dr. Sen's legacy.
          </p>
          <a href="mailto:contact@senvetcare.com" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-inter font-bold text-sm tracking-widest uppercase hover:bg-waiting-gold transition-colors shadow-sm">
             Email resume <span className="material-symbols-outlined text-[18px]">mail</span>
          </a>
      </div>
    </main>
  );
};
