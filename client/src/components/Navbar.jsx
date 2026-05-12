import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = ({ config, sections }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const enabledSections = sections?.filter(s => s.enabled).sort((a, b) => a.order - b.order) || [];
  const sectionLabels = { hero: 'Home', about: 'About', skills: 'Skills', projects: 'Projects', experience: 'Experience', education: 'Education', contact: 'Contact' };
  
  const heroSection = sections?.find(s => s.type === 'hero');
  const logoText = heroSection?.data?.title || config?.seo?.title?.split('—')[0]?.trim() || 'Portfolio';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-3' : 'py-5'
    }`} style={{
      background: scrolled ? 'rgba(15, 15, 15, 0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--color-border)' : 'none',
    }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="#hero" className="text-xl font-bold gradient-text">
          {logoText}
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {enabledSections.filter(s => s.type !== 'hero').map(s => (
            <a key={s.type} href={`#${s.type}`}
              className="text-sm font-medium transition-colors hover:opacity-100"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}>
              {sectionLabels[s.type] || s.type}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-2xl" onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: 'var(--color-text)' }}>
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 py-4 px-6 space-y-4"
          style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          {enabledSections.filter(s => s.type !== 'hero').map(s => (
            <a key={s.type} href={`#${s.type}`}
              className="block text-sm font-medium py-2"
              style={{ color: 'var(--color-text-secondary)' }}
              onClick={() => setMobileOpen(false)}>
              {sectionLabels[s.type] || s.type}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
