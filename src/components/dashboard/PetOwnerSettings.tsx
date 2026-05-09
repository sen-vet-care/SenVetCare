import { useState } from 'react';
import { auth, db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const PetOwnerSettings = ({ userProfile }: { userProfile: any }) => {
  const [formData, setFormData] = useState({
      displayName: userProfile.displayName || '',
      address: userProfile.address || '',
  });

  const handleUpdateProfile = async () => {
    if (auth.currentUser) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), formData);
        alert('Profile updated');
    }
  };

  return (
    <div className="space-y-6">
        <div className="bg-surface rounded-2xl p-6 border border-outline-variant/30">
            <h3 className="font-bold text-lg mb-4 text-ink-depth">Edit Profile</h3>
            <div className="space-y-4">
                <input type="text" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} placeholder="Display Name" className="w-full p-3 rounded-lg border border-outline-variant" />
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Address" className="w-full p-3 rounded-lg border border-outline-variant" />
                <button onClick={handleUpdateProfile} className="bg-primary text-white py-2 px-4 rounded-lg">Save Profile</button>
            </div>
        </div>
        <div className="bg-surface rounded-2xl p-6 border border-outline-variant/30">
            <h3 className="font-bold text-lg mb-4 text-ink-depth">Settings</h3>
            <div className="space-y-4">
                <button className="w-full text-left p-4 rounded-xl hover:bg-surface-container-low text-on-surface-variant flex items-center gap-3">
                   <span className="material-symbols-outlined">notifications_off</span>
                   Disable Notifications
                </button>
                <button className="w-full text-left p-4 rounded-xl hover:bg-surface-container-low text-error flex items-center gap-3 border border-error/30">
                   <span className="material-symbols-outlined">history</span>
                   Delete Activity History
                </button>
                 <button className="w-full text-left p-4 rounded-xl hover:bg-surface-container-low text-error flex items-center gap-3 border border-error/30">
                   <span className="material-symbols-outlined">pets</span>
                   Delete All Pet Data
                </button>
            </div>
        </div>
    </div>
  );
};
