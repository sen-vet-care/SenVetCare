import { useState } from 'react';
import { getDrLilyResponse } from '../../services/ai';

export const DrLilyWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Hello! I'm Dr. Lily®, your virtual assistant and AI triage specialist. Do you have a medical situation to discuss?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "Check clinical hours",
    "Book an emergency triage",
    "Common pet toxicity signs"
  ]);

  const parseSuggestions = (text: string) => {
    const regex = /\[SUGGESTIONS\]([\s\S]*?)\[\/SUGGESTIONS\]/;
    const match = text.match(regex);
    if (match) {
      const suggestionsText = match[1];
      const cleanedSuggestions = suggestionsText
        .split('\n')
        .map(s => s.replace(/^- /, '').trim())
        .filter(s => s.length > 0)
        .slice(0, 3);
      
      const cleanedText = text.replace(regex, '').trim();
      return { cleanedText, cleanedSuggestions };
    }
    return { cleanedText: text, cleanedSuggestions: [] };
  };

  const handleSend = async (message: string) => {
    if (!message.trim() || isLoading) return;
    
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setSuggestions([]); // Clear suggestions while loading
    setIsLoading(true);

    try {
      const response = await getDrLilyResponse(message, messages);
      const { cleanedText, cleanedSuggestions } = parseSuggestions(response);
      setMessages(prev => [...prev, { role: 'assistant', content: cleanedText }]);
      if (cleanedSuggestions.length > 0) {
        setSuggestions(cleanedSuggestions);
      } else {
        setSuggestions(["Check clinical hours", "View services", "Emergency SOS"]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again or call the reception." }]);
      setSuggestions(["Call reception", "Emergency SOS", "Try again"]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMsg = input.trim();
    setInput('');
    handleSend(userMsg);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {/* Expanded Chat */}
      {isOpen ? (
        <div className="bg-surface/95 backdrop-blur-xl border border-outline-variant/30 rounded-3xl w-80 sm:w-96 h-[500px] shadow-2xl flex flex-col overflow-hidden origin-bottom-right">
          <div className="bg-surface-container-highest p-4 flex items-center justify-between border-b border-outline-variant/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-on-secondary shadow-lg relative bg-white border border-outline-variant/20">
                {/* Aura for the top header avatar */}
                <div className="absolute -inset-3 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-lg animate-pulse opacity-30"></div>
                <img src="https://ik.imagekit.io/senvetcare/Dr.%20Lily/Dr%20Lily.webp" alt="Dr. Lily" className="w-[90%] h-[90%] object-contain drop-shadow relative z-10" />
              </div>
              <div>
                <h4 className="font-inter text-[13px] font-bold tracking-widest text-on-background">DR. LILY®</h4>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Triage AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-primary text-on-primary rounded-tr-none' : 'bg-surface-container border border-outline-variant/20 rounded-tl-none text-on-surface'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 bg-surface-container border border-outline-variant/20 rounded-2xl rounded-tl-none text-on-surface-variant text-sm flex gap-1 items-center">
                  <span className="w-2 h-2 rounded-full bg-outline-variant animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-outline-variant animate-bounce" style={{animationDelay: '0.1s'}}></span>
                  <span className="w-2 h-2 rounded-full bg-outline-variant animate-bounce" style={{animationDelay: '0.2s'}}></span>
                </div>
              </div>
            )}
            
            {!isLoading && suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(s)}
                    className="bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-xs font-medium text-primary transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-3 border-t border-outline-variant/30 bg-surface flex flex-col gap-2">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our services..." 
                className="flex-1 bg-surface border border-outline-variant/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button disabled={isLoading} type="submit" className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container disabled:opacity-50 transition-colors">
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
            {/* Dr Lily Branding Bottom */}
            <div className="text-center pt-1 border-t border-outline-variant/30 mt-1">
              <span className="text-[9px] text-on-surface-variant font-bold tracking-widest uppercase opacity-70">Powered by Dr. Lily® AI (Triage Module Active)</span>
            </div>
          </form>
        </div>
      ) : (
        /* Floating Bubble & Initial Message */
        <>
          <div 
            className={`bg-surface/90 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-4 shadow-lg shadow-dr-lily-glow/10 max-w-[280px] transform origin-bottom-right transition-all duration-300 cursor-pointer ${isHovered ? 'scale-105 opacity-100' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            onClick={() => setIsOpen(true)}
          >
            <p className="font-inter font-medium text-[15px] leading-snug tracking-tight text-on-surface mb-2">
              Hello! I'm Dr. Lily®, your virtual assistant and AI triage specialist. Do you have a medical situation to discuss?
            </p>
            <div className="block text-right">
              <span className="text-[9px] text-on-surface-variant font-bold tracking-widest uppercase opacity-60">Powered by Dr. Lily® AI</span>
            </div>
          </div>
          <button 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsOpen(true)}
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
        </>
      )}
    </div>
  );
};
