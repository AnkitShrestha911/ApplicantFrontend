import { apiClient } from './api';

export const getReferrers = () => apiClient.get('/referrers');
export const createReferrer = (payload) => apiClient.post('/referrers', payload);
export const updateReferrer = (id, payload) => apiClient.put(`/referrers/${id}`, payload);
export const deleteReferrer = (id) => apiClient.delete(`/referrers/${id}`);
