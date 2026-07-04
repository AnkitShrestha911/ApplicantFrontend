import { apiClient } from './api';

export const getApplicants = (params) => apiClient.get('/applicants', { params });
export const createApplicant = (payload) => apiClient.post('/applicants', payload);
export const updateApplicant = (id, payload) => apiClient.put(`/applicants/${id}`, payload);
export const deleteApplicant = (id) => apiClient.delete(`/applicants/${id}`);
