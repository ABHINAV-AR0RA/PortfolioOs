const mongoose = require('mongoose');

const portfolioConfigSchema = new mongoose.Schema({
  theme: {
    name: { type: String, default: 'minimal-dark' },
    primaryColor: { type: String, default: '#6366f1' },
    backgroundColor: { type: String, default: '#0f0f0f' },
    textColor: { type: String, default: '#ffffff' },
    accentColor: { type: String, default: '#818cf8' },
    fontFamily: { type: String, default: "'Inter', sans-serif" },
    borderRadius: { type: String, default: '12px' },
  },
  sectionsOrder: {
    type: [String],
    default: ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact'],
  },
  enabledSections: {
    type: [String],
    default: ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact'],
  },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  seo: {
    title: { type: String, default: 'My Portfolio' },
    description: { type: String, default: 'Welcome to my portfolio' },
    keywords: { type: String, default: 'portfolio, developer, projects' },
    ogImage: { type: String, default: '' },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('PortfolioConfig', portfolioConfigSchema);
