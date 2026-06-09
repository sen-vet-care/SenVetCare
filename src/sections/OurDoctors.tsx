import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doc, idx }: { doc: any; idx: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const navigate = useNavigate();

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity }}
      key={idx}
      onClick={() => navigate("/book")}
      className="group relative bg-surface rounded-3xl overflow-hidden border border-outline-variant/30 hover:border-primary/50 hover:shadow-lg transition-all duration-500 ease-in-out flex flex-col cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden bg-surface-container">
        {doc.imageUrl ? (
          <img
            loading="lazy"
            decoding="async"
            src={doc.imageUrl}
            alt={doc.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-high flex justify-center items-center">
            <span className="material-symbols-outlined text-[48px] text-outline-variant">
              person
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-outline-variant">
          <span
            className={`w-2 h-2 rounded-full ${doc.isPresent ? "bg-emerald-500" : "bg-zinc-400"}`}
          ></span>
          <span className="font-inter font-bold text-[10px] tracking-widest text-ink-depth">
            {doc.isPresent ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="font-manrope font-extrabold text-[22px] text-ink-depth leading-tight mb-1.5 group-hover:text-primary transition-colors">
            {doc.name}
          </h3>
          <p className="font-inter font-bold text-primary tracking-widest uppercase text-[10px] mb-1">
            {doc.primary_specialty || doc.specialty}
          </p>
          {doc.title && (
            <p className="font-inter font-bold text-on-surface-variant tracking-widest uppercase text-[10px] mb-1">
              {doc.title}
            </p>
          )}
          {doc.qualifications && (
            <p className="font-inter font-semibold text-outline text-[12px]">
              {doc.qualifications}
            </p>
          )}
        </div>
        <div className="w-6 h-1 bg-gradient-to-r from-primary to-transparent mb-4 opacity-30 group-hover:w-full group-hover:opacity-100 transition-all duration-500 ease-out"></div>
        <p className="font-inter text-on-surface-variant text-[13px] leading-relaxed mb-6 flex-grow line-clamp-3">
          {doc.bio || doc.description || doc.desc}
        </p>
        <div className="flex items-center gap-2 text-primary font-manrope font-bold text-[12px] uppercase tracking-widest mt-auto group-hover:tracking-widest transition-all duration-300">
          <span>Book</span>
          <span className="material-symbols-outlined text-[16px] transform group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const HARDCODED_SCHEDULE = [
  { doc: "Dr Das", day: "Monday", shift: "Morning", time: "11:30am - 2:30pm" },
  { doc: "Dr Bala", day: "Monday", shift: "Afternoon", time: "3:00pm - 5:00pm" },
  { doc: "Dr Sen + Dr Halder", day: "Monday", shift: "Evening", time: "6:30pm - 9:00pm" },
  { doc: "Dr Halder", day: "Monday", shift: "Emergency", time: "11:30pm - 6:00am" },
  { doc: "Dr Karim", day: "Tuesday", shift: "Morning", time: "11:30am - 2:30pm" },
  { doc: "-", day: "Tuesday", shift: "Afternoon", time: "3:00pm - 5:00pm" },
  { doc: "Dr Majie", day: "Tuesday", shift: "Evening", time: "7:00pm - 9:00pm" },
  { doc: "Dr Hossen", day: "Tuesday", shift: "Emergency", time: "11:30pm - 6:00am" },
  { doc: "Dr Das", day: "Wednesday", shift: "Morning", time: "11:30am - 2:30pm" },
  { doc: "Dr Shivangi", day: "Wednesday", shift: "Afternoon", time: "3:00pm - 5:00pm" },
  { doc: "Dr Sen + Dr Halder", day: "Wednesday", shift: "Evening", time: "6:30pm - 9:00pm" },
  { doc: "Dr Halder", day: "Wednesday", shift: "Emergency", time: "11:30pm - 6:00am" },
  { doc: "Dr Tofi Mondol", day: "Thursday", shift: "Morning", time: "11:30am - 2:30pm" },
  { doc: "Dr Bala", day: "Thursday", shift: "Afternoon", time: "3:00pm - 5:00pm" },
  { doc: "Dr Shome", day: "Thursday", shift: "Evening", time: "6:00pm - 7:30pm" },
  { doc: "Dr Roy", day: "Thursday", shift: "Evening", time: "7:30pm - 9:00pm" },
  { doc: "Dr Pallab Mondol", day: "Thursday", shift: "Emergency", time: "11:30pm - 6:00am" },
  { doc: "Dr Pallab Mondol", day: "Friday", shift: "Morning", time: "11:30am - 2:30pm" },
  { doc: "Dr Shivangi", day: "Friday", shift: "Afternoon", time: "3:00pm - 5:00pm" },
  { doc: "Dr Sen + Dr Tofi Mondol", day: "Friday", shift: "Evening", time: "6:30pm - 9:00pm" },
  { doc: "Dr Halder", day: "Friday", shift: "Emergency", time: "11:30pm - 6:00am" },
  { doc: "Dr Karim", day: "Saturday", shift: "Morning", time: "11:30am - 2:30pm" },
  { doc: "-", day: "Saturday", shift: "Afternoon", time: "3:00pm - 5:00pm" },
  { doc: "Dr Shome", day: "Saturday", shift: "Evening", time: "6:00pm - 7:30pm" },
  { doc: "Dr Majie", day: "Saturday", shift: "Evening", time: "7:30pm - 9:00pm" },
  { doc: "Dr Shamim", day: "Saturday", shift: "Emergency", time: "11:30pm - 6:00am" },
  { doc: "Dr Murthy", day: "Sunday", shift: "Morning", time: "11:30am - 2:30pm" },
  { doc: "Dr Shivangi", day: "Sunday", shift: "Afternoon", time: "3:00pm - 5:00pm" },
  { doc: "Dr Karim", day: "Sunday", shift: "Evening", time: "6:00pm - 7:00pm" },
  { doc: "Dr Roy", day: "Sunday", shift: "Evening", time: "7:30pm - 9:00pm" },
  { doc: "Dr Hossen", day: "Sunday", shift: "Emergency", time: "11:30pm - 6:00am" },
];

export const OurDoctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleByDay, setScheduleByDay] = useState<
    {
      day: string;
      slots: { docName: string; time: string; timeNum: number }[];
    }[]
  >([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "doctors"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));

        // Deduplicate by name
        const uniqueDocs: any[] = [];
        const seenNames = new Set<string>();
        for (const d of data) {
          if (d.name && !seenNames.has(d.name)) {
            seenNames.add(d.name);
            uniqueDocs.push(d);
          }
        }

        setDoctors(uniqueDocs.slice(0, 4)); // limit to 4 doctors

        const newSchedule = generateSchedule(uniqueDocs);
        setScheduleByDay(newSchedule);
      } catch (err) {
        console.warn("Error fetching doctors collection:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const generateSchedule = (docs: any[]) => {
    const dayNames = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const parseDays = (daysStr: string) => {
      if (!daysStr) return [1, 2, 3, 4, 5, 6];
      const str = daysStr.toLowerCase();
      let activeDays = new Set<number>();
      if (
        str.includes("mon - fri") ||
        str.includes("mon-fri") ||
        str.includes("weekdays")
      ) {
        [1, 2, 3, 4, 5].forEach((d) => activeDays.add(d));
      }
      if (str.includes("mon")) activeDays.add(1);
      if (str.includes("tue")) activeDays.add(2);
      if (str.includes("wed")) activeDays.add(3);
      if (str.includes("thu")) activeDays.add(4);
      if (str.includes("fri")) activeDays.add(5);
      if (str.includes("sat")) activeDays.add(6);
      if (str.includes("sun")) activeDays.add(0);

      if (activeDays.size === 0) return [1, 2, 3, 4, 5, 6];
      return Array.from(activeDays);
    };

    const parseTime = (timeStr: string) => {
      if (!timeStr) return 0;
      const match = timeStr.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
      if (!match) return 0;
      let hours = parseInt(match[1]);
      const minutes = match[2] ? parseInt(match[2]) : 0;
      const isPM = match[3].toUpperCase() === "PM";
      if (isPM && hours < 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
      return hours + minutes / 60;
    };

    const scheduleObj: {
      [key: number]: { docName: string; time: string; timeNum: number }[];
    } = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      0: [],
    };

    docs.forEach((doc) => {
      const docDays = parseDays(doc.days);
      docDays.forEach((dayIdx) => {
        scheduleObj[dayIdx].push({
          docName: doc.name,
          time: doc.timings || "10:00 AM - 06:00 PM",
          timeNum: parseTime(doc.timings),
        });
      });
    });

    const displayOrder = [1, 2, 3, 4, 5, 6, 0]; // Mon-Sun
    const finalSchedule = [];

    for (const dayIdx of displayOrder) {
      if (scheduleObj[dayIdx].length > 0) {
        // Sort by time within the day
        scheduleObj[dayIdx].sort((a, b) => a.timeNum - b.timeNum);
        finalSchedule.push({
          day: dayNames[dayIdx],
          slots: scheduleObj[dayIdx],
        });
      }
    }

    return finalSchedule;
  };

  return (
    <>
      <section className="py-[120px] px-6 max-w-[1280px] mx-auto w-full overflow-hidden">
        <div className="mb-0">
          <h2 className="font-manrope font-black text-[48px] tracking-tight text-ink-depth mb-4">
            Meet Our Doctors
          </h2>
          <p className="font-inter text-[18px] text-on-surface-variant max-w-2xl mb-10">
            Meet the dedicated team providing immersive clinical excellence.
            Explore our specialists and their expertise.
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
              <span className="material-symbols-outlined text-waiting-gold text-[24px]">
                groups
              </span>
              <span className="text-white font-manrope font-bold tracking-widest uppercase text-sm">
                The Collective of Care
              </span>
            </div>
          </div>

          {/* Doctors Grid */}
          {!loading && doctors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((doc, idx) => (
                <DoctorCard key={idx} doc={doc} idx={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Schedule Table Section */}
      <section className="py-16 px-6 w-full">
        <div className="max-w-[800px] mx-auto w-full">
          <h2 className="font-manrope font-black text-[28px] text-ink-depth mb-6 pb-2 border-b border-outline-variant/30">
            Clinic Schedule
          </h2>
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse border-2 border-emerald-600 bg-white shadow-sm font-sans min-w-[700px]">
              <thead>
                <tr>
                  <th className="border-2 border-emerald-600 p-3 text-emerald-600 font-bold text-sm tracking-wide text-left w-[30%]">
                    DOCTOR
                  </th>
                  <th className="border-2 border-emerald-600 p-3 text-emerald-600 font-bold text-sm tracking-wide text-left w-[20%]">
                    DAY
                  </th>
                  <th className="border-2 border-emerald-600 p-3 text-emerald-600 font-bold text-sm tracking-wide text-left w-[20%]">
                    SHIFT
                  </th>
                  <th className="border-2 border-emerald-600 p-3 text-emerald-600 font-bold text-sm tracking-wide text-left w-[30%]">
                    TIME
                  </th>
                </tr>
              </thead>
              <tbody>
                {HARDCODED_SCHEDULE.map((row, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50 transition-colors">
                    <td className="border-2 border-emerald-600 p-3 text-gray-800 text-sm align-middle">
                      {row.doc}
                    </td>
                    <td className="border-2 border-emerald-600 p-3 text-gray-800 text-sm font-medium align-middle">
                      {row.day}
                    </td>
                    <td className="border-2 border-emerald-600 p-3 text-gray-800 text-sm align-middle">
                      {row.shift}
                    </td>
                    <td className="border-2 border-emerald-600 p-3 text-gray-800 text-sm align-middle">
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};
