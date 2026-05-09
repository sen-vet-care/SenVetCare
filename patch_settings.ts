import * as fs from 'fs';

let code = fs.readFileSync('src/pages/DashboardPage.tsx', 'utf8');

const target = '           {activeTab === \'settings\' && userRole === \'admin\' && (';
const replacement = '           {activeTab === \'settings\' && (';

// Use a more robust search or manual replacement if needed.
// This is simple enough to just do .replace()
code = code.replace(target, replacement);

// Now I need to inject the content.
// Since the template injection is hard, I will find the end of the react component and replace it.

const startIndex = code.indexOf('{activeTab === \'settings\' && (');
if (startIndex === -1) throw new Error("Could not find start index");

// Find end of this block, it ends at   )}
const blockEndIndex = code.indexOf(')}', startIndex);
if (blockEndIndex === -1) throw new Error("Could not find end index");

const newBlock = `{activeTab === 'settings' && (
             <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-2 duration-500">
               {userRole === 'admin' ? (
                 <>
                   <h3 className="font-manrope font-bold text-2xl text-ink-depth mb-6">App Settings</h3>
                   <SeedDataButton />
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
                   </div>
                 </>
               ) : (
                 <PetOwnerSettings userProfile={userProfile} />
               )}
             </div>
           )}`

code = code.substring(0, startIndex) + newBlock + code.substring(blockEndIndex + 2);

fs.writeFileSync('src/pages/DashboardPage.tsx', code);
