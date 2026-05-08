import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface Service {
  id: string;
  name: string;
  description: string;
  rate: string;
  unit: string;
  category: string;
  group?: string;
}

const STANDARD_SERVICES = [
  // Treatments
  { category: 'Treatments', group: 'Consultations', name: 'General OPD', rate: '300 – 800', unit: 'per visit', description: 'General consultation.' },
  { category: 'Treatments', group: 'Consultations', name: 'Specialist', rate: '800 – 1500', unit: 'per visit', description: 'Consultation with a specialist.' },
  { category: 'Treatments', group: 'Consultations', name: 'Follow-up Visits', rate: '200 – 500', unit: 'per visit', description: 'Follow-up after initial consultation.' },
  { category: 'Treatments', group: 'Preventive & Wellness', name: 'Routine Health Check-ups', rate: '500 – 1500', unit: 'per session', description: 'Complete routine checkup.' },
  { category: 'Treatments', group: 'Preventive & Wellness', name: 'Senior Pet Screening', rate: '1500 – 4000', unit: 'per session', description: 'Screening for older pets.' },
  { category: 'Treatments', group: 'Emergency & Critical', name: 'Emergency Consultation', rate: '1000 – 3000', unit: 'per emergency', description: 'Immediate emergency care.' },
  { category: 'Treatments', group: 'Emergency & Critical', name: 'ICU / Monitoring', rate: '2000 – 8000', unit: 'per day', description: 'Intensive care and monitoring.' },
  { category: 'Treatments', group: 'Surgical Procedures', name: 'Spay/Neuter', rate: '4000 – 15000', unit: 'per surgery', description: 'Standard spaying and neutering.' },
  { category: 'Treatments', group: 'Surgical Procedures', name: 'Tumor Removal', rate: '5000 – 25000+', unit: 'per surgery', description: 'Surgical removal of tumors.' },
  { category: 'Treatments', group: 'Surgical Procedures', name: 'Wound Management', rate: '1500 – 8000', unit: 'per session', description: 'Cleaning and treating wounds.' },
  { category: 'Treatments', group: 'Orthopedic Care', name: 'Fracture Repair', rate: '10000 – 50000+', unit: 'per surgery', description: 'Orthopedic fracture repair.' },
  { category: 'Treatments', group: 'Orthopedic Care', name: 'Ligament Surgeries', rate: '15000 – 60000+', unit: 'per surgery', description: 'Cruciate ligament and other joint surgeries.' },
  { category: 'Treatments', group: 'Dental Care', name: 'Scaling & Polishing', rate: '2000 – 6000', unit: 'per session', description: 'Comprehensive dental cleaning.' },
  { category: 'Treatments', group: 'Dental Care', name: 'Tooth Extraction', rate: '500 – 3000', unit: 'per tooth', description: 'Safe dental extractions.' },
  { category: 'Treatments', group: 'Specialized Treatments', name: 'Dermatology (Skin Care)', rate: '500 – 3000', unit: 'per session', description: 'Skin allergies and diseases.' },
  { category: 'Treatments', group: 'Specialized Treatments', name: 'Ophthalmology (Eye Care)', rate: '800 – 3000', unit: 'per session', description: 'Eye exams and treatments.' },
  { category: 'Treatments', group: 'Specialized Treatments', name: 'Cardiology Consultation', rate: '1500 – 4000', unit: 'per session', description: 'Heart health evaluations.' },
  { category: 'Treatments', group: 'Specialized Treatments', name: 'Oncology (Cancer Care)', rate: '5000 – 50000+', unit: 'per session', description: 'Cancer treatments and chemotherapy.' },
  { category: 'Treatments', group: 'Specialized Treatments', name: 'Physiotherapy', rate: '500 – 2500', unit: 'per session', description: 'Mobility and rehabilitation.' },
  { category: 'Treatments', group: 'Specialized Treatments', name: 'Kidney, Liver, Diabetes Care', rate: '1000 – 5000', unit: 'per session', description: 'Management of chronic diseases.' },

  // Lab Tests
  { category: 'Lab Tests', group: 'Blood Tests & Profiles', name: 'Complete Blood Count (CBC)', rate: '300 – 800', unit: 'per test', description: 'Basic blood count.' },
  { category: 'Lab Tests', group: 'Blood Tests & Profiles', name: 'Liver Function Test (LFT)', rate: '800 – 2000', unit: 'per test', description: 'Liver enzyme profile.' },
  { category: 'Lab Tests', group: 'Blood Tests & Profiles', name: 'Kidney Function Test (KFT)', rate: '800 – 2000', unit: 'per test', description: 'Renal panel.' },
  { category: 'Lab Tests', group: 'Blood Tests & Profiles', name: 'Thyroid Profile', rate: '1500 – 3500', unit: 'per test', description: 'T3, T4, and TSH levels.' },
  { category: 'Lab Tests', group: 'Blood Tests & Profiles', name: 'Blood Parasite Tests', rate: '500 – 1500', unit: 'per test', description: 'Testing for tick fever and parasites.' },
  { category: 'Lab Tests', group: 'Advanced Testing', name: 'PCR / ELISA Tests', rate: '1500 – 5000', unit: 'per test', description: 'Advanced molecular diagnostics.' },
  { category: 'Lab Tests', group: 'Advanced Testing', name: 'Allergy Testing', rate: '3000 – 8000', unit: 'per test', description: 'Comprehensive environmental and food allergies.' },
  { category: 'Lab Tests', group: 'Health Packages', name: 'Basic Wellness Panel', rate: '1500 – 3000', unit: 'per package', description: 'General preventative wellness test.' },
  { category: 'Lab Tests', group: 'Health Packages', name: 'Adult Health Package', rate: '3000 – 6000', unit: 'per package', description: 'Detailed health test for adults.' },
  { category: 'Lab Tests', group: 'Health Packages', name: 'Senior Pet Panel', rate: '5000 – 10000', unit: 'per package', description: 'Extensive geriatric profile.' },
  { category: 'Lab Tests', group: 'Imaging & Radiology', name: 'X-Ray', rate: '500 – 1500', unit: 'per scan', description: 'Digital radiography.' },
  { category: 'Lab Tests', group: 'Imaging & Radiology', name: 'Ultrasonography (USG)', rate: '1000 – 3000', unit: 'per scan', description: 'Detailed ultrasound imaging.' },
  { category: 'Lab Tests', group: 'Imaging & Radiology', name: 'Echocardiography (ECHO)', rate: '2500 – 5000', unit: 'per scan', description: 'Ultrasound of the heart.' },
  { category: 'Lab Tests', group: 'Imaging & Radiology', name: 'ECG', rate: '500 – 1500', unit: 'per scan', description: 'Electrocardiogram.' },
  { category: 'Lab Tests', group: 'Other Diagnostics', name: 'Urine Analysis', rate: '300 – 800', unit: 'per test', description: 'Complete urinalysis.' },
  { category: 'Lab Tests', group: 'Other Diagnostics', name: 'Stool Examination', rate: '300 – 800', unit: 'per test', description: 'Fecal analysis for parasites and bacteria.' },
  { category: 'Lab Tests', group: 'Other Diagnostics', name: 'Cytology / Biopsy', rate: '1500 – 5000', unit: 'per test', description: 'Cellular and tissue level analysis.' },
  { category: 'Lab Tests', group: 'Other Diagnostics', name: 'Culture & Sensitivity', rate: '1500 – 4000', unit: 'per test', description: 'Bacterial and fungal culture tests.' },

  // Preventions
  { category: 'Preventions', group: 'Dog Vaccination', name: 'DHPPi (7-in-1 / 9-in-1)', rate: '700 – 1500', unit: 'per dose', description: 'Core canine vaccines.' },
  { category: 'Preventions', group: 'Dog Vaccination', name: 'Anti-Rabies', rate: '300 – 800', unit: 'per dose', description: 'Rabies vaccination.' },
  { category: 'Preventions', group: 'Dog Vaccination', name: 'Annual Booster Packages', rate: '1500 – 3000', unit: 'per package', description: 'Combined booster shots.' },
  { category: 'Preventions', group: 'Cat Vaccination', name: 'FVRCP', rate: '700 – 1500', unit: 'per dose', description: 'Core feline vaccines.' },
  { category: 'Preventions', group: 'Cat Vaccination', name: 'Anti-Rabies', rate: '300 – 800', unit: 'per dose', description: 'Rabies vaccination.' },
  { category: 'Preventions', group: 'Deworming & Parasites', name: 'Deworming', rate: '100 – 500', unit: 'per dose', description: 'Internal parasite control.' },
  { category: 'Preventions', group: 'Deworming & Parasites', name: 'Tick & Flea Prevention', rate: '300 – 1500', unit: 'per dose', description: 'Topical, collar, or oral tick prevention (depends on size).' },
  { category: 'Preventions', group: 'Annual Preventive Plans', name: 'Annual Plans', rate: '2000 – 6000', unit: 'per year', description: 'Comprehensive annual preventative care plans.' },

  // Pharmacy
  { category: 'Pharmacy', group: 'Prescriptions', name: 'Antibiotics', rate: '100 – 500', unit: 'per strip/bottle', description: 'Standard amoxicillin, cephalexin, etc.' },
  { category: 'Pharmacy', group: 'Prescriptions', name: 'Pain Relief (NSAIDs)', rate: '150 – 600', unit: 'per strip/bottle', description: 'Meloxicam, Carprofen, etc.' },
  { category: 'Pharmacy', group: 'Supplements', name: 'Joint Supplements', rate: '500 – 1500', unit: 'per bottle', description: 'Glucosamine and chondroitin.' },
  { category: 'Pharmacy', group: 'Supplements', name: 'Skin & Coat Vitamins', rate: '300 – 1000', unit: 'per bottle', description: 'Omega fatty acids and biotin.' },
  { category: 'Pharmacy', group: 'Diets', name: 'Renal Diet Food (3kg)', rate: '1500 – 3000', unit: 'per bag', description: 'Prescription renal diet.' },
  { category: 'Pharmacy', group: 'Diets', name: 'Gastrointestinal Diet (3kg)', rate: '1200 – 2500', unit: 'per bag', description: 'Prescription GI diet.' },
  { category: 'Pharmacy', group: 'Preventives', name: 'Deworming Tablets', rate: '50 – 200', unit: 'per tablet', description: 'Standard broad-spectrum dewormers.' },
  { category: 'Pharmacy', group: 'Preventives', name: 'Anti-Tick Spray (100ml)', rate: '200 – 800', unit: 'per bottle', description: 'Fipronil spray.' },
];

export const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', description: '', rate: '', unit: '', category: 'Treatments', group: '' });

  useEffect(() => {
    const q = query(collection(db, 'services'));
    const unsub = onSnapshot(q, (snap) => {
      const data: Service[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
      setServices(data);
    });
    return () => unsub();
  }, []);

  const [isPopulating, setIsPopulating] = useState(false);

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), { ...formData });
      } else {
        await addDoc(collection(db, 'services'), { ...formData });
      }
      setFormData({ name: '', description: '', rate: '', unit: '', category: 'Treatments', group: '' });
      setIsAdding(false);
      setEditingId(null);
    } catch (e) {
      console.error("Failed to save service", e);
    }
  };

  const handleSeedStandardServices = async () => {
    if (!confirm("This will populate missing standard services. Are you sure?")) return;
    setIsPopulating(true);
    try {
       for (const standard of STANDARD_SERVICES) {
         // Optionally we could check for existence, but simplest is to just add them
         await addDoc(collection(db, 'services'), standard);
       }
    } catch (e) {
       console.error("Failed to seed services", e);
    } finally {
       setIsPopulating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await deleteDoc(doc(db, 'services', id));
    }
  };

  return (
    <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-outline-variant/30 animate-in fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-manrope font-bold text-2xl text-ink-depth">Manage Services</h3>
        <div className="flex gap-3">
          <button onClick={handleSeedStandardServices} disabled={isPopulating} className="bg-white text-primary border border-primary px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-50 transition disabled:opacity-50">
            {isPopulating ? 'Populating...' : 'Populate Standard Data'}
          </button>
          <button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', description: '', rate: '', unit: '', category: 'Treatments', group: '' }); }} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-emerald-700 transition">
            + Add Service
          </button>
        </div>
      </div>

      {(isAdding || editingId) && (
        <div className="mb-8 p-6 bg-surface-container-low border border-outline-variant/30 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="px-4 py-3 bg-white border border-outline-variant rounded-xl text-zinc-900 placeholder:text-zinc-400" placeholder="Service Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <select className="px-4 py-3 bg-white border border-outline-variant rounded-xl text-zinc-900" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option value="Treatments">Treatments</option>
            <option value="Preventions">Preventions</option>
            <option value="Lab Tests">Lab Tests</option>
            <option value="Pharmacy">Pharmacy</option>
          </select>
          <input className="px-4 py-3 bg-white border border-outline-variant rounded-xl text-zinc-900 placeholder:text-zinc-400" placeholder="Group (e.g. Consultations)" value={formData.group} onChange={e => setFormData({...formData, group: e.target.value})} />
          <input className="px-4 py-3 bg-white border border-outline-variant rounded-xl text-zinc-900 placeholder:text-zinc-400" placeholder="Rate (e.g. 500 - 1000)" type="text" value={formData.rate} onChange={e => setFormData({...formData, rate: e.target.value})} />
          <input className="px-4 py-3 bg-white border border-outline-variant rounded-xl text-zinc-900 placeholder:text-zinc-400" placeholder="Unit (e.g. per session)" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
          <input className="px-4 py-3 bg-white border border-outline-variant rounded-xl md:col-span-2 text-zinc-900 placeholder:text-zinc-400" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <div className="md:col-span-2 flex gap-3 mt-2">
            <button onClick={handleSave} className="bg-ink-depth text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition text-sm">Save</button>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-6 py-2.5 rounded-xl font-bold bg-white text-zinc-900 border border-outline-variant hover:bg-zinc-50 transition text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {services.map(s => (
          <div key={s.id} className="p-5 border border-outline-variant/50 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <h4 className="font-bold text-lg text-ink-depth">{s.name}</h4>
                 <span className="bg-surface-container px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-zinc-500">{s.category}{s.group ? ` • ${s.group}` : ''}</span>
              </div>
              <p className="text-sm text-on-surface-variant max-w-xl">{s.description}</p>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <div className="text-right">
                <p className="font-bold text-emerald-600 text-lg">₹{s.rate}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">{s.unit}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setEditingId(s.id); setFormData({ name: s.name, description: s.description, rate: String(s.rate), unit: s.unit, category: s.category || 'Treatments', group: s.group || '' }); }} className="p-2 text-zinc-500 hover:text-blue-600 bg-surface-container rounded-lg transition"><span className="material-symbols-outlined text-sm">edit</span></button>
                <button onClick={() => handleDelete(s.id)} className="p-2 text-zinc-500 hover:text-red-600 bg-surface-container rounded-lg transition"><span className="material-symbols-outlined text-sm">delete</span></button>
              </div>
            </div>
          </div>
        ))}
        {services.length === 0 && !isAdding && (
          <p className="text-zinc-500 text-center py-8">No services found. Add one above!</p>
        )}
      </div>
    </div>
  );
};
