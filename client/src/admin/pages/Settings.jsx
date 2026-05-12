import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { portfolioService } from '../../services/portfolioService';
import toast from 'react-hot-toast';
import { FiSave, FiLock, FiMail, FiSearch } from 'react-icons/fi';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: ''
  });

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const config = await portfolioService.getPortfolio();
        if (config?.seo) {
          setSeoData({
            title: config.seo.title || '',
            description: config.seo.description || '',
            keywords: config.seo.keywords || ''
          });
        }
      } catch (err) {
        toast.error('Failed to load SEO settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSeo();
  }, []);

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      const updateData = { email: formData.email };
      if (formData.password) updateData.password = formData.password;
      await api.put('/auth/profile', updateData);
      toast.success('Account settings updated successfully');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSeo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await portfolioService.updatePortfolio({ seo: seoData });
      toast.success('SEO metadata updated successfully');
    } catch (error) {
      toast.error('Failed to update SEO settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-indigo-500" /></div>;

  return (
    <div className="max-w-4xl grid md:grid-cols-2 gap-8">
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Account Settings</h1>
          <p className="text-zinc-400">Update your email address or password.</p>
        </div>

        <form onSubmit={handleSaveAccount} className="card space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="email" 
                className="input-field pl-10" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <h3 className="font-medium mb-4">Change Password</h3>
            <p className="text-sm text-zinc-400 mb-4">Leave blank if you do not want to change your password.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input type="password" className="input-field pl-10" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input type="password" className="input-field pl-10" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave />}
              Save Account
            </button>
          </div>
        </form>
      </div>

      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">SEO & Metadata</h1>
          <p className="text-zinc-400">Update how your site appears on Google & browser tabs.</p>
        </div>

        <form onSubmit={handleSaveSeo} className="card space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Browser Tab Title</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                className="input-field pl-10" 
                value={seoData.title}
                onChange={e => setSeoData({...seoData, title: e.target.value})}
                placeholder="My Name — Portfolio"
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">This is what shows up on the browser tab!</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Site Description</label>
            <textarea 
              className="input-field min-h-[100px]" 
              value={seoData.description}
              onChange={e => setSeoData({...seoData, description: e.target.value})}
              placeholder="I am a software engineer..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Keywords (comma separated)</label>
            <input 
              type="text" 
              className="input-field" 
              value={seoData.keywords}
              onChange={e => setSeoData({...seoData, keywords: e.target.value})}
              placeholder="developer, react, node"
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave />}
              Save SEO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
