/* =====================================================
   CHE·NU — React DOM Entry Point
   main.tsx
   ===================================================== */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { applyThemeToDOM, getTheme } from './core/theme/themeEngine';

// Apply theme before render
applyThemeToDOM(getTheme());

// Global styles
const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--chenu-color-border, #2A3A2A);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--chenu-color-border-light, #3A4A3A);
  }

  /* Selection */
  ::selection {
    background: var(--chenu-color-primary, #4A7C4A);
    color: var(--chenu-color-text, #E8F0E8);
  }
`;

// Inject global styles
const styleElement = document.createElement('style');
styleElement.textContent = globalStyles;
document.head.appendChild(styleElement);

// Render app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
