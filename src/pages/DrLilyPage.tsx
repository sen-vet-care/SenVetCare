import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const SPECIES = [
  { id: 'dog', name: 'Dog', icon: 'pets' },
  { id: 'cat', name: 'Cat', icon: 'pets' },
  { id: 'rabbit', name: 'Rabbit', icon: 'rabbit' },
  { id: 'bird', name: 'Bird', icon: 'flutter_dash' },
  { id: 'exotic', name: 'Exotic/Other', icon: 'cruelty_free' }
];

const BREEDS: Record<string, string[]> = {
  dog: ['Labrador', 'Golden Retriever', 'German Shepherd', 'Pug', 'Shih Tzu', 'Indie', 'Beagle', 'Other'],
  cat: ['Persian', 'Siamese', 'Maine Coon', 'Bengal', 'Indie/Stray', 'British Shorthair', 'Other'],
  rabbit: ['Holland Lop', 'Netherland Dwarf', 'Lionhead', 'Other'],
  bird: ['Parakeet', 'Cockatiel', 'Lovebird', 'African Grey', 'Other'],
  exotic: ['Hamster', 'Guinea Pig', 'Turtle', 'Other']
};

const PROBLEMS = [
  'Lethargy / Weakness',
  'Loss of Appetite',
  'Vomiting / Diarrhea',
  'Skin Irritation / Itching',
  'Limping / Mobility issues',
  'Respiratory Distress',
  'Other (Specify below)'
];

const VACCINATIONS: Record<string, string[]> = {
  dog: ['Rabies', 'DHPP', 'Leptospirosis', 'Bordetella', 'Parvovirus'],
  cat: ['Rabies', 'FVRCP', 'FeLV'],
  rabbit: ['RHD1/2', 'Myxomatosis'],
  bird: ['Psittacosis', 'Polyomavirus'],
  exotic: ['Depends on Species']
};

type ConsultationStep = 'intro' | 'pet-details' | 'history' | 'problem' | 'evaluation' | 'result';

const LILY_AVATAR = "https://ik.imagekit.io/senvetcare/Dr.%20Lily/Dr%20Lily.webp";

export const DrLilyPage = () => {
  const [step, setStep] = useState<ConsultationStep>('intro');
  const [formData, setFormData] = useState({
    petName: '',
    species: '',
    breed: '',
    age: '',
    weight: '',
    sex: '',
    vaccinations: [] as string[],
    selectedProblems: [] as string[],
    problemDescription: '',
    files: [] as File[]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.size <= 10 * 1024 * 1024);
      updateFormData('files', [...formData.files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const updated = [...formData.files];
    updated.splice(index, 1);
    updateFormData('files', updated);
  };

  return (
    <main className="min-h-screen bg-black text-white font-inter relative flex flex-col lg:flex-row overflow-hidden">
      {/* Immersive Background Avatar */}
      <div className="hidden lg:block lg:w-1/2 h-screen sticky top-0 left-0 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black z-10 w-full h-full"></div>
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2 }}
          src={LILY_AVATAR} 
          alt="Dr. Lily AI" 
          className="w-full h-full object-cover grayscale brightness-75" 
        />
        <div className="absolute bottom-12 left-12 z-20">
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">Consulting Unit Online</span>
          </div>
        </div>
      </div>

      {/* Consultation Area */}
      <div className="flex-1 min-h-screen relative overflow-y-auto pt-24 pb-12">
        {/* Mobile Avatar Header */}
        <div className="lg:hidden w-full h-48 relative mb-8">
           <img src={LILY_AVATAR} className="w-full h-full object-cover opacity-30 grayscale" alt="Lily Mobile" />
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
        </div>

        <div className="max-w-2xl mx-auto px-8">
          <AnimatePresence mode="wait">
            {step === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center lg:items-start text-center lg:text-left pt-20"
            >
              <h1 className="font-manrope font-bold text-5xl md:text-7xl text-white mb-6 tracking-tight leading-none">I am Dr. Lily</h1>
              <p className="text-zinc-500 text-xl max-w-xl mb-16 leading-relaxed italic">
                "Clinical precision meets digital empathy. I am waiting to listen to your pet's concerns."
              </p>

              <button 
                onClick={() => setStep('pet-details')}
                className="group flex flex-col items-center lg:items-start gap-4 py-8 px-12 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 hover:border-primary/50 transition-all duration-500"
              >
                <span className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">Initiate Diagnostic Protocol</span>
                <span className="font-manrope font-bold text-2xl group-hover:text-primary transition-colors flex items-center gap-3">
                  Begin Consultation
                  <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </span>
              </button>
            </motion.div>
          )}

          {step === 'pet-details' && (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-2xl mx-auto"
            >
              <div className="mb-12 flex items-center gap-6">
                <button onClick={() => setStep('intro')} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                </button>
                <div className="h-1 flex-grow bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-primary rounded-full transition-all duration-1000"></div>
                </div>
                <span className="text-[10px] font-black text-zinc-600 tracking-widest">STEP 01/04</span>
              </div>

              <h2 className="font-manrope font-bold text-3xl mb-10">The Patient Profile</h2>

              <div className="space-y-12">
                <div className="relative">
                  <p className="text-[10px] font-black text-primary tracking-widest uppercase mb-4">Patient Name</p>
                  <input 
                    type="text" 
                    placeholder="e.g. Leo, Bella..."
                    className="w-full bg-transparent border-b border-zinc-800 py-4 text-xl focus:outline-none focus:border-primary transition-colors text-white placeholder:text-zinc-800"
                    value={formData.petName}
                    onChange={(e) => updateFormData('petName', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {SPECIES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => updateFormData('species', s.id)}
                      className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 ${formData.species === s.id ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                    >
                      <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                      <span className="text-[10px] font-bold tracking-widest uppercase">{s.name}</span>
                    </button>
                  ))}
                </div>

                {formData.species && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative">
                      <p className="text-[10px] font-black text-zinc-600 tracking-widest uppercase mb-4">Breed Identification</p>
                      <select 
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary text-white"
                        value={formData.breed}
                        onChange={(e) => updateFormData('breed', e.target.value)}
                      >
                        <option value="">Select Breed</option>
                        {BREEDS[formData.species]?.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="relative">
                      <p className="text-[10px] font-black text-zinc-600 tracking-widest uppercase mb-4">Clinical Sex</p>
                      <div className="flex bg-white/5 rounded-2xl p-1 gap-1">
                        {['Male', 'Female', 'Neutered', 'Castrated'].map(s => (
                          <button
                            key={s}
                            onClick={() => updateFormData('sex', s)}
                            className={`flex-1 py-3 px-1 rounded-xl text-[10px] font-bold uppercase transition-all ${formData.sex === s ? 'bg-white text-black shadow-lg' : 'hover:bg-white/5 text-zinc-500'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-8">
                  <div className="relative">
                    <p className="text-[10px] font-black text-zinc-600 tracking-widest uppercase mb-4">Age (Years/Months)</p>
                    <input 
                      type="text" 
                      placeholder="e.g. 2 Years"
                      className="w-full bg-transparent border-b border-zinc-800 py-3 focus:outline-none focus:border-primary transition-colors"
                      value={formData.age}
                      onChange={(e) => updateFormData('age', e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <p className="text-[10px] font-black text-zinc-600 tracking-widest uppercase mb-4">Weight (KG)</p>
                    <input 
                      type="text" 
                      placeholder="e.g. 12.5"
                      className="w-full bg-transparent border-b border-zinc-800 py-3 focus:outline-none focus:border-primary transition-colors"
                      value={formData.weight}
                      onChange={(e) => updateFormData('weight', e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-8">
                  <button 
                    disabled={!formData.petName || !formData.species}
                    onClick={() => setStep('history')}
                    className="w-full bg-white text-black py-6 rounded-full font-manrope font-black text-[10px] tracking-[0.4em] uppercase hover:bg-primary hover:text-white transition-all disabled:opacity-30"
                  >
                    Next Logic Layer
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'history' && (
            <motion.div 
               key="history"
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -50 }}
               className="w-full max-w-2xl mx-auto"
            >
              <div className="mb-12 flex items-center gap-6">
                <button onClick={() => setStep('pet-details')} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                </button>
                <div className="h-1 flex-grow bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-2/4 bg-primary rounded-full transition-all duration-1000"></div>
                </div>
                <span className="text-[10px] font-black text-zinc-600 tracking-widest">STEP 02/04</span>
              </div>

              <h2 className="font-manrope font-bold text-3xl mb-10">Vaccination Status</h2>

              <p className="text-zinc-500 text-sm mb-8">Select all vaccinations {formData.petName} has received to date.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {VACCINATIONS[formData.species]?.map(v => (
                  <button
                    key={v}
                    onClick={() => {
                      const updated = formData.vaccinations.includes(v) 
                        ? formData.vaccinations.filter(item => item !== v)
                        : [...formData.vaccinations, v];
                      updateFormData('vaccinations', updated);
                    }}
                    className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition-all ${formData.vaccinations.includes(v) ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${formData.vaccinations.includes(v) ? 'bg-primary border-primary' : 'border-zinc-700'}`}>
                      {formData.vaccinations.includes(v) && <span className="material-symbols-outlined text-xs text-black font-bold">check</span>}
                    </div>
                    <span className="text-sm font-medium">{v}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setStep('problem')}
                className="w-full bg-white text-black py-6 rounded-full font-manrope font-black text-[10px] tracking-[0.4em] uppercase hover:bg-primary hover:text-white transition-all"
              >
                Continue to Assessment
              </button>
            </motion.div>
          )}

          {step === 'problem' && (
             <motion.div 
                key="problem"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full max-w-2xl mx-auto"
             >
               <div className="mb-12 flex items-center gap-6">
                 <button onClick={() => setStep('history')} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                   <span className="material-symbols-outlined text-sm">arrow_back</span>
                 </button>
                 <div className="h-1 flex-grow bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full w-3/4 bg-primary rounded-full transition-all duration-1000"></div>
                 </div>
                 <span className="text-[10px] font-black text-zinc-600 tracking-widest">STEP 03/04</span>
               </div>

               <h2 className="font-manrope font-bold text-3xl mb-10">Current Presentation</h2>

               <div className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {PROBLEMS.map(p => (
                     <button
                       key={p}
                       onClick={() => {
                         const updated = formData.selectedProblems.includes(p) 
                           ? formData.selectedProblems.filter(item => item !== p)
                           : [...formData.selectedProblems, p];
                         updateFormData('selectedProblems', updated);
                       }}
                       className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition-all ${formData.selectedProblems.includes(p) ? 'bg-waiting-gold/20 border-waiting-gold' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                     >
                       <span className="text-sm font-medium">{p}</span>
                     </button>
                   ))}
                 </div>

                 <div className="relative">
                   <p className="text-[10px] font-black text-zinc-600 tracking-widest uppercase mb-4">Detailed Observation</p>
                   <textarea 
                     rows={5}
                     placeholder="Describe the problem in your own words. When did it start? How often does it occur?"
                     className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 focus:outline-none focus:border-primary transition-colors text-sm leading-relaxed text-white"
                     value={formData.problemDescription}
                     onChange={(e) => updateFormData('problemDescription', e.target.value)}
                   ></textarea>
                 </div>

                 <div className="p-10 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center text-center group hover:border-primary/50 transition-colors relative">
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.png"
                    />
                    <span className="material-symbols-outlined text-4xl text-zinc-600 mb-4 group-hover:text-primary transition-colors">upload_file</span>
                    <p className="text-sm text-zinc-500 mb-2">Upload medical reports, photos, or videos</p>
                    <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest mb-6">PDF, JPG, PNG • MAX 10MB EACH</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                      Browse Files
                    </button>

                    {formData.files.length > 0 && (
                      <div className="w-full mt-8 grid grid-cols-1 gap-2">
                        {formData.files.map((file, i) => (
                          <div key={i} className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-sm text-zinc-500 italic">attach_file</span>
                              <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[200px]">{file.name}</span>
                            </div>
                            <button onClick={() => removeFile(i)} className="text-red-500 hover:text-red-400 transition-colors">
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                 </div>

                 <button 
                   onClick={() => setStep('evaluation')}
                   className="w-full bg-white text-black py-6 rounded-full font-manrope font-black text-[10px] tracking-[0.4em] uppercase hover:bg-primary hover:text-white transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
                 >
                   Initiate AI Evaluation
                 </button>
               </div>
             </motion.div>
          )}

          {step === 'evaluation' && (
            <motion.div 
               key="evaluation"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="w-full max-w-2xl mx-auto flex flex-col items-center text-center"
            >
              <div className="relative mb-16">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/50 p-1 relative z-10 bg-black">
                  <img src={LILY_AVATAR} alt="Lily" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="absolute -inset-8 bg-primary/20 rounded-full blur-3xl animate-ping border border-primary/40 opacity-30"></div>
              </div>

              <h2 className="font-manrope font-bold text-2xl mb-8">Dr. Lily is analyzing data...</h2>
              
              <div className="w-full space-y-6">
                {[1, 2, 3].map(i => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.8 }}
                    className="p-6 bg-white/5 border border-white/5 rounded-3xl text-left flex gap-6"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div className="flex-grow">
                      <div className="h-4 bg-white/10 rounded-full w-3/4 mb-3 animate-pulse"></div>
                      <div className="h-3 bg-white/5 rounded-full w-1/2 animate-pulse"></div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={() => setStep('result')}
                className="mt-16 text-[10px] font-black text-primary tracking-[0.4em] uppercase animate-bounce"
              >
                Analysis Complete • View Results
              </button>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div 
               key="result"
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full max-w-3xl mx-auto"
            >
              <div className="bg-zinc-900/50 rounded-[3rem] p-10 md:p-16 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <span className="material-symbols-outlined text-[150px] text-primary">analytics</span>
                </div>

                <div className="flex items-center gap-6 mb-12">
                   <div className="w-16 h-16 rounded-full overflow-hidden border border-primary/50 p-0.5">
                      <img src={LILY_AVATAR} alt="Lily" className="w-full h-full object-cover rounded-full" />
                   </div>
                   <div>
                      <h2 className="font-manrope font-bold text-2xl text-white tracking-tight">Diagnostic Inference</h2>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Protocol ID: LILY-X827-02</p>
                   </div>
                </div>

                <div className="space-y-12">
                  <div className="space-y-6">
                    <p className="text-[12px] font-black text-primary tracking-widest uppercase">Probabilistic Pathogens / Issues</p>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-colors">
                        <div>
                           <p className="text-white font-bold text-lg mb-1">Gastrointestinal Disturbance</p>
                           <p className="text-zinc-500 text-xs">Secondary to dietary indiscretion or mild infection.</p>
                        </div>
                        <div className="text-right">
                           <p className="text-emerald-500 font-manrope font-bold text-2xl">78%</p>
                           <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">PROBABILITY</p>
                        </div>
                      </div>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-colors opacity-60">
                        <div>
                           <p className="text-white font-bold text-lg mb-1">Parasitic Infestation</p>
                           <p className="text-zinc-500 text-xs">Based on species profile and reported lethargy.</p>
                        </div>
                        <div className="text-right">
                           <p className="text-waiting-gold font-manrope font-bold text-2xl">15%</p>
                           <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">PROBABILITY</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-[12px] font-black text-primary tracking-widest uppercase">Diagnostic Recommendations</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <li className="flex gap-4 items-start p-4 bg-white/5 rounded-xl text-xs text-zinc-300 leading-relaxed italic">
                         <span className="material-symbols-outlined text-sm text-primary">microscope</span>
                         Stool Routine Examination for parasite screening.
                       </li>
                       <li className="flex gap-4 items-start p-4 bg-white/5 rounded-xl text-xs text-zinc-300 leading-relaxed italic">
                         <span className="material-symbols-outlined text-sm text-primary">medication</span>
                         Bland diet trial (boiled rice & curd for 48 hours).
                       </li>
                    </ul>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                     <p className="text-[12px] font-black text-white tracking-widest uppercase mb-4 flex items-center gap-2">
                       <span className="material-symbols-outlined text-sm">gavel</span>
                       Legal Disclaimer & Protocol
                     </p>
                     <p className="text-zinc-500 text-[11px] leading-relaxed font-bold uppercase tracking-wide">
                        THIS IS AN ARTIFICIAL INTELLIGENCE OUTPUT GENERATED BY THE LILY-UNIT CORE. IT DOES NOT CONSTITUTE A LICENSED VETERINARY DIAGNOSIS OR PROFESSIONAL MEDICAL ADVICE. THE PROBABILITIES PROVIDED ARE BASED ON STATISTICAL DATASETS AND MAY NOT REFLECT THE CLINICAL REALITY OF YOUR PET. SEN VET CARE ASSUMES NO LEGAL LIABILITY FOR ACTIONS TAKEN BASED ON THIS INFERENCE. IF YOUR PET SHOWS SIGNS OF DISTRESS, IMMEDIATE CLINICAL INTERVENTION IS MANDATORY.
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/10">
                    <a href="https://wa.me/message/EOOITVOJLIHNO1" className="flex flex-col items-center justify-center p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl hover:bg-emerald-500/20 transition-all group">
                       <span className="material-symbols-outlined text-2xl text-emerald-500 mb-3">chat</span>
                       <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Mild Issue</span>
                       <span className="text-white font-bold text-xs mt-1">Tele-Consult</span>
                    </a>
                    <button className="flex flex-col items-center justify-center p-6 bg-primary/10 border border-primary/20 rounded-3xl hover:bg-primary/20 transition-all">
                       <span className="material-symbols-outlined text-2xl text-primary mb-3">clinical_notes</span>
                       <span className="text-[9px] font-black text-primary uppercase tracking-widest">Recommended</span>
                       <span className="text-white font-bold text-xs mt-1">Visit Clinic</span>
                    </button>
                    <a href="tel:+919871155162" className="flex flex-col items-center justify-center p-6 bg-red-500/10 border border-red-500/20 rounded-3xl hover:bg-red-500/20 transition-all">
                       <span className="material-symbols-outlined text-2xl text-red-500 mb-3">emergency</span>
                       <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Emergency</span>
                       <span className="text-white font-bold text-xs mt-1">Call Now</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                 <button onClick={() => setStep('intro')} className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em] hover:text-white transition-colors">Start New Analysis</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </main>
);
};
