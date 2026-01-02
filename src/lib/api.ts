import axios from 'axios';
import { BASE_URL } from './config';

export { BASE_URL };

const api = axios.create({
    // baseURL: '/api', // Local development via proxy
    baseURL: `${BASE_URL}/api`, // Production backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token if it exists (for Admin)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getPhones = (page = 1, limit = 30) => api.get(`/phones?page=${page}&limit=${limit}`).then(res => res.data);
export const getPhone = (id: string) => api.get(`/phones/${id}`).then(res => res.data);
export const getMyOrders = (number: string) => api.get(`/bookings/${number}`).then(res => res.data);
export const placeOrder = (data: any) => api.post('/bookings', data).then(res => res.data);

export const adminLogin = (creds: any) => api.post('/admin/login', creds).then(res => res.data);
export const getAdminBookings = () => api.get('/admin/bookings').then(res => res.data);
export const updateBookingStatus = (id: string, status: string) => api.put(`/admin/bookings/${id}`, { status }).then(res => res.data);
export const getAdminPhones = (page = 1, limit = 30) => api.get(`/admin/phones?page=${page}&limit=${limit}`).then(res => res.data);
// Note: Phones API might need FormData for file upload
export const addPhone = (formData: FormData) => api.post('/admin/phones', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
}).then(res => res.data);
export const deletePhone = (id: string) => api.delete(`/admin/phones/${id}`).then(res => res.data);

export default api;
