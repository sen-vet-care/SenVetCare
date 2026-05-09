import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';

export const RecordsPanel = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const q = query(collection(db, 'medical_records'), orderBy('date', 'desc'));
        const snaps = await getDocs(q);
        setRecords(snaps.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to fetch records", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  return (
    <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-manrope font-bold text-2xl text-ink-depth">Medical Records</h3>
      </div>
      
      {loading ? (
        <div className="p-8 text-center text-on-surface-variant">Loading records...</div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl">folder_shared</span>
          </div>
          <h4 className="font-manrope font-bold text-xl text-ink-depth mb-2">No Records Available</h4>
          <p className="text-on-surface-variant max-w-sm mx-auto">Medical records, lab results, and prescriptions will appear here after your visits.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((rec) => (
            <div key={rec.id} className="bg-surface-container/30 border border-outline-variant/30 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:bg-surface-container/50 transition-colors">
               <div>
                 <div className="flex items-center gap-3 mb-2">
                   <h4 className="font-bold text-ink-depth text-lg">{rec.petName} <span className="text-sm font-medium text-on-surface-variant ml-1">({rec.species})</span></h4>
                   <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[10px] font-bold uppercase tracking-widest">{rec.type}</span>
                 </div>
                 <p className="text-sm text-on-surface-variant mb-1"><span className="font-bold text-ink-depth">Doctor:</span> {rec.doctorName}</p>
                 <p className="text-sm text-on-surface-variant mb-2"><span className="font-bold text-ink-depth">Notes:</span> {rec.notes}</p>
                 <div className="flex items-center gap-4 text-xs font-medium text-on-surface-variant">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span> {new Date(rec.date).toLocaleDateString()}</span>
                    {rec.weight && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">scale</span> {rec.weight}</span>}
                 </div>
               </div>
               
               <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                 <button className="flex-1 sm:flex-none text-center px-4 py-2 bg-surface text-ink-depth border border-outline-variant rounded-xl text-sm font-bold hover:bg-surface-container-low transition-colors whitespace-nowrap">View Details</button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
