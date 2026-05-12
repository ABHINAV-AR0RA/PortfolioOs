import { useEffect, useState } from 'react';
import { FiToggleLeft, FiToggleRight, FiMenu } from 'react-icons/fi';
import { sectionService } from '../../services/sectionService';
import { portfolioService } from '../../services/portfolioService';
import toast from 'react-hot-toast';

const sectionLabels = { hero: 'Hero', about: 'About', skills: 'Skills', projects: 'Projects', experience: 'Experience', education: 'Education', contact: 'Contact' };

const SectionsManager = () => {
  const [sections, setSections] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [secs, cfg] = await Promise.all([sectionService.getSections(), portfolioService.getPortfolio()]);
      setSections(secs.sort((a, b) => a.order - b.order));
      setConfig(cfg);
    } catch (err) { toast.error('Failed to load sections'); }
    finally { setLoading(false); }
  };

  const toggleSection = async (type) => {
    try {
      const enabled = config.enabledSections.includes(type)
        ? config.enabledSections.filter(s => s !== type)
        : [...config.enabledSections, type];
      const updated = await portfolioService.updatePortfolio({ enabledSections: enabled });
      setConfig(updated);
      toast.success(`Section ${enabled.includes(type) ? 'enabled' : 'disabled'}`);
    } catch (err) { toast.error('Failed to toggle section'); }
  };

  const handleDragStart = (index) => setDraggedIndex(index);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = async (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const newSections = [...sections];
    const [moved] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, moved);
    setSections(newSections);
    setDraggedIndex(null);

    try {
      const orderedIds = newSections.map(s => s._id);
      await sectionService.reorderSections(orderedIds);
      const newOrder = newSections.map(s => s.type);
      await portfolioService.updatePortfolio({ sectionsOrder: newOrder });
      toast.success('Sections reordered');
    } catch (err) { toast.error('Failed to reorder'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Manage Sections</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Enable, disable, and reorder your portfolio sections. Drag to reorder.</p>
      </div>
      <div className="space-y-3">
        {sections.map((section, index) => {
          const isEnabled = config?.enabledSections?.includes(section.type);
          return (
            <div key={section._id} draggable onDragStart={() => handleDragStart(index)} onDragOver={handleDragOver} onDrop={() => handleDrop(index)}
              className={`card flex items-center gap-4 cursor-grab active:cursor-grabbing transition-all ${draggedIndex === index ? 'opacity-50 scale-95' : ''}`}>
              <FiMenu className="text-lg flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }} />
              <div className="flex-1">
                <h3 className="font-semibold">{sectionLabels[section.type] || section.type}</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Type: {section.type} • Order: {index + 1}</p>
              </div>
              <button onClick={() => toggleSection(section.type)} className="text-2xl transition-colors">
                {isEnabled ? <FiToggleRight style={{ color: 'var(--color-primary)' }} /> : <FiToggleLeft style={{ color: 'var(--color-text-secondary)' }} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionsManager;
