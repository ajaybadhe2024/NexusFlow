// Centralized API Configuration for future Node.js / Express / MongoDB integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  DEVICES: `${API_BASE_URL}/devices`,
  TELEMETRY: `${API_BASE_URL}/telemetry`,
  PIPELINES: `${API_BASE_URL}/pipelines`,
  ALERTS: `${API_BASE_URL}/alerts`,
  ANALYTICS: `${API_BASE_URL}/analytics`,
};

export const IS_MOCK_MODE = true; // Set to false when connecting real Express backend

export default API_BASE_URL;
