import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';

export const PetsPanel = () => {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [newPet, setNewPet] = useState({ petName: '', species: '', breed: '' });

  const fetchPets = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const q = query(collection(db, 'pets'), where('ownerId', '==', user.uid));
      const snaps = await getDocs(q);
      setPets(snaps.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Failed to fetch pets", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, 'pets'), {
        ...newPet,
        ownerId: user.uid,
        ownerEmail: user.email,
        createdAt: new Date().toISOString()
      });
      setIsAddingPet(false);
      setNewPet({ petName: '', species: '', breed: '' });
      fetchPets();
    } catch (err) {
      console.error("Failed to add pet", err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading pets...</div>;
  }

  return (
    <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-manrope font-bold text-2xl text-ink-depth">My Pets</h3>
        <button onClick={() => setIsAddingPet(true)} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-emerald-700 transition">
          + Add Pet
        </button>
      </div>

      {isAddingPet && (
        <form onSubmit={handleAddPet} className="mb-8 p-6 bg-surface-container-low border border-outline-variant/30 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
          <input required placeholder="Pet Name" value={newPet.petName} onChange={e => setNewPet({...newPet, petName: e.target.value})} className="px-4 py-3 bg-surface border border-outline-variant/50 rounded-xl text-sm text-ink-depth placeholder:text-on-surface-variant focus:outline-primary" />
          <input required placeholder="Species (e.g. Dog, Cat)" value={newPet.species} onChange={e => setNewPet({...newPet, species: e.target.value})} className="px-4 py-3 bg-surface border border-outline-variant/50 rounded-xl text-sm text-ink-depth placeholder:text-on-surface-variant focus:outline-primary" />
          <input placeholder="Breed (Optional)" value={newPet.breed} onChange={e => setNewPet({...newPet, breed: e.target.value})} className="px-4 py-3 bg-surface border border-outline-variant/50 rounded-xl text-sm text-ink-depth placeholder:text-on-surface-variant focus:outline-primary" />
          <div className="md:col-span-3 flex gap-3 mt-2">
            <button type="submit" className="bg-ink-depth text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition text-sm">Save Pet</button>
            <button type="button" onClick={() => setIsAddingPet(false)} className="px-6 py-2.5 rounded-xl font-bold bg-surface text-ink-depth border border-outline-variant hover:bg-surface-container-low transition text-sm">Cancel</button>
          </div>
        </form>
      )}

      {pets.length === 0 && !isAddingPet ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-outline-variant mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">pets</span>
          </div>
          <h5 className="font-manrope font-bold text-ink-depth">No Pets Found</h5>
          <p className="font-inter text-sm text-on-surface-variant mt-2 max-w-xs mx-auto">Add your pet's details to manage their health records, appointments, and prescriptions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pets.map(pet => (
            <div key={pet.id} className="p-5 border border-outline-variant/50 rounded-2xl flex gap-4 items-center bg-surface-container">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-ink-depth font-bold text-xl uppercase shrink-0">
                {pet.petName?.charAt(0) || '?'}
              </div>
              <div>
                <h4 className="font-bold text-lg text-ink-depth">{pet.petName || 'Unnamed Pet'}</h4>
                <p className="text-sm text-on-surface-variant capitalize">{pet.species} • {pet.breed || 'Unknown breed'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
