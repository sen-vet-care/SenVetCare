import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { getTriageNextStep } from '../services/ai';

const SPECIES = [
  { id: 'Dog / Canine', name: 'Dog', icon: 'pets' },
  { id: 'Cat / Feline', name: 'Cat', icon: 'pets' },
  { id: 'Rabbit', name: 'Rabbit', icon: 'cruelty_free' },
  { id: 'Parrot / Bird', name: 'Bird', icon: 'flutter_dash' },
  { id: 'Turtle / Tortoise', name: 'Turtle', icon: 'pest_control' },
  { id: 'Fish / Aquatic', name: 'Fish', icon: 'set_meal' },
  { id: 'Guinea Pig', name: 'Guinea Pig', icon: 'cruelty_free' },
  { id: 'Other', name: 'Other', icon: 'category' },
  { id: 'Unknown', name: 'Unknown', icon: 'help_outline' }
];

const BREEDS: Record<string, string[]> = {
  'Dog / Canine': ['Unknown', 'Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'Pug', 'Shih Tzu', 'Indie', 'Beagle', 'Other'],
  'Cat / Feline': ['Unknown', 'Persian', 'Siamese', 'Maine Coon', 'Bengal', 'Indie/Stray', 'British Shorthair', 'Other'],
  'Rabbit': ['Unknown', 'Holland Lop', 'Netherland Dwarf', 'Lionhead', 'Other'],
  'Parrot / Bird': ['Unknown', 'Parakeet', 'Cockatiel', 'Lovebird', 'African Grey', 'Other'],
  'Turtle / Tortoise': ['Unknown', 'Red-Eared Slider', 'Indian Tent Turtle', 'Other'],
  'Fish / Aquatic': ['Unknown', 'Goldfish', 'Betta', 'Guppy', 'Other'],
  'Guinea Pig': ['Unknown', 'American', 'Abyssinian', 'Peruvian', 'Other'],
  'Other': ['Unknown'],
  'Unknown': ['Unknown']
};

const VACCINATIONS: Record<string, string[]> = {
  'Dog / Canine': ['Unknown / Not Known', 'DHPPiL', 'Rabies', 'Bordetella', 'Leptospira'],
  'Cat / Feline': ['Unknown / Not Known', 'FVRCP', 'Rabies', 'FeLV'],
  'Rabbit': ['Unknown / Not Known', 'Myxomatosis', 'RVHD1', 'RVHD2'],
  'Parrot / Bird': ['Unknown / Not Known', 'PBFD', 'Polyomavirus', 'Newcastle Disease']
};

const LILY_AVATAR = "https://ik.imagekit.io/senvetcare/Dr.%20Lily/Dr%20Lily.webp";

type ConsultationStep = 'intro' | 'login' | 'select-pet' | 'pet-details' | 'history' | 'problem' | 'evaluation' | 'triage' | 'result';
type Message = { role: string; content: string };

export const DrLilyPage = () => {
  const [step, setStep] = useState<ConsultationStep>('intro');
  const [formData, setFormData] = useState({
    ownerName: '',
    mobileNumber: '',
    emailAddress: '',
    petName: '',
    species: '',
    breed: '',
    sex: '',
    age: '',
    weight: '',
    vaccinations: [] as string[],
    problemDescription: '',
    files: [] as File[],
    agreedDisclaimer: false
  });

  const [triageHistory, setTriageHistory] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [triageLoading, setTriageLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  
  const [othersText, setOthersText] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Login simulation states
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Mock registered pets
  const mockPets = [
    { id: '1', name: 'Max', species: 'Dog / Canine', breed: 'Golden Retriever', sex: 'Male', age: '3 years', weight: '30', vaccinations: ['DHPPiL', 'Rabies'] },
    { id: '2', name: 'Luna', species: 'Cat / Feline', breed: 'Persian', sex: 'Female', age: '2 years', weight: '4' }
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpSent) {
      if (loginPhone.length >= 10) {
        setIsOtpSent(true);
      }
    } else {
      if (loginOtp === '1234') {
        const ownerName = 'John Doe';
        updateFormData('ownerName', ownerName);
        updateFormData('mobileNumber', loginPhone);
        setStep('select-pet');
      } else {
        alert('Invalid OTP. Use 1234');
      }
    }
  };

  const handleSelectMockPet = (pet: typeof mockPets[0]) => {
    setFormData(prev => ({
      ...prev,
      petName: pet.name,
      species: pet.species,
      breed: pet.breed,
      sex: pet.sex,
      age: pet.age,
      weight: pet.weight,
      vaccinations: pet.vaccinations || []
    }));
    setStep('history');
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

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

  const handleSpeciesSelect = (speciesId: string) => {
    setFormData(prev => ({
      ...prev,
      species: speciesId,
      breed: speciesId === 'Unknown' ? 'Unknown' : prev.breed,
      vaccinations: []
    }));
  };

  const handleStartTriage = async () => {
    setStep('evaluation');
    try {
      const initialHistory = [{ role: 'user', content: "Let's begin the triage assessment." }];
      setTriageHistory(initialHistory);
      const res = await getTriageNextStep(formData, initialHistory);
      if (res.status === 'question' && res.question) {
        setCurrentQuestion(res);
        setStep('triage');
      } else if ((res.status === 'complete' && res.report) || res.report) {
        setReportData(res.report);
        setStep('result');
      } else {
         // fallback incase Gemini decides it's complete without report
         setReportData({
            urgencyLevel: 'ORANGE',
            summary: "AI Assessment gathered general concerns based on your answers.",
            differentialDiagnoses: [],
            recommendedTests: ["Clinical Examination"],
            generalTreatment: "Requires physical evaluation by a vet.",
            homeManagement: ["Keep pet calm and hydrated."],
            warningSigns: ["Worsening of current symptoms"],
            followUpRecommendation: "Consult the clinic at your earliest convenience."
         });
         setStep('result');
      }
    } catch (err) {
      console.error(err);
      alert("Error starting triage. Please check your connection.");
      setStep('problem');
    }
  };

  const handleTriageAnswer = async (answer: string) => {
    const finalAnswer = answer === 'Others' ? `Others: ${othersText}` : answer;
    
    const newHistory = [
      ...triageHistory, 
      { role: 'assistant', content: currentQuestion.question }, 
      { role: 'user', content: finalAnswer }
    ];
    setTriageHistory(newHistory);
    setTriageLoading(true);
    setCurrentQuestion(null);
    setOthersText("");
    setSelectedOption(null);

    try {
      const res = await getTriageNextStep(formData, newHistory);
      if (res.status === 'question' && res.question) {
        setCurrentQuestion(res);
      } else if (res.status === 'complete' || res.report) {
        setReportData(res.report);
        setStep('result');
      } else {
         throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to process your response. Concluding assessment.");
      setReportData({
         urgencyLevel: 'ORANGE',
         summary: "Triage ended prematurely. Please review with a vet.",
         differentialDiagnoses: [],
         recommendedTests: ["Standard Veterinary Exam"],
         generalTreatment: "Consult a professional for specific treatment.",
         homeManagement: [],
         warningSigns: [],
         followUpRecommendation: "Visit the clinic."
      });
      setStep('result');
    }
    setTriageLoading(false);
  };

  useEffect(() => {
     if (step === 'triage') {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
     }
  }, [triageHistory, currentQuestion, step]);

  const bgGradient = step === 'result' ? 
    (reportData?.urgencyLevel === 'RED' ? 'bg-[#EF4444]' : 
     reportData?.urgencyLevel === 'ORANGE' ? 'bg-[#F97316]' : 'bg-[#22C55E]') : 
    'bg-[#0D0D0F]';

  return (
    <main className={`min-h-screen text-white font-inter relative flex flex-col lg:flex-row overflow-hidden transition-colors duration-1000 ${bgGradient}`}>
      
      {/* Mobile background image */}
      {step !== 'result' && (
        <div className="lg:hidden fixed inset-0 z-0 pointer-events-none">
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 2 }}
            src={LILY_AVATAR} 
            alt="" 
            className="w-full h-full object-cover grayscale brightness-50" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0F]/80 via-transparent to-[#0D0D0F]"></div>
        </div>
      )}
      
      {/* Intro/Form Layout */}
      {step !== 'result' && (
        <div className="hidden lg:block lg:w-1/2 h-screen sticky top-0 left-0 overflow-hidden border-r border-[#2A2A35]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0D0D0F] z-10 w-full h-full"></div>
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 2 }}
            src={LILY_AVATAR} 
            alt="Dr. Lily AI" 
            className="w-full h-full object-cover grayscale brightness-75 mix-blend-luminosity" 
          />
          <div className="absolute bottom-12 left-12 z-20">
            <div className="flex items-center gap-3 px-4 py-2 bg-[#6EE7B7]/10 border border-[#6EE7B7]/20 rounded-full backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#6EE7B7] animate-pulse"></span>
              <span className="text-[10px] font-black tracking-[0.2em] text-[#6EE7B7] uppercase">Triage Engine Online</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 min-h-screen relative z-10 overflow-y-auto ${step === 'result' ? 'w-full' : 'pt-24 pb-12'}`}>
        
        <div className={`max-w-3xl mx-auto px-6 ${step === 'result' ? 'py-12' : ''}`}>
          <AnimatePresence mode="wait">
            
            {step === 'intro' && (
              <motion.div 
                key="intro"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left pt-20"
              >
                <div className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full bg-[#C084FC]/10 border border-[#C084FC]/30 text-[#C084FC] text-[10px] font-bold uppercase tracking-widest">
                  Not A Chatbot • Veterinary AI
                </div>
                <h1 className="font-manrope font-bold text-5xl md:text-6xl text-[#F2F2F4] mb-6 tracking-tight leading-loose">
                  Hello! I'm Dr. Lily.
                </h1>
                <p className="text-[#A0A0B0] text-lg max-w-xl mb-12 leading-relaxed">
                  Is your pet already registered with us, or shall we create a new profile today? My triage system will evaluate your pet's symptoms using purely clinical protocols.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <button 
                      onClick={() => setStep('pet-details')}
                      className="bg-[#6EE7B7] text-[#0D0D0F] hover:bg-[#4ADBA0] transition-colors py-4 px-8 rounded-full font-bold uppercase tracking-widest text-xs"
                    >
                      Create New Profile
                    </button>
                    <button 
                      onClick={() => setStep('login')}
                      className="bg-[#1C1C22] text-[#F2F2F4] border border-[#2A2A35] hover:border-[#606070] transition-colors py-4 px-8 rounded-full font-bold uppercase tracking-widest text-xs"
                    >
                      I Am Returning
                    </button>
                </div>
              </motion.div>
            )}

            {step === 'login' && (
              <motion.div 
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto pt-12 lg:pt-20"
              >
                <div className="flex items-center gap-4 mb-10">
                  <button onClick={() => setStep('intro')} className="w-10 h-10 rounded-full bg-[#1C1C22] border border-[#2A2A35] flex items-center justify-center hover:bg-[#2A2A35] transition-colors">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  </button>
                  <h2 className="font-manrope font-bold text-3xl text-white">Client Portal</h2>
                </div>
                
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  {!isOtpSent ? (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#A0A0B0] mb-3">Mobile Number</label>
                      <input 
                        type="tel" 
                        required 
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        placeholder="Enter 10-digit number"
                        className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-2xl px-5 py-4 text-white focus:border-[#6EE7B7] outline-none transition-colors"
                      />
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#A0A0B0] mb-3">Enter OTP (Use 1234)</label>
                      <input 
                        type="text" 
                        required 
                        value={loginOtp}
                        onChange={(e) => setLoginOtp(e.target.value)}
                        placeholder="4-digit code"
                        className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-2xl px-5 py-4 text-white focus:border-[#6EE7B7] outline-none transition-colors tracking-[0.5em] text-center text-xl"
                      />
                    </motion.div>
                  )}
                  
                  <button 
                    type="submit"
                    className="w-full bg-white text-black hover:bg-[#6EE7B7] transition-colors py-4 rounded-full font-bold uppercase tracking-widest text-xs mt-4"
                  >
                    {isOtpSent ? 'Verify & Continue' : 'Send OTP'}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'select-pet' && (
              <motion.div 
                key="select-pet"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-xl mx-auto pt-10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setStep('login')} className="w-10 h-10 rounded-full bg-[#1C1C22] border border-[#2A2A35] flex items-center justify-center hover:bg-[#2A2A35] transition-colors">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  </button>
                  <h2 className="font-manrope font-bold text-3xl text-white">Select Patient</h2>
                </div>
                
                <p className="text-[#A0A0B0] mb-8">Welcome back, {formData.ownerName}. Which pet needs Dr. Lily's attention today?</p>
                
                <div className="grid gap-4 mb-8">
                  {mockPets.map((pet) => (
                    <button 
                      key={pet.id}
                      onClick={() => handleSelectMockPet(pet)}
                      className="bg-[#1C1C22] border border-[#2A2A35] p-6 rounded-[2rem] hover:border-[#6EE7B7]/50 hover:bg-[#2A2A35]/50 transition-all text-left flex items-center gap-6 group"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#2A2A35] flex items-center justify-center group-hover:bg-[#6EE7B7]/20 transition-colors text-white group-hover:text-[#6EE7B7]">
                        <span className="material-symbols-outlined text-3xl">pets</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-manrope font-bold text-xl text-white mb-1">{pet.name}</h3>
                        <p className="text-[#A0A0B0] text-sm">{pet.breed} • {pet.age}</p>
                      </div>
                      <span className="material-symbols-outlined text-[#606070] group-hover:text-[#6EE7B7] transition-colors">chevron_right</span>
                    </button>
                  ))}
                </div>
                
                <div className="text-center">
                  <button onClick={() => setStep('pet-details')} className="text-[#6EE7B7] text-sm font-bold uppercase tracking-widest hover:text-white transition-colors">
                    + Register New Pet
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'pet-details' && (
              <motion.div 
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <h2 className="font-manrope font-bold text-3xl mb-10 text-[#F2F2F4]">Owner & Pet Information</h2>

                <div className="space-y-12">
                  <div className="bg-[#141418] border border-[#2A2A35] rounded-[2rem] p-8 space-y-6">
                    <h3 className="text-sm font-bold text-[#A0A0B0] uppercase tracking-widest border-b border-[#2A2A35] pb-4 mb-6">Owner Profile</h3>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <label className="text-xs text-[#A0A0B0] mb-2 block">Full Name *</label>
                        <input type="text" className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]" value={formData.ownerName} onChange={e => updateFormData('ownerName', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="relative">
                            <label className="text-xs text-[#A0A0B0] mb-2 block">Mobile Number *</label>
                            <input type="tel" className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]" value={formData.mobileNumber} onChange={e => updateFormData('mobileNumber', e.target.value)} />
                         </div>
                         <div className="relative">
                            <label className="text-xs text-[#A0A0B0] mb-2 block">Email Address * <span className="text-[#606070]">(Reports sent here)</span></label>
                            <input type="email" className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]" value={formData.emailAddress} onChange={e => updateFormData('emailAddress', e.target.value)} />
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#141418] border border-[#2A2A35] rounded-[2rem] p-8 space-y-6">
                    <h3 className="text-sm font-bold text-[#A0A0B0] uppercase tracking-widest border-b border-[#2A2A35] pb-4 mb-6">Patient Profile</h3>
                    
                    <div className="relative mb-6">
                      <label className="text-xs text-[#A0A0B0] mb-2 block">Pet's Name</label>
                      <input type="text" className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]" value={formData.petName} onChange={e => updateFormData('petName', e.target.value)} />
                    </div>

                    <div className="mb-6">
                       <label className="text-xs text-[#A0A0B0] mb-3 block">Species *</label>
                       <div className="flex w-full overflow-x-auto gap-3 pb-2 custom-scrollbar">
                         {SPECIES.map(s => (
                           <button
                             key={s.id}
                             onClick={() => handleSpeciesSelect(s.id)}
                             className={`flex-shrink-0 px-5 py-3 rounded-xl border flex items-center gap-2 transition-all ${formData.species === s.id ? 'bg-[#6EE7B7]/10 border-[#6EE7B7] text-[#6EE7B7]' : 'bg-[#1C1C22] border-[#2A2A35] text-[#A0A0B0] hover:border-[#606070]'}`}
                           >
                             <span className="material-symbols-outlined text-lg">{s.icon}</span>
                             <span className="text-sm font-bold">{s.name}</span>
                           </button>
                         ))}
                       </div>
                    </div>

                    {formData.species && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                         {formData.species !== 'Unknown' && (
                           <div className="relative">
                             <label className="text-xs text-[#A0A0B0] mb-2 block">Breed</label>
                             <select className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]" value={formData.breed} onChange={e => updateFormData('breed', e.target.value)}>
                               <option value="">Select Breed</option>
                               {BREEDS[formData.species]?.map(b => <option key={b} value={b}>{b}</option>)}
                             </select>
                           </div>
                         )}
                         <div className="relative">
                           <label className="text-xs text-[#A0A0B0] mb-2 block">Sex</label>
                           <select className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]" value={formData.sex} onChange={e => updateFormData('sex', e.target.value)}>
                              <option value="">Select Sex</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Neutered">Neutered</option>
                              <option value="Castrated">Castrated</option>
                              <option value="Unknown">Unknown</option>
                           </select>
                         </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="relative">
                        <label className="text-xs text-[#A0A0B0] mb-2 block">DOB / Age Approx.</label>
                        <input type="text" className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]" value={formData.age} onChange={e => updateFormData('age', e.target.value)} />
                      </div>
                      <div className="relative">
                        <label className="text-xs text-[#A0A0B0] mb-2 block">Weight (kg)</label>
                        <input type="number" step="0.1" className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]" value={formData.weight} onChange={e => updateFormData('weight', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={!formData.ownerName || !formData.mobileNumber || !formData.emailAddress || !formData.species}
                    onClick={() => setStep('history')}
                    className="w-full bg-[#6EE7B7] text-[#0D0D0F] py-5 rounded-full font-bold uppercase tracking-widest hover:bg-[#4ADBA0] transition-colors disabled:opacity-50"
                  >
                    Continue to Medical History →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <button onClick={() => setStep('pet-details')} className="mb-6 flex items-center gap-2 text-[#A0A0B0] hover:text-[#F2F2F4]">
                  <span className="material-symbols-outlined text-sm">arrow_back</span> Back
                </button>
                <h2 className="font-manrope font-bold text-3xl mb-10 text-[#F2F2F4]">Vaccination Status</h2>

                {formData.species !== 'Unknown' && VACCINATIONS[formData.species] ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    {VACCINATIONS[formData.species].map(v => (
                       <button
                         key={v}
                         onClick={() => {
                           // If unknown selected, clear others. If others selected, clear unknown.
                           let updated = [...formData.vaccinations];
                           if (v === 'Unknown / Not Known') {
                              updated = updated.includes(v) ? [] : [v];
                           } else {
                              updated = updated.filter(item => item !== 'Unknown / Not Known');
                              if (updated.includes(v)) {
                                 updated = updated.filter(item => item !== v);
                              } else {
                                 updated.push(v);
                              }
                           }
                           updateFormData('vaccinations', updated);
                         }}
                         className={`p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${formData.vaccinations.includes(v) ? 'bg-[#6EE7B7]/10 border-[#6EE7B7] text-[#6EE7B7]' : 'bg-[#141418] border-[#2A2A35] text-[#F2F2F4] hover:border-[#606070]'}`}
                       >
                         <div className={`w-5 h-5 flex-shrink-0 rounded flex items-center justify-center border ${formData.vaccinations.includes(v) ? 'bg-[#6EE7B7] border-[#6EE7B7]' : 'border-[#606070]'}`}>
                           {formData.vaccinations.includes(v) && <span className="material-symbols-outlined text-xs text-[#0D0D0F] font-bold">check</span>}
                         </div>
                         <span className="text-sm font-medium">{v}</span>
                       </button>
                    ))}
                  </div>
                ) : (
                   <p className="text-[#A0A0B0] mb-12">No vaccination data tracking available for this species.</p>
                )}

                <button 
                  onClick={() => setStep('problem')}
                  className="w-full bg-[#6EE7B7] text-[#0D0D0F] py-5 rounded-full font-bold uppercase tracking-widest hover:bg-[#4ADBA0] transition-colors"
                >
                  Continue to Chief Complaint →
                </button>
              </motion.div>
            )}

            {step === 'problem' && (
              <motion.div 
                key="problem"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <button onClick={() => setStep('history')} className="mb-6 flex items-center gap-2 text-[#A0A0B0] hover:text-[#F2F2F4]">
                  <span className="material-symbols-outlined text-sm">arrow_back</span> Back
                </button>
                <h2 className="font-manrope font-bold text-3xl mb-10 text-[#F2F2F4]">Chief Complaint</h2>

                <div className="space-y-8">
                  <div className="relative">
                    <label className="text-xs text-[#A0A0B0] mb-2 block">Tell us what's going on (Optional)</label>
                    <textarea 
                      rows={4}
                      placeholder="e.g. He started vomiting this morning and hasn't eaten."
                      className="w-full bg-[#141418] border border-[#2A2A35] rounded-xl p-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4] resize-none"
                      value={formData.problemDescription}
                      onChange={(e) => updateFormData('problemDescription', e.target.value)}
                    ></textarea>
                  </div>

                  <div className="bg-[#141418] border border-[#2A2A35] rounded-2xl p-6">
                    <p className="text-sm font-bold text-[#F2F2F4] mb-2">Upload Files (Optional)</p>
                    <p className="text-xs text-[#A0A0B0] mb-4">Attach medical reports or photos (JPG/PNG/PDF).</p>
                    
                    <button onClick={() => fileInputRef.current?.click()} className="px-5 py-2 bg-[#1C1C22] border border-[#2A2A35] rounded-lg text-sm font-medium hover:bg-[#2A2A35] transition-colors w-full flex items-center justify-center gap-2 text-[#F2F2F4]">
                      <span className="material-symbols-outlined text-lg">upload</span> Browse
                    </button>
                    <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.jpg,.png" />

                    {formData.files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {formData.files.map((file, i) => (
                           <div key={i} className="flex items-center justify-between bg-[#1C1C22] p-2 rounded border border-[#2A2A35]">
                             <span className="text-xs truncate text-[#A0A0B0]">{file.name}</span>
                             <button onClick={() => removeFile(i)} className="text-[#EF4444] hover:text-red-400">
                               <span className="material-symbols-outlined text-[16px]">close</span>
                             </button>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <label className="flex items-start gap-4 p-4 bg-[#141418] border border-[#EF4444]/30 rounded-xl cursor-pointer">
                     <input 
                       type="checkbox" 
                       className="mt-1" 
                       checked={formData.agreedDisclaimer}
                       onChange={e => updateFormData('agreedDisclaimer', e.target.checked)}
                     />
                     <span className="text-xs text-[#A0A0B0] leading-relaxed">
                       I understand that I am interacting with Dr. Lily, an AI veterinary assistant, and not a licensed veterinarian. Her assessments are for general guidance only and must not replace professional diagnosis.
                     </span>
                  </label>

                  <button 
                    disabled={!formData.agreedDisclaimer}
                    onClick={handleStartTriage}
                    className="w-full bg-[#6EE7B7] text-[#0D0D0F] py-5 rounded-full font-bold uppercase tracking-widest hover:bg-[#4ADBA0] transition-colors disabled:opacity-50 disabled:bg-[#606070]"
                  >
                    Start Intelligent Triage →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'evaluation' && (
              <motion.div 
                key="summary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full flex flex-col items-center justify-center h-64 text-center"
              >
                 <div className="w-16 h-16 border-4 border-[#6EE7B7]/20 border-t-[#6EE7B7] rounded-full animate-spin mb-6"></div>
                 <h2 className="font-manrope font-bold text-2xl text-[#F2F2F4] mb-2">Analyzing Clinical Data...</h2>
                 <p className="text-[#A0A0B0] text-sm">Please wait while Dr. Lily builds the triage matrix.</p>
              </motion.div>
            )}

            {step === 'triage' && (
              <motion.div 
                 key="triage"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="w-full flex flex-col h-[70vh] max-h-[700px] border border-[#2A2A35] rounded-3xl bg-[#141418] overflow-hidden"
              >
                  <div className="bg-[#1C1C22] p-4 border-b border-[#2A2A35] flex items-center gap-3">
                     <img src={LILY_AVATAR} className="w-10 h-10 rounded-full border border-[#2A2A35] grayscale" alt="Dr Lily" />
                     <div>
                       <p className="font-bold text-[#F2F2F4] text-sm">Dr. Lily</p>
                       <p className="text-[10px] text-[#6EE7B7] uppercase tracking-widest font-black">AI Triage Module</p>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                     {triageHistory.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#6EE7B7]/10 border border-[#6EE7B7]/30 text-[#6EE7B7] rounded-br-none' : 'bg-[#1C1C22] border border-[#2A2A35] text-[#F2F2F4] rounded-bl-none'}`}>
                              {msg.content}
                           </div>
                        </div>
                     ))}
                     
                     {currentQuestion && !triageLoading && (
                        <div className="flex justify-start">
                           <div className="max-w-[90%] p-5 rounded-2xl rounded-bl-none bg-[#1C1C22] border border-[#2A2A35] text-[#F2F2F4]">
                              <p className="mb-4 text-sm leading-relaxed">{currentQuestion.question}</p>
                              
                              <div className="space-y-3">
                                 {currentQuestion.options?.map((opt: string, i: number) => (
                                    <div key={i}>
                                      <button 
                                        onClick={() => setSelectedOption(opt)}
                                        className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${selectedOption === opt ? 'bg-[#6EE7B7]/20 border-[#6EE7B7]' : 'bg-[#141418] border-[#2A2A35] hover:border-[#606070]'}`}
                                      >
                                        {opt}
                                      </button>
                                      {opt === 'Others' && selectedOption === 'Others' && (
                                         <div className="mt-2 flex gap-2">
                                            <input 
                                              type="text" 
                                              autoFocus
                                              value={othersText}
                                              onChange={e => setOthersText(e.target.value)}
                                              placeholder="Please specify..."
                                              className="flex-1 bg-[#0D0D0F] border border-[#2A2A35] rounded-lg px-3 py-2 text-sm text-[#F2F2F4] focus:outline-none focus:border-[#6EE7B7]"
                                            />
                                         </div>
                                      )}
                                    </div>
                                 ))}
                              </div>
                              <button 
                                disabled={!selectedOption || (selectedOption === 'Others' && !othersText.trim())}
                                onClick={() => handleTriageAnswer(selectedOption!)}
                                className="mt-5 w-full bg-[#F2F2F4] text-[#0D0D0F] py-3 rounded-xl font-bold text-xs uppercase disabled:opacity-50 disabled:bg-[#606070]"
                              >
                                Submit Response
                              </button>
                           </div>
                        </div>
                     )}

                     {triageLoading && (
                        <div className="flex justify-start">
                           <div className="p-4 rounded-2xl rounded-bl-none bg-[#1C1C22] border border-[#2A2A35]">
                              <div className="flex gap-1">
                                 <span className="w-2 h-2 rounded-full bg-[#A0A0B0] animate-bounce"></span>
                                 <span className="w-2 h-2 rounded-full bg-[#A0A0B0] animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                 <span className="w-2 h-2 rounded-full bg-[#A0A0B0] animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                              </div>
                           </div>
                        </div>
                     )}
                     <div ref={chatBottomRef}></div>
                  </div>
              </motion.div>
            )}

            {step === 'result' && reportData && (
              <motion.div 
                 key="result"
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="w-full max-w-4xl mx-auto"
              >
                 <div className="bg-black/50 backdrop-blur-xl rounded-[2rem] border border-white/20 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="bg-[#EF4444] text-white text-[10px] font-black uppercase text-center py-2 px-4 rounded-lg mb-8 tracking-widest inline-block w-full">
                      ⚠️ This assessment was generated by Dr. Lily, an AI assistant trained exclusively on veterinary science. It is not a substitute for professional veterinary diagnosis or treatment.
                    </div>

                    <div className="flex justify-between items-start mb-10 pb-8 border-b border-white/10">
                       <div>
                         <h2 className="text-3xl font-manrope font-bold text-white mb-2">Clinical Report</h2>
                         <p className="text-white/60 text-sm">LILY-RPT-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-white font-bold">{formData.petName || 'Patient'}</p>
                         <p className="text-white/60 text-sm">{formData.species} • {formData.breed}</p>
                       </div>
                    </div>

                    <div className="mb-10 p-6 bg-white/10 rounded-2xl border border-white/10">
                       <h3 className="text-[11px] uppercase font-black text-white/50 tracking-widest mb-3">Assessment Summary</h3>
                       <p className="text-white text-sm leading-relaxed">{reportData.summary}</p>
                    </div>

                    {reportData.differentialDiagnoses?.length > 0 && (
                      <div className="mb-12">
                         <h3 className="text-[11px] uppercase font-black text-white/50 tracking-widest mb-4">Differential Diagnoses</h3>
                         <div className="space-y-4">
                            {reportData.differentialDiagnoses.map((d: any, i: number) => (
                               <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                  <div className="flex justify-between items-center mb-2">
                                     <p className="font-bold text-white">{d.condition}</p>
                                     <p className="text-white font-manrope">{typeof d.probability === 'number' ? d.probability + '%' : d.probability}</p>
                                  </div>
                                  <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden mb-3">
                                     <div className="bg-white h-full" style={{ width: `${typeof d.probability === 'number' ? d.probability : parseInt(d.probability) || 50}%` }}></div>
                                  </div>
                                  <p className="text-white/60 text-xs leading-relaxed">{d.reasoning}</p>
                               </div>
                            ))}
                         </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 border-t border-white/10 pt-10">
                       <div>
                         <h3 className="text-[11px] uppercase font-black text-white/50 tracking-widest mb-4">Recommended Tests</h3>
                         <ul className="space-y-2">
                            {reportData.recommendedTests?.map((t: string, i: number) => (
                               <li key={i} className="flex gap-2 items-start text-sm text-white"><span className="text-white/50">•</span> {t}</li>
                            ))}
                         </ul>
                         <div className="mt-6 p-5 border border-white/20 bg-white/5 rounded-xl text-center">
                            <p className="text-xs text-white/70 mb-3">Book tests seamlessly at the clinic.</p>
                            <Link to={reportData.urgencyLevel === 'RED' ? '/book?emergency=true' : '/book'} className="inline-block text-xs font-bold uppercase tracking-widest text-[#0D0D0F] bg-white py-2 px-6 rounded-full hover:bg-white/80 transition-colors">
                              Book At Clinic
                            </Link>
                         </div>
                       </div>
                       
                       <div>
                         <h3 className="text-[11px] uppercase font-black text-white/50 tracking-widest mb-4">Home Management</h3>
                         <ul className="space-y-2 mb-6">
                            {reportData.homeManagement?.map((t: string, i: number) => (
                               <li key={i} className="flex gap-2 items-start text-sm text-white"><span className="text-white/50">•</span> {t}</li>
                            ))}
                         </ul>
                         
                         <h3 className="text-[11px] uppercase font-black text-white/50 tracking-widest mb-4 text-[#EF4444]">Escalate Immediately If</h3>
                         <ul className="space-y-2">
                            {reportData.warningSigns?.map((t: string, i: number) => (
                               <li key={i} className="flex gap-2 items-start text-sm text-white"><span className="text-[#EF4444]">•</span> {t}</li>
                            ))}
                         </ul>
                       </div>
                    </div>

                    <div className="mb-12">
                       <h3 className="text-[11px] uppercase font-black text-white/50 tracking-widest mb-3">General Line of Treatment</h3>
                       <p className="text-white text-sm leading-relaxed">{reportData.generalTreatment}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-10">
                        {/* Primary actions pointing back to clinic */}
                        <a href="tel:9871155162" className={`flex flex-col items-center p-6 rounded-2xl border transition-colors ${reportData.urgencyLevel === 'RED' ? 'bg-white text-black border-white' : 'bg-black/30 border-white/20 text-white hover:bg-white/10'}`}>
                           <span className="material-symbols-outlined mb-2 text-3xl">emergency</span>
                           <span className="font-bold mb-1">Call Emergency</span>
                           <span className="text-[10px] uppercase font-black opacity-60">24/7 Response</span>
                        </a>
                        
                        <a href="https://wa.me/message/EOOITVOJLIHNO1" className={`flex flex-col items-center p-6 rounded-2xl border transition-colors ${reportData.urgencyLevel === 'GREEN' ? 'bg-white text-black border-white' : 'bg-black/30 border-white/20 text-white hover:bg-white/10'}`}>
                           <span className="material-symbols-outlined mb-2 text-3xl">video_camera_front</span>
                           <span className="font-bold mb-1">Tele-Consult</span>
                           <span className="text-[10px] uppercase font-black opacity-60">Clinic Doctor</span>
                        </a>

                        <Link to={reportData.urgencyLevel === 'RED' ? '/book?emergency=true' : '/book'} className={`flex flex-col items-center p-6 rounded-2xl border transition-colors ${reportData.urgencyLevel === 'ORANGE' ? 'bg-white text-black border-white' : 'bg-black/30 border-white/20 text-white hover:bg-white/10'}`}>
                           <span className="material-symbols-outlined mb-2 text-3xl">home_health</span>
                           <span className="font-bold mb-1">Clinic Visit</span>
                           <span className="text-[10px] uppercase font-black opacity-60">Book Appointment</span>
                        </Link>
                    </div>

                 </div>

                 <div className="mt-8 text-center pb-20">
                    <button onClick={() => window.location.reload()} className="text-white/50 hover:text-white text-xs uppercase font-bold tracking-widest transition-colors mb-4 block mx-auto">
                       Close & Return
                    </button>
                    <p className="text-white/40 text-[10px] max-w-sm mx-auto leading-relaxed">
                       🌿 Be part of the ecosystem. Let's grow together with our pets. Dr. Lily is free for every pet parent.
                    </p>
                 </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};
