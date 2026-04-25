import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { supabase } from '../services/supabase';

const DoctorCard = ({ doc, idx }: { doc: any, idx: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div 
      ref={cardRef}
      style={{ y, opacity }}
      key={idx} 
      className="group relative bg-surface rounded-3xl overflow-hidden border border-outline-variant/30 hover:border-primary/50 hover:shadow-lg transition-all duration-500 ease-in-out flex flex-col cursor-pointer"
    >
      <div className="relative h-72 overflow-hidden bg-surface-container">
          {doc.image_url ? (
            <img loading="lazy" decoding="async" src={doc.image_url} alt={doc.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-105" />
          ) : (
            <div className="w-full h-full bg-surface-container-high flex justify-center items-center">
              <span className="material-symbols-outlined text-[64px] text-outline-variant">person</span>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-outline-variant">
              <span className={`w-2 h-2 rounded-full ${doc.availability === 'Online' ? 'bg-secondary' : 'bg-pharmacy-green'}`}></span>
              <span className="font-inter font-bold text-[12px] tracking-widest text-ink-depth">{doc.availability || 'In-Clinic'}</span>
          </div>
      </div>
      <div className="p-8 flex flex-col flex-grow">
          <div className="mb-4">
              <h3 className="font-manrope font-extrabold text-[28px] text-ink-depth leading-tight mb-2 group-hover:text-primary transition-colors">{doc.name}</h3>
              <p className="font-inter font-bold text-primary tracking-widest uppercase text-[12px] mb-2">{doc.primary_specialty || doc.specialty}</p>
              {doc.title && <p className="font-inter font-bold text-on-surface-variant tracking-widest uppercase text-[12px] mb-1">{doc.title}</p>}
              {doc.qualifications && <p className="font-inter font-semibold text-outline text-[14px]">{doc.qualifications}</p>}
          </div>
          <div className="w-8 h-1 bg-gradient-to-r from-primary to-transparent mb-6 opacity-30 group-hover:w-full group-hover:opacity-100 transition-all duration-500 ease-out"></div>
          <p className="font-inter text-on-surface-variant text-[15px] leading-relaxed mb-6 flex-grow line-clamp-3">
              {doc.bio || doc.description || doc.desc}
          </p>
          <div className="flex items-center gap-2 text-primary font-manrope font-bold text-[14px] uppercase tracking-widest mt-auto group-hover:tracking-[0.2em] transition-all duration-300">
              <span>Book Consultation</span>
              <span className="material-symbols-outlined text-[18px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
      </div>
    </motion.div>
  );
};

export const OurDoctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase.from('doctors').select('*');
        if (error) throw error;
        setDoctors(data || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const scheduleData = [
    {
      day: "Monday",
      shifts: [
        { shift: "Morning", time: "11:30am - 2:30pm", doctors: "Dr Das", type: "regular" },
        { shift: "Afternoon", time: "3:00pm - 5:00pm", doctors: "Dr Bala", type: "regular" },
        { shift: "Evening", time: "6:30pm - 9:00pm", doctors: "Dr Halder", type: "regular" },
        { shift: "Emergency", time: "11:30pm - 6:00am", doctors: "Dr Halder", type: "emergency" },
      ]
    },
    {
      day: "Tuesday",
      shifts: [
        { shift: "Morning", time: "11:30am - 2:30pm", doctors: "Dr Karim", type: "regular" },
        { shift: "Afternoon", time: "3:00pm - 5:00pm", doctors: "Dr Karim", type: "regular" },
        { shift: "Evening", time: "7:00pm - 9:00pm", doctors: "Dr Majie", type: "regular" },
        { shift: "Emergency", time: "11:30pm - 6:00am", doctors: "Dr Hossen", type: "emergency" },
      ]
    },
    {
      day: "Wednesday",
      shifts: [
        { shift: "Morning", time: "11:30am - 2:30pm", doctors: "Dr Das", type: "regular" },
        { shift: "Afternoon", time: "3:00pm - 5:00pm", doctors: "Dr Shivangi", type: "regular" },
        { shift: "Evening", time: "6:30pm - 9:00pm", doctors: "Dr Halder", type: "regular" },
        { shift: "Emergency", time: "11:30pm - 6:00am", doctors: "Dr Halder", type: "emergency" },
      ]
    },
    {
      day: "Thursday",
      shifts: [
        { shift: "Morning", time: "11:30am - 2:30pm", doctors: "Dr Tofi Mondol", type: "regular" },
        { shift: "Afternoon", time: "3:00pm - 5:00pm", doctors: "Dr Bala", type: "regular" },
        { shift: "Evening", time: "6:00pm - 7:30pm", doctors: "Dr Shome", type: "regular" },
        { shift: "Evening", time: "7:30pm - 9:00pm", doctors: "Dr Roy", type: "regular" },
        { shift: "Emergency", time: "11:30pm - 6:00am", doctors: "Dr Pallab Mondol", type: "emergency" },
      ]
    },
    {
      day: "Friday",
      shifts: [
        { shift: "Morning", time: "11:30am - 2:30pm", doctors: "Dr Pallab Mondol", type: "regular" },
        { shift: "Afternoon", time: "3:00pm - 5:00pm", doctors: "Dr Shivangi", type: "regular" },
        { shift: "Evening", time: "6:30pm - 9:00pm", doctors: "Dr Tofi Mondol", type: "regular" },
        { shift: "Emergency", time: "11:30pm - 6:00am", doctors: "Dr Halder", type: "emergency" },
      ]
    },
    {
      day: "Saturday",
      shifts: [
        { shift: "Morning", time: "11:30am - 2:30pm", doctors: "Dr Karim", type: "regular" },
        { shift: "Afternoon", time: "3:00pm - 5:00pm", doctors: "Dr Karim", type: "regular" },
        { shift: "Evening", time: "6:00pm - 7:30pm", doctors: "Dr Shome", type: "regular" },
        { shift: "Evening", time: "7:30pm - 9:00pm", doctors: "Dr Majie", type: "regular" },
        { shift: "Emergency", time: "11:30pm - 6:00am", doctors: "Dr Shamim", type: "emergency" },
      ]
    },
    {
      day: "Sunday",
      shifts: [
        { shift: "Morning", time: "11:30am - 2:30pm", doctors: "Dr Murthy", type: "regular" },
        { shift: "Afternoon", time: "3:00pm - 5:00pm", doctors: "Dr Shivangi", type: "regular" },
        { shift: "Evening", time: "6:00pm - 7:00pm", doctors: "Dr Karim", type: "regular" },
        { shift: "Evening", time: "7:30pm - 9:00pm", doctors: "Dr Roy", type: "regular" },
        { shift: "Emergency", time: "11:30pm - 6:00am", doctors: "Dr Hossen", type: "emergency" },
      ]
    }
  ];

  const [activeDay, setActiveDay] = useState("Monday");

  return (
    <section className="py-[120px] px-6 max-w-[1280px] mx-auto w-full overflow-hidden">
      <div className="mb-16">
        <h2 className="font-manrope font-black text-[48px] tracking-tight text-ink-depth mb-4">Doctor Schedule <span className="text-on-surface-variant font-medium text-[24px] tracking-normal">(Tentative)</span></h2>
        <p className="font-inter text-[18px] text-on-surface-variant max-w-2xl mb-10">
          Meet the dedicated team providing immersive clinical excellence. Check our weekly roster to plan your visit or walk-in consultation.
        </p>

        {/* Team Photo Banner */}
        <div className="w-full bg-surface-container rounded-3xl overflow-hidden relative group shadow-2xl mb-16 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none"></div>
            <img 
                loading="lazy"
                decoding="async"
                src="https://ik.imagekit.io/senvetcare/Logo/Team%20SenVetCare.webp" 
                alt="SenVetCare Team" 
                className="w-full h-auto max-h-[600px] object-contain transition-all duration-1000 transform scale-95 group-hover:scale-100"
            />
            <div className="absolute bottom-6 left-6 z-20 sanctuary-card px-6 py-3 rounded-full inline-flex items-center gap-3 backdrop-blur-md">
                <span className="material-symbols-outlined text-waiting-gold text-[24px]">groups</span>
                <span className="text-white font-manrope font-bold tracking-widest uppercase text-sm">The Collective of Care</span>
            </div>
        </div>

        {/* Doctors Grid (From Supabase) */}
        {!loading && doctors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {doctors.map((doc, idx) => (
              <DoctorCard key={idx} doc={doc} idx={idx} />
            ))}
          </div>
        )}

        {/* Schedule Interface */}
        <div className="bg-surface border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm">
          {/* Day Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar border-b border-outline-variant/30 bg-surface-container-low">
            {scheduleData.map((dayObj) => (
              <button
                key={dayObj.day}
                onClick={() => setActiveDay(dayObj.day)}
                className={`py-6 px-8 min-w-max font-manrope font-bold text-[16px] transition-colors relative ${
                  activeDay === dayObj.day 
                    ? 'text-primary' 
                    : 'text-on-surface-variant hover:text-ink-depth hover:bg-surface'
                }`}
              >
                {dayObj.day}
                {activeDay === dayObj.day && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Shifts Content */}
          <div className="p-0 sm:p-6 bg-surface">
             {scheduleData.map((dayObj) => (
                <div 
                  key={dayObj.day} 
                  className={`flex flex-col gap-4 ${activeDay === dayObj.day ? 'block' : 'hidden'}`}
                >
                  <div className="grid grid-cols-1 divide-y divide-outline-variant/30 border border-outline-variant/30 sm:rounded-2xl overflow-hidden">
                    <div className="hidden sm:grid sm:grid-cols-12 bg-surface-container-low p-4 text-xs font-bold font-inter tracking-widest uppercase text-on-surface-variant">
                      <div className="col-span-3">Shift</div>
                      <div className="col-span-4">Time</div>
                      <div className="col-span-5">Available Doctors</div>
                    </div>
                    {dayObj.shifts.map((shift, idx) => (
                      <div 
                        key={idx} 
                        className={`sm:grid sm:grid-cols-12 p-4 sm:items-center hover:bg-surface-container-low/50 transition-colors ${
                          shift.type === 'emergency' ? 'bg-error/5 relative' : ''
                        }`}
                      >
                        {shift.type === 'emergency' && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
                        )}
                        <div className="col-span-3 mb-2 sm:mb-0 flex items-center gap-2">
                          <span className={`material-symbols-outlined text-[18px] ${shift.type === 'emergency' ? 'text-error animate-pulse' : 'text-primary'}`}>
                            {shift.type === 'emergency' ? 'emergency' : 'schedule'}
                          </span>
                          <span className={`font-manrope font-bold text-[16px] ${shift.type === 'emergency' ? 'text-error' : 'text-ink-depth'}`}>
                            {shift.shift}
                          </span>
                        </div>
                        <div className="col-span-4 mb-2 sm:mb-0 font-inter text-on-surface-variant text-[15px] flex items-center gap-2">
                           <span className="material-symbols-outlined text-[14px] opacity-70">nest_clock_farsight_analog</span>
                           {shift.time}
                        </div>
                        <div className="col-span-5 font-inter font-medium text-[16px] text-ink-depth bg-surface-container inline-block sm:block px-3 py-1.5 sm:px-0 sm:py-0 sm:bg-transparent rounded-lg">
                          {shift.doctors}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
             ))}
          </div>
          <div className="p-4 sm:p-6 bg-surface-container-low border-t border-outline-variant/30 text-sm text-on-surface-variant font-inter flex gap-2 items-start">
            <span className="material-symbols-outlined text-[18px] text-waiting-gold shrink-0">info</span>
            <p><strong>Note:</strong> This schedule is tentative and subject to change based on emergencies and doctors' availability. We recommend calling ahead to confirm your preferred doctor's presence.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
