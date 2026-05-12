import { usePortfolio } from '../context/PortfolioContext';
import ThemeProvider from '../themes/ThemeProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import SkillsSection from '../sections/SkillsSection';
import ProjectsSection from '../sections/ProjectsSection';
import ExperienceSection from '../sections/ExperienceSection';
import EducationSection from '../sections/EducationSection';
import ContactSection from '../sections/ContactSection';

const sectionComponents = {
  hero: HeroSection,
  about: AboutSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  experience: ExperienceSection,
  education: EducationSection,
  contact: ContactSection,
};

const PortfolioPage = () => {
  const { config, sections, projects, loading, error } = usePortfolio();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <p className="text-xl mb-2">Unable to load portfolio</p>
          <p style={{ color: 'var(--color-text-secondary)' }}>Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  const themeName = config?.theme?.name || 'minimal-dark';
  const themeOverrides = config?.theme || {};
  const enabledSections = config?.enabledSections || [];
  const sectionsOrder = config?.sectionsOrder || [];

  // Sort sections by configured order
  const orderedSections = sectionsOrder
    .filter(type => enabledSections.includes(type))
    .map(type => sections.find(s => s.type === type))
    .filter(Boolean);

  // Update page title from SEO config
  if (config?.seo?.title) {
    document.title = config.seo.title;
  }

  return (
    <ThemeProvider themeName={themeName} customOverrides={themeOverrides}>
      <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <Navbar config={config} sections={orderedSections} />

        <main>
          {orderedSections.map((section) => {
            const Component = sectionComponents[section.type];
            if (!Component) return null;

            const extraProps = {};
            if (section.type === 'projects') {
              extraProps.projects = projects;
            }
            if (section.type === 'contact') {
              extraProps.socialLinks = config?.socialLinks;
            }

            return <Component key={section._id || section.type} data={section.data} {...extraProps} />;
          })}
        </main>

        <Footer config={config} />
      </div>
    </ThemeProvider>
  );
};

export default PortfolioPage;
