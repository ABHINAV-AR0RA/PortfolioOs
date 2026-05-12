import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome, FiLayers, FiGrid, FiUser, FiCode, FiFolder,
  FiBriefcase, FiBookOpen, FiMail, FiLayout, FiSettings, FiLogOut, FiExternalLink
} from 'react-icons/fi';

const navItems = [
  { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
  { path: '/admin/sections', icon: FiLayers, label: 'Sections' },
  { path: '/admin/hero', icon: FiGrid, label: 'Hero' },
  { path: '/admin/about', icon: FiUser, label: 'About' },
  { path: '/admin/skills', icon: FiCode, label: 'Skills' },
  { path: '/admin/projects', icon: FiFolder, label: 'Projects' },
  { path: '/admin/experience', icon: FiBriefcase, label: 'Experience' },
  { path: '/admin/education', icon: FiBookOpen, label: 'Education' },
  { path: '/admin/contact', icon: FiMail, label: 'Contact' },
  { path: '/admin/theme', icon: FiLayout, label: 'Theme' },
  { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-sidebar">
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <h1 className="text-lg font-bold gradient-text">PortfolioOS</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label, exact }) => (
          <NavLink
            key={path}
            to={path}
            end={exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white'
                  : 'hover:bg-opacity-50'
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(129,140,248,0.1))' : 'transparent',
              color: isActive ? 'var(--color-text)' : 'var(--color-text-secondary)',
              borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
            })}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t space-y-2" style={{ borderColor: 'var(--color-border)' }}>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
          style={{ color: 'var(--color-text-secondary)' }}>
          <FiExternalLink size={18} /> View Portfolio
        </a>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-red-400 hover:bg-red-500/10">
          <FiLogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
