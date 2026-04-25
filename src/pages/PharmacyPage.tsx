import React, { useState, useEffect } from 'react';

// MOCK DATA: In a real environment, this can be fetched from a published Google Sheet CSV 
// via a backend API or directly.
const MOCK_MEDICINES = [
  { id: '1', name: 'NexGard Spectra', type: 'Flea & Tick', company: 'Boehringer Ingelheim', description: 'Monthly chewable for dogs.', price: '₹2,500' },
  { id: '2', name: 'Simparica Trio', type: 'Flea & Tick', company: 'Zoetis', description: 'Advanced protection against fleas, ticks, and heartworms.', price: '₹2,800' },
  { id: '3', name: 'Apoquel', type: 'Dermatology', company: 'Zoetis', description: 'Fast-acting itch relief for allergic dogs.', price: '₹3,200' },
  { id: '4', name: 'Heartgard Plus', type: 'Dewormer', company: 'Boehringer Ingelheim', description: 'Heartworm disease prevention.', price: '₹1,500' },
  { id: '5', name: 'Bravecto', type: 'Flea & Tick', company: 'MSD Animal Health', description: 'Up to 12 weeks of protection.', price: '₹3,500' },
  { id: '6', name: 'Cerenia', type: 'Anti-emetic', company: 'Zoetis', description: 'Prevention of vomiting and motion sickness.', price: '₹1,800' },
];

export const PharmacyPage = () => {
  const [medicines, setMedicines] = useState(MOCK_MEDICINES);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');

  const types = ['All', ...Array.from(new Set(MOCK_MEDICINES.map(m => m.type)))];
  const companies = ['All', ...Array.from(new Set(MOCK_MEDICINES.map(m => m.company)))];

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(search.toLowerCase()) || 
                          med.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'All' || med.type === selectedType;
    const matchesCompany = selectedCompany === 'All' || med.company === selectedCompany;
    return matchesSearch && matchesType && matchesCompany;
  });

  return (
    <section id="pharmacy" className="py-32 bg-surface-container-low min-h-screen relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pharmacy-green/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <header className="mb-16 text-center">
           <h2 className="font-manrope font-extrabold text-[48px] md:text-[64px] tracking-tight text-ink-depth leading-tight mb-4">
            Curated <span className="text-pharmacy-green">Pharmacy.</span>
          </h2>
          <p className="font-inter text-xl text-on-surface-variant font-light max-w-2xl mx-auto">
            World-class veterinary therapeutics, synchronized directly from our central inventory.
          </p>
        </header>

        {/* Filters */}
        <div className="bg-surface/80 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-6 mb-12 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              type="text" 
              placeholder="Search therapeutics..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-2xl border border-outline-variant/50 focus:border-pharmacy-green focus:ring-1 focus:ring-pharmacy-green outline-none font-inter transition-all"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 bg-surface-container rounded-2xl border border-outline-variant/50 focus:border-pharmacy-green outline-none font-inter text-sm shadow-sm cursor-pointer"
            >
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select 
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-4 py-3 bg-surface-container rounded-2xl border border-outline-variant/50 focus:border-pharmacy-green outline-none font-inter text-sm shadow-sm cursor-pointer"
            >
              {companies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Medicines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.length === 0 ? (
            <div className="col-span-full py-20 text-center text-on-surface-variant font-inter">No therapeutics found mirroring your criteria.</div>
          ) : (
            filteredMedicines.map(med => (
              <div key={med.id} className="bg-surface rounded-3xl p-8 border border-outline-variant/30 hover:shadow-xl hover:shadow-pharmacy-green/10 transition-all duration-500 flex flex-col group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pharmacy-green/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 bg-surface-container border border-outline-variant/50 rounded-full font-inter font-bold text-[10px] uppercase tracking-widest text-on-surface-variant group-hover:text-pharmacy-green transition-colors">
                    {med.type}
                  </span>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-pharmacy-green transition-colors">medication</span>
                </div>

                <h3 className="font-manrope font-bold text-2xl text-ink-depth mb-1">{med.name}</h3>
                <p className="font-inter text-xs text-outline font-bold uppercase tracking-widest mb-4">{med.company}</p>
                <p className="font-inter text-sm text-on-surface-variant leading-relaxed mb-8 flex-grow">
                  {med.description}
                </p>

                <div className="flex justify-between items-center pt-6 border-t border-outline-variant/30">
                  <span className="font-manrope font-bold text-xl text-ink-depth">{med.price}</span>
                  <button className="hidden text-pharmacy-green font-inter font-bold text-sm tracking-widest uppercase items-center gap-1 group-hover:flex transition-all">
                    Request <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

