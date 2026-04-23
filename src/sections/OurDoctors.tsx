export const OurDoctors = () => {
  const doctors = [
    {
      name: "Dr. Ananya Ray",
      title: "Senior Feline Specialist",
      edu: "BVSc & AH, MVSc (Internal Medicine)",
      desc: "With over 12 years of experience focusing exclusively on feline internal medicine, Dr. Ray brings a calm, methodical approach to complex diagnostics and long-term care plans.",
      status: "In-Clinic",
      color: "bg-pharmacy-green",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5eR1jYv1PkqLzLJhsj4zCVgbjbvB2fAt1wU0X4J-Y1JbDttnS4E4IPzoCp0gHsTk2AUz-uv826O4A80oMm9Dv1pXW5KG1YMSlXbXoON6n-yXPNPtQD-zoC1vyFgNFkikds06AVVAW1UDMbH-_cgO2QVo57gb-LK7WdBCMdXDvlwmbeXm9lxL8E0MGVqVqD2tTv8B2W3ln02WIqa-bkxdwWqAPmpCFm-ctexHskV6UXtCA5rB_N7Ie3ZXTa7nMlbGg5FGoJQU4OoQ"
    },
    {
      name: "Dr. Vikram Sen",
      title: "Orthopedic Surgeon",
      edu: "BVSc, MS (Surgery), Cert. Ortho",
      desc: "Specializing in advanced orthopedic procedures and joint replacements. Dr. Sen is dedicated to restoring mobility and improving the quality of life for active pets.",
      status: "Online & Clinic",
      color: "bg-secondary",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPOaAGk3Sq28IeiFA0MelMys864P7iDXNTuTmtr52rmkHDChprBmWxP39M1QryQXEBNG2iSdMiD_mpSzIJQ47dU5amCvC2RfjrW7lvrPWgWTb3Mqn_XoJsUo0xj8acLOh-mvvg2qEb_foP21BPdM4g9tMB5wwOsr7tlIm5JxZ0wmiX0Sx746OGXcOdXF0YwNbdKDcBoM9WagIeunyJ-G_0rphs-Cmbi9I2JuUX56bMJpvV9fILG8kBDF60yX3KtFYvjrHp0nKmjts"
    },
    {
      name: "Dr. Priya Sharma",
      title: "Dermatology & Allergies",
      edu: "BVSc, PGDip (Dermatology)",
      desc: "Dr. Sharma utilizes cutting-edge diagnostic tools to identify and treat complex skin conditions and environmental allergies, ensuring your pet's comfort.",
      status: "Consult Only",
      color: "bg-waiting-gold",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhI8S1cwOdWOIESc8_5IQybDZ0HjY1VT1lTRsOA1mqI_PmkxPmSNbQb2TFFZ1V4mXZqyp0AGuE3I8BA9EmtJ3QNnQGusMYIOhYgZHNlfEXCYss2-WtHFNHn09O1cC3t_piJpTYSgYQ5PUg5lJOH5omLhXUciblIm7WZrZ-pUp39sIRuGade7RJhaT6vGktQBkqaqh88PQk8QWWBU7bUbT7B4_bA8cBNKQKZLM0fRiFGv8P73nUUGuee5747vu-hSAgKqZGn8WyACg"
    }
  ];

  return (
    <section className="py-[120px] px-6 max-w-[1280px] mx-auto w-full">
      <div className="mb-16">
        <h2 className="font-manrope font-black text-[48px] tracking-tight text-ink-depth mb-4">Our Specialists</h2>
        <p className="font-inter text-[18px] text-on-surface-variant max-w-2xl">
          Meet the dedicated team providing immersive clinical excellence. Select a doctor to view their profile, availability, and book your consultation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doc, idx) => (
          <div key={idx} className="group relative bg-white rounded-3xl overflow-hidden border border-outline-variant/30 hover:border-primary/50 hover:shadow-lg transition-all duration-500 ease-in-out flex flex-col cursor-pointer">
            <div className="relative h-72 overflow-hidden bg-slate-100">
                <img src={doc.img} alt={doc.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-105" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-slate-200">
                    <span className={`w-2 h-2 rounded-full ${doc.color}`}></span>
                    <span className="font-inter font-bold text-[12px] tracking-widest text-ink-depth">{doc.status}</span>
                </div>
            </div>
            
            <div className="p-6 flex-grow flex flex-col relative bg-white z-10 -mt-4 rounded-t-xl transition-colors duration-300 group-hover:bg-primary-container/5">
                <h3 className="font-manrope font-semibold text-[24px] text-ink-depth mb-1 group-hover:text-primary transition-colors">{doc.name}</h3>
                <p className="font-inter text-[16px] text-primary font-medium mb-4">{doc.title}</p>
                
                <div className="flex items-center gap-2 mb-4 text-on-surface-variant">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>school</span>
                    <span className="font-inter text-sm">{doc.edu}</span>
                </div>
                
                <div className="overflow-hidden h-0 group-hover:h-24 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                    <p className="font-inter text-sm text-on-surface-variant line-clamp-3">
                        {doc.desc}
                    </p>
                </div>
                
                <div className="mt-auto pt-6">
                    <button className="w-full bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-inter font-bold text-[12px] tracking-widest py-3 rounded-full transition-colors duration-300 flex items-center justify-center gap-2 border border-primary/20 group-hover:border-transparent uppercase">
                        <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                        Book with this Doctor
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
