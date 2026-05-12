import { useEffect, useRef } from 'react';
import { FiFolder, FiGithub, FiExternalLink } from 'react-icons/fi';

const ProjectsSection = ({ data, projects }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.05 }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" ref={sectionRef} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="animate-on-scroll text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
            style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)' }}>
            <FiFolder /> Featured Projects
          </div>
          <h2 className="section-title">My Work</h2>
          <p className="section-subtitle">Projects I&apos;ve built and contributed to</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <div
              key={project._id || i}
              className="animate-on-scroll card group hover-lift overflow-hidden"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {/* Project image */}
              {project.imageUrl && (
                <div className="relative -mx-6 -mt-6 mb-6 h-48 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, var(--color-surface), transparent)' }} />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col flex-1">
                {project.featured && (
                  <span className="inline-flex self-start px-3 py-1 text-xs font-medium rounded-full mb-3"
                    style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary)' }}>
                    Featured
                  </span>
                )}

                <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-colors">
                  {project.title}
                </h3>

                <p className="text-sm mb-4 flex-1 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 text-xs rounded-full font-mono"
                        style={{
                          background: 'var(--color-surface-hover)',
                          color: 'var(--color-text-secondary)',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-4 mt-auto pt-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      <FiGithub /> Source
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm transition-colors"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      <FiExternalLink /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
