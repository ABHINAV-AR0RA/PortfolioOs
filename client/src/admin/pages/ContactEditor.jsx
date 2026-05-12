import { useState, useEffect } from 'react';
import { sectionService } from '../../services/sectionService';
import { portfolioService } from '../../services/portfolioService';
import toast from 'react-hot-toast';
import { FiSave } from 'react-icons/fi';

const ContactEditor = () => {
  const [sectionId, setSectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    email: '',
    phone: '',
    location: '',
    cta: ''
  });
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    youtube: '',
    website: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sections, config] = await Promise.all([
        sectionService.getSections(),
        portfolioService.getPortfolio()
      ]);
      
      const contactSection = sections.find(s => s.type === 'contact');
      if (contactSection) {
        setSectionId(contactSection._id);
        setData({
          email: contactSection.data.email || '',
          phone: contactSection.data.phone || '',
          location: contactSection.data.location || '',
          cta: contactSection.data.cta || ''
        });
      }

      if (config && config.socialLinks) {
        setSocialLinks({
          github: config.socialLinks.github || '',
          linkedin: config.socialLinks.linkedin || '',
          twitter: config.socialLinks.twitter || '',
          instagram: config.socialLinks.instagram || '',
          youtube: config.socialLinks.youtube || '',
          website: config.socialLinks.website || ''
        });
      }
    } catch (err) {
      toast.error('Failed to load contact information');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const promises = [portfolioService.updatePortfolio({ socialLinks })];
      if (sectionId) {
        promises.push(sectionService.updateSection(sectionId, { data }));
      }
      
      await Promise.all(promises);
      toast.success('Contact information updated successfully');
    } catch (err) {
      toast.error('Failed to update contact information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-indigo-500" /></div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Contact Section & Socials</h1>
          <p className="text-zinc-400">Manage your contact information and social media links.</p>
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
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                value={data.email}
                onChange={e => setData({...data, email: e.target.value})}
                placeholder="hello@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input 
                type="text" 
                className="input-field" 
                value={data.phone}
                onChange={e => setData({...data, phone: e.target.value})}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input 
                type="text" 
                className="input-field" 
                value={data.location}
                onChange={e => setData({...data, location: e.target.value})}
                placeholder="San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Call to Action Text</label>
              <textarea 
                className="input-field min-h-[80px]" 
                value={data.cta}
                onChange={e => setData({...data, cta: e.target.value})}
                placeholder="Let's work together..."
              />
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="text-xl font-semibold mb-4">Social Links</h2>
            
            {Object.keys(socialLinks).map(platform => (
              <div key={platform}>
                <label className="block text-sm font-medium mb-2 capitalize">{platform} URL</label>
                <input 
                  type="url" 
                  className="input-field" 
                  value={socialLinks[platform]}
                  onChange={e => setSocialLinks({...socialLinks, [platform]: e.target.value})}
                  placeholder={`https://${platform}.com/...`}
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactEditor;
