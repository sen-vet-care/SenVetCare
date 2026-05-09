import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  days?: string;
  timings: string;
  isPresent: boolean;
  imageUrl?: string;
}

export const AdminDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', specialty: '', days: '', timings: '', isPresent: true, imageUrl: '' });

  useEffect(() => {
    const q = query(collection(db, 'doctors'));
    const unsub = onSnapshot(q, (snap) => {
      const data: Doctor[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Doctor));
      setDoctors(data);
    });
    return () => unsub();
  }, []);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateDoc(doc(db, 'doctors', editingId), formData);
      } else {
        await addDoc(collection(db, 'doctors'), formData);
      }
      setFormData({ name: '', specialty: '', days: '', timings: '', isPresent: true, imageUrl: '' });
      setIsAdding(false);
      setEditingId(null);
    } catch (e) {
      console.error("Failed to save doctor", e);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'doctors', id));
    setConfirmDeleteId(null);
  };

  const togglePresence = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, 'doctors', id), { isPresent: !currentStatus });
  };

  return (
    <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-outline-variant/30 animate-in fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-manrope font-bold text-2xl text-ink-depth">Manage Doctors</h3>
        <button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', specialty: '', days: '', timings: '', isPresent: true, imageUrl: '' }); }} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-emerald-700 transition">
          + Add Doctor
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="mb-8 p-6 bg-surface-container-low border border-outline-variant/30 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="px-4 py-3 bg-surface border border-outline-variant/50 rounded-xl text-ink-depth placeholder:text-on-surface-variant focus:outline-primary focus:border-primary" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input className="px-4 py-3 bg-surface border border-outline-variant/50 rounded-xl text-ink-depth placeholder:text-on-surface-variant focus:outline-primary focus:border-primary" placeholder="Specialty" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} />
          <input className="px-4 py-3 bg-surface border border-outline-variant/50 rounded-xl text-ink-depth placeholder:text-on-surface-variant focus:outline-primary focus:border-primary" placeholder="Days (e.g. Mon-Fri)" value={formData.days || ''} onChange={e => setFormData({...formData, days: e.target.value})} />
          <input className="px-4 py-3 bg-surface border border-outline-variant/50 rounded-xl text-ink-depth placeholder:text-on-surface-variant focus:outline-primary focus:border-primary" placeholder="Timings (e.g. 9AM - 5PM)" value={formData.timings} onChange={e => setFormData({...formData, timings: e.target.value})} />
          <input className="px-4 py-3 bg-surface border border-outline-variant/50 rounded-xl text-ink-depth placeholder:text-on-surface-variant focus:outline-primary focus:border-primary md:col-span-2" placeholder="Image URL (optional)" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />

          <div className="md:col-span-2 flex items-center gap-3 mt-2">
             <label className="font-bold text-sm text-ink-depth">Currently Present?</label>
             <input type="checkbox" checked={formData.isPresent} onChange={e => setFormData({...formData, isPresent: e.target.checked})} className="w-5 h-5 accent-primary rounded" />
          </div>

          <div className="md:col-span-2 flex gap-3 mt-4">
            <button onClick={handleSave} className="bg-ink-depth text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition text-sm">Save</button>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-6 py-2.5 rounded-xl font-bold bg-surface text-ink-depth border border-outline-variant hover:bg-surface-container-low transition text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {doctors.map(d => (
          <div key={d.id} className="p-5 border border-outline-variant/50 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container-highest shrink-0 border border-outline-variant/30 flex items-center justify-center">
                {d.imageUrl ? (
                  <img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-outline-variant text-3xl">person</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                   <h4 className="font-manrope font-bold text-lg text-ink-depth">{d.name}</h4>
                   <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${d.isPresent ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'}`}>
                      {d.isPresent ? 'Present' : 'Absent'}
                   </span>
                </div>
                <p className="text-sm text-on-surface-variant font-medium">{d.specialty}</p>
                {d.days && <p className="text-sm text-ink-depth font-semibold mt-1">{d.days}</p>}
                <p className="text-sm text-on-surface-variant mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-xs">schedule</span> {d.timings || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 mt-4 md:mt-0">
              <button 
                 onClick={() => togglePresence(d.id, d.isPresent)}
                 className={`px-4 py-2 font-bold text-xs rounded-xl transition ${d.isPresent ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-primary/20 text-primary hover:bg-primary/30'}`}
              >
                 Mark {d.isPresent ? 'Absent' : 'Present'}
              </button>
              <div className="flex items-center gap-2 border-l border-outline-variant/30 pl-3 ml-1">
                <button onClick={() => { setEditingId(d.id); setFormData({ name: d.name, specialty: d.specialty, days: d.days || '', timings: d.timings, isPresent: d.isPresent, imageUrl: d.imageUrl || '' }); }} className="p-2 text-on-surface-variant hover:text-primary bg-surface-container-highest rounded-lg transition"><span className="material-symbols-outlined text-sm">edit</span></button>
                {confirmDeleteId === d.id ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleDelete(d.id)} className="p-1.5 text-xs font-bold text-white bg-error rounded-lg transition">Confirm</button>
                    <button onClick={() => setConfirmDeleteId(null)} className="p-1.5 text-xs font-bold text-on-surface-variant bg-surface-container-highest rounded-lg transition">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDeleteId(d.id)} className="p-2 text-on-surface-variant hover:text-error bg-surface-container-highest rounded-lg transition"><span className="material-symbols-outlined text-sm">delete</span></button>
                )}
              </div>
            </div>
          </div>
        ))}
        {doctors.length === 0 && !isAdding && (
          <p className="text-on-surface-variant text-center py-8">No doctors found. Add one above!</p>
        )}
      </div>
    </div>
  );
};
