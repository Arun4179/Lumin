
import React, { useState } from 'react';
import { ArrowRight, Loader2, Mail, Lock } from 'lucide-react';

interface SignInProps {
  onSignIn: () => void;
  onNavigate: () => void; // To navigate back/home
}

export const SignIn: React.FC<SignInProps> = ({ onSignIn, onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API Call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignIn();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-stretch">
      {/* Left Side - Image (Hidden on mobile) */}
      <div className="hidden lg:block w-1/2 relative bg-stone-900">
        <img 
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" 
          alt="Fashion Editorial" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-16 text-white max-w-lg animate-fade-in-up">
          <p className="text-sm font-medium tracking-widest uppercase mb-4 opacity-80">Join the Collective</p>
          <h1 className="text-5xl font-serif leading-tight mb-6">
            Elegance is not just what you wear, it's how you live.
          </h1>
          <p className="text-stone-300 font-light">
            Sign in to access exclusive collections, personalized AI styling, and early access to sales.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 md:px-12 py-12 bg-white relative">
        <button 
            onClick={onNavigate}
            className="absolute top-8 right-8 text-sm text-stone-500 hover:text-stone-900 font-medium tracking-wide underline-offset-4 hover:underline"
        >
            Skip to Store
        </button>

        <div className="w-full max-w-md animate-in slide-in-from-bottom-4 duration-700">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-stone-500">
              {isLogin ? 'Please enter your details.' : 'Join us for a curated experience.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border-b border-stone-200 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors bg-transparent placeholder-stone-300"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-b border-stone-200 py-3 pl-8 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors bg-transparent placeholder-stone-300"
                  placeholder="name@example.com"
                />
                <Mail size={16} className="absolute left-0 top-3.5 text-stone-400" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                 <label className="text-xs font-bold uppercase text-stone-500 tracking-wider">Password</label>
                 {isLogin && (
                   <button type="button" className="text-xs text-stone-500 hover:text-stone-900">Forgot password?</button>
                 )}
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border-b border-stone-200 py-3 pl-8 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors bg-transparent placeholder-stone-300"
                  placeholder="••••••••"
                />
                <Lock size={16} className="absolute left-0 top-3.5 text-stone-400" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-stone-900 text-white py-4 rounded-sm font-medium hover:bg-stone-800 transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-8"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-stone-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-stone-900 hover:underline underline-offset-4"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
