import { useState, useEffect } from 'react';
import { portfolioService } from '../../services/portfolioService';
import { themes, themeNames } from '../../themes/themeConfig';
import toast from 'react-hot-toast';
import { FiSave, FiMonitor } from 'react-icons/fi';

const ThemeEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState({
    name: 'minimal-dark',
    primaryColor: '#6366f1',
    backgroundColor: '#0f0f0f',
    textColor: '#ffffff',
    accentColor: '#818cf8',
    fontFamily: "'Inter', sans-serif",
    borderRadius: '12px',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const config = await portfolioService.getPortfolio();
      if (config?.theme) {
        setTheme({ ...theme, ...config.theme });
      }
    } catch (err) {
      toast.error('Failed to load theme configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await portfolioService.updatePortfolio({ theme });
      toast.success('Theme configuration updated successfully');
    } catch (err) {
      toast.error('Failed to update theme');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeSelect = (themeName) => {
    const selectedTheme = themes[themeName];
    if (selectedTheme) {
      setTheme({
        name: themeName,
        primaryColor: selectedTheme.variables['--color-primary'],
        backgroundColor: selectedTheme.variables['--color-bg'],
        textColor: selectedTheme.variables['--color-text'],
        accentColor: selectedTheme.variables['--color-accent'],
        fontFamily: selectedTheme.variables['--font-family'],
        borderRadius: selectedTheme.variables['--border-radius'],
      });
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-indigo-500" /></div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Theme Engine</h1>
          <p className="text-zinc-400">Customize the look and feel of your portfolio.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-2">
            <FiMonitor /> Preview
          </a>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave />}
            Save Theme
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Preset Themes</h2>
            <div className="grid grid-cols-2 gap-4">
              {themeNames.map(name => {
                const preset = themes[name];
                const isActive = theme.name === name;
                return (
                  <button
                    key={name}
                    onClick={() => handleThemeSelect(name)}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      isActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    <div 
                      className="w-full h-16 rounded-md mb-3 border border-zinc-700/50 flex flex-col justify-between p-2"
                      style={{ background: preset.variables['--color-bg'] }}
                    >
                      <div className="w-1/2 h-2 rounded-full" style={{ background: preset.variables['--color-primary'] }} />
                      <div className="flex justify-end gap-1">
                        <div className="w-4 h-4 rounded-full" style={{ background: preset.variables['--color-accent'] }} />
                      </div>
                    </div>
                    <span className="font-medium text-sm text-center">{preset.name}</span>
                    <span className="text-xs text-zinc-500 text-center mt-1">{preset.description}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Custom Overrides</h2>
            <p className="text-sm text-zinc-400 mb-6">Fine-tune the selected preset to your liking.</p>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      className="w-10 h-10 rounded border-0 cursor-pointer bg-transparent" 
                      value={theme.primaryColor || '#000000'}
                      onChange={e => setTheme({...theme, primaryColor: e.target.value})}
                    />
                    <input 
                      type="text" 
                      className="input-field py-2 text-sm uppercase font-mono" 
                      value={theme.primaryColor}
                      onChange={e => setTheme({...theme, primaryColor: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      className="w-10 h-10 rounded border-0 cursor-pointer bg-transparent" 
                      value={theme.accentColor || '#000000'}
                      onChange={e => setTheme({...theme, accentColor: e.target.value})}
                    />
                    <input 
                      type="text" 
                      className="input-field py-2 text-sm uppercase font-mono" 
                      value={theme.accentColor}
                      onChange={e => setTheme({...theme, accentColor: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Background Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      className="w-10 h-10 rounded border-0 cursor-pointer bg-transparent" 
                      value={theme.backgroundColor || '#000000'}
                      onChange={e => setTheme({...theme, backgroundColor: e.target.value})}
                    />
                    <input 
                      type="text" 
                      className="input-field py-2 text-sm uppercase font-mono" 
                      value={theme.backgroundColor}
                      onChange={e => setTheme({...theme, backgroundColor: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Text Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      className="w-10 h-10 rounded border-0 cursor-pointer bg-transparent" 
                      value={theme.textColor || '#ffffff'}
                      onChange={e => setTheme({...theme, textColor: e.target.value})}
                    />
                    <input 
                      type="text" 
                      className="input-field py-2 text-sm uppercase font-mono" 
                      value={theme.textColor}
                      onChange={e => setTheme({...theme, textColor: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Font Family</label>
                <select 
                  className="input-field py-2" 
                  value={theme.fontFamily}
                  onChange={e => setTheme({...theme, fontFamily: e.target.value})}
                >
                  <option value="'Inter', sans-serif">Inter</option>
                  <option value="'Roboto', sans-serif">Roboto</option>
                  <option value="'Poppins', sans-serif">Poppins</option>
                  <option value="'Playfair Display', serif">Playfair Display</option>
                  <option value="'Outfit', sans-serif">Outfit</option>
                  <option value="'Fira Code', monospace">Fira Code</option>
                  <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Border Radius</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={theme.borderRadius}
                  onChange={e => setTheme({...theme, borderRadius: e.target.value})}
                  placeholder="e.g. 12px or 0.5rem"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeEditor;
