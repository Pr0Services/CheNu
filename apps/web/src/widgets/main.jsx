/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ROADY V25 - MAIN ENTRY POINT
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Error boundary for production
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ROADY Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0a0d0b',
          color: '#f4f0eb',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
          padding: '20px',
        }}>
          <span style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</span>
          <h1 style={{ fontSize: '24px', marginBottom: '12px' }}>Oups! Une erreur est survenue</h1>
          <p style={{ color: '#78716c', marginBottom: '24px' }}>
            {this.state.error?.message || 'Erreur inattendue'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #4ade80, #22d3ee)',
              border: 'none',
              borderRadius: '10px',
              color: '#0a0d0b',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Recharger l'application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Mount app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
