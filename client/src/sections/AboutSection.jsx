import { useEffect, useRef } from 'react';
import { FiUser } from 'react-icons/fi';

const AboutSection = ({ data }) => {
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

  if (!data) return null;

  const { bio, highlights } = data;

  return (
    <section id="about" ref={sectionRef} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="animate-on-scroll text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
            style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)' }}>
            <FiUser /> About Me
          </div>
          <h2 className="section-title">Get to know me</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Bio */}
          <div className="animate-on-scroll">
            <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {bio}
            </p>
          </div>

          {/* Highlights Grid */}
          {highlights && highlights.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className="animate-on-scroll card text-center hover-lift"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                    {item.value}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
