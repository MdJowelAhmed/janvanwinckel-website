// utils/tokenUtils.js

/**
 * Decode JWT token
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - true if expired, false otherwise
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Get user role from token
 * @param {string} token - JWT token
 * @returns {string|null} - User role or null
 */
export const getUserRoleFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

/**
 * Get user email from token
 * @param {string} token - JWT token
 * @returns {string|null} - User email or null
 */
export const getUserEmailFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded?.email || null;
};

/**
 * Get user ID from token
 * @param {string} token - JWT token
 * @returns {string|null} - User ID or null
 */
export const getUserIdFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded?.id || null;
};