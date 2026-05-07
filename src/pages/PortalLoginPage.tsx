import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const ADMIN_EMAILS = [
  'drtbsmemorialvetclinic@gmail.com',
  'senvetcare@gmail.com',
  'contact@senvetcare.com'
];

export const PortalLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('pet-owner');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      if (userCredential.user) {
        const userEmail = userCredential.user.email?.toLowerCase();
        let finalRole = userType;
        
        if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
          finalRole = 'admin';
        } else if (userType === 'admin') {
          alert('You are not authorized to create an admin account. Defaulting to pet-owner.');
          finalRole = 'pet-owner';
        }
        
        // Save user data to Firestore
        const userRef = doc(db, 'users', userCredential.user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // It's a new user
          await setDoc(userRef, {
            email: userCredential.user.email,
            role: finalRole, // Assign the resolved role
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          });
          alert("Sign up successful! Welcome to SenVetCare.");
        } else {
          // Existing user, update last login and ensure role is updated if they are an admin
          await setDoc(userRef, {
            lastLoginAt: serverTimestamp(),
            ...(userEmail && ADMIN_EMAILS.includes(userEmail) ? { role: 'admin' } : {})
          }, { merge: true });
          alert("Login successful! Welcome to the Clinical Portal.");
        }

        navigate('/dashboard'); // Redirect to dashboard or home
      }
    } catch (error: any) {
      console.error("Google Auth failed:", error);
      alert(`Google Authentication Failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!isSignUp && email === 'contact@senvetcare.com' && password === 'admin123') {
        alert("Demo Access Granted.");
        navigate('/dashboard');
        return;
      }

      const userEmail = email.toLowerCase();
      let finalRole = userType;
      
      if (ADMIN_EMAILS.includes(userEmail)) {
        finalRole = 'admin';
      } else if (userType === 'admin') {
        alert("You are not authorized to create an admin account. Defaulting to pet-owner.");
        finalRole = 'pet-owner';
      }
      
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Add user info to firestore right after sign up
        const userRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userRef, {
            email: userCredential.user.email,
            role: finalRole, 
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
        });
        alert("Sign up successful! Welcome to SenVetCare.");
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        // update last log in
        const userRef = doc(db, 'users', userCredential.user.uid);
        const userSnap = await getDoc(userRef);
        // Fallback for demo users that don't have record
        if (!userSnap.exists()) {
             await setDoc(userRef, {
                email: userCredential.user.email,
                role: finalRole, 
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
             });
        } else {
            // Update last log in and ensure it's still admin if it's an admin email in case they were downgraded.
            await setDoc(userRef, {
                lastLoginAt: serverTimestamp(),
                ...(ADMIN_EMAILS.includes(userEmail) ? { role: 'admin' } : {})
            }, { merge: true });
        }
        alert("Login successful! Welcome to the Clinical Portal.");
      }
      
      if (userCredential?.user) {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Auth failed:", error);
      if (error.code === 'auth/operation-not-allowed') {
        alert("Email/Password Authentication is not enabled yet in your Firebase Project.\n\nTo fix this: Go to your Firebase Console -> Authentication -> Sign-in method, and enable the 'Email/Password' provider.");
      } else {
        alert(`Authentication Failed: ${error.message || 'Invalid credentials'}`);
      }
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
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">or continue with</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-inter font-bold text-xs tracking-[0.1em] uppercase hover:bg-white/10 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <div className="mt-6 text-center">
              {!isSignUp ? (
                <p className="font-inter text-xs text-zinc-400">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setIsSignUp(true)} className="text-emerald-400 font-bold hover:underline">
                    Sign up for free
                  </button>
                </p>
              ) : (
                <p className="font-inter text-xs text-zinc-400">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setIsSignUp(false)} className="text-emerald-400 font-bold hover:underline">
                    Sign in
                  </button>
                </p>
              )}
            </div>
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
