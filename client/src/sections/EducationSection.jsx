import { useEffect, useRef } from 'react';
import { FiBookOpen } from 'react-icons/fi';

const EducationSection = ({ data }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (!data?.education) return null;

  return (
    <section id="education" ref={sectionRef} className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="animate-on-scroll text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
            style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)' }}>
            <FiBookOpen /> Education
          </div>
          <h2 className="section-title">Education</h2>
        </div>
        <div className="space-y-6">
          {data.education.map((edu, i) => (
            <div key={i} className="animate-on-scroll card hover-lift" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}>
                      <FiBookOpen className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{edu.institution}</h3>
                      <p className="text-sm" style={{ color: 'var(--color-primary)' }}>{edu.degree}</p>
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {edu.description}
                    </p>
                  )}
                </div>
                <span className="text-sm font-mono px-3 py-1 rounded self-start"
                  style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)' }}>
                  {edu.dates}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
