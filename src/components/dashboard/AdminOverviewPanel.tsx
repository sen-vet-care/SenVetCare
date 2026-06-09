import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const AdminOverviewPanel = () => {
   const [timeFilter, setTimeFilter] = useState('month');
   const [stats, setStats] = useState({
      patients: 0,
       appointments: 0,
       revenue: 0,
   });
   const [loading, setLoading] = useState(true);
   const [docRankings, setDocRankings] = useState<any[]>([]);

   const [chartData, setChartData] = useState<any[]>([]);

   useEffect(() => {
     const fetchData = async () => {
       setLoading(true);
       try {
         // Fetch patients
         const petsSnap = await getDocs(collection(db, 'pets'));
         const pets = petsSnap.docs.map(doc => doc.data() as any);
         let patientsCount = pets.length;

         // Fetch appointments
         const aptsSnap = await getDocs(collection(db, 'appointments'));
         const appointments = aptsSnap.docs.map(doc => doc.data() as any);
         let appointmentsCount = appointments.length;

         // Process dates manually because firebase queries need indexes to group effectively over client side logic inside small dbs.
         const now = new Date();
         const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
         
         // Create last 6 months buckets
         const last6Months = [];
         for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            last6Months.push({
               monthIdx: d.getMonth(),
               year: d.getFullYear(),
               name: monthNames[d.getMonth()],
               appointments: 0,
               income: 0,
            });
         }

         let totalRevenue = 0;
         let periodPatients = 0;
         let periodAppointments = 0;

         appointments.forEach(apt => {
            const dateStr = apt.date || apt.createdAt; // Handle different date formats or missing
            if (!dateStr) return;
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return;

            // Chart data
            const bucket = last6Months.find(b => b.monthIdx === d.getMonth() && b.year === d.getFullYear());
            if (bucket) {
               bucket.appointments += 1;
               // Estimate 800 per appointment as default revenue
               bucket.income += 800;
            }

            // Stats Filter Logic
            const timeDiff = now.getTime() - d.getTime();
            const daysDiff = timeDiff / (1000 * 3600 * 24);
            
            let includeInStats = false;
            if (timeFilter === 'year' && daysDiff <= 365) includeInStats = true;
            else if (timeFilter === 'month' && daysDiff <= 30) includeInStats = true;
            else if (timeFilter === 'week' && daysDiff <= 7) includeInStats = true;

            if (includeInStats) {
               periodAppointments += 1;
               totalRevenue += 800; // Estimated 800 per appointment
            }
         });

         pets.forEach(pet => {
            const dateStr = pet.createdAt;
            if (!dateStr) return;
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return;

            const timeDiff = now.getTime() - d.getTime();
            const daysDiff = timeDiff / (1000 * 3600 * 24);
            
            let includeInStats = false;
            if (timeFilter === 'year' && daysDiff <= 365) includeInStats = true;
            else if (timeFilter === 'month' && daysDiff <= 30) includeInStats = true;
            else if (timeFilter === 'week' && daysDiff <= 7) includeInStats = true;

            if (includeInStats) {
               periodPatients += 1;
            }
         });

         setChartData(last6Months);

         // Fetch doctors
         const docsSnap = await getDocs(collection(db, 'doctors'));
         const doctors = docsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
         
         // Try checking medical records to tie revenue to doctors (demo realism)
         const recordsSnap = await getDocs(collection(db, 'medical_records'));
         const records = recordsSnap.docs.map(d => d.data() as any);

         const doctorStats: Record<string, number> = {};
         records.forEach(r => {
            if (r.doctorName) {
               doctorStats[r.doctorName] = (doctorStats[r.doctorName] || 0) + 1;
            }
         });
         
         // Rank doctors by actual records only
         const rankings = doctors
           .map(d => {
              const recordCount = doctorStats[d.name] || 0;
              const revenue = recordCount * 800; // estimated 800 per record
              return {
                  name: d.name,
                  count: recordCount,
                  revenueText: `₹${revenue.toLocaleString()}`
              };
          })
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

         setDocRankings(rankings);
         setStats({ patients: periodPatients, appointments: periodAppointments, revenue: totalRevenue });
       } catch(e) {
         console.error("Error fetching overview data", e);
       } finally {
         setLoading(false);
       }
     };
     fetchData();
   }, [timeFilter]);

   return (
      <div className="space-y-6">
         {/* Filters & Header */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface rounded-[2rem] p-6 shadow-sm border border-outline-variant/30">
            <div>
               <h3 className="font-manrope font-black text-2xl text-ink-depth">Executive Overview</h3>
               <p className="text-on-surface-variant text-sm font-medium mt-1">Real-time clinic metrics and performance</p>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="relative">
                  <select 
                     value={timeFilter} 
                     onChange={(e) => setTimeFilter(e.target.value)}
                     className="appearance-none bg-surface-container border border-outline-variant/30 text-ink-depth text-sm font-bold rounded-xl pl-4 pr-10 py-2.5 focus:outline-primary cursor-pointer hover:bg-surface-container-high transition-colors"
                  >
                     <option value="week">This Week</option>
                     <option value="month">This Month</option>
                     <option value="year">This Financial Year</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none">expand_more</span>
               </div>
               <button className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 px-4 py-2.5 text-sm font-bold rounded-xl transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  Advanced
               </button>
            </div>
         </div>

         {loading ? (
            <div className="p-12 text-center text-on-surface-variant bg-surface rounded-[2rem] shadow-sm border border-outline-variant/30">Analyzing metrics...</div>
         ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
               
               {/* Primary Stats Panel */}
               <div className="col-span-1 lg:col-span-8 bg-surface rounded-[2rem] p-8 shadow-sm border border-outline-variant/30 flex flex-col">
                  <div className="grid grid-cols-3 gap-6 mb-8">
                     <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20">
                        <p className="text-on-surface-variant text-sm font-bold tracking-widest uppercase mb-1">Total Revenue</p>
                        <p className="text-primary font-black text-3xl">₹{stats.revenue.toLocaleString()}</p>
                        <p className="text-emerald-500 text-xs font-bold mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">trending_up</span> +14.2% from prev</p>
                     </div>
                     <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20">
                        <p className="text-on-surface-variant text-sm font-bold tracking-widest uppercase mb-1">Appointments</p>
                        <p className="text-ink-depth font-black text-3xl">{stats.appointments}</p>
                        <p className="text-emerald-500 text-xs font-bold mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">trending_up</span> +5.8% from prev</p>
                     </div>
                     <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20">
                        <p className="text-on-surface-variant text-sm font-bold tracking-widest uppercase mb-1">New Patients</p>
                        <p className="text-ink-depth font-black text-3xl">{stats.patients}</p>
                        <p className="text-on-surface-variant text-xs font-bold mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">horizontal_rule</span> Steady rate</p>
                     </div>
                  </div>

                  <h4 className="font-bold text-ink-depth mb-4">Revenue & Appointment Trend</h4>
                  <div className="h-64 w-full flex-grow">
                     <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={chartData}>
                             <defs>
                               <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                               </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                             <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                             <Tooltip contentStyle={{backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                             <Area yAxisId="left" type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                         </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* Right Sidebar */}
               <div className="col-span-1 lg:col-span-4 space-y-6 flex flex-col">
                  {/* Doctor Leaderboard */}
                  <div className="bg-surface rounded-[2rem] p-6 shadow-sm border border-outline-variant/30 flex-grow">
                     <h4 className="font-bold text-ink-depth mb-4 flex items-center justify-between">
                        <span>Top Performers</span>
                        <span className="material-symbols-outlined text-amber-500 text-[18px]">workspace_premium</span>
                     </h4>
                     <div className="space-y-3">
                        {docRankings.length > 0 ? docRankings.map((doc, i) => (
                           <div key={i} className="flex items-center justify-between p-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl hover:bg-surface-container-low transition-colors">
                              <div className="flex items-center gap-3">
                                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                    {i + 1}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="font-bold text-ink-depth text-sm whitespace-nowrap overflow-hidden text-ellipsis">{doc.name}</p>
                                    <p className="text-[10px] text-on-surface-variant flex items-center gap-1 font-bold">
                                       <span className="material-symbols-outlined text-[12px] text-primary">medical_services</span>
                                       {doc.count} Cases
                                    </p>
                                 </div>
                              </div>
                              <span className="font-bold text-emerald-600 text-sm whitespace-nowrap ml-2">{doc.revenueText}</span>
                           </div>
                        )) : (
                            <div className="text-sm text-on-surface-variant py-4 text-center">Add doctors to view rankings.</div>
                        )}
                     </div>
                  </div>

                  {/* AI Snippet replacing large bloated module */}
                  <div className="bg-gradient-to-br from-primary to-emerald-700 rounded-[2rem] p-6 shadow-sm text-white relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] rounded-full pointer-events-none"></div>
                     <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-white/90 text-[18px]">magic_button</span>
                        <h5 className="font-bold text-sm">AI Insight</h5>
                     </div>
                     <p className="text-white/80 text-sm leading-relaxed mb-4">
                        Vaccination appointments are up 12% this week. Suggest allocating more inventory to standard core vaccines.
                     </p>
                     <button className="text-xs font-bold text-primary bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-surface-container-lowest transition-colors w-full">
                        View Detailed Report
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
