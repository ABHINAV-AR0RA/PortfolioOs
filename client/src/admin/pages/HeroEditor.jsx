import { useState, useEffect } from 'react';
import { sectionService } from '../../services/sectionService';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

const HeroEditor = () => {
  const [sectionId, setSectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    title: '',
    subtitle: '',
    description: '',
    profileImage: '',
    backgroundImage: '',
    ctaButtons: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const sections = await sectionService.getSections();
      const heroSection = sections.find(s => s.type === 'hero');
      if (heroSection) {
        setSectionId(heroSection._id);
        setData({
          title: heroSection.data.title || '',
          subtitle: heroSection.data.subtitle || '',
          description: heroSection.data.description || '',
          profileImage: heroSection.data.profileImage || '',
          backgroundImage: heroSection.data.backgroundImage || '',
          ctaButtons: heroSection.data.ctaButtons || []
        });
      }
    } catch (err) {
      toast.error('Failed to load hero section');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!sectionId) return;
    
    setSaving(true);
    try {
      await sectionService.updateSection(sectionId, { data });
      toast.success('Hero section updated successfully');
    } catch (err) {
      toast.error('Failed to update hero section');
    } finally {
      setSaving(false);
    }
  };

  const addCta = () => {
    setData({
      ...data,
      ctaButtons: [...data.ctaButtons, { text: 'New Button', link: '#', variant: 'primary' }]
    });
  };

  const updateCta = (index, field, value) => {
    const newCtas = [...data.ctaButtons];
    newCtas[index] = { ...newCtas[index], [field]: value };
    setData({ ...data, ctaButtons: newCtas });
  };

  const removeCta = (index) => {
    const newCtas = [...data.ctaButtons];
    newCtas.splice(index, 1);
    setData({ ...data, ctaButtons: newCtas });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-indigo-500" /></div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Hero Section</h1>
          <p className="text-zinc-400">Edit the main hero section of your portfolio.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave />}
          Save Changes
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold mb-4">Content</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input 
              type="text" 
              className="input-field" 
              value={data.title}
              onChange={e => setData({...data, title: e.target.value})}
              placeholder="e.g. John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <input 
              type="text" 
              className="input-field" 
              value={data.subtitle}
              onChange={e => setData({...data, subtitle: e.target.value})}
              placeholder="e.g. Full Stack Developer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea 
              className="input-field min-h-[100px]" 
              value={data.description}
              onChange={e => setData({...data, description: e.target.value})}
              placeholder="A brief introduction about yourself..."
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Profile Image</h2>
            <ImageUploader 
              value={data.profileImage}
              onChange={(url) => setData({...data, profileImage: url})}
            />
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Background Image</h2>
            <ImageUploader 
              value={data.backgroundImage}
              onChange={(url) => setData({...data, backgroundImage: url})}
            />
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Call to Action Buttons</h2>
            <button 
              type="button" 
              onClick={addCta}
              className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"
            >
              <FiPlus /> Add Button
            </button>
          </div>
          
          {data.ctaButtons.length === 0 ? (
            <p className="text-zinc-500 text-sm italic">No buttons added yet. Click 'Add Button' to create one.</p>
          ) : (
            <div className="space-y-4">
              {data.ctaButtons.map((btn, index) => (
                <div key={index} className="flex gap-4 items-start p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Button Text</label>
                        <input 
                          type="text" 
                          className="input-field text-sm py-2" 
                          value={btn.text}
                          onChange={e => updateCta(index, 'text', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Link URL</label>
                        <input 
                          type="text" 
                          className="input-field text-sm py-2" 
                          value={btn.link}
                          onChange={e => updateCta(index, 'link', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Style Variant</label>
                      <select 
                        className="input-field text-sm py-2"
                        value={btn.variant}
                        onChange={e => updateCta(index, 'variant', e.target.value)}
                      >
                        <option value="primary">Primary (Gradient Fill)</option>
                        <option value="secondary">Secondary (Outline)</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeCta(index)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg mt-5 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default HeroEditor;
