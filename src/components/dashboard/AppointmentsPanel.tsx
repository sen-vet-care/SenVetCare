export const AppointmentsPanel = () => {
  return (
    <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-manrope font-bold text-2xl text-ink-depth">Appointments</h3>
        <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-emerald-700 transition">
          Book Appointment
        </button>
      </div>
      
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl">event_upcoming</span>
        </div>
        <h4 className="font-manrope font-bold text-xl text-ink-depth mb-2">No Upcoming Appointments</h4>
        <p className="text-on-surface-variant max-w-sm mx-auto">You have no scheduled appointments. Book a new consultation or check back later.</p>
      </div>
    </div>
  );
};
