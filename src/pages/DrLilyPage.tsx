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
    dob: '',
    ageUnit: 'years' as 'years' | 'months' | 'days',
    weight: '',
    vaccinations: [] as string[],
    problemDescription: '',
    files: [] as File[],
    agreedDisclaimer: false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const calculateAgeFromDOB = (dobString: string, unit: 'years' | 'months' | 'days') => {
    if (!dobString) return '';
    const birthDate = new Date(dobString);
    const today = new Date();
    
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    
    if (unit === 'days') {
      return Math.floor(diffTime / (1000 * 60 * 60 * 24)).toString();
    } else if (unit === 'months') {
      const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
      return months.toString();
    } else {
      let years = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        years--;
      }
      return years.toString();
    }
  };

  const calculateDOBFromAge = (ageValue: string, unit: 'years' | 'months' | 'days') => {
    if (!ageValue) return '';
    const age = parseInt(ageValue);
    if (isNaN(age)) return '';
    
    const date = new Date();
    if (unit === 'days') {
      date.setDate(date.getDate() - age);
    } else if (unit === 'months') {
      date.setMonth(date.getMonth() - age);
    } else {
      date.setFullYear(date.getFullYear() - age);
    }
    return date.toISOString().split('T')[0];
  };

  const handleDOBChange = (dob: string) => {
    const age = calculateAgeFromDOB(dob, formData.ageUnit);
    setFormData(prev => ({ ...prev, dob, age }));
  };

  const handleAgeChange = (age: string) => {
    const dob = calculateDOBFromAge(age, formData.ageUnit);
    setFormData(prev => ({ ...prev, age, dob }));
  };

  const handleUnitChange = (unit: 'years' | 'months' | 'days') => {
    const age = calculateAgeFromDOB(formData.dob, unit);
    setFormData(prev => ({ ...prev, ageUnit: unit, age }));
  };

  const [triageHistory, setTriageHistory] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [triageLoading, setTriageLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  
  const [othersText, setOthersText] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Login simulation states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Mock registered pets
  const mockPets = [
    { id: '1', name: 'Max', species: 'Dog / Canine', breed: 'Golden Retriever', sex: 'Male', age: '3 years', weight: '30', vaccinations: ['DHPPiL', 'Rabies'] },
    { id: '2', name: 'Luna', species: 'Cat / Feline', breed: 'Persian', sex: 'Female', age: '2 years', weight: '4' }
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsAuthenticating(false);
      // For demo, any valid email format works
      if (loginEmail.includes('@') && loginEmail.length > 5) {
        const ownerName = loginEmail.split('@')[0];
        updateFormData('ownerName', ownerName);
        updateFormData('emailAddress', loginEmail);
        setStep('select-pet');
      } else {
        alert('Please enter a valid clinical email address.');
      }
    }, 1200);
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

  const chatContainerRef = useRef<HTMLDivElement>(null);

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
    } catch (err: any) {
      console.error(err);
      alert("Even Doctors get sick. Please inform the developer that Dr. Lily is not feeling well, taken leave and needs immediate attention. Sorry I cannot help now, you call the clinic directly at 9871155162");
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
        // Trigger automatic clinic alert simulation
        console.log("Automatic Clinic Alert Sent for Case:", res.report?.consultationId);
      } else {
         throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      alert("Even Doctors get sick. Please inform the developer that Dr. Lily is not feeling well, taken leave and needs immediate attention. Sorry I cannot help now, you call the clinic directly at 9871155162");
      // Fallback
      setStep('result');
      if (!reportData) {
         setReportData({
            urgencyLevel: 'ORANGE',
            consultationId: `LILY-${Date.now()}`,
            summary: "Error during live evaluation. Please consult a vet immediately.",
            differentialDiagnoses: [],
            recommendedTests: [],
            clinicDiagnosticServices: [],
            generalTreatment: "Emergency triage failed. Contact clinic.",
            homeManagementAdvice: [],
            warningSigns: [],
            followUp: "Immediate",
            recommendedDoctors: []
         });
      }
    }
    setTriageLoading(false);
  };

  useEffect(() => {
     if (step === 'triage' && chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#A0A0B0] mb-3">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g., patient@email.com"
                      className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-2xl px-5 py-4 text-white focus:border-[#6EE7B7] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#A0A0B0] mb-3">Security Password</label>
                    <input 
                      type="password" 
                      required 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-2xl px-5 py-4 text-white focus:border-[#6EE7B7] outline-none transition-colors"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full bg-white text-black hover:bg-[#6EE7B7] transition-colors py-4 rounded-full font-bold uppercase tracking-widest text-xs mt-4 flex items-center justify-center gap-2"
                  >
                    {isAuthenticating ? (
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    ) : 'Authenticate Access'}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="relative">
                        <label className="text-xs text-[#A0A0B0] mb-2 block">Date of Birth</label>
                        <input 
                          type="date" 
                          className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4] [color-scheme:dark]" 
                          value={formData.dob} 
                          onChange={e => handleDOBChange(e.target.value)} 
                        />
                      </div>
                      <div className="relative">
                        <label className="text-xs text-[#A0A0B0] mb-2 block">Age Approx.</label>
                        <div className="flex gap-2">
                           <input 
                             type="number" 
                             className="flex-1 bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]" 
                             placeholder="Value"
                             value={formData.age} 
                             onChange={e => handleAgeChange(e.target.value)} 
                           />
                           <div className="flex bg-[#1C1C22] border border-[#2A2A35] rounded-xl p-1">
                              {(['years', 'months', 'days'] as const).map(u => (
                                <button
                                  key={u}
                                  onClick={() => handleUnitChange(u)}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${formData.ageUnit === u ? 'bg-[#6EE7B7] text-[#0D0D0F]' : 'text-[#A0A0B0] hover:text-[#F2F2F4]'}`}
                                >
                                  {u[0]}
                                </button>
                              ))}
                           </div>
                        </div>
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

                  <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
                  >
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
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="w-full min-h-screen text-white pb-24"
              >
                 {/* 1. AI Disclaimer Banner */}
                 <div className="bg-white/10 backdrop-blur-md border-b border-white/20 py-3 px-6 sticky top-0 z-50 text-center">
                    <p className="text-[10px] md:text-xs font-bold leading-relaxed max-w-4xl mx-auto">
                       ⚠️ This assessment was generated by Dr. Lily, an AI assistant trained exclusively on veterinary science. It is not a substitute for professional veterinary diagnosis or treatment. Please consult a licensed veterinarian.
                    </p>
                 </div>

                 <div id="lily-report-content" className="max-w-4xl mx-auto px-6 py-12">
                   {/* 2. Report Header */}
                   <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 pb-12 border-b border-white/20">

                    <div className="flex justify-between items-start mb-10 pb-8 border-b border-white/10">
                       <div>
                                <h1 className="font-manrope font-bold text-2xl tracking-tight text-white">Diagnosis & Recommendation Report</h1>
                                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Generated by Dr. Lily AI</p>
                             </div>
                          </div>
                          <div className="space-y-1 text-white">
                             <p className="text-sm font-medium">Owner: {formData.ownerName}</p>
                             <p className="text-sm text-white/70">Contact: {formData.mobileNumber}</p>
                             <p className="text-sm text-white/70">Report ID: <span className="font-mono">{reportData.consultationId || `LILY-RPT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`}</span></p>
                             <p className="text-sm text-white/70">Date: {new Date().toLocaleString()}</p>
                          </div>
                       <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-3xl min-w-[280px]">
                          <div className="flex items-center gap-2 mb-4">
                             <span className="material-symbols-outlined text-[#6EE7B7]">pets</span>
                             <span className="font-bold uppercase tracking-widest text-[10px] text-[#6EE7B7]">Patient Profile</span>
                          </div>
                          <h2 className="text-2xl font-manrope font-bold mb-2">{formData.petName || 'Unknown Patient'}</h2>
                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-white">
                             <div>
                                <p className="text-[10px] uppercase font-black text-white/40">Species</p>
                                <p className="text-sm font-medium">{formData.species}</p>
                             </div>
                             <div>
                                <p className="text-[10px] uppercase font-black text-white/40">Breed</p>
                                <p className="text-sm font-medium">{formData.breed}</p>
                             </div>
                             <div>
                                <p className="text-[10px] uppercase font-black text-white/40">Age / Sex</p>
                                <p className="text-sm font-medium">{formData.age} {formData.ageUnit} • {formData.sex}</p>
                             </div>
                             <div>
                                <p className="text-[10px] uppercase font-black text-white/40">Weight</p>
                                <p className="text-sm font-medium">{formData.weight} kg</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* 3. Priority Actions */}
                    <div className="mb-16">
                       <h3 className="text-[11px] uppercase font-black text-white/50 tracking-widest mb-6 border-b border-white/10 pb-2">Immediate Recommended Actions</h3>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {reportData.urgencyLevel === 'RED' ? (
                             <>
                                <div className="p-6 rounded-3xl bg-white text-black flex flex-col items-center text-center shadow-xl">
                                   <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-xs mb-4">1</span>
                                   <span className="material-symbols-outlined text-4xl mb-2 text-[#EF4444]">emergency</span>
                                   <p className="font-bold leading-tight">Visit the clinic immediately</p>
                                   <p className="text-[10px] mt-2 opacity-60">Emergency hours active</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/10 border border-white/20 flex flex-col items-center text-center">
                                   <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-black text-xs mb-4">2</span>
                                   <span className="material-symbols-outlined text-4xl mb-2 text-white">home_health</span>
                                   <p className="font-bold leading-tight text-white">Call on-call vet to home</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/10 border border-white/20 flex flex-col items-center text-center">
                                   <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-black text-xs mb-4">3</span>
                                   <span className="material-symbols-outlined text-4xl mb-2 text-white">videocam</span>
                                   <p className="font-bold leading-tight text-white">Teleconsultation</p>
                                </div>
                             </>
                          ) : reportData.urgencyLevel === 'ORANGE' ? (
                             <>
                                <div className="p-6 rounded-3xl bg-white text-black flex flex-col items-center text-center shadow-xl">
                                   <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-xs mb-4">1</span>
                                   <span className="material-symbols-outlined text-4xl mb-2 text-[#F97316]">home_health</span>
                                   <p className="font-bold leading-tight">Call clinic vet to home</p>
                                   <p className="text-[10px] mt-2 opacity-60">Recommended for moderate urgency</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/10 border border-white/20 flex flex-col items-center text-center text-white">
                                   <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-black text-xs mb-4">2</span>
                                   <span className="material-symbols-outlined text-4xl mb-2">local_hospital</span>
                                   <p className="font-bold leading-tight">Visit the clinic</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/10 border border-white/20 flex flex-col items-center text-center text-white">
                                   <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-black text-xs mb-4">3</span>
                                   <span className="material-symbols-outlined text-4xl mb-2">videocam</span>
                                   <p className="font-bold leading-tight">Teleconsultation</p>
                                </div>
                             </>
                          ) : (
                             <>
                                <div className="p-6 rounded-3xl bg-white text-black flex flex-col items-center text-center shadow-xl">
                                   <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-xs mb-4">1</span>
                                   <span className="material-symbols-outlined text-4xl mb-2 text-[#22C55E]">videocam</span>
                                   <p className="font-bold leading-tight">Teleconsultation</p>
                                   <p className="text-[10px] mt-2 opacity-60">First priority for non-urgent</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/10 border border-white/20 flex flex-col items-center text-center text-white">
                                   <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-black text-xs mb-4">2</span>
                                   <span className="material-symbols-outlined text-4xl mb-2">home_health</span>
                                   <p className="font-bold leading-tight">Call vet to home</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/10 border border-white/20 flex flex-col items-center text-center text-white">
                                   <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-black text-xs mb-4">3</span>
                                   <span className="material-symbols-outlined text-4xl mb-2">event_available</span>
                                   <p className="font-bold leading-tight">Book in-clinic appointment</p>
                                </div>
                             </>
                          )}
                       </div>
                    </div>

                    <div className="mb-16 p-8 bg-white/10 rounded-[2rem] border border-white/20 backdrop-blur-md">
                       <h3 className="text-[11px] uppercase font-black text-white/50 tracking-widest mb-4">Lily's Summary of Symptoms</h3>
                       <p className="text-lg font-medium leading-relaxed italic text-white">"{reportData.summary}"</p>
                    </div>

                    {reportData.differentialDiagnoses?.length > 0 && (
                      <div className="mb-12">
                         <h3 className="text-[11px] uppercase font-black text-white/50 tracking-widest mb-6">Differential Diagnoses</h3>
                         <div className="space-y-4">
                            {reportData.differentialDiagnoses.map((d: any, i: number) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                                   <div className="flex justify-between items-end mb-4 text-white">
                                      <div>
                                         <p className="text-[10px] uppercase font-black text-white/40 mb-1">Suspected Condition</p>
                                         <h4 className="text-xl font-bold">{d.condition}</h4>
                                      </div>
                                      <div className="text-right">
                                         <p className="text-2xl font-black font-manrope">{typeof d.probability === 'number' ? d.probability + '%' : d.probability}</p>
                                      </div>
                                   </div>
                                   <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden mb-6">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${typeof d.probability === 'number' ? d.probability : parseInt(d.probability) || 50}%` }}
                                        transition={{ delay: 0.5, duration: 1.5 }}
                                        className="bg-white h-full"
                                      ></motion.div>
                                   </div>
                                   <div className="text-white">
                                      <p className="text-[10px] uppercase font-black text-white/40 mb-2">Clinical Reasoning</p>
                                      <p className="text-sm text-white/80 leading-relaxed">{d.reasoning}</p>
                                   </div>
                                </div>
                            ))}
                         </div>
                      </div>
                    )}

                    {/* 6. Diagnostic Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 text-white">
                       <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                          <h3 className="text-[11px] uppercase font-black text-white/50 tracking-widest mb-6">Recommended Tests</h3>
                          <ul className="space-y-3">
                             {reportData.recommendedTests?.map((t: string, i: number) => (
                                <li key={i} className="flex gap-3 items-start text-sm">
                                   <span className="material-symbols-outlined text-sm mt-0.5">check_circle</span>
                                   <span>{t}</span>
                                </li>
                             ))}
                          </ul>
                       </div>
                       
                       <div className="bg-white text-black p-8 rounded-[2rem] shadow-xl">
                          <h3 className="text-[11px] uppercase font-black text-black/40 tracking-widest mb-6 border-b border-black/10 pb-2">In-Clinic Diagnostics</h3>
                          <div className="space-y-4 mb-8">
                             {reportData.clinicDiagnosticServices?.map((s: any, i: number) => (
                                <div key={i} className="flex justify-between items-center border-b border-black/10 pb-3">
                                   <div className="flex-1">
                                      <p className="font-bold text-sm">{s.service}</p>
                                      <p className="text-[10px] opacity-60">{s.description}</p>
                                   </div>
                                   {s.inHouse && <span className="text-[9px] font-black uppercase bg-black text-white px-2 py-0.5 rounded ml-2">In-House</span>}
                                </div>
                             ))}
                          </div>
                          <button className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-lg">
                             Book Test at Clinic <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </button>
                       </div>
                    </div>

                    {/* 7. Treatment & Management */}
                    <div className="space-y-8 mb-16 text-white">
                       <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                          <h3 className="text-[11px] uppercase font-black text-white/50 tracking-widest mb-4">General Line of Treatment</h3>
                          <p className="text-sm leading-relaxed text-white/80">{reportData.generalTreatment}</p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                             <h3 className="text-[11px] uppercase font-black text-white/50 tracking-widest mb-6">Home Management Advice</h3>
                             <ul className="space-y-3">
                                {(reportData.homeManagementAdvice || reportData.homeManagement)?.map((t: string, i: number) => (
                                   <li key={i} className="flex gap-3 items-start text-sm">
                                      <span className="material-symbols-outlined text-sm mt-0.5 text-[#6EE7B7]">house</span>
                                      <span>{t}</span>
                                   </li>
                                ))}
                             </ul>
                          </div>

                          <div className="bg-white/5 border border-white/20 p-8 rounded-[2rem]">
                             <h3 className="text-[11px] uppercase font-black text-white/50 tracking-widest mb-6 text-[#EF4444]">Escalate Immediately If</h3>
                             <ul className="space-y-3">
                                {reportData.warningSigns?.map((t: string, i: number) => (
                                   <li key={i} className="flex gap-3 items-start text-sm text-white">
                                      <span className="material-symbols-outlined text-sm mt-0.5 text-[#EF4444]">warning</span>
                                      <span>{t}</span>
                                   </li>
                                ))}
                             </ul>
                          </div>
                       </div>
                    </div>

                    {/* 8. Doctors Recommendation */}
                    <div className="mb-16">
                       <h3 className="text-[11px] uppercase font-black text-white/50 tracking-widest mb-6 text-center">Recommended Doctors for this Case</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {reportData.recommendedDoctors?.map((doc: any, i: number) => (
                             <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 flex flex-col text-white">
                                <div className="flex items-center gap-3 mb-4">
                                   <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                      <span className="material-symbols-outlined">person</span>
                                   </div>
                                   <div>
                                      <h4 className="font-bold text-sm">{doc.name}</h4>
                                      {doc.specialty && <p className="text-[10px] uppercase font-black text-white/40">{doc.specialty}</p>}
                                   </div>
                                </div>
                                <p className="text-[11px] text-white/70 italic mb-6 leading-relaxed">"{doc.reason}"</p>
                                <div className="mt-auto space-y-2">
                                   <button className="w-full bg-white text-black py-2.5 rounded-full font-bold uppercase tracking-widest text-[9px] hover:bg-white/80 transition-colors">Book Appt</button>
                                   <button className="w-full border border-white/30 text-white py-2.5 rounded-full font-bold uppercase tracking-widest text-[9px] hover:bg-white/10 transition-colors">Teleconsult</button>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* 9. Follow Up & Contact */}
                    <div className="flex flex-col md:flex-row gap-6 mb-16">
                       <div className="flex-1 bg-white text-black p-8 rounded-[2rem] text-center shadow-xl">
                          <h3 className="text-[11px] uppercase font-black text-black/40 tracking-widest mb-2">Automated Follow-up</h3>
                          <p className="text-xl font-bold mb-1">Re-consult Dr. Lily in {reportData.followUp || '48 hours'}</p>
                          <p className="text-[10px] opacity-60">A reminder will be sent to your email</p>
                       </div>
                       
                       {(reportData.urgencyLevel === 'RED' || reportData.urgencyLevel === 'ORANGE') && (
                          <div className={`flex-1 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center border-4 border-white inline-block text-white ${reportData.urgencyLevel === 'RED' ? 'bg-[#EF4444]' : 'bg-[#F97316]'}`}>
                             <h3 className="text-[11px] uppercase font-black text-white/50 tracking-widest mb-3">Clinic Emergency Line</h3>
                             <p className="text-2xl font-black mb-4">98711-55162</p>
                             <a href="tel:9871155162" className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-2xl">Tap to Call Now</a>
                          </div>
                       )}
                    </div>

                    {/* 10. Sharing & CTAs */}
                    <div className="flex justify-center mb-20">
                       <button 
                         onClick={() => {
                           const element = document.getElementById('lily-report-content');
                           if (!element) return;
                           
                           // Dynamically import to avoid slowing down initial load
                           Promise.all([
                             import('html-to-image'),
                             import('jspdf')
                           ]).then(([htmlToImage, jsPDFModule]) => {
                             htmlToImage.toPng(element, { 
                               cacheBust: true, 
                               backgroundColor: '#0D0D0F',
                               pixelRatio: 2 // Higher quality
                             })
                               .then((dataUrl) => {
                                 const jsPDF = jsPDFModule.jsPDF;
                                 const pdf = new jsPDF('p', 'mm', 'a4');
                                 const margin = 10;
                                 const pdfWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
                                 const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
                                 
                                 pdf.addImage(dataUrl, 'PNG', margin, margin, pdfWidth, pdfHeight);
                                 pdf.save(`DrLily-Report-${formData.petName}-${new Date().getTime()}.pdf`);
                               })
                               .catch((err) => {
                                 console.error("PDF generation error:", err);
                                 alert("Error generating PDF. Please try again.");
                               });
                           }).catch(err => {
                             console.error("PDF generator library load error:", err);
                             alert("Error loading PDF generator.");
                           });
                         }}
                         className="p-8 bg-[#6EE7B7] text-[#0D0D0F] rounded-2xl flex flex-col items-center gap-4 hover:bg-[#4ADBA0] transition-all transform hover:scale-105 shadow-xl min-w-[240px]"
                       >
                          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
                          </div>
                          <div className="text-center">
                            <span className="text-xs uppercase font-black tracking-widest block mb-1">Download PDF</span>
                            <span className="text-[10px] opacity-60 font-medium">Full Diagnosis & Recommendation</span>
                          </div>
                       </button>
                    </div>

                    <div className="text-center text-white">
                       <p className="text-sm font-medium mb-2">🌿 Be part of the ecosystem. Let's grow together with our pets.</p>
                       <p className="text-xs text-white/50 max-w-2xl mx-auto leading-relaxed mb-8">
                          Dr. Lily is free for every pet parent. Join thousands of pet owners, vets, clinics, and care providers building the future of pet healthcare — together.
                       </p>
                       <a href="https://senvetcare.com" className="inline-block text-[10px] font-black uppercase tracking-[0.3em] bg-white text-black px-10 py-4 rounded-full">Explore Ecosystem</a>
                       <button onClick={() => window.location.reload()} className="mt-12 text-white/30 hover:text-white text-[10px] uppercase font-bold tracking-[0.2em] block mx-auto transition-colors">Close & Return</button>
                    </div>
                 </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};
