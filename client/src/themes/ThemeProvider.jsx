import { useEffect } from 'react';
import { getThemeByName } from './themeConfig';

const ThemeProvider = ({ themeName, customOverrides = {}, children }) => {
  useEffect(() => {
    const theme = getThemeByName(themeName);
    const root = document.documentElement;

    // Apply theme CSS variables
    Object.entries(theme.variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Apply custom overrides from admin
    Object.entries(customOverrides).forEach(([key, value]) => {
      if (value) {
        // Map property names to CSS variable names
        const varMap = {
          primaryColor: '--color-primary',
          backgroundColor: '--color-bg',
          textColor: '--color-text',
          accentColor: '--color-accent',
          fontFamily: '--font-family',
          borderRadius: '--border-radius',
        };
        if (varMap[key]) {
          root.style.setProperty(varMap[key], value);
        }
      }
    });

    // Handle dynamic font injection
    const fontToLoad = customOverrides?.fontFamily || theme.variables['--font-family'];
    if (fontToLoad) {
      const fontName = fontToLoad.split(',')[0].replace(/['"]/g, '').trim();
      const linkId = `dynamic-font-${fontName.replace(/\\s+/g, '-')}`;
      
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\\s+/g, '+')}:wght@300;400;500;600;700;800&display=swap`;
        document.head.appendChild(link);
      }
    }

    // Apply theme class
    document.body.className = '';
    document.body.classList.add(theme.className);

    return () => {
      document.body.className = '';
    };
  }, [themeName, customOverrides]);

  return <>{children}</>;
};

export default ThemeProvider;
