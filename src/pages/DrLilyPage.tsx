import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { getTriageNextStep } from "../services/ai";
import { auth, db } from "../services/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const SPECIES = [
  { id: "Dog / Canine", name: "Dog", icon: "pets" },
  { id: "Cat / Feline", name: "Cat", icon: "pets" },
  { id: "Rabbit", name: "Rabbit", icon: "cruelty_free" },
  { id: "Parrot / Bird", name: "Bird", icon: "flutter_dash" },
  { id: "Turtle / Tortoise", name: "Turtle", icon: "pest_control" },
  { id: "Fish / Aquatic", name: "Fish", icon: "set_meal" },
  { id: "Guinea Pig", name: "Guinea Pig", icon: "cruelty_free" },
  { id: "Other", name: "Other", icon: "category" },
  { id: "Unknown", name: "Unknown", icon: "help_outline" },
];

const BREEDS: Record<string, string[]> = {
  "Dog / Canine": [
    "Unknown",
    "Labrador Retriever",
    "Golden Retriever",
    "German Shepherd",
    "Pug",
    "Shih Tzu",
    "Indie",
    "Beagle",
    "Other",
  ],
  "Cat / Feline": [
    "Unknown",
    "Persian",
    "Siamese",
    "Maine Coon",
    "Bengal",
    "Indie/Stray",
    "British Shorthair",
    "Other",
  ],
  Rabbit: ["Unknown", "Holland Lop", "Netherland Dwarf", "Lionhead", "Other"],
  "Parrot / Bird": [
    "Unknown",
    "Parakeet",
    "Cockatiel",
    "Lovebird",
    "African Grey",
    "Other",
  ],
  "Turtle / Tortoise": [
    "Unknown",
    "Red-Eared Slider",
    "Indian Tent Turtle",
    "Other",
  ],
  "Fish / Aquatic": ["Unknown", "Goldfish", "Betta", "Guppy", "Other"],
  "Guinea Pig": ["Unknown", "American", "Abyssinian", "Peruvian", "Other"],
  Other: ["Unknown"],
  Unknown: ["Unknown"],
};

const VACCINATIONS: Record<string, string[]> = {
  "Dog / Canine": [
    "Unknown / Not Known",
    "DHPPiL",
    "Rabies",
    "Bordetella",
    "Leptospira",
  ],
  "Cat / Feline": ["Unknown / Not Known", "FVRCP", "Rabies", "FeLV"],
  Rabbit: ["Unknown / Not Known", "Myxomatosis", "RVHD1", "RVHD2"],
  "Parrot / Bird": [
    "Unknown / Not Known",
    "PBFD",
    "Polyomavirus",
    "Newcastle Disease",
  ],
};

const LILY_AVATAR =
  "https://ik.imagekit.io/senvetcare/Dr.%20Lily/Dr%20Lily.webp";

type ConsultationStep =
  | "intro"
  | "login"
  | "select-pet"
  | "pet-details"
  | "history"
  | "problem"
  | "evaluation"
  | "triage"
  | "result";
type Message = { role: string; content: string };

export const DrLilyPage = () => {
  const [step, setStep] = useState<ConsultationStep>("intro");
  const [formData, setFormData] = useState({
    ownerName: "",
    mobileNumber: "",
    emailAddress: "",
    petName: "",
    species: "",
    breed: "",
    sex: "",
    age: "",
    dob: "",
    ageUnit: "years" as "years" | "months" | "days",
    weight: "",
    vaccinations: [] as string[],
    problemDescription: "",
    files: [] as File[],
    agreedDisclaimer: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const calculateAgeFromDOB = (
    dobString: string,
    unit: "years" | "months" | "days",
  ) => {
    if (!dobString) return "";
    const birthDate = new Date(dobString);
    const today = new Date();

    const diffTime = Math.abs(today.getTime() - birthDate.getTime());

    if (unit === "days") {
      return Math.floor(diffTime / (1000 * 60 * 60 * 24)).toString();
    } else if (unit === "months") {
      const months =
        (today.getFullYear() - birthDate.getFullYear()) * 12 +
        (today.getMonth() - birthDate.getMonth());
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

  const calculateDOBFromAge = (
    ageValue: string,
    unit: "years" | "months" | "days",
  ) => {
    if (!ageValue) return "";
    const age = parseInt(ageValue);
    if (isNaN(age)) return "";

    const date = new Date();
    if (unit === "days") {
      date.setDate(date.getDate() - age);
    } else if (unit === "months") {
      date.setMonth(date.getMonth() - age);
    } else {
      date.setFullYear(date.getFullYear() - age);
    }
    return date.toISOString().split("T")[0];
  };

  const handleDOBChange = (dob: string) => {
    const age = calculateAgeFromDOB(dob, formData.ageUnit);
    setFormData((prev) => ({ ...prev, dob, age }));
  };

  const handleAgeChange = (age: string) => {
    const dob = calculateDOBFromAge(age, formData.ageUnit);
    setFormData((prev) => ({ ...prev, age, dob }));
  };

  const handleUnitChange = (unit: "years" | "months" | "days") => {
    const age = calculateAgeFromDOB(formData.dob, unit);
    setFormData((prev) => ({ ...prev, ageUnit: unit, age }));
  };

  const [triageHistory, setTriageHistory] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [triageLoading, setTriageLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const [othersText, setOthersText] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Login simulation states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Mock registered pets
  const mockPets = [
    {
      id: "1",
      name: "Max",
      species: "Dog / Canine",
      breed: "Golden Retriever",
      sex: "Male",
      age: "3 years",
      weight: "30",
      vaccinations: ["DHPPiL", "Rabies"],
    },
    {
      id: "2",
      name: "Luna",
      species: "Cat / Feline",
      breed: "Persian",
      sex: "Female",
      age: "2 years",
      weight: "4",
    },
  ];

  const handleGoogleAuth = async () => {
    setIsAuthenticating(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      if (userCredential.user) {
        const userEmail = userCredential.user.email?.toLowerCase() || "";
        const ownerName =
          userCredential.user.displayName || userEmail.split("@")[0] || "";

        // Save user data to Firestore
        const userRef = doc(db, "users", userCredential.user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: userCredential.user.email,
            role: "pet-owner",
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          });
        } else {
          await setDoc(
            userRef,
            {
              lastLoginAt: serverTimestamp(),
            },
            { merge: true },
          );
        }

        updateFormData("ownerName", ownerName);
        updateFormData("emailAddress", userEmail);
        setStep("select-pet");
      }
    } catch (error: any) {
      console.error("Google Auth failed:", error);
      alert(`Authentication Failed: ${error.message}`);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSelectMockPet = (pet: (typeof mockPets)[0]) => {
    setFormData((prev) => ({
      ...prev,
      petName: pet.name,
      species: pet.species,
      breed: pet.breed,
      sex: pet.sex,
      age: pet.age,
      weight: pet.weight,
      vaccinations: pet.vaccinations || [],
    }));
    setStep("history");
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        (f) => f.size <= 10 * 1024 * 1024,
      );
      updateFormData("files", [...formData.files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const updated = [...formData.files];
    updated.splice(index, 1);
    updateFormData("files", updated);
  };

  const handleSpeciesSelect = (speciesId: string) => {
    setFormData((prev) => ({
      ...prev,
      species: speciesId,
      breed: speciesId === "Unknown" ? "Unknown" : prev.breed,
      vaccinations: [],
    }));
  };

  const saveReport = async (report: any) => {
    if (auth.currentUser) {
      const reportId = report.consultationId || `LILY-${Date.now()}`;
      try {
        await setDoc(doc(db, "triage_reports", reportId), {
          ownerId: auth.currentUser.uid,
          petName: formData.petName,
          species: formData.species,
          createdAt: serverTimestamp(),
          ...report,
        });
      } catch (err) {
        console.error("Failed to save report", err);
      }
    }
  };

  const handleStartTriage = async () => {
    setStep("evaluation");
    try {
      const initialHistory = [
        { role: "user", content: "Let's begin the triage assessment." },
      ];
      setTriageHistory(initialHistory);
      const res = await getTriageNextStep(formData, initialHistory);
      if (res.status === "question" && res.question) {
        setCurrentQuestion(res);
        setStep("triage");
      } else if ((res.status === "complete" && res.report) || res.report) {
        setReportData(res.report);
        saveReport(res.report);
        setStep("result");
      } else {
        // fallback incase Gemini decides it's complete without report
        const fallbackReport = {
          urgencyLevel: "ORANGE",
          consultationId: `LILY-${Date.now()}`,
          clinicalAlertRationale: "General triage protocol (fallback: could not reach AI Triage Engine).",
          soap: {
            subjective: "Owner reported issues with pet's health during assessment.",
            objective: "Unable to complete triage - contact clinic for full assessment.",
            assessment: "Triage assessment service unavailable.",
            plan: "Immediate physical veterinary consultation required."
          },
          differentialDiagnoses: [],
          recommendedTests: [{ testName: "Clinical Examination", description: "Standard physical exam by a vet." }],
          generalTreatment: "Requires physical evaluation by a vet.",
          homeManagementAdvice: ["Keep pet calm and hydrated."],
          warningSigns: ["Worsening of current symptoms"],
          followUp: "Consult the clinic immediately.",
        };
        setReportData(fallbackReport);
        saveReport(fallbackReport);
        setStep("result");
      }
    } catch (err: any) {
      console.error(err);
      alert(
        "Even Doctors get sick. Please inform the developer that Dr. Lily is not feeling well, taken leave and needs immediate attention. Sorry I cannot help now, you call the clinic directly at 9871155162",
      );
      setStep("problem");
    }
  };

  const handleTriageAnswer = async (answer: string) => {
    const finalAnswer = answer === "Others" ? `Others: ${othersText}` : answer;

    const newHistory = [
      ...triageHistory,
      { role: "assistant", content: currentQuestion.question },
      { role: "user", content: finalAnswer },
    ];
    setTriageHistory(newHistory);
    setTriageLoading(true);
    setCurrentQuestion(null);
    setOthersText("");
    setSelectedOption(null);

    try {
      const res = await getTriageNextStep(formData, newHistory);
      if (res.status === "question" && res.question) {
        setCurrentQuestion(res);
      } else if (res.status === "complete" || res.report) {
        setReportData(res.report);
        saveReport(res.report);
        setStep("result");
        // Trigger automatic clinic alert simulation
        console.log(
          "Automatic Clinic Alert Sent for Case:",
          res.report?.consultationId,
        );
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      alert(
        "Even Doctors get sick. Please inform the developer that Dr. Lily is not feeling well, taken leave and needs immediate attention. Sorry I cannot help now, you call the clinic directly at 9871155162",
      );
      // Fallback
      setStep("result");
      if (!reportData) {
        setReportData({
          urgencyLevel: "ORANGE",
          consultationId: `LILY-${Date.now()}`,
          summary:
            "Error during live evaluation. Please consult a vet immediately.",
          differentialDiagnoses: [],
          recommendedTests: [],
          clinicDiagnosticServices: [],
          generalTreatment: "Emergency triage failed. Contact clinic.",
          homeManagementAdvice: [],
          warningSigns: [],
          followUp: "Immediate",
          recommendedDoctors: [],
        });
      }
    }
    setTriageLoading(false);
  };

  useEffect(() => {
    if (step === "triage" && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [triageHistory, currentQuestion, step]);

  const bgGradient = step === "result" ? "bg-zinc-100" : "bg-[#0D0D0F]";

  return (
    <main
      className={`min-h-screen text-white font-inter relative flex flex-col lg:flex-row overflow-hidden transition-colors duration-1000 ${bgGradient}`}
    >
      {/* Mobile background image */}
      {step !== "result" && (
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
      {step !== "result" && (
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
              <span className="text-[10px] font-black tracking-[0.2em] text-[#6EE7B7] uppercase">
                Triage Engine Online
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 min-h-screen relative z-10 overflow-y-auto ${step === "result" ? "w-full" : "pt-24 pb-12"}`}
      >
        <div
          className={`max-w-3xl mx-auto px-6 ${step === "result" ? "py-12" : ""}`}
        >
          <AnimatePresence mode="wait">
            {step === "intro" && (
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
                  Is your pet already registered with us, or shall we create a
                  new profile today? My triage system will evaluate your pet's
                  symptoms using purely clinical protocols.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <button
                    onClick={() => setStep("pet-details")}
                    className="bg-[#6EE7B7] text-[#0D0D0F] hover:bg-[#4ADBA0] transition-colors py-4 px-8 rounded-full font-bold uppercase tracking-widest text-xs"
                  >
                    Create New Profile
                  </button>
                  <button
                    onClick={handleGoogleAuth}
                    disabled={isAuthenticating}
                    className="bg-[#1C1C22] text-[#F2F2F4] border border-[#2A2A35] hover:border-[#606070] transition-colors py-4 px-8 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isAuthenticating ? (
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Login to continue
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {step === "select-pet" && (
              <motion.div
                key="select-pet"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-xl mx-auto pt-10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={() => setStep("login")}
                    className="w-10 h-10 rounded-full bg-[#1C1C22] border border-[#2A2A35] flex items-center justify-center hover:bg-[#2A2A35] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_back
                    </span>
                  </button>
                  <h2 className="font-manrope font-bold text-3xl text-white">
                    Select Patient
                  </h2>
                </div>

                <p className="text-[#A0A0B0] mb-8">
                  Welcome back, {formData.ownerName}. Which pet needs Dr. Lily's
                  attention today?
                </p>

                <div className="grid gap-4 mb-8">
                  {mockPets.map((pet) => (
                    <button
                      key={pet.id}
                      onClick={() => handleSelectMockPet(pet)}
                      className="bg-[#1C1C22] border border-[#2A2A35] p-6 rounded-[2rem] hover:border-[#6EE7B7]/50 hover:bg-[#2A2A35]/50 transition-all text-left flex items-center gap-6 group"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#2A2A35] flex items-center justify-center group-hover:bg-[#6EE7B7]/20 transition-colors text-white group-hover:text-[#6EE7B7]">
                        <span className="material-symbols-outlined text-3xl">
                          pets
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-manrope font-bold text-xl text-white mb-1">
                          {pet.name}
                        </h3>
                        <p className="text-[#A0A0B0] text-sm">
                          {pet.breed} • {pet.age}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-[#606070] group-hover:text-[#6EE7B7] transition-colors">
                        chevron_right
                      </span>
                    </button>
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setStep("pet-details")}
                    className="text-[#6EE7B7] text-sm font-bold uppercase tracking-widest hover:text-white transition-colors"
                  >
                    + Register New Pet
                  </button>
                </div>
              </motion.div>
            )}

            {step === "pet-details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <h2 className="font-manrope font-bold text-3xl mb-10 text-[#F2F2F4]">
                  Owner & Pet Information
                </h2>

                <div className="space-y-12">
                  <div className="bg-[#141418] border border-[#2A2A35] rounded-[2rem] p-8 space-y-6">
                    <h3 className="text-sm font-bold text-[#A0A0B0] uppercase tracking-widest border-b border-[#2A2A35] pb-4 mb-6">
                      Owner Profile
                    </h3>

                    <div className="space-y-4">
                      <div className="relative">
                        <label className="text-xs text-[#A0A0B0] mb-2 block">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]"
                          value={formData.ownerName}
                          onChange={(e) =>
                            updateFormData("ownerName", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <label className="text-xs text-[#A0A0B0] mb-2 block">
                            Mobile Number *
                          </label>
                          <input
                            type="tel"
                            className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]"
                            value={formData.mobileNumber}
                            onChange={(e) =>
                              updateFormData("mobileNumber", e.target.value)
                            }
                          />
                        </div>
                        <div className="relative">
                          <label className="text-xs text-[#A0A0B0] mb-2 block">
                            Email Address *{" "}
                            <span className="text-[#606070]">
                              (Reports sent here)
                            </span>
                          </label>
                          <input
                            type="email"
                            className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]"
                            value={formData.emailAddress}
                            onChange={(e) =>
                              updateFormData("emailAddress", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#141418] border border-[#2A2A35] rounded-[2rem] p-8 space-y-6">
                    <h3 className="text-sm font-bold text-[#A0A0B0] uppercase tracking-widest border-b border-[#2A2A35] pb-4 mb-6">
                      Patient Profile
                    </h3>

                    <div className="relative mb-6">
                      <label className="text-xs text-[#A0A0B0] mb-2 block">
                        Pet's Name
                      </label>
                      <input
                        type="text"
                        className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]"
                        value={formData.petName}
                        onChange={(e) =>
                          updateFormData("petName", e.target.value)
                        }
                      />
                    </div>

                    <div className="mb-6">
                      <label className="text-xs text-[#A0A0B0] mb-3 block">
                        Species *
                      </label>
                      <div className="flex w-full overflow-x-auto gap-3 pb-2 custom-scrollbar">
                        {SPECIES.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => handleSpeciesSelect(s.id)}
                            className={`flex-shrink-0 px-5 py-3 rounded-xl border flex items-center gap-2 transition-all ${formData.species === s.id ? "bg-[#6EE7B7]/10 border-[#6EE7B7] text-[#6EE7B7]" : "bg-[#1C1C22] border-[#2A2A35] text-[#A0A0B0] hover:border-[#606070]"}`}
                          >
                            <span className="material-symbols-outlined text-lg">
                              {s.icon}
                            </span>
                            <span className="text-sm font-bold">{s.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {formData.species && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {formData.species !== "Unknown" && (
                          <div className="relative">
                            <label className="text-xs text-[#A0A0B0] mb-2 block">
                              Breed
                            </label>
                            <select
                              className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]"
                              value={formData.breed}
                              onChange={(e) =>
                                updateFormData("breed", e.target.value)
                              }
                            >
                              <option value="">Select Breed</option>
                              {BREEDS[formData.species]?.map((b) => (
                                <option key={b} value={b}>
                                  {b}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        <div className="relative">
                          <label className="text-xs text-[#A0A0B0] mb-2 block">
                            Sex
                          </label>
                          <select
                            className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]"
                            value={formData.sex}
                            onChange={(e) =>
                              updateFormData("sex", e.target.value)
                            }
                          >
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
                        <label className="text-xs text-[#A0A0B0] mb-2 block">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4] [color-scheme:dark]"
                          value={formData.dob}
                          onChange={(e) => handleDOBChange(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <label className="text-xs text-[#A0A0B0] mb-2 block">
                          Age Approx.
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            className="flex-1 bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]"
                            placeholder="Value"
                            value={formData.age}
                            onChange={(e) => handleAgeChange(e.target.value)}
                          />
                          <div className="flex bg-[#1C1C22] border border-[#2A2A35] rounded-xl p-1">
                            {(["years", "months", "days"] as const).map((u) => (
                              <button
                                key={u}
                                onClick={() => handleUnitChange(u)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${formData.ageUnit === u ? "bg-[#6EE7B7] text-[#0D0D0F]" : "text-[#A0A0B0] hover:text-[#F2F2F4]"}`}
                              >
                                {u[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <label className="text-xs text-[#A0A0B0] mb-2 block">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full bg-[#1C1C22] border border-[#2A2A35] rounded-xl py-3 px-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4]"
                          value={formData.weight}
                          onChange={(e) =>
                            updateFormData("weight", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={
                      !formData.ownerName ||
                      !formData.mobileNumber ||
                      !formData.emailAddress ||
                      !formData.species
                    }
                    onClick={() => setStep("history")}
                    className="w-full bg-[#6EE7B7] text-[#0D0D0F] py-5 rounded-full font-bold uppercase tracking-widest hover:bg-[#4ADBA0] transition-colors disabled:opacity-50"
                  >
                    Continue to Medical History →
                  </button>
                </div>
              </motion.div>
            )}

            {step === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <button
                  onClick={() => setStep("pet-details")}
                  className="mb-6 flex items-center gap-2 text-[#A0A0B0] hover:text-[#F2F2F4]"
                >
                  <span className="material-symbols-outlined text-sm">
                    arrow_back
                  </span>{" "}
                  Back
                </button>
                <h2 className="font-manrope font-bold text-3xl mb-10 text-[#F2F2F4]">
                  Vaccination Status
                </h2>

                {formData.species !== "Unknown" &&
                VACCINATIONS[formData.species] ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    {VACCINATIONS[formData.species].map((v) => (
                      <button
                        key={v}
                        onClick={() => {
                          // If unknown selected, clear others. If others selected, clear unknown.
                          let updated = [...formData.vaccinations];
                          if (v === "Unknown / Not Known") {
                            updated = updated.includes(v) ? [] : [v];
                          } else {
                            updated = updated.filter(
                              (item) => item !== "Unknown / Not Known",
                            );
                            if (updated.includes(v)) {
                              updated = updated.filter((item) => item !== v);
                            } else {
                              updated.push(v);
                            }
                          }
                          updateFormData("vaccinations", updated);
                        }}
                        className={`p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${formData.vaccinations.includes(v) ? "bg-[#6EE7B7]/10 border-[#6EE7B7] text-[#6EE7B7]" : "bg-[#141418] border-[#2A2A35] text-[#F2F2F4] hover:border-[#606070]"}`}
                      >
                        <div
                          className={`w-5 h-5 flex-shrink-0 rounded flex items-center justify-center border ${formData.vaccinations.includes(v) ? "bg-[#6EE7B7] border-[#6EE7B7]" : "border-[#606070]"}`}
                        >
                          {formData.vaccinations.includes(v) && (
                            <span className="material-symbols-outlined text-xs text-[#0D0D0F] font-bold">
                              check
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium">{v}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#A0A0B0] mb-12">
                    No vaccination data tracking available for this species.
                  </p>
                )}

                <button
                  onClick={() => setStep("problem")}
                  className="w-full bg-[#6EE7B7] text-[#0D0D0F] py-5 rounded-full font-bold uppercase tracking-widest hover:bg-[#4ADBA0] transition-colors"
                >
                  Continue to Chief Complaint →
                </button>
              </motion.div>
            )}

            {step === "problem" && (
              <motion.div
                key="problem"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <button
                  onClick={() => setStep("history")}
                  className="mb-6 flex items-center gap-2 text-[#A0A0B0] hover:text-[#F2F2F4]"
                >
                  <span className="material-symbols-outlined text-sm">
                    arrow_back
                  </span>{" "}
                  Back
                </button>
                <h2 className="font-manrope font-bold text-3xl mb-10 text-[#F2F2F4]">
                  Chief Complaint
                </h2>

                <div className="space-y-8">
                  <div className="relative">
                    <label className="text-xs text-[#A0A0B0] mb-2 block">
                      Tell us what's going on (Optional)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="e.g. He started vomiting this morning and hasn't eaten."
                      className="w-full bg-[#141418] border border-[#2A2A35] rounded-xl p-4 focus:outline-none focus:border-[#6EE7B7] text-[#F2F2F4] resize-none"
                      value={formData.problemDescription}
                      onChange={(e) =>
                        updateFormData("problemDescription", e.target.value)
                      }
                    ></textarea>
                  </div>

                  <div className="bg-[#141418] border border-[#2A2A35] rounded-2xl p-6">
                    <p className="text-sm font-bold text-[#F2F2F4] mb-2">
                      Upload Files (Optional)
                    </p>
                    <p className="text-xs text-[#A0A0B0] mb-4">
                      Attach medical reports or photos (JPG/PNG/PDF).
                    </p>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2 bg-[#1C1C22] border border-[#2A2A35] rounded-lg text-sm font-medium hover:bg-[#2A2A35] transition-colors w-full flex items-center justify-center gap-2 text-[#F2F2F4]"
                    >
                      <span className="material-symbols-outlined text-lg">
                        upload
                      </span>{" "}
                      Browse
                    </button>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.png"
                    />

                    {formData.files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {formData.files.map((file, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-[#1C1C22] p-2 rounded border border-[#2A2A35]"
                          >
                            <span className="text-xs truncate text-[#A0A0B0]">
                              {file.name}
                            </span>
                            <button
                              onClick={() => removeFile(i)}
                              className="text-[#EF4444] hover:text-red-400"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                close
                              </span>
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
                      onChange={(e) =>
                        updateFormData("agreedDisclaimer", e.target.checked)
                      }
                    />
                    <span className="text-xs text-[#A0A0B0] leading-relaxed">
                      I understand that I am interacting with Dr. Lily, an AI
                      veterinary assistant, and not a licensed veterinarian. Her
                      assessments are for general guidance only and must not
                      replace professional diagnosis.
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

            {step === "evaluation" && (
              <motion.div
                key="summary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full flex flex-col items-center justify-center h-64 text-center"
              >
                <div className="w-16 h-16 border-4 border-[#6EE7B7]/20 border-t-[#6EE7B7] rounded-full animate-spin mb-6"></div>
                <h2 className="font-manrope font-bold text-2xl text-[#F2F2F4] mb-2">
                  Analyzing Clinical Data...
                </h2>
                <p className="text-[#A0A0B0] text-sm">
                  Please wait while Dr. Lily builds the triage matrix.
                </p>
              </motion.div>
            )}

            {step === "triage" && (
              <motion.div
                key="triage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col h-[70vh] max-h-[700px] border border-[#2A2A35] rounded-3xl bg-[#141418] overflow-hidden"
              >
                <div className="bg-[#1C1C22] p-4 border-b border-[#2A2A35] flex items-center gap-3">
                  <img
                    src={LILY_AVATAR}
                    className="w-10 h-10 rounded-full border border-[#2A2A35] grayscale"
                    alt="Dr Lily"
                  />
                  <div>
                    <p className="font-bold text-[#F2F2F4] text-sm">Dr. Lily</p>
                    <p className="text-[10px] text-[#6EE7B7] uppercase tracking-widest font-black">
                      AI Triage Module
                    </p>
                  </div>
                </div>

                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
                >
                  {triageHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-[#6EE7B7]/10 border border-[#6EE7B7]/30 text-[#6EE7B7] rounded-br-none" : "bg-[#1C1C22] border border-[#2A2A35] text-[#F2F2F4] rounded-bl-none"}`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {currentQuestion && !triageLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[90%] p-5 rounded-2xl rounded-bl-none bg-[#1C1C22] border border-[#2A2A35] text-[#F2F2F4]">
                        <p className="mb-4 text-sm leading-relaxed">
                          {currentQuestion.question}
                        </p>

                        <div className="space-y-3">
                          {currentQuestion.options?.map(
                            (opt: string, i: number) => (
                              <div key={i}>
                                <button
                                  onClick={() => setSelectedOption(opt)}
                                  className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${selectedOption === opt ? "bg-[#6EE7B7]/20 border-[#6EE7B7]" : "bg-[#141418] border-[#2A2A35] hover:border-[#606070]"}`}
                                >
                                  {opt}
                                </button>
                                {opt === "Others" &&
                                  selectedOption === "Others" && (
                                    <div className="mt-2 flex gap-2">
                                      <input
                                        type="text"
                                        autoFocus
                                        value={othersText}
                                        onChange={(e) =>
                                          setOthersText(e.target.value)
                                        }
                                        placeholder="Please specify..."
                                        className="flex-1 bg-[#0D0D0F] border border-[#2A2A35] rounded-lg px-3 py-2 text-sm text-[#F2F2F4] focus:outline-none focus:border-[#6EE7B7]"
                                      />
                                    </div>
                                  )}
                              </div>
                            ),
                          )}
                        </div>
                        <button
                          disabled={
                            !selectedOption ||
                            (selectedOption === "Others" && !othersText.trim())
                          }
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
                          <span
                            className="w-2 h-2 rounded-full bg-[#A0A0B0] animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></span>
                          <span
                            className="w-2 h-2 rounded-full bg-[#A0A0B0] animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatBottomRef}></div>
                </div>
              </motion.div>
            )}

            {step === "result" && reportData && (
  <motion.div
    key="result"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="w-full min-h-screen bg-zinc-100 pb-24 flex flex-col items-center"
  >
    <div className="w-full flex justify-center py-12 px-2 sm:px-6 overflow-x-auto">
      <div
        id="lily-report-content"
        className="w-full max-w-[794px] bg-white text-zinc-900 shadow-2xl p-8 sm:p-12 mb-8 relative flex flex-col"
        style={{ minHeight: '1123px' }}
      >
        {/* Header - Clinic Info */}
        <div className="flex border-b-2 border-emerald-800 pb-8 mb-8 items-start">
            <img src="https://ik.imagekit.io/senvetcare/Logo/Logo%20Trans.webp" alt="Clinic Logo" className="w-24 h-24 object-contain mr-6"/>
            <div className="flex-1">
                <h1 className="font-serif font-black text-4xl text-emerald-900 leading-tight">Sen Vet Care</h1>
                <p className="text-sm font-bold text-emerald-900/70 uppercase tracking-widest leading-snug">Legacy Dr. T. B. Sen Memorial Veterinary Clinic</p>
                <div className="text-[10px] text-zinc-600 mt-2 space-y-0.5">
                    <p>Address: 69, Dr. Suresh Sarkar Rd, Entally, Kolkata, West Bengal 700014</p>
                    <p>Contact: 09871155162 | Email: contact@senvetcare.com</p>
                    <p>Website: www.senvetcare.com | <a href="https://maps.app.goo.gl/c5VaPsCrPVsVcMYr6" className="text-emerald-700 underline" target="_blank">Google Map</a></p>
                </div>
            </div>
            <div className="text-right text-xs text-zinc-500 font-mono">
                <p>Ref ID: {reportData.consultationId}</p>
                <p>{new Date().toLocaleDateString()}</p>
            </div>
        </div>
        
        {/* Patient/Owner Details */}
        <div className="grid grid-cols-2 gap-8 mb-10 text-sm">
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                <h4 className="font-bold text-emerald-800 uppercase text-[10px] tracking-wider mb-1">Owner Details</h4>
                <p className="font-bold">{formData.ownerName}</p>
                <p className="text-zinc-600 text-xs">{formData.mobileNumber}</p>
                <p className="text-zinc-600 text-xs">{formData.emailAddress}</p>
            </div>
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                <h4 className="font-bold text-emerald-800 uppercase text-[10px] tracking-wider mb-1">Pet Details</h4>
                <p className="font-bold">{formData.petName}</p>
                <p className="text-zinc-600 text-xs">{formData.species} | {formData.breed}</p>
                <p className="text-zinc-600 text-xs">{formData.age} {formData.ageUnit}</p>
            </div>
        </div>

        {/* Clinical Alert Section */}
        <div className={`p-6 mb-8 border-2 ${
            reportData.urgencyLevel === 'RED' ? 'border-red-600' :
            reportData.urgencyLevel === 'ORANGE' ? 'border-orange-500' :
            'border-emerald-600'
        } bg-white`}>
            <h2 className={`text-sm font-black uppercase tracking-widest mb-2 ${
                reportData.urgencyLevel === 'RED' ? 'text-red-600' :
                reportData.urgencyLevel === 'ORANGE' ? 'text-orange-600' :
                'text-emerald-700'
            }`}>
               Clinical Alert: <span className="font-bold">{reportData.urgencyLevel}</span> Priority
            </h2>
            <p className="text-xs italic leading-relaxed text-zinc-800">{reportData.clinicalAlertRationale}</p>
        </div>

        {/* SOAP Structure */}
        <div className="space-y-6 flex-1">
            <section><h3 className="text-xs font-black uppercase tracking-widest text-emerald-800 border-b border-emerald-200 pb-1 mb-2">Subjective</h3><p className="text-sm text-zinc-700">{reportData.soap?.subjective || 'N/A'}</p></section>
            <section><h3 className="text-xs font-black uppercase tracking-widest text-emerald-800 border-b border-emerald-200 pb-1 mb-2">Objective</h3><p className="text-sm text-zinc-700">{reportData.soap?.objective || 'N/A'}</p></section>
            <section><h3 className="text-xs font-black uppercase tracking-widest text-emerald-800 border-b border-emerald-200 pb-1 mb-2">Assessment</h3><p className="text-sm text-zinc-700">{reportData.soap?.assessment || 'N/A'}</p></section>
            <section><h3 className="text-xs font-black uppercase tracking-widest text-emerald-800 border-b border-emerald-200 pb-1 mb-2">Plan</h3><p className="text-sm text-zinc-700">{reportData.soap?.plan || 'N/A'}</p></section>
        </div>

        {/* Recommended Diagnostics */}
        {reportData.recommendedTests?.length > 0 && (
            <div className="mt-8 border-t border-zinc-200 pt-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-800 border-b border-zinc-200 pb-2 mb-4">Diagnostic Recommendations</h3>
            <div className="space-y-4">
                {reportData.recommendedTests.map((t: any, i: number) => (
                <div key={i} className="text-sm">
                    <p className="font-bold text-emerald-800">{t.testName}</p>
                    <p className="text-xs text-zinc-600 italic">{t.description}</p>
                </div>
                ))}
            </div>
            </div>
        )}

        {/* Footer CTA & Disclaimer */}
        <div className="mt-auto pt-12 border-t border-zinc-200">
            <div className="flex gap-4 justify-center mb-6">
                <a href="tel:09871155162" className="bg-emerald-800 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition">Call Now</a>
                <a href="https://wa.me/919871155162" className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-emerald-500 transition">WhatsApp</a>
                <a href="/booking" className="bg-emerald-800 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition">Book Visit</a>
            </div>
            <p className="text-[9px] text-zinc-500 text-center leading-relaxed italic border-t border-zinc-100 pt-4">
                Disclaimer: This triage assessment is generated by an AI assistant for professional veterinary use only.
                It is not a substitute for a physical consultation. Decisions based on this report are at the discretion of the veterinary practitioner. This is an AI-generated document.
            </p>
            <p className="text-center text-xs text-zinc-400 mt-4 font-mono">Page 1 of 1</p>
        </div>
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
