export const themes = {
  'minimal-dark': {
    name: 'Minimal Dark',
    description: 'Sleek, modern dark mode with subtle accents',
    className: 'theme-minimal-dark',
    variables: {
      '--color-primary': '#6366f1',
      '--color-accent': '#818cf8',
      '--color-bg': '#0f0f0f',
      '--color-bg-secondary': '#1a1a2e',
      '--color-text': '#ffffff',
      '--color-text-secondary': '#a1a1aa',
      '--color-surface': '#18181b',
      '--color-surface-hover': '#27272a',
      '--color-border': '#27272a',
      '--font-family': "'Inter', sans-serif",
      '--border-radius': '12px',
    },
  },
  'glassmorphism': {
    name: 'Glassmorphism',
    description: 'Frosted glass cards with vibrant backgrounds',
    className: 'theme-glassmorphism',
    variables: {
      '--color-primary': '#8b5cf6',
      '--color-accent': '#a78bfa',
      '--color-bg': '#0c0a1a',
      '--color-bg-secondary': '#1e1b3a',
      '--color-text': '#f0eeff',
      '--color-text-secondary': '#b4b0d0',
      '--color-surface': 'rgba(255, 255, 255, 0.06)',
      '--color-surface-hover': 'rgba(255, 255, 255, 0.1)',
      '--color-border': 'rgba(255, 255, 255, 0.1)',
      '--font-family': "'Inter', sans-serif",
      '--border-radius': '16px',
    },
  },
  'terminal': {
    name: 'Terminal',
    description: 'Hacker-style monospace terminal aesthetic',
    className: 'theme-terminal',
    variables: {
      '--color-primary': '#00ff88',
      '--color-accent': '#00cc6a',
      '--color-bg': '#0a0e14',
      '--color-bg-secondary': '#121820',
      '--color-text': '#00ff88',
      '--color-text-secondary': '#00cc6a99',
      '--color-surface': '#0d1117',
      '--color-surface-hover': '#161b22',
      '--color-border': '#00ff8833',
      '--font-family': "'JetBrains Mono', monospace",
      '--border-radius': '4px',
    },
  },
  'modern-gradient': {
    name: 'Modern Gradient',
    description: 'Vibrant gradients with bold typography',
    className: 'theme-gradient',
    variables: {
      '--color-primary': '#f472b6',
      '--color-accent': '#c084fc',
      '--color-bg': '#0f0f23',
      '--color-bg-secondary': '#1a0f2e',
      '--color-text': '#ffffff',
      '--color-text-secondary': '#c4b5d8',
      '--color-surface': '#1a1535',
      '--color-surface-hover': '#251f45',
      '--color-border': '#2d2555',
      '--font-family': "'Inter', sans-serif",
      '--border-radius': '16px',
    },
  },
};

export const getThemeByName = (name) => {
  return themes[name] || themes['minimal-dark'];
};

export const themeNames = Object.keys(themes);
