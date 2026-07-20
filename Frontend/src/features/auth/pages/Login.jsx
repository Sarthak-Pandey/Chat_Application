import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login, verifyEmail, resendVerification, validateEmail, validatePassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State variables for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendSuccessMessage, setResendSuccessMessage] = useState('');
  const [showResendLink, setShowResendLink] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  const token = searchParams.get('token');
  const verifyTriggered = useRef(false);

  // Auto-trigger verification if token exists in URL query params
  useEffect(() => {
    if (token && !verifyTriggered.current) {
      verifyTriggered.current = true;
      
      const triggerVerification = async () => {
        setVerifying(true);
        setErrorMessage('');
        setResendSuccessMessage('');
        try {
          const response = await verifyEmail(token);
          if (response && response.success) {
            setResendSuccessMessage('Your email has been verified successfully! You can now log in.');
            // Clear URL search params
            setSearchParams({}, { replace: true });
          } else {
            setErrorMessage(response?.message || 'Verification failed.');
          }
        } catch (err) {
          setErrorMessage(err.message || 'Verification link is invalid or expired.');
          setShowResendLink(true);
        } finally {
          setVerifying(false);
        }
      };
      
      triggerVerification();
    }
  }, [token, verifyEmail, setSearchParams]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setResendSuccessMessage('');
    setShowResendLink(false);

    // Validation
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password);
      if (response && response.success) {
        navigate('/');
      } else {
        setErrorMessage(response?.message || 'Login failed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during login.');
      // Handle unverified user login blocks
      if (err.isUnverifiedUser) {
        setShowResendLink(true);
        setUnverifiedEmail(err.email || email);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle resending verification email
  const handleResend = async () => {
    setErrorMessage('');
    setResendSuccessMessage('');
    setResendLoading(true);
    try {
      const response = await resendVerification(unverifiedEmail || email);
      if (response && response.success) {
        setResendSuccessMessage('Verification link has been resent to your email address successfully! Please check your inbox.');
        setShowResendLink(false);
      } else {
        setErrorMessage(response?.message || 'Failed to resend verification link.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while resending.');
    } finally {
      setResendLoading(false);
    }
  };

  // Loading Screen for Verification
  if (verifying) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white selection:bg-red-500 selection:text-white">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-t-red-600 border-r-transparent border-b-rose-900 border-l-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-red-500 border-b-transparent border-l-red-500 animate-spin animate-reverse"></div>
        </div>
        <p className="mt-4 text-neutral-400 text-sm tracking-wider animate-pulse">
          VERIFYING YOUR EMAIL LINK...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-8 relative overflow-y-auto font-sans selection:bg-red-500 selection:text-white">
      {/* Background Red Gradients/Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-900/20 blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-rose-950/20 blur-3xl pointer-events-none animate-pulse delay-700"></div>

      <div className="w-full max-w-md z-10 transition-all duration-500 hover:scale-[1.01]">
        {/* Logo/Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-900/30 ring-1 ring-white/10 mb-4 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-neutral-400 text-sm mt-1">Access your dashboard and chats</p>
        </div>

        {/* Card */}
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/80 relative">
          {/* Neon Top Edge */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-200 text-sm flex items-start gap-3 animate-headShake">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-500 shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <div className="flex-1">
                <span className="font-semibold text-white block mb-0.5">
                  {showResendLink ? "Verification Required" : "Authentication Error"}
                </span>
                <span className="text-neutral-300 block">
                  {errorMessage}
                </span>
                
                {/* Resend verification email button */}
                {showResendLink && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="mt-3 text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 underline underline-offset-4 decoration-red-500/40 hover:decoration-red-400 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {resendLoading ? (
                      <>
                        <svg className="animate-spin h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Resending Link...
                      </>
                    ) : (
                      <>
                        Resend verification email
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {resendSuccessMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-200 text-sm flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>{resendSuccessMessage}</span>
            </div>
          )}

          {/* Dev Mode Sandbox Notice */}
          {showResendLink && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/20 border border-red-900/20 text-neutral-400 text-[10px] font-mono leading-normal">
              <span className="text-red-400 font-semibold block mb-0.5">Dev Sandbox Tip:</span>
              View the resent activation link in your backend terminal logs.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group mt-6 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-red-900/20 hover:shadow-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-950 transition-all duration-300 disabled:opacity-50 cursor-pointer overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-neutral-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-red-500 hover:text-red-400 font-semibold underline underline-offset-4 decoration-red-900/40 transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
