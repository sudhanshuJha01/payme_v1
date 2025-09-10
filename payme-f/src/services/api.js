import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

// Request Interceptor: Adds the access token to every outgoing request
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handles expired access tokens
api.interceptors.response.use(
    (response) => response, // If the response is successful, just return it
    async (error) => {
        const originalRequest = error.config;
        const { logout, login } = useAuthStore.getState();

        // If the error is 401 and it's not a retry request
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark it as a retry to prevent infinite loops

            try {
                // Call the refresh-token endpoint
                const { data } = await api.post('/user/refresh-token');
                
                // Update the store with the new access token
                const { user } = useAuthStore.getState();
                login(user, data.accessToken);
                
                // Update the header of the original request with the new token
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                
                // Retry the original request
                return api(originalRequest);
                
            } catch (refreshError) {
                // If the refresh token is also invalid, log the user out
                logout();
                window.location.href = '/login'; // Redirect to login page
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;