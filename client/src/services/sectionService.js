import api from './api';

export const sectionService = {
  getSections: async () => {
    const { data } = await api.get('/sections');
    return data;
  },

  getSection: async (id) => {
    const { data } = await api.get(`/sections/${id}`);
    return data;
  },

  createSection: async (sectionData) => {
    const { data } = await api.post('/sections', sectionData);
    return data;
  },

  updateSection: async (id, sectionData) => {
    const { data } = await api.put(`/sections/${id}`, sectionData);
    return data;
  },

  deleteSection: async (id) => {
    const { data } = await api.delete(`/sections/${id}`);
    return data;
  },

  reorderSections: async (orderedIds) => {
    const { data } = await api.put('/sections/reorder', { orderedIds });
    return data;
  },
};
