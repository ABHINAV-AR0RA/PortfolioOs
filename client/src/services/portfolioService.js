import api from './api';

export const portfolioService = {
  getPortfolio: async () => {
    const { data } = await api.get('/portfolio');
    return data;
  },

  updatePortfolio: async (portfolioData) => {
    const { data } = await api.put('/portfolio', portfolioData);
    return data;
  },
};
