import { useEffect, useRef } from 'react';
import { FiArrowDown } from 'react-icons/fi';

const HeroSection = ({ data }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (!data) return null;

  const { title, subtitle, description, ctaButtons, profileImage, backgroundImage } = data;

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--color-primary)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'var(--color-accent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Profile image */}
        {profileImage && (
          <div className="animate-on-scroll mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 animate-float"
                style={{ borderColor: 'var(--color-primary)' }}>
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 rounded-full animate-glow" style={{ opacity: 0.3 }} />
            </div>
          </div>
        )}

        {/* Title */}
        <h1 className="animate-on-scroll text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
          <span className="gradient-text">{title || 'Hello World'}</span>
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="animate-on-scroll text-xl md:text-2xl lg:text-3xl font-light mb-6"
            style={{ color: 'var(--color-text-secondary)', transitionDelay: '0.1s' }}>
            {subtitle}
          </p>
        )}

        {/* Description */}
        {description && (
          <p className="animate-on-scroll max-w-2xl mx-auto text-base md:text-lg mb-10 leading-relaxed"
            style={{ color: 'var(--color-text-secondary)', transitionDelay: '0.2s' }}>
            {description}
          </p>
        )}

        {/* CTA Buttons */}
        {ctaButtons && ctaButtons.length > 0 && (
          <div className="animate-on-scroll flex flex-wrap justify-center gap-4"
            style={{ transitionDelay: '0.3s' }}>
            {ctaButtons.map((btn, i) => (
              <a
                key={i}
                href={btn.link}
                className={btn.variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
              >
                {btn.text}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <FiArrowDown className="text-2xl" style={{ color: 'var(--color-text-secondary)' }} />
      </div>
    </section>
  );
};

export default HeroSection;
