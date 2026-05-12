import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiYoutube, FiGlobe, FiHeart } from 'react-icons/fi';

const socialIcons = {
  github: FiGithub, linkedin: FiLinkedin, twitter: FiTwitter,
  instagram: FiInstagram, youtube: FiYoutube, website: FiGlobe,
};

const Footer = ({ config }) => {
  const socialLinks = config?.socialLinks || {};
  const activeSocials = Object.entries(socialLinks).filter(([, url]) => url);

  return (
    <footer className="py-12 px-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-5xl mx-auto text-center">
        {activeSocials.length > 0 && (
          <div className="flex justify-center gap-4 mb-6">
            {activeSocials.map(([platform, url]) => {
              const Icon = socialIcons[platform] || FiGlobe;
              return (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                  <Icon />
                </a>
              );
            })}
          </div>
        )}
        <p className="text-sm flex items-center justify-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
          Built with <FiHeart className="text-red-500" /> using PortfolioOS
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)', opacity: 0.5 }}>
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
