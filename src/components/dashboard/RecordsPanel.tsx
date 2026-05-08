export const RecordsPanel = () => {
  return (
    <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-manrope font-bold text-2xl text-ink-depth">Medical Records</h3>
      </div>
      
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl">folder_shared</span>
        </div>
        <h4 className="font-manrope font-bold text-xl text-ink-depth mb-2">No Records Available</h4>
        <p className="text-on-surface-variant max-w-sm mx-auto">Medical records, lab results, and prescriptions will appear here after your visits.</p>
      </div>
    </div>
  );
};
