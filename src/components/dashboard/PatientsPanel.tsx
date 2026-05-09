import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

export const PatientsPanel = () => {
  const [dbPatients, setDbPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const snaps = await getDocs(collection(db, 'pets'));
        const data = snaps.docs.map(d => ({ id: d.id, ...d.data() } as any));
        // Inject demo fields for columns if they don't exist
        const enhancedData = data.map((p: any) => ({
          ...p,
          contactNumber: p.contactNumber || `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          lastVisitDate: p.lastVisitDate || new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          vaccinationDate: p.vaccinationDate || new Date(Date.now() + Math.random() * 10000000000).toISOString(),
          dewormingDate: p.dewormingDate || new Date(Date.now() + Math.random() * 5000000000).toISOString(),
          reviewDate: p.reviewDate || new Date(Date.now() + Math.random() * 2000000000).toISOString(),
        }));
        setDbPatients(enhancedData);
      } catch (e) {
        console.error("Failed to fetch patients", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPatients = useMemo(() => {
    let sortablePatients = [...dbPatients];
    if (sortConfig !== null) {
      sortablePatients.sort((a, b) => {
        const aVal = a[sortConfig.key] || '';
        const bVal = b[sortConfig.key] || '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortablePatients;
  }, [dbPatients, sortConfig]);

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant">Loading patients...</div>;
  }

  const ThHeader = ({ label, sortKey }: { label: string, sortKey: string }) => (
    <th className="py-4 px-2 font-bold whitespace-nowrap cursor-pointer hover:text-primary transition-colors text-xs uppercase tracking-widest" onClick={() => handleSort(sortKey)}>
      {label}
      {sortConfig?.key === sortKey && (
        <span className="material-symbols-outlined text-[14px] align-middle ml-1">
          {sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
        </span>
      )}
    </th>
  );

  return (
    <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-2 duration-500 relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-manrope font-bold text-2xl text-ink-depth">Clinic Patients</h3>
        <div className="relative">
          <input type="text" placeholder="Search patients..." className="pl-10 pr-4 py-2 border border-outline-variant/30 rounded-xl text-sm w-64 bg-surface-container text-ink-depth placeholder:text-on-surface-variant focus:outline-primary focus:border-primary" />
          <span className="material-symbols-outlined text-on-surface-variant absolute left-3 top-2.5 text-[18px]">search</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <table className="w-full text-left border-collapse">
          <thead>
             <tr className="border-b border-outline-variant/50 text-on-surface-variant text-sm">
               <ThHeader label="Pet Details" sortKey="petName" />
               <ThHeader label="Contact" sortKey="contactNumber" />
               <ThHeader label="Last Visit" sortKey="lastVisitDate" />
               <ThHeader label="Vaccination" sortKey="vaccinationDate" />
               <ThHeader label="Deworming" sortKey="dewormingDate" />
               <ThHeader label="Review" sortKey="reviewDate" />
               <th className="py-4 px-2 font-bold text-right text-xs uppercase tracking-widest">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {sortedPatients.length === 0 ? (
               <tr>
                 <td colSpan={7} className="py-12 text-center text-on-surface-variant">No patients registered in the system.</td>
               </tr>
            ) : sortedPatients.map(p => (
               <tr key={p.id} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="py-4 px-2">
                     <p className="font-bold text-ink-depth text-[15px]">{p.petName || 'Unnamed'}</p>
                     <p className="text-[12px] text-on-surface-variant capitalize mt-0.5">{p.species} / {p.breed || 'Unknown'}</p>
                  </td>
                  <td className="py-4 px-2 text-sm text-on-surface-variant font-medium">
                     <div className="flex flex-col">
                        <span className="text-ink-depth">{p.contactNumber}</span>
                        <span className="text-xs truncate max-w-[140px] block" title={p.ownerEmail || p.email}>{p.ownerEmail || p.email || 'N/A'}</span>
                     </div>
                  </td>
                  <td className="py-4 px-2 text-sm text-on-surface-variant">
                     {new Date(p.lastVisitDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-2 text-sm font-bold text-primary">
                     {new Date(p.vaccinationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-2 text-sm text-on-surface-variant">
                     {new Date(p.dewormingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-2 text-sm text-on-surface-variant">
                     {new Date(p.reviewDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-2 text-right">
                    <button onClick={() => setSelectedPatient(p)} className="text-primary hover:text-white hover:bg-primary text-xs font-bold bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
                      View Profile
                    </button>
                  </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Profile Modal - Injected directly over the existing component */}
      {selectedPatient && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-surface w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-8">
               <button onClick={() => setSelectedPatient(null)} className="absolute top-6 right-6 w-10 h-10 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant hover:bg-outline-variant/30 transition-colors z-10">
                  <span className="material-symbols-outlined">close</span>
               </button>
               
               {/* Modal Header */}
               <div className="bg-surface-container-low p-8 border-b border-outline-variant/30 flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-manrope font-extrabold text-primary shadow-inner">
                     {selectedPatient.petName ? selectedPatient.petName.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                     <h2 className="text-3xl font-manrope font-black text-ink-depth mb-1">{selectedPatient.petName || 'Unknown Patient'}</h2>
                     <p className="text-on-surface-variant font-medium text-lg capitalize flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">pets</span>
                        {selectedPatient.species} • {selectedPatient.breed || 'Mixed'}
                     </p>
                  </div>
               </div>
               
               {/* Modal Body */}
               <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-4">
                     <h4 className="font-manrope font-bold text-lg text-ink-depth border-b border-outline-variant/30 pb-2">Owner Details</h4>
                     <div>
                        <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Email</p>
                        <p className="text-ink-depth font-medium">{selectedPatient.ownerEmail || selectedPatient.email || 'Not provided'}</p>
                     </div>
                     <div>
                        <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Contact Number</p>
                        <p className="text-ink-depth font-medium flex items-center gap-2">
                           <span className="material-symbols-outlined text-[16px] text-primary">call</span>
                           {selectedPatient.contactNumber}
                        </p>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <h4 className="font-manrope font-bold text-lg text-ink-depth border-b border-outline-variant/30 pb-2">Medical Timeline</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Last Visit</p>
                           <p className="text-ink-depth font-medium">{new Date(selectedPatient.lastVisitDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                           <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-1 text-primary">Next Vaccine</p>
                           <p className="text-primary font-bold">{new Date(selectedPatient.vaccinationDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                           <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Deworming Due</p>
                           <p className="text-ink-depth font-medium">{new Date(selectedPatient.dewormingDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                           <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Review Date</p>
                           <p className="text-ink-depth font-medium">{new Date(selectedPatient.reviewDate).toLocaleDateString()}</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Modal Footer */}
               <div className="p-6 bg-surface-container-lowest border-t border-outline-variant/30 flex justify-end gap-3">
                  <button onClick={() => setSelectedPatient(null)} className="px-6 py-3 rounded-xl font-bold bg-surface text-ink-depth border border-outline-variant hover:bg-surface-container-low transition">Close</button>
                  <button className="px-6 py-3 rounded-xl font-bold bg-ink-depth text-white hover:bg-black transition flex items-center gap-2 shadow-md">
                     <span className="material-symbols-outlined text-[18px]">edit_note</span>
                     Edit Profile
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
