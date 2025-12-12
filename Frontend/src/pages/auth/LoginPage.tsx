/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU - PAGE DE CONNEXION                             ║
 * ║                                                                              ║
 * ║  Page d'authentification avec logo CHE·NU                                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';

export const LoginPage: React.FC<{ onLogin?: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate login
      await new Promise(r => setTimeout(r, 1000));
      
      // Demo: accept any credentials
      localStorage.setItem('chenu_token', 'demo_token');
      localStorage.setItem('chenu_user', JSON.stringify({ email, name: 'Jo' }));
      
      onLogin?.();
    } catch {
      setError('Identifiants invalides');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #0D1210 0%, #121816 50%, #0F1512 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(63, 114, 73, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(216, 178, 106, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div
        style={{
          width: '100%',
          maxWidth: 420,
          padding: 40,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              width: 140,
              height: 140,
              margin: '0 auto 20px',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(216, 178, 106, 0.25)',
              border: '2px solid rgba(216, 178, 106, 0.2)',
            }}
          >
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
                    font-size: 48px;
                  ">🏛️</div>
                `;
              }}
            />
          </div>
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#E8F0E8',
            letterSpacing: 3,
            marginBottom: 8,
          }}>
            CHE·NU
          </h1>
          <p style={{
            fontSize: 12,
            color: '#8B9B8B',
            letterSpacing: 2,
          }}>
            CHEZ NOUS • CONSTRUCTION INTELLIGENTE
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 16,
              padding: 32,
              border: '1px solid rgba(216, 178, 106, 0.15)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h2 style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#D8B26A',
              marginBottom: 24,
              textAlign: 'center',
            }}>
              Connexion
            </h2>

            {error && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 8,
                color: '#ef4444',
                fontSize: 12,
                marginBottom: 20,
                textAlign: 'center',
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 11,
                color: '#8B9B8B',
                marginBottom: 8,
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(216, 178, 106, 0.2)',
                  borderRadius: 10,
                  color: '#E8F0E8',
                  fontSize: 13,
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block',
                fontSize: 11,
                color: '#8B9B8B',
                marginBottom: 8,
              }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(216, 178, 106, 0.2)',
                  borderRadius: 10,
                  color: '#E8F0E8',
                  fontSize: 13,
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: isLoading
                  ? 'rgba(216, 178, 106, 0.3)'
                  : 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)',
                border: 'none',
                borderRadius: 10,
                color: '#1A1A1A',
                fontSize: 13,
                fontWeight: 600,
                cursor: isLoading ? 'wait' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {isLoading ? '⏳ Connexion...' : 'Se connecter →'}
            </button>

            <div style={{
              marginTop: 20,
              textAlign: 'center',
            }}>
              <a
                href="#"
                style={{
                  fontSize: 11,
                  color: '#8B9B8B',
                  textDecoration: 'none',
                }}
              >
                Mot de passe oublié?
              </a>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: 32,
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 10, color: '#6B7B6B' }}>
            Nouveau sur CHE·NU?{' '}
            <a href="#" style={{ color: '#D8B26A', textDecoration: 'none' }}>
              Créer un compte
            </a>
          </p>
          <p style={{ fontSize: 9, color: '#4B5B4B', marginTop: 16 }}>
            © 2024 CHE·NU by Pro-Service Construction
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
