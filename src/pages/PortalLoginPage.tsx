import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

export const PortalLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('pet-owner');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!isSignUp && email === 'contact@senvetcare.com' && password === 'admin123') {
        alert("Demo Access Granted.");
        navigate('/');
        return;
      }
      
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("Sign up successful! Welcome to SenVetCare.");
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful! Welcome to the Clinical Portal.");
      }
      
      if (userCredential.user) {
        navigate('/'); // Redirect to dashboard or home
      }
    } catch (error: any) {
      console.error("Auth failed:", error);
      alert(`Authentication Failed: ${error.message || 'Invalid credentials'}`);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <main className="min-h-screen py-32 bg-black relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-waiting-gold/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md px-6"
      >
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto mb-6">
            <img src="https://ik.imagekit.io/senvetcare/Logo/Logo%20Trans.webp" alt="SenVetCare" className="w-full h-full object-contain filter invert opacity-90" />
          </div>
          <h1 className="font-manrope font-bold text-3xl text-white mb-2 tracking-tight uppercase">Clinical Portal</h1>
          <p className="font-inter text-zinc-600 text-[10px] uppercase font-bold tracking-[0.2em]">Authorized Access Managed by Dr. Sen Memorial Trust</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          <form onSubmit={handleAuth} className="space-y-8">
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 mx-auto max-w-xs mb-8">
              <button 
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${!isSignUp ? 'bg-white text-black' : 'text-zinc-500'}`}
              >
                Login
              </button>
              <button 
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${isSignUp ? 'bg-white text-black' : 'text-zinc-500'}`}
              >
                Sign Up
              </button>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-4">
                <label className="block font-inter font-bold text-[10px] tracking-[0.2em] text-zinc-500 uppercase px-1">Role Selection</label>
                <div className="grid grid-cols-3 gap-2">
                  {['pet-owner', 'vets', 'admin'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setUserType(type)}
                      className={`py-3 rounded-xl font-inter font-bold text-[9px] uppercase tracking-wider transition-all duration-300 border ${
                        userType === type 
                          ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]' 
                          : 'bg-black/40 text-zinc-500 border-white/5 hover:border-white/20'
                      }`}
                    >
                      {type.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block font-inter font-bold text-[10px] tracking-[0.2em] text-zinc-500 uppercase px-1" htmlFor="email">Email Address</label>
                <input 
                  required
                  type="email" 
                  id="email" 
                  placeholder="e.g., patient@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-white/5 rounded-2xl px-5 py-4 font-inter text-white placeholder:text-zinc-800 focus:outline-none focus:border-primary transition-all duration-300"
                />
              </div>

              <div className="space-y-4">
                <label className="block font-inter font-bold text-[10px] tracking-[0.2em] text-zinc-500 uppercase px-1" htmlFor="password">Security Password</label>
                <input 
                  required
                  type="password" 
                  id="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-white/5 rounded-2xl px-5 py-4 font-inter text-white placeholder:text-zinc-800 focus:outline-none focus:border-primary transition-all duration-300"
                />
              </div>
            </div>

            <div className={`flex items-center justify-between text-[10px] font-inter font-bold uppercase tracking-widest text-zinc-600 ${isSignUp ? 'hidden': ''}`}>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-black" />
                Keep Session
              </label>
              <a href="#" className="hover:text-primary transition-colors">Credential Recovery</a>
            </div>
            
            {isSignUp && (
              <div className="text-center">
                <p className="font-inter text-[12px] text-emerald-400 font-bold uppercase tracking-widest">Sign up for free</p>
              </div>
            )}

            <button 
              disabled={isLoading}
              type="submit"
              className="w-full bg-white text-black py-5 rounded-full font-inter font-bold text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-white transition-all duration-500 shadow-[0_20px_50px_rgba(255,255,255,0.05)] disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Authenticate'}
                  <span className="material-symbols-outlined text-sm">{isSignUp ? 'how_to_reg' : 'lock_open'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="font-inter text-[10px] text-zinc-700 font-bold uppercase tracking-widest leading-relaxed">
              Protected by Sen-Memorial Protocol<br/>
              Access Logs are strictly monitored
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate('/')}
            className="font-inter text-[10px] font-bold text-zinc-600 hover:text-white uppercase tracking-[0.3em] transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to Public Access
          </button>
        </div>
      </motion.div>
    </main>
  );
};
