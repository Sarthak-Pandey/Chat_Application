import { useContext } from 'react';
import { AuthContext } from '../store/auth.context';

/**
 * Custom hook to access authentication context and business rules.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password && password.length >= 6;
  };

  const validateUsername = (username) => {
    const re = /^[a-zA-Z0-9_]{3,30}$/;
    return username && re.test(username.trim());
  };

  return {
    ...context,
    validateEmail,
    validatePassword,
    validateUsername,
  };
}
