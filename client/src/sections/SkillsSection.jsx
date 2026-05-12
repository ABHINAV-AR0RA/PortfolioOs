import { useEffect, useRef } from 'react';
import { FiCode } from 'react-icons/fi';

const SkillsSection = ({ data }) => {
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

  if (!data?.skills) return null;

  // Group skills by category
  const categories = data.skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" ref={sectionRef} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="animate-on-scroll text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
            style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)' }}>
            <FiCode /> Skills & Technologies
          </div>
          <h2 className="section-title">My Tech Stack</h2>
          <p className="section-subtitle">Technologies I work with</p>
        </div>

        <div className="space-y-12">
          {Object.entries(categories).map(([category, skills], catIndex) => (
            <div key={category} className="animate-on-scroll" style={{ transitionDelay: `${catIndex * 0.1}s` }}>
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }} />
                {category}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill, i) => (
                  <div key={i} className="card group">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm font-mono" style={{ color: 'var(--color-primary)' }}>
                        {skill.proficiency}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden"
                      style={{ background: 'var(--color-border)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${skill.proficiency}%`,
                          background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
