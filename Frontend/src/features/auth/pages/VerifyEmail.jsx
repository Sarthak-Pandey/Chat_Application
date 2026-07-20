import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();
  
  const token = searchParams.get('token');
  
  // UI States
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');
  
  // Ref to prevent double executions in React StrictMode
  const verifiedRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token. Please click the link sent to your registered email.');
      return;
    }

    if (verifiedRef.current) return;
    verifiedRef.current = true;

    const executeVerification = async () => {
      try {
        const response = await verifyEmail(token);
        if (response && response.success) {
          setStatus('success');
          setMessage(response.message || 'Your email has been verified successfully.');
        } else {
          setStatus('error');
          setMessage(response?.message || 'Verification failed.');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Verification token is invalid or has expired.');
      }
    };

    executeVerification();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 relative overflow-hidden font-sans selection:bg-red-500 selection:text-white">
      {/* Background Red Gradients/Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-900/20 blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-rose-950/20 blur-3xl pointer-events-none animate-pulse delay-700"></div>

      <div className="w-full max-w-md z-10 transition-all duration-500 hover:scale-[1.01]">
        {/* Logo/Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-900/30 ring-1 ring-white/10 mb-4 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.75 3.75 0 0 1 21 12Z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent text-center">
            Account Verification
          </h2>
          <p className="text-neutral-400 text-sm mt-1 text-center">Validating your email credentials</p>
        </div>

        {/* Card */}
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/80 relative text-center">
          {/* Neon Top Edge */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>

          {/* Loading View */}
          {status === 'loading' && (
            <div className="py-6 flex flex-col items-center space-y-4">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-4 border-t-red-600 border-r-transparent border-b-rose-900 border-l-transparent animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-red-500 border-b-transparent border-l-red-500 animate-spin animate-reverse"></div>
              </div>
              <h3 className="text-lg font-semibold text-neutral-200 mt-2">Checking token validity...</h3>
              <p className="text-sm text-neutral-400">Please hold on while we secure your account details.</p>
            </div>
          )}

          {/* Success View */}
          {status === 'success' && (
            <div className="py-6 flex flex-col items-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-red-950/40 border border-red-500/50 flex items-center justify-center text-red-500 shadow-lg shadow-red-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-100 mt-2">Verified Successfully!</h3>
              <p className="text-sm text-neutral-400">{message}</p>
              
              <Link
                to="/login"
                className="w-full relative group mt-6 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-red-900/20 hover:shadow-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-950 transition-all duration-300 block text-center cursor-pointer"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Error View */}
          {status === 'error' && (
            <div className="py-6 flex flex-col items-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-red-950/40 border border-red-800/50 flex items-center justify-center text-red-500 shadow-lg shadow-red-950/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-100 mt-2">Verification Failed</h3>
              <p className="text-sm text-neutral-400 px-4">{message}</p>
              
              <div className="flex gap-4 w-full mt-6">
                <Link
                  to="/register"
                  className="flex-1 bg-gradient-to-r from-red-700 to-rose-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] text-sm block"
                >
                  Register Again
                </Link>
                <Link
                  to="/login"
                  className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-300 font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:bg-neutral-750 text-sm block"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
