import { createContext, useContext, useState, useEffect } from 'react';
import { portfolioService } from '../services/portfolioService';
import { sectionService } from '../services/sectionService';
import { projectService } from '../services/projectService';

const PortfolioContext = createContext(null);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [sections, setSections] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [configData, sectionsData, projectsData] = await Promise.all([
        portfolioService.getPortfolio(),
        sectionService.getSections(),
        projectService.getProjects(),
      ]);

      setConfig(configData);
      setSections(sectionsData);
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const refreshConfig = async () => {
    const data = await portfolioService.getPortfolio();
    setConfig(data);
    return data;
  };

  const refreshSections = async () => {
    const data = await sectionService.getSections();
    setSections(data);
    return data;
  };

  const refreshProjects = async () => {
    const data = await projectService.getProjects();
    setProjects(data);
    return data;
  };

  return (
    <PortfolioContext.Provider value={{
      config,
      sections,
      projects,
      loading,
      error,
      fetchAll,
      refreshConfig,
      refreshSections,
      refreshProjects,
      setConfig,
      setSections,
      setProjects,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
