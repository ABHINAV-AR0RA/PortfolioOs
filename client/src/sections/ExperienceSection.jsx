import { useEffect, useRef } from 'react';
import { FiBriefcase } from 'react-icons/fi';

const ExperienceSection = ({ data }) => {
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

  if (!data?.experiences) return null;

  return (
    <section id="experience" ref={sectionRef} className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="animate-on-scroll text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
            style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)' }}>
            <FiBriefcase /> Experience
          </div>
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">My professional journey</p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px transform md:-translate-x-1/2"
            style={{ background: 'linear-gradient(to bottom, var(--color-primary), var(--color-border))' }} />

          {data.experiences.map((exp, i) => (
            <div
              key={i}
              className={`animate-on-scroll relative mb-12 md:w-1/2 ${
                i % 2 === 0 ? 'md:pr-12 md:ml-0' : 'md:pl-12 md:ml-auto'
              } pl-8 md:pl-0`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-auto top-0 w-3 h-3 rounded-full transform -translate-x-1.5"
                style={{
                  background: 'var(--color-primary)',
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
                  ...(i % 2 === 0
                    ? { right: '-6px', left: 'auto' }
                    : { left: '-6px' }),
                }}
              />

              <div className="card hover-lift">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono px-2 py-1 rounded"
                    style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)' }}>
                    {exp.duration}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1">{exp.role}</h3>
                <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-primary)' }}>
                  {exp.company}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
