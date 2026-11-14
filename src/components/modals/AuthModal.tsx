import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authMode, openAuthModal, closeAuthModal, login, signup, loginGoogle } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<{ message: string; type: 'error' | 'success' | '' }>({
    message: '',
    type: '',
  });
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const isSignUp = authMode === 'signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setStatus({ message: 'Please enter both email and password.', type: 'error' });
      return;
    }
    if (password.length < 6) {
      setStatus({ message: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }

    setLoading(true);
    setStatus({ message: isSignUp ? 'Creating your account...' : 'Logging in...', type: '' });

    if (isSignUp) {
      const res = await signup(email, password);
      setLoading(false);
      if (res.error) {
        setStatus({ message: res.error, type: 'error' });
      } else {
        setStatus({ message: 'Account created successfully!', type: 'success' });
        setTimeout(() => closeAuthModal(), 1000);
      }
    } else {
      const res = await login(email, password);
      setLoading(false);
      if (res.error) {
        setStatus({ message: res.error, type: 'error' });
      } else {
        setStatus({ message: 'Logged in successfully!', type: 'success' });
        setTimeout(() => closeAuthModal(), 1000);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
      style={{
        background: 'rgba(20,10,15,0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        className="glass p-6 md:p-8 rounded-2xl max-w-md w-full relative"
        style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}
      >
        <button
          onClick={closeAuthModal}
          style={{ position: 'absolute', top: '1rem', right: '1rem', cursor: 'pointer' }}
          className="muted hover:text-white bg-transparent border-0 text-xl"
        >
          ✕
        </button>

        <h2 className="serif text-3xl gt text-center">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="muted text-sm text-center mt-1">
          {isSignUp
            ? 'Sign up to access Pro tools and save your wishlist.'
            : 'Log in to access your McGee Jewelry tools.'}
        </p>

        <div className="mt-5 flex flex-col gap-3">
          <button
            type="button"
            onClick={loginGoogle}
            className="btn btn-ghost flex items-center justify-center gap-2 w-full text-sm cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 11.3 0 14s.7 5.3 1.9 7.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center my-1">
            <div className="flex-1 border-t border-rose-200/20" />
            <span className="px-3 text-xs muted uppercase tracking-wider">OR WITH EMAIL</span>
            <div className="flex-1 border-t border-rose-200/20" />
          </div>

          <form onSubmit={handleSubmit} autoComplete="on">
            <label className="fld text-left">
              <span>Email address</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full"
              />
            </label>

            <label className="fld text-left mt-3">
              <span>Password</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold w-full mt-4 justify-center"
            >
              {isSignUp ? 'Create Account' : 'Log In'}
            </button>
          </form>

          {status.message && (
            <p
              className={`text-xs text-center mt-2 ${
                status.type === 'error'
                  ? 'text-red-400'
                  : status.type === 'success'
                  ? 'text-emerald-400'
                  : 'muted'
              }`}
            >
              {status.message}
            </p>
          )}

          <div className="text-center mt-3 pt-3 border-t border-rose-200/10 text-xs">
            <span className="muted">
              {isSignUp ? 'Already have an account?' : 'New to McGee Jewelry?'}
            </span>{' '}
            <button
              type="button"
              onClick={() => openAuthModal(isSignUp ? 'login' : 'signup')}
              className="underline gt font-semibold bg-transparent border-0 cursor-pointer p-0"
            >
              {isSignUp ? 'Log in' : 'Create an account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
