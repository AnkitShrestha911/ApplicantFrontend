import { apiClient } from './api';

export const getTypes = () =>
  Promise.resolve({ data: { data: [{ _id: 'New', name: 'New' }, { _id: 'Add', name: 'Add' }] } });
export const createType = (payload) => apiClient.post('/types', payload);
export const updateType = (id, payload) => apiClient.put(`/types/${id}`, payload);
export const deleteType = (id) => apiClient.delete(`/types/${id}`);
