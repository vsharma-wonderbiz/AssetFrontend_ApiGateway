import axios from "axios";

const api = axios.create({
  baseURL: 'https://localhost:7285/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('🔄 Token expired, attempting refresh...');
        
        const refreshResponse = await axios.post(
          'https://localhost:7285/api/User/refresh-token',
          {},
          { withCredentials: true }
        );

        if (refreshResponse.status === 200) {
          console.log('✅ Token refreshed successfully');
          
          // Small delay to ensure cookie is set
          await new Promise(resolve => setTimeout(resolve, 100));
          
          return api(originalRequest);
        }
        
      } catch (refreshError) {
        console.error('❌ Refresh failed:', refreshError.response?.status);
        console.error('❌ Error details:', refreshError.response?.data);
        
        // Clear user data and redirect
        localStorage.removeItem('user');
        if (typeof window !== 'undefined') {
          window.location.href = '/Register';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;