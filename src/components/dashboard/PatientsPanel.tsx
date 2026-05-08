import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

export const PatientsPanel = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const snaps = await getDocs(collection(db, 'pets'));
        setPatients(snaps.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Failed to fetch patients", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading patients...</div>;
  }

  return (
    <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-manrope font-bold text-2xl text-ink-depth">Clinic Patients</h3>
        <div className="relative">
          <input type="text" placeholder="Search patients..." className="pl-10 pr-4 py-2 border border-outline-variant rounded-xl text-sm w-64 bg-surface-container-lowest text-zinc-900 placeholder:text-zinc-500" />
          <span className="material-symbols-outlined text-on-surface-variant absolute left-3 top-2.5 text-[18px]">search</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
             <tr className="border-b border-outline-variant/50 text-on-surface-variant text-sm">
               <th className="py-4 font-medium">Pet Name</th>
               <th className="py-4 font-medium">Species/Breed</th>
               <th className="py-4 font-medium">Owner Email</th>
               <th className="py-4 font-medium text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-on-surface-variant">No patients registered in the system.</td>
              </tr>
            ) : patients.map(p => (
              <tr key={p.id} className="hover:bg-surface-container-lowest transition-colors">
                 <td className="py-4 font-medium text-ink-depth">{p.petName || 'Unnamed'}</td>
                 <td className="py-4 text-sm text-on-surface-variant capitalize">{p.species} / {p.breed || 'Unknown'}</td>
                 <td className="py-4 text-sm text-on-surface-variant">{p.ownerEmail || p.email || 'N/A'}</td>
                 <td className="py-4 text-right">
                   <button className="text-primary hover:text-emerald-700 text-sm font-bold bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">View Profile</button>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
