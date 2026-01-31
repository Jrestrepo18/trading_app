import { Platform } from 'react-native';

// Use 10.0.2.2 for Android emulator to access localhost, and localhost for iOS
const DEV_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5257' : 'http://localhost:5257';
const PROD_URL = 'https://your-production-api.com';

export const API_URL = __DEV__ ? DEV_URL : PROD_URL;

export const ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_URL}/api/auth/login`,
        REGISTER: `${API_URL}/api/auth/register`,
    },
    USERS: {
        ME: `${API_URL}/api/users/me`,
        PUSH_TOKEN: (id: string) => `${API_URL}/api/users/${id}/push-token`,
    },
    ADMIN: {
        STATS: `${API_URL}/api/users/stats`,
        SIGNALS: `${API_URL}/api/admin/signals`, // Next step
        NEWS: `${API_URL}/api/admin/news`, // Next step
    }
};
