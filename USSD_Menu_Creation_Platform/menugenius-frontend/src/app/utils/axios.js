import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://menugenius.azurewebsites.net',
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  config => {
    const currentPath = window.location.pathname;
    
    if (currentPath.startsWith('/dashboard')) {
      const userToken = localStorage.getItem('userAccessToken');
      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
    } else if (currentPath.startsWith('/admin')) {
      const adminToken = localStorage.getItem('adminAccessToken');
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } 
    
    return config;
  },
  error => Promise.reject(error)
);

// Add a response interceptor to handle token refreshing
// axiosInstance.interceptors.response.use(response => {
//   return response;
// }, async error => {
//   const originalRequest = error.config;
//   if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const refreshToken = localStorage.getItem('refreshToken');
//       try {
//           const response = await axiosInstance.post('/user/token/refresh/', {
//               refresh: refreshToken
//           });
//           const { access } = response.data;
//           localStorage.setItem('accessToken', access);
//           axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + access;
//           originalRequest.headers['Authorization'] = 'Bearer ' + access;
//           return axiosInstance(originalRequest);
//       } catch (refreshError) {
//           console.log('Refresh token failed', refreshError);
//           // Handle token refresh failure (e.g., log out the user)
//           return Promise.reject(refreshError);
//       }
//   }
//   return Promise.reject(error);
// });

export default axiosInstance;
