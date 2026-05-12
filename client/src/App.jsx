import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import PortfolioPage from './pages/PortfolioPage';
import AdminLayout from './admin/AdminLayout';
import LoginPage from './admin/pages/LoginPage';
import DashboardHome from './admin/pages/DashboardHome';
import SectionsManager from './admin/pages/SectionsManager';
import ProtectedRoute from './admin/components/ProtectedRoute';

// Placeholders for the editors we will create next
import HeroEditor from './admin/pages/HeroEditor';
import AboutEditor from './admin/pages/AboutEditor';
import SkillsEditor from './admin/pages/SkillsEditor';
import ProjectsEditor from './admin/pages/ProjectsEditor';
import ExperienceEditor from './admin/pages/ExperienceEditor';
import EducationEditor from './admin/pages/EducationEditor';
import ContactEditor from './admin/pages/ContactEditor';
import ThemeEditor from './admin/pages/ThemeEditor';
import Settings from './admin/pages/Settings';

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ className: 'toast-custom' }} />
      <Routes>
        {/* Public Portfolio Route */}
        <Route path="/" element={<PortfolioPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="sections" element={<SectionsManager />} />
          <Route path="hero" element={<HeroEditor />} />
          <Route path="about" element={<AboutEditor />} />
          <Route path="skills" element={<SkillsEditor />} />
          <Route path="projects" element={<ProjectsEditor />} />
          <Route path="experience" element={<ExperienceEditor />} />
          <Route path="education" element={<EducationEditor />} />
          <Route path="contact" element={<ContactEditor />} />
          <Route path="theme" element={<ThemeEditor />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
