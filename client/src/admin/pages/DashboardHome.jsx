import { useEffect, useState } from 'react';
import { FiLayers, FiFolder, FiLayout, FiActivity } from 'react-icons/fi';
import { sectionService } from '../../services/sectionService';
import { projectService } from '../../services/projectService';
import { portfolioService } from '../../services/portfolioService';

const DashboardHome = () => {
  const [stats, setStats] = useState({ sections: 0, projects: 0, theme: '', enabled: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [sections, projects, config] = await Promise.all([
          sectionService.getSections(),
          projectService.getProjects(),
          portfolioService.getPortfolio(),
        ]);
        setStats({
          sections: sections.length,
          projects: projects.length,
          theme: config?.theme?.name || 'minimal-dark',
          enabled: config?.enabledSections?.length || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { icon: FiLayers, label: 'Total Sections', value: stats.sections, color: '#6366f1' },
    { icon: FiActivity, label: 'Active Sections', value: stats.enabled, color: '#10b981' },
    { icon: FiFolder, label: 'Projects', value: stats.projects, color: '#f59e0b' },
    { icon: FiLayout, label: 'Current Theme', value: stats.theme.replace('-', ' '), color: '#ec4899' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Manage your portfolio from here</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map(({ icon: Icon, label, value, color }, i) => (
          <div key={i} className="card hover-lift">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${color}20`, color }}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold capitalize">{value}</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Quick Tips</h2>
        <ul className="space-y-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--color-primary)' }} />
            Use the <strong>Sections</strong> page to enable/disable and reorder your portfolio sections.
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--color-primary)' }} />
            Edit each section's content by clicking its name in the sidebar.
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--color-primary)' }} />
            Switch themes and customize colors from the <strong>Theme</strong> page.
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--color-primary)' }} />
            Click <strong>View Portfolio</strong> in the sidebar to preview your changes live.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardHome;
