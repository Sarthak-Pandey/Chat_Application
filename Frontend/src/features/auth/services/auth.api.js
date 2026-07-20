import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  withCredentials: true,
});

/**
 * Handle axios error response format
 */
function handleAxiosError(error) {
  if (error.response?.data) {
    const { message, errors, isUnverifiedUser, isUnverifiedExisting, email } = error.response.data;
    
    let errMsg = message || 'Network request failed';
    if (errors && Array.isArray(errors) && errors.length > 0) {
      const detailedMsgs = errors.map((e) => e.message).join(' | ');
      errMsg = `${message}: ${detailedMsgs}`;
    }
    
    const customError = new Error(errMsg);
    customError.isUnverifiedUser = isUnverifiedUser;
    customError.isUnverifiedExisting = isUnverifiedExisting;
    customError.email = email;
    throw customError;
  }
  throw error;
}

/**
 * Register a new user
 * @param {Object} userData { username, email, password }
 */
export async function registerUser(userData) {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

/**
 * Login user
 * @param {Object} credentials { email, password }
 */
export async function loginUser(credentials) {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

/**
 * Get current user profile
 */
export async function getMe() {
  try {
    const response = await api.get('/get-me');
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

/**
 * Verify email verification token
 * @param {string} token
 */
export async function verifyEmailToken(token) {
  try {
    const response = await api.get(`/verify-email`, {
      params: { token },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

/**
 * Resend email verification link
 * @param {string} email
 */
export async function resendVerificationToken(email) {
  try {
    const response = await api.post('/resend-verification', { email });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}
