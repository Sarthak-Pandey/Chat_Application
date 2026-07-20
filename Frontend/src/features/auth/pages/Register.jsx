import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const { register, resendVerification, validateUsername, validateEmail, validatePassword } = useAuth();
  
  // State variables for form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validation
    if (!validateUsername(username)) {
      setErrorMessage('Username must be 3-30 characters long and contain only letters, numbers, or underscores (no spaces).');
      return;
    }
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
      const response = await register(username, email, password);
      if (response && response.success) {
        setRegisteredEmail(email);
        setVerificationSent(true);
        setSuccessMessage("Thanks for signing up! We've sent a verification link to your email. Please check your inbox (and spam folder) and click the link to verify your account before logging in.");
      } else {
        setErrorMessage(response?.message || 'Registration failed.');
      }
    } catch (err) {
      if (err.isUnverifiedExisting) {
        setRegisteredEmail(err.email || email);
        setVerificationSent(true);
        setSuccessMessage(err.message || 'This email is already registered but not verified. Please check your inbox and verify your email before logging in.');
      } else {
        setErrorMessage(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle resend verification email
  const handleResend = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setResendLoading(true);
    try {
      const response = await resendVerification(registeredEmail);
      if (response && response.success) {
        setSuccessMessage("Verification link has been resent to your email address successfully! Please check your inbox.");
      } else {
        setErrorMessage(response?.message || 'Failed to resend verification.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during resending verification.');
    } finally {
      setResendLoading(false);
    }
  };

  // Reset form to sign up another user
  const handleReset = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setErrorMessage('');
    setSuccessMessage('');
    setVerificationSent(false);
    setRegisteredEmail('');
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-8 relative overflow-y-auto font-sans selection:bg-red-500 selection:text-white">
      {/* Background Red Gradients/Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-900/20 blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-rose-950/20 blur-3xl pointer-events-none animate-pulse delay-700"></div>

      <div className="w-full max-w-md z-10 transition-all duration-500 hover:scale-[1.01]">
        {/* Logo or Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-900/30 ring-1 ring-white/10 mb-4 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-white">
              {verificationSent ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0zM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              )}
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            {verificationSent ? "Verify Email" : "Create Account"}
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            {verificationSent ? "Check your inbox for the link" : "Get started with our premium service"}
          </p>
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
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-200 text-sm flex items-start gap-3 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 animate-pulse">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-white mb-1">Verify Your Account</p>
                <p className="text-neutral-300 text-xs leading-relaxed">{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading || verificationSent}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 disabled:opacity-50"
                  required
                />
              </div>
            </div>

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
                  disabled={loading || verificationSent}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || verificationSent}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Verification Tip in Dev Mode */}
            {verificationSent && (
              <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/20 text-neutral-400 text-[11px] font-mono leading-normal">
                <strong className="text-red-400 block mb-1">Developer Notice:</strong>
                Verify this account by inspecting the backend console logs to copy the generated URL.
              </div>
            )}

            {/* Submit or Resend Button */}
            {!verificationSent ? (
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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Sign Up
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            ) : (
              <div className="space-y-3 mt-6">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="w-full relative group bg-gradient-to-r from-red-800 to-rose-700 hover:from-red-700 hover:to-rose-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 disabled:opacity-50 cursor-pointer overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {resendLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Resending...
                      </>
                    ) : (
                      <>
                        Resend Verification Email
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 animate-pulse">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full bg-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs font-semibold py-2 px-4 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-all duration-300 cursor-pointer"
                >
                  Sign Up Another Account
                </button>
              </div>
            )}
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-neutral-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-red-500 hover:text-red-400 font-semibold underline underline-offset-4 decoration-red-900/40 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
