import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { AdminServices } from '../components/dashboard/AdminServices';
import { AdminDoctors } from '../components/dashboard/AdminDoctors';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Stats placeholders
  const [petsCount, setPetsCount] = useState(0);

  // Settings placeholders
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [webAccessEnabled, setWebAccessEnabled] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/portal-login');
        return;
      }
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const isAdminEmail = ['senvetcare@gmail.com', 'contact@senvetcare.com', 'drtbsmemorialvetclinic@gmail.com'].includes(user.email?.toLowerCase() || '');
          const role = isAdminEmail ? 'admin' : (data.role || 'pet-owner');
          setUserRole(role);
          setUserName(user.displayName || data.email?.split('@')[0] || 'User');
          
          if (role === 'pet-owner') {
            const q = query(collection(db, 'pets'), where('ownerId', '==', user.uid));
            const petSnaps = await getDocs(q);
            setPetsCount(petSnaps.size);
          } else if (role === 'admin') {
            const settingsDoc = await getDoc(doc(db, 'settings', 'config'));
            if (settingsDoc.exists()) {
               setNotificationsEnabled(settingsDoc.data().notificationsEnabled ?? true);
               setWebAccessEnabled(settingsDoc.data().webAccessEnabled ?? true);
            }
          }
        } else {
           const isAdminEmail = ['senvetcare@gmail.com', 'contact@senvetcare.com', 'drtbsmemorialvetclinic@gmail.com'].includes(user.email?.toLowerCase() || '');
           setUserRole(isAdminEmail ? 'admin' : 'pet-owner');
           setUserName(user.displayName || user.email?.split('@')[0] || 'User');
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleToggleSetting = async (key: string, value: boolean) => {
     try {
        if (key === 'notificationsEnabled') setNotificationsEnabled(value);
        if (key === 'webAccessEnabled') setWebAccessEnabled(value);
        await updateDoc(doc(db, 'settings', 'config'), { [key]: value });
     } catch(e) {
        console.error("Failed to update setting", e);
     }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-clinical-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/5 text-on-background pb-20">
      {/* Dashboard Top Header */}
      <div className="bg-surface shadow border-b border-outline-variant/30 pt-28 pb-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="font-manrope text-3xl font-bold text-ink-depth">Welcome back, {userName}</h1>
            <p className="font-inter text-on-surface-variant mt-1 capitalize">{userRole?.replace('-', ' ')} Portal</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/50 relative">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full"></span>
            </button>
            <button 
              onClick={() => {
                auth.signOut();
                navigate('/');
              }}
              className="px-6 py-3 bg-white hover:bg-zinc-200 border border-outline-variant text-black rounded-full font-inter font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 shadow-sm"
            >
              Sign Out
              <span className="material-symbols-outlined text-sm">logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-5 py-4 rounded-2xl font-inter font-bold text-sm flex items-center gap-4 transition-colors ${activeTab === 'overview' ? 'bg-emerald-50 text-primary border border-emerald-100' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-ink-depth'}`}>
            <span className="material-symbols-outlined">dashboard</span>
            Overview
          </button>
          
          {userRole === 'pet-owner' && (
            <button 
              onClick={() => setActiveTab('pets')}
              className={`w-full text-left px-5 py-4 rounded-2xl font-inter font-medium text-sm flex items-center gap-4 transition-colors ${activeTab === 'pets' ? 'bg-emerald-50 text-primary border border-emerald-100' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-ink-depth'}`}>
              <span className="material-symbols-outlined">pets</span>
              My Pets
            </button>
          )}

          {(userRole === 'vets' || userRole === 'admin') && (
            <button 
              onClick={() => setActiveTab('patients')}
              className={`w-full text-left px-5 py-4 rounded-2xl font-inter font-medium text-sm flex items-center gap-4 transition-colors ${activeTab === 'patients' ? 'bg-emerald-50 text-primary border border-emerald-100' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-ink-depth'}`}>
              <span className="material-symbols-outlined">groups</span>
              Patients
            </button>
          )}

          <button 
            onClick={() => setActiveTab('appointments')}
            className={`w-full text-left px-5 py-4 rounded-2xl font-inter font-medium text-sm flex items-center gap-4 transition-colors ${activeTab === 'appointments' ? 'bg-emerald-50 text-primary border border-emerald-100' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-ink-depth'}`}>
            <span className="material-symbols-outlined">event</span>
            Appointments
          </button>

          <button 
            onClick={() => setActiveTab('records')}
            className={`w-full text-left px-5 py-4 rounded-2xl font-inter font-medium text-sm flex items-center gap-4 transition-colors ${activeTab === 'records' ? 'bg-emerald-50 text-primary border border-emerald-100' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-ink-depth'}`}>
            <span className="material-symbols-outlined">history</span>
            Medical Records
          </button>

          {userRole === 'admin' && (
            <>
              <button 
                onClick={() => setActiveTab('doctors')}
                className={`w-full text-left px-5 py-4 mt-8 rounded-2xl font-inter font-medium text-sm flex items-center gap-4 transition-colors ${activeTab === 'doctors' ? 'bg-emerald-50 text-primary border border-emerald-100' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-ink-depth'}`}>
                <span className="material-symbols-outlined">local_hospital</span>
                Doctors
              </button>
              <button 
                onClick={() => setActiveTab('services')}
                className={`w-full text-left px-5 py-4 rounded-2xl font-inter font-medium text-sm flex items-center gap-4 transition-colors ${activeTab === 'services' ? 'bg-emerald-50 text-primary border border-emerald-100' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-ink-depth'}`}>
                <span className="material-symbols-outlined">medical_services</span>
                Services
              </button>
            </>
          )}
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-5 py-4 rounded-2xl font-inter font-medium text-sm flex items-center gap-4 transition-colors ${userRole !== 'admin' ? 'mt-8' : ''} ${activeTab === 'settings' ? 'bg-emerald-50 text-primary border border-emerald-100' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-ink-depth'}`}>
             <span className="material-symbols-outlined">settings</span>
             Settings
          </button>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-8">
          
          {activeTab === 'overview' && (
            <>
              {/* Metrics Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {userRole === 'pet-owner' ? (
                    <>
                      <div className="bg-surface rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">pets</span>
                        </div>
                        <div>
                          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Total Pets</p>
                          <h4 className="text-2xl font-manrope font-bold text-ink-depth">{petsCount}</h4>
                        </div>
                      </div>
                      <div className="bg-surface rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">event</span>
                        </div>
                        <div>
                          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Upcoming Visits</p>
                          <h4 className="text-2xl font-manrope font-bold text-ink-depth">0</h4>
                        </div>
                      </div>
                      <div className="bg-surface rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">medication</span>
                        </div>
                        <div>
                          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Active Prescriptions</p>
                          <h4 className="text-2xl font-manrope font-bold text-ink-depth">0</h4>
                        </div>
                      </div>
                    </>
                 ) : (
                    <>
                      <div className="bg-surface rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">group</span>
                        </div>
                        <div>
                          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Today's Queue</p>
                          <h4 className="text-2xl font-manrope font-bold text-ink-depth">0</h4>
                        </div>
                      </div>
                      <div className="bg-surface rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">pending_actions</span>
                        </div>
                        <div>
                          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Pending Reports</p>
                          <h4 className="text-2xl font-manrope font-bold text-ink-depth">0</h4>
                        </div>
                      </div>
                      <div className="bg-surface rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">smart_toy</span>
                        </div>
                        <div>
                          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Dr Lily Summary</p>
                          <h4 className="text-lg font-manrope font-bold text-ink-depth">Clean</h4>
                        </div>
                      </div>
                    </>
                 )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Widget 1 */}
                <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-outline-variant/30">
                   <h3 className="font-manrope font-bold text-xl text-ink-depth mb-6">Recent Activity</h3>
                   <div className="space-y-6">
                     {/* Empty State */}
                     <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-outline-variant mb-4">
                          <span className="material-symbols-outlined text-3xl">inbox</span>
                        </div>
                        <h5 className="font-manrope font-bold text-ink-depth">No Recent Activity</h5>
                        <p className="font-inter text-sm text-on-surface-variant mt-2 max-w-xs">Your latest appointments, pet records, and clinic updates will appear here.</p>
                     </div>
                   </div>
                </div>

                {/* Dr Lily AI Insight Widget */}
                {userRole !== 'admin' && (
                  <div className="bg-gradient-to-br from-zinc-900 to-black rounded-[2rem] p-8 shadow-xl text-white relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none"></div>
                     <div className="flex items-center gap-3 mb-6">
                       <span className="material-symbols-outlined text-emerald-400">smart_toy</span>
                       <h3 className="font-manrope font-bold text-xl">Dr Lily AI Insights</h3>
                     </div>
                     
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                       <p className="font-inter text-zinc-300 text-sm leading-relaxed italic">
                         "Hello {userName}, based on regional data, there is a spike in tick-borne illnesses this week. 
                         Ensure your pets are up to date on preventatives before scheduling walks in wooded areas."
                       </p>
                       <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                         <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">System generated alert</p>
                         {userRole === 'pet-owner' ? (
                           <button onClick={() => navigate('/dr-lily')} className="text-emerald-400 hover:text-emerald-300 text-sm font-bold flex items-center gap-1 transition-colors">
                             Ask Dr. Lily
                             <span className="material-symbols-outlined text-sm">arrow_forward</span>
                           </button>
                         ) : (
                           <button onClick={() => navigate('/dr-lily')} className="text-emerald-400 hover:text-emerald-300 text-sm font-bold flex items-center gap-1 transition-colors">
                             Analyze Symptoms
                             <span className="material-symbols-outlined text-sm">arrow_forward</span>
                           </button>
                         )}
                       </div>
                     </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'doctors' && userRole === 'admin' && <AdminDoctors />}
          
          {activeTab === 'services' && userRole === 'admin' && <AdminServices />}

          {activeTab === 'settings' && userRole === 'admin' && (
             <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-2 duration-500">
               <h3 className="font-manrope font-bold text-2xl text-ink-depth mb-6">App Settings</h3>
               
               <div className="space-y-6 max-w-2xl">
                 <div className="flex items-center justify-between p-6 bg-surface border border-outline-variant/50 rounded-2xl">
                   <div>
                     <h4 className="font-manrope font-bold text-ink-depth text-lg">System Notifications</h4>
                     <p className="font-inter text-sm text-on-surface-variant max-w-md">Enable or disable automatic notifications sent from the web app to admins.</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" checked={notificationsEnabled} onChange={(e) => handleToggleSetting('notificationsEnabled', e.target.checked)} />
                     <div className="w-14 h-7 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                   </label>
                 </div>

                 <div className="flex items-center justify-between p-6 bg-red-50 border border-red-100 rounded-2xl">
                   <div>
                     <h4 className="font-manrope font-bold text-red-700 text-lg">App Web Access</h4>
                     <p className="font-inter text-sm text-red-600/80 max-w-md">Toggle to completely stop or allow web access to the clinic app.</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" checked={webAccessEnabled} onChange={(e) => handleToggleSetting('webAccessEnabled', e.target.checked)} />
                     <div className="w-14 h-7 bg-red-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
                   </label>
                 </div>
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};
