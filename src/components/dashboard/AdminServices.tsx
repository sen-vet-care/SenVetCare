import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface Service {
  id: string;
  name: string;
  description: string;
  rate: number;
  unit: string;
}

export const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', description: '', rate: '', unit: '' });

  useEffect(() => {
    const q = query(collection(db, 'services'));
    const unsub = onSnapshot(q, (snap) => {
      const data: Service[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
      setServices(data);
    });
    return () => unsub();
  }, []);

  const handleSave = async () => {
    try {
      const rateNum = parseFloat(formData.rate) || 0;
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), { ...formData, rate: rateNum });
      } else {
        await addDoc(collection(db, 'services'), { ...formData, rate: rateNum });
      }
      setFormData({ name: '', description: '', rate: '', unit: '' });
      setIsAdding(false);
      setEditingId(null);
    } catch (e) {
      console.error("Failed to save service", e);
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
        <button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', description: '', rate: '', unit: '' }); }} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-emerald-700 transition">
          + Add Service
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="mb-8 p-6 bg-surface-container-low border border-outline-variant/30 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="px-4 py-3 bg-white border border-outline-variant rounded-xl" placeholder="Service Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input className="px-4 py-3 bg-white border border-outline-variant rounded-xl" placeholder="Rate (e.g. 50)" type="number" value={formData.rate} onChange={e => setFormData({...formData, rate: e.target.value})} />
          <input className="px-4 py-3 bg-white border border-outline-variant rounded-xl" placeholder="Unit (e.g. per session)" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
          <input className="px-4 py-3 bg-white border border-outline-variant rounded-xl md:col-span-2" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <div className="md:col-span-2 flex gap-3 mt-2">
            <button onClick={handleSave} className="bg-ink-depth text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition text-sm">Save</button>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-6 py-2.5 rounded-xl font-bold bg-white border border-outline-variant hover:bg-zinc-50 transition text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {services.map(s => (
          <div key={s.id} className="p-5 border border-outline-variant/50 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50">
            <div>
              <h4 className="font-bold text-lg text-ink-depth">{s.name}</h4>
              <p className="text-sm text-on-surface-variant max-w-xl">{s.description}</p>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <div className="text-right">
                <p className="font-bold text-emerald-600 text-lg">${s.rate}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">{s.unit}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setEditingId(s.id); setFormData({ name: s.name, description: s.description, rate: s.rate.toString(), unit: s.unit }); }} className="p-2 text-zinc-500 hover:text-blue-600 bg-surface-container rounded-lg transition"><span className="material-symbols-outlined text-sm">edit</span></button>
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
