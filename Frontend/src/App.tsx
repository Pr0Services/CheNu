/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU - APPLICATION PRINCIPALE                        ║
 * ║                                                                              ║
 * ║  Avec logo CHE·NU intégré + Nova Widget                                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from 'react';
import { NovaWidget } from './components/nova/NovaWidget';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { SettingsPage } from './pages/SettingsPage';
import { UniverseView } from './views/UniverseView';
import { MeetingRoom } from './ui/meetings/MeetingRoom';
import { IALaboratoryPage } from './pages/modules/IALaboratoryPage';
import { IALearningPage } from './pages/modules/IALearningPage';
import { Meeting } from './core/meetings/meeting.types';
import { createMeeting } from './core/meetings/meeting.logic';

type AppView = 'home' | 'universe' | 'meeting' | 'settings' | 'ia-lab' | 'ia-learn';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('chenu_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('chenu_token');
    localStorage.removeItem('chenu_user');
    setIsAuthenticated(false);
  };

  const handleStartMeeting = () => {
    const newMeeting = createMeeting(
      'Strategic Planning Session',
      'Define Q1 2025 priorities and resource allocation',
      { requireHumanDecision: true, autoAdvancePhases: false }
    );
    setActiveMeeting(newMeeting);
    setCurrentView('meeting');
  };

  const handleCloseMeeting = () => {
    setActiveMeeting(null);
    setCurrentView('home');
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      background: '#0D1210',
    }}>
      {/* Main Navigation Bar */}
      {currentView !== 'meeting' && (
        <nav style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          background: 'rgba(13, 18, 16, 0.95)',
          borderBottom: '1px solid rgba(216, 178, 106, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 100,
          backdropFilter: 'blur(10px)',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(216, 178, 106, 0.2)',
            }}>
              <img
                src="/assets/images/chenu-logo.jpg"
                alt="CHE·NU"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div style="
                      width: 100%;
                      height: 100%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      background: linear-gradient(135deg, #3F7249 0%, #2F5A39 100%);
                      color: #D8B26A;
                      font-size: 18px;
                    ">🏛️</div>
                  `;
                }}
              />
            </div>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#E8F0E8', letterSpacing: 1.5 }}>
                CHE·NU
              </span>
              <span style={{ fontSize: 9, color: '#6B7B6B', display: 'block', marginTop: -2 }}>
                Chez Nous
              </span>
            </div>
          </div>

          {/* Main Nav Items */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'home', label: 'Accueil', icon: '🏠' },
              { id: 'universe', label: 'Univers', icon: '🌌' },
              { id: 'ia-lab', label: 'IA Lab', icon: '🧪' },
              { id: 'ia-learn', label: 'IA Learn', icon: '🎓' },
              { id: 'settings', label: 'Paramètres', icon: '⚙️' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as AppView)}
                style={{
                  padding: '8px 14px',
                  background: currentView === item.id ? 'rgba(216, 178, 106, 0.15)' : 'transparent',
                  border: 'none',
                  borderRadius: 8,
                  color: currentView === item.id ? '#D8B26A' : '#8B9B8B',
                  fontSize: 11,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right side - Actions + User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={handleStartMeeting}
              style={{
                padding: '8px 14px',
                background: 'linear-gradient(135deg, #3F7249 0%, #2F5A39 100%)',
                border: 'none',
                borderRadius: 8,
                color: '#E8F0E8',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>🎬</span>
              <span>Meeting</span>
            </button>
            <button
              onClick={handleLogout}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 600,
                color: '#1A1A1A',
                cursor: 'pointer',
              }}
              title="Déconnexion"
            >
              JO
            </button>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <main style={{ 
        paddingTop: currentView !== 'meeting' ? 56 : 0,
        height: '100%',
        overflow: 'auto',
      }}>
        {currentView === 'home' && <HomePage />}
        {currentView === 'universe' && <UniverseView />}
        {currentView === 'settings' && <SettingsPage />}
        {currentView === 'ia-lab' && <IALaboratoryPage />}
        {currentView === 'ia-learn' && <IALearningPage />}
        {currentView === 'meeting' && activeMeeting && (
          <MeetingRoom
            meeting={activeMeeting}
            onUpdateMeeting={setActiveMeeting}
            onClose={handleCloseMeeting}
          />
        )}
      </main>

      {/* Nova Widget - Always accessible after login */}
      <NovaWidget isAuthenticated={isAuthenticated} />

      {/* Global Styles */}
      <style>{`
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
          background: #0D1210;
          color: #E8F0E8;
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(216, 178, 106, 0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(216, 178, 106, 0.5);
        }
        ::selection {
          background: rgba(216, 178, 106, 0.3);
          color: #E8F0E8;
        }
        input:focus, textarea:focus, select:focus {
          border-color: rgba(216, 178, 106, 0.5) !important;
        }
      `}</style>
    </div>
  );
};


export default App;
