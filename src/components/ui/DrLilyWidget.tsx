import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DrLilyWidget = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {/* Floating Bubble & Initial Message */}
      <div 
        className={`bg-surface/90 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-4 shadow-lg shadow-dr-lily-glow/10 max-w-[280px] transform origin-bottom-right transition-all duration-300 cursor-pointer ${isHovered ? 'scale-105 opacity-100' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        onClick={() => navigate('/dr-lily')}
      >
        <p className="font-inter font-medium text-[15px] leading-snug tracking-tight text-on-surface mb-2">
          Hello! I'm Dr. Lily®, your virtual assistant and AI triage specialist. Start a free triage assessment now.
        </p>
        <div className="block text-right">
          <span className="text-[9px] text-on-surface-variant font-bold tracking-widest uppercase opacity-60">Powered by Dr. Lily® AI</span>
        </div>
      </div>
      <button 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate('/dr-lily')}
        className="relative group mt-3 ml-auto block"
      >
        {/* Siri-like Aura Background */}
        <div className="absolute -inset-6 bg-gradient-to-tr from-cyan-400 via-white to-purple-500 rounded-full blur-xl animate-pulse opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
        
        {/* Inner White Glow behind Avatar */}
        <div className="absolute inset-0 bg-white rounded-full shadow-[0_0_20px_10px_rgba(255,255,255,0.8)] z-0"></div>
        
        <div className="relative w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center shadow-xl border border-white/50 group-hover:scale-105 transition-transform z-10 overflow-hidden">
          <img src="https://ik.imagekit.io/senvetcare/Dr.%20Lily/Dr%20Lily.webp" alt="Dr. Lily" className="w-[90%] h-[90%] object-contain drop-shadow-md z-20" />
        </div>
        
        <div className="absolute -bottom-5 w-[140px] left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <span className="bg-surface/90 backdrop-blur px-2 py-0.5 rounded-full border border-outline-variant/30 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest shadow-sm">Dr. Lily® AI</span>
        </div>
      </button>
    </div>
  );
};

