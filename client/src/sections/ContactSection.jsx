import { useEffect, useRef, useState } from 'react';
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';

const ContactSection = ({ data, socialLinks }) => {
  const sectionRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:${data.email}?subject=Portfolio Contact from ${form.name}&body=${encodeURIComponent(form.message)}`;
    window.open(mailtoLink);
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="animate-on-scroll text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
            style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)' }}>
            <FiMail /> Contact
          </div>
          <h2 className="section-title">Get In Touch</h2>
          {data.cta && <p className="section-subtitle">{data.cta}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="animate-on-scroll space-y-6">
            {data.email && (
              <a href={`mailto:${data.email}`} className="card flex items-center gap-4 hover-lift cursor-pointer">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}>
                  <FiMail className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Email</p>
                  <p className="font-medium">{data.email}</p>
                </div>
              </a>
            )}
            {data.phone && (
              <div className="card flex items-center gap-4 hover-lift">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}>
                  <FiPhone className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Phone</p>
                  <p className="font-medium">{data.phone}</p>
                </div>
              </div>
            )}
            {data.location && (
              <div className="card flex items-center gap-4 hover-lift">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' }}>
                  <FiMapPin className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Location</p>
                  <p className="font-medium">{data.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="animate-on-scroll space-y-4" style={{ transitionDelay: '0.2s' }}>
            <input type="text" placeholder="Your Name" className="input-field"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input type="email" placeholder="Your Email" className="input-field"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <textarea placeholder="Your Message" rows={5} className="input-field resize-none"
              value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <FiSend /> Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
