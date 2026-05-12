import api from './api';

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;
  },

  deleteImage: async (publicId) => {
    const { data } = await api.delete(`/upload/image/${publicId}`);
    return data;
  },
};
