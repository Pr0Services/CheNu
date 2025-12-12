/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU - PAGE D'ACCUEIL                                ║
 * ║                                                                              ║
 * ║  Nova en valeur + Accès rapide aux sphères + Interface épurée               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';

interface Sphere {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  stats?: { label: string; value: string }[];
}

const SPHERES: Sphere[] = [
  { id: 'maison', name: 'Maison', icon: '🏠', color: '#4ade80', description: 'Espace personnel', stats: [{ label: 'Projets', value: '3' }, { label: 'Tâches', value: '12' }] },
  { id: 'entreprise', name: 'Entreprise', icon: '🏢', color: '#3b82f6', description: 'Pro-Service Construction', stats: [{ label: 'Projets actifs', value: '8' }, { label: 'Équipe', value: '24' }] },
  { id: 'projets', name: 'Projets', icon: '🏗️', color: '#f59e0b', description: 'Chantiers en cours', stats: [{ label: 'En cours', value: '5' }, { label: 'Terminés', value: '47' }] },
  { id: 'creative', name: 'Studio', icon: '🎨', color: '#ec4899', description: 'Creative Studio', stats: [{ label: 'Designs', value: '15' }] },
  { id: 'gouvernement', name: 'Gouv', icon: '🏛️', color: '#8b5cf6', description: 'Services publics', stats: [{ label: 'Permis', value: '4' }] },
  { id: 'immobilier', name: 'Immo', icon: '🏘️', color: '#06b6d4', description: 'Immobilier', stats: [{ label: 'Propriétés', value: '12' }] },
];

const QUICK_STATS = [
  { icon: '📊', label: 'Projets actifs', value: '8', trend: '+2' },
  { icon: '✅', label: 'Tâches complétées', value: '156', trend: '+12 cette semaine' },
  { icon: '💰', label: 'Revenus MTD', value: '127K$', trend: '+15%' },
  { icon: '👥', label: 'Équipe', value: '24', trend: '3 sur site' },
];

export const HomePage: React.FC = () => {
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  });

  const [novaQuery, setNovaQuery] = useState('');
  const [isNovaFocused, setIsNovaFocused] = useState(false);

  const handleNovaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (novaQuery.trim()) {
      // This will trigger the Nova widget or navigate to Nova
      console.log('Nova query:', novaQuery);
      setNovaQuery('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #0D1210 0%, #121816 50%, #0F1512 100%)',
      color: '#E8F0E8',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '24px',
      overflow: 'auto',
    }}>
      {/* Header with greeting */}
      <header style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, color: '#E8F0E8' }}>
              {greeting}, Jo 👋
            </h1>
            <p style={{ fontSize: 11, color: '#8B9B8B', margin: '4px 0 0 0' }}>
              {new Date().toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{
              padding: '8px 12px',
              background: 'rgba(216, 178, 106, 0.1)',
              border: '1px solid rgba(216, 178, 106, 0.2)',
              borderRadius: 8,
              color: '#D8B26A',
              fontSize: 10,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span>🔔</span>
              <span style={{ background: '#E54D4D', borderRadius: '50%', width: 14, height: 14, fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
            </button>
          </div>
        </div>
      </header>

      {/* Nova AI - Featured Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(216, 178, 106, 0.08) 0%, rgba(63, 114, 73, 0.08) 100%)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        border: '1px solid rgba(216, 178, 106, 0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle glow effect */}
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 150,
          height: 150,
          background: 'radial-gradient(circle, rgba(216, 178, 106, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, position: 'relative' }}>
          {/* Nova Avatar */}
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #D8B26A 0%, #3F7249 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            flexShrink: 0,
            boxShadow: '0 4px 20px rgba(216, 178, 106, 0.3)',
          }}>
            ✨
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Nova</h2>
              <span style={{ fontSize: 9, padding: '2px 6px', background: 'rgba(63, 114, 73, 0.3)', borderRadius: 4, color: '#A8C8A8' }}>IA Assistant</span>
            </div>
            <p style={{ fontSize: 11, color: '#A8B8A8', margin: '0 0 12px 0', lineHeight: 1.5 }}>
              Bonjour Jo! Je suis prête à vous aider avec vos projets. Posez-moi une question ou utilisez les raccourcis ci-dessous.
            </p>

            {/* Nova Search Bar */}
            <form onSubmit={handleNovaSubmit} style={{ marginBottom: 12 }}>
              <div style={{
                display: 'flex',
                gap: 8,
                background: isNovaFocused ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                borderRadius: 10,
                padding: 4,
                border: isNovaFocused ? '1px solid rgba(216, 178, 106, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'all 0.2s ease',
              }}>
                <input
                  type="text"
                  value={novaQuery}
                  onChange={(e) => setNovaQuery(e.target.value)}
                  onFocus={() => setIsNovaFocused(true)}
                  onBlur={() => setIsNovaFocused(false)}
                  placeholder="Demandez n'importe quoi à Nova..."
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    padding: '8px 12px',
                    color: '#E8F0E8',
                    fontSize: 11,
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '8px 14px',
                    background: novaQuery.trim() ? 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)' : 'rgba(216, 178, 106, 0.2)',
                    border: 'none',
                    borderRadius: 8,
                    color: novaQuery.trim() ? '#1A1A1A' : '#6B7B6B',
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: novaQuery.trim() ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Demander →
                </button>
              </div>
            </form>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { icon: '📊', label: 'Créer un devis' },
                { icon: '📋', label: 'Mes tâches' },
                { icon: '⚠️', label: 'Check CNESST' },
                { icon: '🔍', label: 'Vérifier licence RBQ' },
                { icon: '📅', label: 'Planning semaine' },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => setNovaQuery(action.label)}
                  style={{
                    padding: '5px 10px',
                    background: 'rgba(63, 114, 73, 0.15)',
                    border: '1px solid rgba(63, 114, 73, 0.25)',
                    borderRadius: 6,
                    color: '#A8C8A8',
                    fontSize: 9,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {QUICK_STATS.map((stat, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 10,
                padding: 14,
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div style={{ fontSize: 18, marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#E8F0E8' }}>{stat.value}</div>
              <div style={{ fontSize: 9, color: '#8B9B8B' }}>{stat.label}</div>
              <div style={{ fontSize: 8, color: '#4ade80', marginTop: 4 }}>{stat.trend}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Spheres Grid */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0, color: '#C8D8C8' }}>Mes Sphères</h3>
          <button style={{
            padding: '4px 10px',
            background: 'none',
            border: '1px solid rgba(216, 178, 106, 0.2)',
            borderRadius: 6,
            color: '#D8B26A',
            fontSize: 9,
            cursor: 'pointer',
          }}>
            Voir tout →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {SPHERES.map((sphere) => (
            <div
              key={sphere.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 12,
                padding: 14,
                border: '1px solid rgba(255, 255, 255, 0.06)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = `${sphere.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: `${sphere.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}>
                  {sphere.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#E8F0E8' }}>{sphere.name}</div>
                  <div style={{ fontSize: 9, color: '#8B9B8B' }}>{sphere.description}</div>
                </div>
              </div>
              {sphere.stats && (
                <div style={{ display: 'flex', gap: 12 }}>
                  {sphere.stats.map((stat, i) => (
                    <div key={i}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: sphere.color }}>{stat.value}</div>
                      <div style={{ fontSize: 8, color: '#6B7B6B' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#C8D8C8' }}>Activité récente</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: '✅', text: 'Tâche "Inspection fondations" complétée', time: 'Il y a 2h', color: '#4ade80' },
            { icon: '📄', text: 'Devis #2024-089 envoyé à M. Tremblay', time: 'Il y a 4h', color: '#3b82f6' },
            { icon: '⚠️', text: 'Rappel: Renouvellement licence RBQ dans 30 jours', time: 'Hier', color: '#f59e0b' },
            { icon: '👥', text: 'Marc Gagnon assigné au projet Résidence Laval', time: 'Hier', color: '#8b5cf6' },
          ].map((activity, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <span style={{ fontSize: 14 }}>{activity.icon}</span>
              <span style={{ flex: 1, fontSize: 10, color: '#C8D8C8' }}>{activity.text}</span>
              <span style={{ fontSize: 9, color: '#6B7B6B' }}>{activity.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
