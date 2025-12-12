/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — PROJECT PREDICTOR COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════════
 * Composant de prédiction IA pour les projets:
 * - Score de santé avec visualisation
 * - Prédiction de délais et budget
 * - Facteurs de risque
 * - Recommandations actionnables
 * - Timeline prédictive
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TOKENS
// ─────────────────────────────────────────────────────────────────────────────

const tokens = {
  colors: {
    primary: '#d4a855',
    secondary: '#5a9a6e',
    accent: '#5bb5a6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    bg: {
      primary: '#0f1419',
      secondary: '#1a1f2e',
      tertiary: '#252b3b',
      card: 'rgba(26, 31, 46, 0.95)',
    },
    text: {
      primary: '#f5f5f5',
      secondary: '#a0a0a0',
      muted: '#6b7280',
    },
    border: 'rgba(212, 168, 85, 0.2)',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const styles = {
  container: {
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.xl,
    border: `1px solid ${tokens.colors.border}`,
    overflow: 'hidden',
  },
  header: {
    padding: tokens.spacing.lg,
    borderBottom: `1px solid ${tokens.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: tokens.colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  badge: {
    padding: '4px 12px',
    borderRadius: tokens.radius.full,
    fontSize: 12,
    fontWeight: 500,
  },
  body: {
    padding: tokens.spacing.lg,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  scoreSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.bg.tertiary,
    borderRadius: tokens.radius.lg,
  },
  scoreRing: {
    position: 'relative',
    marginBottom: tokens.spacing.md,
  },
  scoreLabel: {
    fontSize: 12,
    color: tokens.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  metricCard: {
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.bg.tertiary,
    borderRadius: tokens.radius.md,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: tokens.colors.text.muted,
  },
  section: {
    marginBottom: tokens.spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  factorList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.sm,
  },
  factorItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: tokens.radius.md,
    borderLeft: '3px solid',
  },
  factorIcon: {
    width: 32,
    height: 32,
    borderRadius: tokens.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
  },
  factorContent: {
    flex: 1,
  },
  factorTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: tokens.colors.text.primary,
    marginBottom: 2,
  },
  factorDesc: {
    fontSize: 12,
    color: tokens.colors.text.secondary,
  },
  recommendation: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacing.md,
    padding: tokens.spacing.md,
    backgroundColor: 'rgba(212, 168, 85, 0.1)',
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.sm,
    border: `1px solid ${tokens.colors.border}`,
  },
  recommendationIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 14,
    color: tokens.colors.text.primary,
    lineHeight: 1.5,
  },
  timeline: {
    display: 'flex',
    alignItems: 'center',
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.bg.tertiary,
    borderRadius: tokens.radius.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  timelineTrack: {
    flex: 1,
    height: 8,
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: tokens.radius.sm,
    position: 'relative',
    margin: '0 16px',
  },
  timelineProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    borderRadius: tokens.radius.sm,
    transition: 'width 0.5s ease',
  },
  timelineMarker: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: '3px solid',
    backgroundColor: tokens.colors.bg.primary,
  },
  timelineLabel: {
    textAlign: 'center',
    minWidth: 80,
  },
  timelineDate: {
    fontSize: 14,
    fontWeight: 600,
    color: tokens.colors.text.primary,
  },
  timelineText: {
    fontSize: 11,
    color: tokens.colors.text.muted,
  },
  confidenceMeter: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    padding: tokens.spacing.sm,
    backgroundColor: tokens.colors.bg.tertiary,
    borderRadius: tokens.radius.sm,
    marginTop: tokens.spacing.md,
  },
  confidenceBar: {
    flex: 1,
    height: 6,
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: tokens.radius.sm,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: tokens.radius.sm,
    transition: 'width 0.5s ease',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 500,
    borderRadius: tokens.radius.md,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  footer: {
    padding: tokens.spacing.md,
    borderTop: `1px solid ${tokens.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: tokens.colors.bg.secondary,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const getRiskColor = (level) => {
  switch (level) {
    case 'low': return tokens.colors.success;
    case 'medium': return tokens.colors.warning;
    case 'high': return tokens.colors.error;
    case 'critical': return '#dc2626';
    default: return tokens.colors.text.muted;
  }
};

const getRiskLabel = (level) => {
  switch (level) {
    case 'low': return 'Faible';
    case 'medium': return 'Modéré';
    case 'high': return 'Élevé';
    case 'critical': return 'Critique';
    default: return level;
  }
};

const getConfidenceLabel = (confidence) => {
  if (confidence >= 80) return 'Haute';
  if (confidence >= 60) return 'Moyenne';
  return 'Basse';
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-CA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// SCORE RING COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const ScoreRing = ({ score, size = 120, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  
  const getScoreColor = (score) => {
    if (score >= 80) return tokens.colors.success;
    if (score >= 60) return tokens.colors.warning;
    if (score >= 40) return tokens.colors.error;
    return '#dc2626';
  };
  
  const color = getScoreColor(score);
  
  return (
    <svg width={size} height={size}>
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={tokens.colors.bg.secondary}
        strokeWidth={strokeWidth}
      />
      
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      
      {/* Score text */}
      <text
        x={size / 2}
        y={size / 2 - 8}
        textAnchor="middle"
        fontSize={size / 3.5}
        fontWeight="700"
        fill={tokens.colors.text.primary}
      >
        {score}
      </text>
      <text
        x={size / 2}
        y={size / 2 + 16}
        textAnchor="middle"
        fontSize={12}
        fill={tokens.colors.text.muted}
      >
        / 100
      </text>
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const mockPrediction = {
  project_id: 'proj-123',
  project_name: 'Rénovation Tremblay',
  predicted_completion: '2025-03-05',
  original_deadline: '2025-02-28',
  delay_days: 5,
  delay_probability: 72.5,
  predicted_final_cost: 92500,
  original_budget: 85000,
  cost_variance: 7500,
  cost_variance_percent: 8.8,
  overrun_probability: 65,
  health_score: 72,
  risk_level: 'medium',
  risk_factors: [
    {
      factor: 'Retard de livraison matériaux',
      impact: '3 jours',
      severity: 'high',
      recommendation: 'Relancer le fournisseur XYZ',
    },
    {
      factor: 'Météo défavorable prévue',
      impact: '2 jours',
      severity: 'medium',
      recommendation: 'Prioriser travaux intérieurs',
    },
    {
      factor: '2 tâches critiques en retard',
      impact: 'Chemin critique impacté',
      severity: 'high',
      recommendation: 'Réaffecter ressources',
    },
  ],
  positive_factors: [
    {
      factor: 'Équipe performante',
      impact: '+15% productivité',
      contribution: 'high',
    },
    {
      factor: 'Client réactif',
      impact: 'Décisions rapides',
      contribution: 'medium',
    },
  ],
  confidence: 'medium',
  confidence_score: 78,
  recommendations: [
    '⏰ Retard prévu de 5 jours. Considérez d\'ajouter des ressources ou de revoir les priorités des tâches critiques.',
    '💰 Dépassement budgétaire de 8.8% anticipé. Analysez les postes de dépenses et négociez avec les fournisseurs.',
    '📋 Planifiez une réunion d\'équipe cette semaine pour identifier les blocages.',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const ProjectPredictor = ({ projectId, prediction = mockPrediction }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  
  const riskColor = getRiskColor(prediction.risk_level);
  const progressPercent = ((new Date() - new Date('2024-10-01')) / 
    (new Date(prediction.original_deadline) - new Date('2024-10-01'))) * 100;
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🧠</span>
          Prédiction Nova - {prediction.project_name}
        </div>
        <div
          style={{
            ...styles.badge,
            backgroundColor: `${riskColor}20`,
            color: riskColor,
          }}
        >
          Risque {getRiskLabel(prediction.risk_level)}
        </div>
      </div>
      
      {/* Body */}
      <div style={styles.body}>
        {/* Main Metrics */}
        <div style={styles.grid}>
          {/* Health Score */}
          <div style={styles.scoreSection}>
            <ScoreRing score={prediction.health_score} />
            <div style={styles.scoreLabel}>Score de Santé</div>
          </div>
          
          {/* Delay Prediction */}
          <div style={styles.metricCard}>
            <div style={{ ...styles.metricValue, color: prediction.delay_days > 0 ? tokens.colors.error : tokens.colors.success }}>
              {prediction.delay_days > 0 ? `+${prediction.delay_days}` : '0'} jours
            </div>
            <div style={styles.metricLabel}>Retard prévu</div>
            <div style={{ 
              fontSize: 11, 
              color: tokens.colors.text.muted,
              marginTop: 8 
            }}>
              Probabilité: {prediction.delay_probability}%
            </div>
          </div>
          
          {/* Budget Prediction */}
          <div style={styles.metricCard}>
            <div style={{ ...styles.metricValue, color: prediction.cost_variance > 0 ? tokens.colors.error : tokens.colors.success }}>
              {prediction.cost_variance > 0 ? '+' : ''}{prediction.cost_variance_percent.toFixed(1)}%
            </div>
            <div style={styles.metricLabel}>Écart budget prévu</div>
            <div style={{ 
              fontSize: 11, 
              color: tokens.colors.text.muted,
              marginTop: 8 
            }}>
              {formatCurrency(prediction.predicted_final_cost)} prévu
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>📅</span> Timeline Prédictive
          </div>
          <div style={styles.timeline}>
            <div style={styles.timelineLabel}>
              <div style={styles.timelineDate}>1 Oct</div>
              <div style={styles.timelineText}>Début</div>
            </div>
            
            <div style={styles.timelineTrack}>
              <div
                style={{
                  ...styles.timelineProgress,
                  width: `${Math.min(100, progressPercent)}%`,
                  backgroundColor: tokens.colors.primary,
                }}
              />
              <div
                style={{
                  ...styles.timelineMarker,
                  left: `${Math.min(100, progressPercent)}%`,
                  borderColor: tokens.colors.primary,
                }}
              />
              {prediction.delay_days > 0 && (
                <div
                  style={{
                    ...styles.timelineMarker,
                    left: '100%',
                    borderColor: tokens.colors.error,
                    backgroundColor: tokens.colors.error,
                  }}
                />
              )}
            </div>
            
            <div style={styles.timelineLabel}>
              <div style={{ ...styles.timelineDate, color: prediction.delay_days > 0 ? tokens.colors.error : tokens.colors.text.primary }}>
                {formatDate(prediction.predicted_completion)}
              </div>
              <div style={styles.timelineText}>
                {prediction.delay_days > 0 ? 'Fin prévue' : 'Dans les temps'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Risk Factors */}
        {showDetails && (
          <>
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <span>⚠️</span> Facteurs de Risque
              </div>
              <div style={styles.factorList}>
                {prediction.risk_factors.map((factor, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.factorItem,
                      borderLeftColor: factor.severity === 'high' ? tokens.colors.error : tokens.colors.warning,
                    }}
                  >
                    <div
                      style={{
                        ...styles.factorIcon,
                        backgroundColor: factor.severity === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      }}
                    >
                      {factor.severity === 'high' ? '🔴' : '🟡'}
                    </div>
                    <div style={styles.factorContent}>
                      <div style={styles.factorTitle}>{factor.factor}</div>
                      <div style={styles.factorDesc}>
                        Impact: {factor.impact} • {factor.recommendation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Positive Factors */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <span>✅</span> Points Positifs
              </div>
              <div style={styles.factorList}>
                {prediction.positive_factors.map((factor, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.factorItem,
                      borderLeftColor: tokens.colors.success,
                    }}
                  >
                    <div
                      style={{
                        ...styles.factorIcon,
                        backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      }}
                    >
                      🟢
                    </div>
                    <div style={styles.factorContent}>
                      <div style={styles.factorTitle}>{factor.factor}</div>
                      <div style={styles.factorDesc}>Impact: {factor.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recommendations */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <span>💡</span> Recommandations Nova
              </div>
              {prediction.recommendations.map((rec, i) => (
                <div key={i} style={styles.recommendation}>
                  <span style={styles.recommendationIcon}>→</span>
                  <span style={styles.recommendationText}>{rec}</span>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Confidence Meter */}
        <div style={styles.confidenceMeter}>
          <span style={{ fontSize: 12, color: tokens.colors.text.muted }}>
            Confiance de la prédiction:
          </span>
          <div style={styles.confidenceBar}>
            <div
              style={{
                ...styles.confidenceFill,
                width: `${prediction.confidence_score}%`,
                backgroundColor: prediction.confidence_score >= 80 
                  ? tokens.colors.success 
                  : prediction.confidence_score >= 60 
                    ? tokens.colors.warning 
                    : tokens.colors.error,
              }}
            />
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, color: tokens.colors.text.primary }}>
            {prediction.confidence_score}% ({getConfidenceLabel(prediction.confidence_score)})
          </span>
        </div>
      </div>
      
      {/* Footer */}
      <div style={styles.footer}>
        <span style={{ fontSize: 12, color: tokens.colors.text.muted }}>
          Mis à jour il y a 5 min • Basé sur {prediction.confidence === 'high' ? 'données complètes' : 'données partielles'}
        </span>
        <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              ...styles.button,
              backgroundColor: tokens.colors.bg.tertiary,
              color: tokens.colors.text.secondary,
              padding: '6px 12px',
              fontSize: 12,
            }}
          >
            {showDetails ? 'Réduire' : 'Détails'}
          </button>
          <button
            style={{
              ...styles.button,
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.bg.primary,
              padding: '6px 12px',
              fontSize: 12,
            }}
          >
            📥 Exporter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectPredictor;

// ─────────────────────────────────────────────────────────────────────────────
// MINI PREDICTOR (for dashboard)
// ─────────────────────────────────────────────────────────────────────────────

export const MiniProjectPredictor = ({ prediction = mockPrediction }) => {
  const riskColor = getRiskColor(prediction.risk_level);
  
  return (
    <div style={{
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.bg.card,
      borderRadius: tokens.radius.lg,
      border: `1px solid ${tokens.colors.border}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tokens.spacing.md }}>
        <span style={{ fontWeight: 600, color: tokens.colors.text.primary }}>
          🧠 {prediction.project_name}
        </span>
        <span style={{
          ...styles.badge,
          backgroundColor: `${riskColor}20`,
          color: riskColor,
          fontSize: 10,
          padding: '2px 8px',
        }}>
          {getRiskLabel(prediction.risk_level)}
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: tokens.spacing.lg }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.text.primary }}>
            {prediction.health_score}
          </div>
          <div style={{ fontSize: 10, color: tokens.colors.text.muted }}>Santé</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            color: prediction.delay_days > 0 ? tokens.colors.error : tokens.colors.success 
          }}>
            {prediction.delay_days > 0 ? `+${prediction.delay_days}j` : '✓'}
          </div>
          <div style={{ fontSize: 10, color: tokens.colors.text.muted }}>Délai</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            color: prediction.cost_variance > 0 ? tokens.colors.warning : tokens.colors.success 
          }}>
            {prediction.cost_variance > 0 ? '+' : ''}{prediction.cost_variance_percent.toFixed(0)}%
          </div>
          <div style={{ fontSize: 10, color: tokens.colors.text.muted }}>Budget</div>
        </div>
      </div>
    </div>
  );
};
