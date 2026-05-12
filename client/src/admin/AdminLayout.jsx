import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Sidebar />
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
