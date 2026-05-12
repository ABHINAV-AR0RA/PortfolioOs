require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const PortfolioConfig = require('../models/PortfolioConfig');
const Section = require('../models/Section');
const Project = require('../models/Project');

const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await PortfolioConfig.deleteMany({});
    await Section.deleteMany({});
    await Project.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // 2. Create admin user
    console.log('👤 Creating admin user...');
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolioos.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const adminUser = new User({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });
    await adminUser.save();
    console.log(`👤 Admin user created: ${adminEmail}`);

    // Create portfolio config
    const config = await PortfolioConfig.create({
      theme: {
        name: 'minimal-dark',
        primaryColor: '#6366f1',
        backgroundColor: '#0f0f0f',
        textColor: '#ffffff',
        accentColor: '#818cf8',
        fontFamily: "'Inter', sans-serif",
        borderRadius: '12px',
      },
      sectionsOrder: ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact'],
      enabledSections: ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact'],
      socialLinks: {
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: 'https://twitter.com/johndoe',
      },
      seo: {
        title: 'Abhinav Arora — Full Stack Developer',
        description: 'Full Stack Developer specializing in React, Node.js, and cloud technologies.',
        keywords: 'developer, full stack, react, node, portfolio',
      },
      owner: adminUser._id,
    });

    console.log('⚙️  Portfolio config created');

    // Create sections
    const sections = await Section.insertMany([
      {
        type: 'hero',
        enabled: true,
        order: 0,
        layout: 'default',
        data: {
          title: 'John Doe',
          subtitle: 'Full Stack Developer & Creative Technologist',
          description: 'I craft digital experiences that blend beautiful design with powerful functionality. Passionate about building products that make a difference.',
          ctaButtons: [
            { text: 'View Projects', link: '#projects', variant: 'primary' },
            { text: 'Contact Me', link: '#contact', variant: 'secondary' },
          ],
          profileImage: '',
          backgroundImage: '',
        },
        owner: adminUser._id,
      },
      {
        type: 'about',
        enabled: true,
        order: 1,
        layout: 'default',
        data: {
          bio: "I'm a passionate full-stack developer with 5+ years of experience building scalable web applications. I love turning complex problems into simple, beautiful, and intuitive designs. When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge through tech blogs.",
          highlights: [
            { label: 'Years Experience', value: '5+' },
            { label: 'Projects Completed', value: '50+' },
            { label: 'Technologies', value: '20+' },
            { label: 'Happy Clients', value: '30+' },
          ],
        },
        owner: adminUser._id,
      },
      {
        type: 'skills',
        enabled: true,
        order: 2,
        layout: 'default',
        data: {
          skills: [
            { name: 'React', category: 'Frontend', proficiency: 95 },
            { name: 'TypeScript', category: 'Frontend', proficiency: 90 },
            { name: 'Next.js', category: 'Frontend', proficiency: 88 },
            { name: 'Tailwind CSS', category: 'Frontend', proficiency: 92 },
            { name: 'Node.js', category: 'Backend', proficiency: 90 },
            { name: 'Express.js', category: 'Backend', proficiency: 88 },
            { name: 'Python', category: 'Backend', proficiency: 85 },
            { name: 'PostgreSQL', category: 'Database', proficiency: 82 },
            { name: 'MongoDB', category: 'Database', proficiency: 88 },
            { name: 'Docker', category: 'DevOps', proficiency: 80 },
            { name: 'AWS', category: 'DevOps', proficiency: 78 },
            { name: 'Git', category: 'DevOps', proficiency: 92 },
          ],
        },
        owner: adminUser._id,
      },
      {
        type: 'projects',
        enabled: true,
        order: 3,
        layout: 'default',
        data: {},
        owner: adminUser._id,
      },
      {
        type: 'experience',
        enabled: true,
        order: 4,
        layout: 'default',
        data: {
          experiences: [
            {
              company: 'TechCorp Inc.',
              role: 'Senior Full Stack Developer',
              duration: 'Jan 2023 — Present',
              description: 'Leading development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines and mentored junior developers.',
            },
            {
              company: 'StartupXYZ',
              role: 'Full Stack Developer',
              duration: 'Jun 2021 — Dec 2022',
              description: 'Built and maintained React/Node.js applications. Designed RESTful APIs and integrated third-party services. Improved page load times by 40%.',
            },
            {
              company: 'Digital Agency Pro',
              role: 'Frontend Developer',
              duration: 'Aug 2019 — May 2021',
              description: 'Developed responsive web applications for enterprise clients. Led the migration from jQuery to React, improving developer productivity by 60%.',
            },
          ],
        },
        owner: adminUser._id,
      },
      {
        type: 'education',
        enabled: true,
        order: 5,
        layout: 'default',
        data: {
          education: [
            {
              institution: 'MIT',
              degree: 'B.S. in Computer Science',
              dates: '2015 — 2019',
              description: 'Graduated with honors. Focused on software engineering and distributed systems. Led the university coding club.',
            },
          ],
        },
        owner: adminUser._id,
      },
      {
        type: 'contact',
        enabled: true,
        order: 6,
        layout: 'default',
        data: {
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          cta: "Let's build something amazing together!",
        },
        owner: adminUser._id,
      },
    ]);

    console.log(`📄 ${sections.length} sections created`);

    // Create sample projects
    const projects = await Project.insertMany([
      {
        title: 'E-Commerce Platform',
        description: 'A full-featured e-commerce platform with real-time inventory management, payment processing, and advanced analytics dashboard.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
        githubUrl: 'https://github.com/johndoe/ecommerce',
        liveUrl: 'https://ecommerce-demo.vercel.app',
        imageUrl: '',
        featured: true,
        order: 0,
        owner: adminUser._id,
      },
      {
        title: 'AI Chat Application',
        description: 'Real-time chat application powered by GPT-4 with conversation history, code highlighting, and multi-language support.',
        technologies: ['Next.js', 'OpenAI', 'WebSocket', 'MongoDB', 'Tailwind'],
        githubUrl: 'https://github.com/johndoe/ai-chat',
        liveUrl: 'https://ai-chat-demo.vercel.app',
        imageUrl: '',
        featured: true,
        order: 1,
        owner: adminUser._id,
      },
      {
        title: 'Task Management System',
        description: 'Collaborative project management tool with Kanban boards, real-time updates, team workspaces, and automated workflows.',
        technologies: ['React', 'Express', 'Socket.io', 'MongoDB', 'Docker'],
        githubUrl: 'https://github.com/johndoe/taskmanager',
        liveUrl: 'https://task-manager-demo.vercel.app',
        imageUrl: '',
        featured: true,
        order: 2,
        owner: adminUser._id,
      },
      {
        title: 'Weather Analytics Dashboard',
        description: 'Interactive weather visualization dashboard with historical data analysis, forecasting, and geolocation-based alerts.',
        technologies: ['Vue.js', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL'],
        githubUrl: 'https://github.com/johndoe/weather',
        liveUrl: '',
        imageUrl: '',
        featured: false,
        order: 3,
        owner: adminUser._id,
      },
    ]);

    console.log(`🚀 ${projects.length} projects created`);
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD ? '******** (from .env)' : 'admin123'}\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
