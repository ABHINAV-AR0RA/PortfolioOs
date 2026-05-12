import { useState, useEffect } from 'react';
import { sectionService } from '../../services/sectionService';
import toast from 'react-hot-toast';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

const AboutEditor = () => {
  const [sectionId, setSectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    bio: '',
    highlights: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const sections = await sectionService.getSections();
      const aboutSection = sections.find(s => s.type === 'about');
      if (aboutSection) {
        setSectionId(aboutSection._id);
        setData({
          bio: aboutSection.data.bio || '',
          highlights: aboutSection.data.highlights || []
        });
      }
    } catch (err) {
      toast.error('Failed to load about section');
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
      toast.success('About section updated successfully');
    } catch (err) {
      toast.error('Failed to update about section');
    } finally {
      setSaving(false);
    }
  };

  const addHighlight = () => {
    setData({
      ...data,
      highlights: [...data.highlights, { label: 'New Label', value: '10+' }]
    });
  };

  const updateHighlight = (index, field, value) => {
    const newHighlights = [...data.highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    setData({ ...data, highlights: newHighlights });
  };

  const removeHighlight = (index) => {
    const newHighlights = [...data.highlights];
    newHighlights.splice(index, 1);
    setData({ ...data, highlights: newHighlights });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-indigo-500" /></div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">About Section</h1>
          <p className="text-zinc-400">Edit your biography and key highlights.</p>
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
          <h2 className="text-xl font-semibold mb-4">Biography</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Bio Text</label>
            <textarea 
              className="input-field min-h-[200px]" 
              value={data.bio}
              onChange={e => setData({...data, bio: e.target.value})}
              placeholder="Write your professional biography here..."
            />
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Highlights / Stats</h2>
            <button 
              type="button" 
              onClick={addHighlight}
              className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"
            >
              <FiPlus /> Add Highlight
            </button>
          </div>
          
          {data.highlights.length === 0 ? (
            <p className="text-zinc-500 text-sm italic">No highlights added yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {data.highlights.map((item, index) => (
                <div key={index} className="flex gap-4 items-start p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Big Value</label>
                      <input 
                        type="text" 
                        className="input-field text-sm py-2 text-center text-xl font-bold font-mono" 
                        value={item.value}
                        onChange={e => updateHighlight(index, 'value', e.target.value)}
                        placeholder="e.g. 5+"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Small Label</label>
                      <input 
                        type="text" 
                        className="input-field text-sm py-2 text-center" 
                        value={item.label}
                        onChange={e => updateHighlight(index, 'label', e.target.value)}
                        placeholder="e.g. Years Experience"
                      />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeHighlight(index)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors mt-6"
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

export default AboutEditor;
