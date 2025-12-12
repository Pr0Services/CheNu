/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ 3D - UI COMPONENTS
 * Composants d'interface utilisateur overlay
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { useWorld3DStore, SpaceId } from '../../stores/world3DStore';
import { SPACES_CONFIG, TOKENS } from '../../config/spacesConfig';

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const styles = {
  panel: {
    position: 'fixed' as const,
    right: 0,
    top: 64,
    width: 400,
    height: 'calc(100vh - 64px)',
    background: 'rgba(26, 26, 26, 0.98)',
    backdropFilter: 'blur(30px)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 150,
    overflowY: 'auto' as const,
    padding: 32
  },
  closeBtn: {
    position: 'absolute' as const,
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    border: 'none',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '50%',
    color: TOKENS.colors.softSand,
    fontSize: 24,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontFamily: "'Lora', serif",
    fontSize: 28,
    fontWeight: 700,
    color: TOKENS.colors.softSand,
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: TOKENS.colors.ancientStone
  },
  description: {
    fontSize: 15,
    lineHeight: 1.7,
    color: 'rgba(233, 228, 214, 0.8)',
    margin: '24px 0'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    marginBottom: 8
  },
  enterBtn: {
    width: '100%',
    padding: '18px 24px',
    border: 'none',
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 32
  },
  indicators: {
    position: 'fixed' as const,
    bottom: 32,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 8,
    padding: '12px 16px',
    background: 'rgba(26, 26, 26, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: 40,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    zIndex: 100
  },
  indicator: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    transition: 'all 0.3s ease'
  },
  novaBtn: {
    position: 'fixed' as const,
    bottom: 32,
    right: 32,
    width: 64,
    height: 64,
    background: `linear-gradient(135deg, ${TOKENS.colors.sacredGold}, ${TOKENS.colors.cenoteTurquoise})`,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 8px 32px rgba(216, 178, 106, 0.3)`,
    zIndex: 200,
    fontSize: 28
  },
  controlsHint: {
    position: 'fixed' as const,
    bottom: 32,
    left: 32,
    background: 'rgba(26, 26, 26, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '16px 20px',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    zIndex: 100
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SPACE PANEL
// ─────────────────────────────────────────────────────────────────────────────

interface SpacePanelProps {
  isOpen: boolean;
  spaceId: SpaceId | null;
  onClose: () => void;
  onEnter: () => void;
}

export function SpacePanel({ isOpen, spaceId, onClose, onEnter }: SpacePanelProps) {
  if (!spaceId) return null;
  
  const config = SPACES_CONFIG[spaceId];
  
  return (
    <div style={{
      ...styles.panel,
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)'
    }}>
      <button style={styles.closeBtn} onClick={onClose}>×</button>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24 }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: `${config.colorHex}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40
        }}>
          {config.icon}
        </div>
        <div>
          <div style={styles.title}>{config.name}</div>
          <div style={styles.subtitle}>{config.subtitle}</div>
        </div>
      </div>
      
      {/* Description */}
      <div style={styles.description}>{config.description}</div>
      
      {/* Features */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 1,
          color: TOKENS.colors.sacredGold,
          marginBottom: 16
        }}>
          Fonctionnalités
        </div>
        {config.features.map((feature, i) => (
          <div key={i} style={styles.featureItem}>
            <span style={{ fontSize: 20 }}>{feature.icon}</span>
            <span style={{ fontSize: 14, color: TOKENS.colors.softSand }}>{feature.text}</span>
          </div>
        ))}
      </div>
      
      {/* Stats */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 1,
          color: TOKENS.colors.sacredGold,
          marginBottom: 16
        }}>
          Statistiques
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {Object.entries(config.stats).map(([key, value]) => (
            <div key={key} style={{
              textAlign: 'center',
              padding: 16,
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 12
            }}>
              <div style={{
                fontFamily: "'Lora', serif",
                fontSize: 24,
                fontWeight: 700,
                color: TOKENS.colors.sacredGold
              }}>
                {value}
              </div>
              <div style={{ fontSize: 11, color: TOKENS.colors.ancientStone, marginTop: 4 }}>
                {key}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Enter Button */}
      <button 
        style={{
          ...styles.enterBtn,
          background: config.colorHex,
          color: '#1A1A1A'
        }}
        onClick={onEnter}
      >
        <span>Entrer dans l'espace</span>
        <span>→</span>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPACE INDICATORS
// ─────────────────────────────────────────────────────────────────────────────

export function SpaceIndicators() {
  const { selectedSpace, focusOnSpace } = useWorld3DStore();
  
  return (
    <div style={styles.indicators}>
      {Object.values(SPACES_CONFIG).map((space) => (
        <button
          key={space.id}
          style={{
            ...styles.indicator,
            borderColor: selectedSpace === space.id ? space.colorHex : 'transparent',
            background: selectedSpace === space.id 
              ? `${space.colorHex}25` 
              : 'rgba(255, 255, 255, 0.05)'
          }}
          onClick={() => focusOnSpace(space.id)}
          title={space.name}
        >
          {space.icon}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NOVA BUTTON
// ─────────────────────────────────────────────────────────────────────────────

export function NovaButton() {
  const { toggleNova } = useWorld3DStore();
  
  return (
    <button style={styles.novaBtn} onClick={toggleNova} title="Nova AI">
      🤖
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLS HINT
// ─────────────────────────────────────────────────────────────────────────────

export function ControlsHint() {
  return (
    <div style={styles.controlsHint}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: TOKENS.colors.sacredGold,
        marginBottom: 10
      }}>
        Contrôles
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { key: 'Glisser', action: 'Rotation' },
          { key: 'Scroll', action: 'Zoom' },
          { key: 'Clic', action: 'Sélection' },
          { key: '2×Clic', action: 'Focus' }
        ].map(({ key, action }) => (
          <div key={key} style={{ 
            fontSize: 13, 
            color: TOKENS.colors.ancientStone,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '3px 8px',
              borderRadius: 4,
              fontSize: 11,
              color: TOKENS.colors.softSand
            }}>
              {key}
            </span>
            {action}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────────────────────────────────────

interface HeaderProps {
  onResetView: () => void;
  onDashboard?: () => void;
}

export function Header({ onResetView, onDashboard }: HeaderProps) {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 64,
      background: 'rgba(26, 26, 26, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{
          fontFamily: "'Lora', serif",
          fontSize: 24,
          fontWeight: 700,
          color: TOKENS.colors.sacredGold
        }}>
          CHE<span style={{ color: TOKENS.colors.softSand }}>·</span>NU
        </div>
        <div style={{ fontSize: 14, color: TOKENS.colors.ancientStone }}>
          Votre univers unifié
        </div>
      </div>
      
      <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onResetView}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            border: `1px solid rgba(216, 178, 106, 0.3)`,
            borderRadius: 8,
            color: TOKENS.colors.sacredGold,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          🔄 Vue initiale
        </button>
        {onDashboard && (
          <button
            onClick={onDashboard}
            style={{
              padding: '10px 20px',
              background: TOKENS.colors.sacredGold,
              border: `1px solid ${TOKENS.colors.sacredGold}`,
              borderRadius: 8,
              color: TOKENS.colors.darkSlate,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            📊 Dashboard
          </button>
        )}
      </nav>
    </header>
  );
}
