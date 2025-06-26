import api from './api';

const MapelService = {
  getAll: async () => {
    try {
      const response = await api.get('/mapel');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  get: async (id) => {
    try {
      const response = await api.get(`/mapel/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/mapel', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/mapel/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/mapel/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default MapelService; 