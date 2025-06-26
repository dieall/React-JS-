import api from './api';

const GuruService = {
  getAll: async () => {
    try {
      const response = await api.get('/guru');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  get: async (id) => {
    try {
      const response = await api.get(`/guru/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (data) => {
    try {
      // Use FormData for file upload
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      
      const response = await api.post('/guru', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      // Use FormData for file upload
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      formData.append('_method', 'PUT'); // Laravel requires this for PUT requests with FormData
      
      const response = await api.post(`/guru/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/guru/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default GuruService; 