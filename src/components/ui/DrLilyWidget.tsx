import { useState } from 'react';
import { getDrLilyResponse } from '../../services/ai';

export const DrLilyWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Hello! I'm Dr. Lily®, your virtual assistant. How can I help you navigate the clinic or find information today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await getDrLilyResponse(userMsg, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again or call the reception." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {/* Expanded Chat */}
      {isOpen ? (
        <div className="bg-surface/95 backdrop-blur-xl border border-outline-variant/30 rounded-3xl w-80 sm:w-96 h-[500px] shadow-2xl flex flex-col overflow-hidden origin-bottom-right">
          <div className="bg-surface-container-highest p-4 flex items-center justify-between border-b border-outline-variant/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary shadow-lg relative">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                <div className="absolute -inset-1 rounded-full border-2 border-dr-lily-glow animate-pulse opacity-50"></div>
              </div>
              <div>
                <h4 className="font-inter text-[12px] font-bold tracking-widest text-on-background">DR. LILY®</h4>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Clinic Assistant</p>
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
          </div>
          
          <form onSubmit={handleSubmit} className="p-3 border-t border-outline-variant/30 bg-white">
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
          </form>
        </div>
      ) : (
        /* Floating Bubble & Initial Message */
        <>
          <div 
            className={`bg-surface/90 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-4 shadow-lg shadow-dr-lily-glow/10 max-w-[280px] transform origin-bottom-right transition-all duration-300 cursor-pointer ${isHovered ? 'scale-105 opacity-100' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            onClick={() => setIsOpen(true)}
          >
            <p className="font-inter font-medium text-[15px] leading-snug tracking-tight text-on-surface">
              Hello! I'm Dr. Lily®, your virtual assistant. How can I help you navigate the clinic today?
            </p>
          </div>
          <button 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsOpen(true)}
            className="relative group"
          >
            <div className="absolute -inset-2 bg-dr-lily-glow/20 rounded-full blur-md animate-pulse group-hover:bg-dr-lily-glow/40 transition-colors"></div>
            <div className="relative w-16 h-16 bg-gradient-to-tr from-secondary to-dr-lily-glow rounded-full flex items-center justify-center shadow-xl border border-white/30 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white text-3xl">smart_toy</span>
            </div>
          </button>
        </>
      )}
    </div>
  );
};
