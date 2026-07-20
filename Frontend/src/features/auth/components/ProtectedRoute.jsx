import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

/**
 * Route protection component.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} props.requireAuth - If true, restricts to logged-in users. If false, restricts to guests.
 */
export function ProtectedRoute({ children, requireAuth = true }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
        <div className="relative w-16 h-16">
          {/* Animated Spinner with Red Gradient */}
          <div className="absolute inset-0 rounded-full border-4 border-t-red-600 border-r-transparent border-b-rose-900 border-l-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-red-500 border-b-transparent border-l-red-500 animate-spin animate-reverse"></div>
        </div>
        <p className="mt-4 text-neutral-400 text-sm tracking-wider animate-pulse">
          SECURE CONNECTION ESTABLISHING...
        </p>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
