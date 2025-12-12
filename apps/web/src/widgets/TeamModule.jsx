/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — TEAM MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 * Module Équipe complet:
 * - Liste des employés avec profils
 * - Planning et disponibilités
 * - Suivi des compétences CCQ
 * - Formations CNESST
 * - Performance et heures
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';

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
    purple: '#8b5cf6',
    pink: '#ec4899',
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
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const mockEmployees = [
  {
    id: 'emp-001',
    name: 'Jean-Pierre Tremblay',
    role: 'Contremaître',
    email: 'jp.tremblay@chenu.ca',
    phone: '514-555-0101',
    avatar: '👷',
    status: 'active',
    ccqNumber: 'CCQ-123456',
    ccqTrade: 'Charpentier-menuisier',
    ccqExpiry: '2025-06-30',
    hourlyRate: 42,
    hoursThisWeek: 38,
    hoursThisMonth: 156,
    projects: ['Rénovation Tremblay', 'Bergeron'],
    certifications: [
      { name: 'SST', expiry: '2025-03-15', status: 'valid' },
      { name: 'Travail en hauteur', expiry: '2024-12-20', status: 'expiring' },
      { name: 'SIMDUT', expiry: '2025-08-10', status: 'valid' },
    ],
    performance: 92,
  },
  {
    id: 'emp-002',
    name: 'Marie-Claude Gagnon',
    role: 'Électricienne',
    email: 'mc.gagnon@chenu.ca',
    phone: '514-555-0102',
    avatar: '👩‍🔧',
    status: 'active',
    ccqNumber: 'CCQ-234567',
    ccqTrade: 'Électricien',
    ccqExpiry: '2025-09-15',
    hourlyRate: 45,
    hoursThisWeek: 40,
    hoursThisMonth: 168,
    projects: ['ABC Industriel'],
    certifications: [
      { name: 'SST', expiry: '2025-05-20', status: 'valid' },
      { name: 'Licence C', expiry: '2026-01-15', status: 'valid' },
    ],
    performance: 95,
  },
  {
    id: 'emp-003',
    name: 'Pierre Lavoie',
    role: 'Plombier',
    email: 'p.lavoie@chenu.ca',
    phone: '514-555-0103',
    avatar: '🔧',
    status: 'active',
    ccqNumber: 'CCQ-345678',
    ccqTrade: 'Plombier',
    ccqExpiry: '2025-04-20',
    hourlyRate: 44,
    hoursThisWeek: 35,
    hoursThisMonth: 142,
    projects: ['Rénovation Tremblay', 'Condo St-Denis'],
    certifications: [
      { name: 'SST', expiry: '2024-11-30', status: 'expired' },
      { name: 'Gaz naturel', expiry: '2025-07-10', status: 'valid' },
    ],
    performance: 88,
  },
  {
    id: 'emp-004',
    name: 'Sophie Dubois',
    role: 'Gestionnaire de projet',
    email: 's.dubois@chenu.ca',
    phone: '514-555-0104',
    avatar: '👩‍💼',
    status: 'active',
    ccqNumber: null,
    ccqTrade: null,
    ccqExpiry: null,
    hourlyRate: 55,
    hoursThisWeek: 42,
    hoursThisMonth: 175,
    projects: ['ABC Industriel', 'Bergeron', 'Condo St-Denis'],
    certifications: [
      { name: 'PMP', expiry: '2026-02-28', status: 'valid' },
      { name: 'SST', expiry: '2025-04-15', status: 'valid' },
    ],
    performance: 97,
  },
  {
    id: 'emp-005',
    name: 'Michel Bouchard',
    role: 'Manœuvre',
    email: 'm.bouchard@chenu.ca',
    phone: '514-555-0105',
    avatar: '👨‍🔧',
    status: 'vacation',
    ccqNumber: 'CCQ-456789',
    ccqTrade: 'Manœuvre',
    ccqExpiry: '2025-12-31',
    hourlyRate: 28,
    hoursThisWeek: 0,
    hoursThisMonth: 120,
    projects: [],
    certifications: [
      { name: 'SST', expiry: '2025-06-30', status: 'valid' },
      { name: 'Chariot élévateur', expiry: '2025-03-01', status: 'expiring' },
    ],
    performance: 85,
  },
  {
    id: 'emp-006',
    name: 'Luc Bergeron',
    role: 'Apprenti menuisier',
    email: 'l.bergeron@chenu.ca',
    phone: '514-555-0106',
    avatar: '🧑‍🔧',
    status: 'active',
    ccqNumber: 'CCQ-567890',
    ccqTrade: 'Charpentier-menuisier (apprenti)',
    ccqExpiry: '2025-08-15',
    hourlyRate: 24,
    hoursThisWeek: 40,
    hoursThisMonth: 160,
    projects: ['Rénovation Tremblay'],
    certifications: [
      { name: 'SST', expiry: '2025-09-20', status: 'valid' },
    ],
    performance: 82,
  },
];

const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const mockSchedule = {
  'emp-001': ['Tremblay', 'Tremblay', 'Tremblay', 'Bergeron', 'Bergeron', null, null],
  'emp-002': ['ABC', 'ABC', 'ABC', 'ABC', 'ABC', null, null],
  'emp-003': ['Tremblay', 'Tremblay', 'St-Denis', 'St-Denis', 'Tremblay', null, null],
  'emp-004': ['Bureau', 'ABC', 'Bergeron', 'St-Denis', 'Bureau', null, null],
  'emp-005': ['Vacances', 'Vacances', 'Vacances', 'Vacances', 'Vacances', null, null],
  'emp-006': ['Tremblay', 'Tremblay', 'Tremblay', 'Tremblay', 'Tremblay', null, null],
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const styles = {
  container: {
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.bg.primary,
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: tokens.colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.colors.text.secondary,
    marginTop: 4,
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
  tabs: {
    display: 'flex',
    gap: tokens.spacing.xs,
    marginBottom: tokens.spacing.lg,
    borderBottom: `1px solid ${tokens.colors.border}`,
    paddingBottom: tokens.spacing.md,
  },
  tab: {
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 500,
    borderRadius: `${tokens.radius.md}px ${tokens.radius.md}px 0 0`,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  statCard: {
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    border: `1px solid ${tokens.colors.border}`,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: tokens.spacing.md,
  },
  employeeCard: {
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.xl,
    border: `1px solid ${tokens.colors.border}`,
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHeader: {
    padding: tokens.spacing.lg,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
    borderBottom: `1px solid ${tokens.colors.border}`,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.lg,
    backgroundColor: tokens.colors.bg.tertiary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 600,
    color: tokens.colors.text.primary,
    marginBottom: 2,
  },
  employeeRole: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: tokens.radius.full,
    fontSize: 11,
    fontWeight: 500,
  },
  cardBody: {
    padding: tokens.spacing.md,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: `1px solid ${tokens.colors.border}`,
    fontSize: 13,
  },
  infoLabel: {
    color: tokens.colors.text.muted,
  },
  infoValue: {
    color: tokens.colors.text.primary,
    fontWeight: 500,
  },
  certList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacing.xs,
    marginTop: tokens.spacing.sm,
  },
  certBadge: {
    padding: '4px 8px',
    borderRadius: tokens.radius.sm,
    fontSize: 11,
    fontWeight: 500,
  },
  progressBar: {
    height: 8,
    backgroundColor: tokens.colors.bg.tertiary,
    borderRadius: tokens.radius.full,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: tokens.radius.full,
    transition: 'width 0.5s ease',
  },
  cardFooter: {
    padding: tokens.spacing.md,
    borderTop: `1px solid ${tokens.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: tokens.colors.bg.secondary,
  },
  // Schedule
  scheduleTable: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
  },
  scheduleTh: {
    padding: '12px 8px',
    fontSize: 12,
    fontWeight: 600,
    color: tokens.colors.text.secondary,
    textAlign: 'center',
    backgroundColor: tokens.colors.bg.secondary,
    borderBottom: `1px solid ${tokens.colors.border}`,
  },
  scheduleTd: {
    padding: '12px 8px',
    fontSize: 13,
    textAlign: 'center',
    borderBottom: `1px solid ${tokens.colors.border}`,
  },
  scheduleCell: {
    padding: '6px 10px',
    borderRadius: tokens.radius.sm,
    fontSize: 11,
    fontWeight: 500,
  },
  // Training alerts
  alertCard: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.md,
    border: `1px solid ${tokens.colors.border}`,
    marginBottom: tokens.spacing.sm,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },
  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: tokens.radius.xl,
    width: '100%',
    maxWidth: 600,
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    padding: tokens.spacing.lg,
    borderBottom: `1px solid ${tokens.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: tokens.colors.text.primary,
  },
  modalBody: {
    padding: tokens.spacing.lg,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return tokens.colors.success;
    case 'vacation': return tokens.colors.info;
    case 'sick': return tokens.colors.warning;
    case 'inactive': return tokens.colors.text.muted;
    default: return tokens.colors.text.muted;
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'active': return 'Actif';
    case 'vacation': return 'Vacances';
    case 'sick': return 'Maladie';
    case 'inactive': return 'Inactif';
    default: return status;
  }
};

const getCertColor = (status) => {
  switch (status) {
    case 'valid': return tokens.colors.success;
    case 'expiring': return tokens.colors.warning;
    case 'expired': return tokens.colors.error;
    default: return tokens.colors.text.muted;
  }
};

const getPerformanceColor = (score) => {
  if (score >= 90) return tokens.colors.success;
  if (score >= 75) return tokens.colors.warning;
  return tokens.colors.error;
};

const getProjectColor = (project) => {
  const colors = [tokens.colors.primary, tokens.colors.info, tokens.colors.accent, tokens.colors.purple, tokens.colors.pink];
  const hash = project?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
  return colors[hash % colors.length];
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const EmployeeCard = ({ employee, onView }) => {
  const statusColor = getStatusColor(employee.status);
  const performanceColor = getPerformanceColor(employee.performance);
  
  return (
    <div
      style={styles.employeeCard}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={styles.cardHeader}>
        <div style={styles.avatar}>{employee.avatar}</div>
        <div style={styles.employeeInfo}>
          <div style={styles.employeeName}>{employee.name}</div>
          <div style={styles.employeeRole}>{employee.role}</div>
        </div>
        <span
          style={{
            ...styles.statusBadge,
            backgroundColor: `${statusColor}20`,
            color: statusColor,
          }}
        >
          {getStatusLabel(employee.status)}
        </span>
      </div>
      
      <div style={styles.cardBody}>
        {employee.ccqTrade && (
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>🏗️ Métier CCQ</span>
            <span style={styles.infoValue}>{employee.ccqTrade}</span>
          </div>
        )}
        
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>⏱️ Cette semaine</span>
          <span style={styles.infoValue}>{employee.hoursThisWeek}h</span>
        </div>
        
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>📅 Ce mois</span>
          <span style={styles.infoValue}>{employee.hoursThisMonth}h</span>
        </div>
        
        <div style={{ marginTop: tokens.spacing.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: tokens.colors.text.muted }}>Performance</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: performanceColor }}>
              {employee.performance}%
            </span>
          </div>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${employee.performance}%`,
                backgroundColor: performanceColor,
              }}
            />
          </div>
        </div>
        
        <div style={{ marginTop: tokens.spacing.md }}>
          <span style={{ fontSize: 12, color: tokens.colors.text.muted }}>Certifications</span>
          <div style={styles.certList}>
            {employee.certifications.map((cert, i) => (
              <span
                key={i}
                style={{
                  ...styles.certBadge,
                  backgroundColor: `${getCertColor(cert.status)}20`,
                  color: getCertColor(cert.status),
                }}
              >
                {cert.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div style={styles.cardFooter}>
        <button
          onClick={() => onView(employee)}
          style={{
            ...styles.button,
            padding: '6px 12px',
            fontSize: 12,
            backgroundColor: tokens.colors.bg.tertiary,
            color: tokens.colors.text.secondary,
          }}
        >
          👁️ Profil
        </button>
        <button
          style={{
            ...styles.button,
            padding: '6px 12px',
            fontSize: 12,
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.bg.primary,
          }}
        >
          📅 Planning
        </button>
      </div>
    </div>
  );
};

const ScheduleView = ({ employees }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.scheduleTable}>
        <thead>
          <tr>
            <th style={{ ...styles.scheduleTh, textAlign: 'left', paddingLeft: 16 }}>Employé</th>
            {weekDays.map(day => (
              <th key={day} style={styles.scheduleTh}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td style={{ ...styles.scheduleTd, textAlign: 'left', paddingLeft: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{emp.avatar}</span>
                  <div>
                    <div style={{ fontWeight: 500, color: tokens.colors.text.primary }}>{emp.name}</div>
                    <div style={{ fontSize: 11, color: tokens.colors.text.muted }}>{emp.role}</div>
                  </div>
                </div>
              </td>
              {mockSchedule[emp.id]?.map((project, i) => (
                <td key={i} style={styles.scheduleTd}>
                  {project ? (
                    <span
                      style={{
                        ...styles.scheduleCell,
                        backgroundColor: project === 'Vacances' 
                          ? `${tokens.colors.info}20`
                          : project === 'Bureau'
                            ? `${tokens.colors.text.muted}20`
                            : `${getProjectColor(project)}20`,
                        color: project === 'Vacances'
                          ? tokens.colors.info
                          : project === 'Bureau'
                            ? tokens.colors.text.secondary
                            : getProjectColor(project),
                      }}
                    >
                      {project}
                    </span>
                  ) : (
                    <span style={{ color: tokens.colors.text.muted }}>—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TrainingAlerts = ({ employees }) => {
  const alerts = useMemo(() => {
    const result = [];
    employees.forEach(emp => {
      emp.certifications.forEach(cert => {
        if (cert.status === 'expired' || cert.status === 'expiring') {
          result.push({
            employee: emp.name,
            avatar: emp.avatar,
            certification: cert.name,
            expiry: cert.expiry,
            status: cert.status,
          });
        }
      });
    });
    return result.sort((a, b) => new Date(a.expiry) - new Date(b.expiry));
  }, [employees]);
  
  if (alerts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: tokens.spacing.xl, color: tokens.colors.text.muted }}>
        ✅ Toutes les formations sont à jour!
      </div>
    );
  }
  
  return (
    <div>
      {alerts.map((alert, i) => (
        <div key={i} style={styles.alertCard}>
          <div
            style={{
              ...styles.alertIcon,
              backgroundColor: `${getCertColor(alert.status)}20`,
            }}
          >
            {alert.status === 'expired' ? '🚨' : '⚠️'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, color: tokens.colors.text.primary }}>
              {alert.avatar} {alert.employee}
            </div>
            <div style={{ fontSize: 13, color: tokens.colors.text.secondary }}>
              {alert.certification} — {alert.status === 'expired' ? 'Expirée' : 'Expire le'} {alert.expiry}
            </div>
          </div>
          <button
            style={{
              ...styles.button,
              padding: '6px 12px',
              fontSize: 12,
              backgroundColor: tokens.colors.warning,
              color: '#fff',
            }}
          >
            Planifier
          </button>
        </div>
      ))}
    </div>
  );
};

const EmployeeModal = ({ employee, onClose }) => {
  if (!employee) return null;
  
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md }}>
            <span style={{ fontSize: 40 }}>{employee.avatar}</span>
            <div>
              <div style={styles.modalTitle}>{employee.name}</div>
              <div style={{ color: tokens.colors.text.secondary }}>{employee.role}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              ...styles.button,
              backgroundColor: 'transparent',
              color: tokens.colors.text.muted,
              padding: tokens.spacing.sm,
            }}
          >
            ✕
          </button>
        </div>
        
        <div style={styles.modalBody}>
          {/* Contact */}
          <div style={{ marginBottom: tokens.spacing.lg }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: tokens.colors.text.primary, marginBottom: tokens.spacing.sm }}>
              📞 Contact
            </h4>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Email</span>
              <span style={styles.infoValue}>{employee.email}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Téléphone</span>
              <span style={styles.infoValue}>{employee.phone}</span>
            </div>
          </div>
          
          {/* CCQ */}
          {employee.ccqNumber && (
            <div style={{ marginBottom: tokens.spacing.lg }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: tokens.colors.text.primary, marginBottom: tokens.spacing.sm }}>
                🏗️ CCQ
              </h4>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Numéro</span>
                <span style={styles.infoValue}>{employee.ccqNumber}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Métier</span>
                <span style={styles.infoValue}>{employee.ccqTrade}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Expiration</span>
                <span style={styles.infoValue}>{employee.ccqExpiry}</span>
              </div>
            </div>
          )}
          
          {/* Hours */}
          <div style={{ marginBottom: tokens.spacing.lg }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: tokens.colors.text.primary, marginBottom: tokens.spacing.sm }}>
              ⏱️ Heures
            </h4>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Taux horaire</span>
              <span style={styles.infoValue}>{employee.hourlyRate}$/h</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Cette semaine</span>
              <span style={styles.infoValue}>{employee.hoursThisWeek}h</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Ce mois</span>
              <span style={styles.infoValue}>{employee.hoursThisMonth}h</span>
            </div>
          </div>
          
          {/* Certifications */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: tokens.colors.text.primary, marginBottom: tokens.spacing.sm }}>
              📋 Certifications
            </h4>
            {employee.certifications.map((cert, i) => (
              <div key={i} style={{ ...styles.infoRow, alignItems: 'center' }}>
                <span style={styles.infoLabel}>{cert.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={styles.infoValue}>{cert.expiry}</span>
                  <span
                    style={{
                      ...styles.certBadge,
                      backgroundColor: `${getCertColor(cert.status)}20`,
                      color: getCertColor(cert.status),
                    }}
                  >
                    {cert.status === 'valid' ? '✓' : cert.status === 'expiring' ? '⚠️' : '✗'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const TeamModule = () => {
  const [activeTab, setActiveTab] = useState('team');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const tabs = [
    { id: 'team', label: 'Équipe', icon: '👥' },
    { id: 'schedule', label: 'Planning', icon: '📅' },
    { id: 'training', label: 'Formations', icon: '📋' },
    { id: 'performance', label: 'Performance', icon: '📈' },
  ];
  
  const stats = useMemo(() => ({
    total: mockEmployees.length,
    active: mockEmployees.filter(e => e.status === 'active').length,
    hoursWeek: mockEmployees.reduce((sum, e) => sum + e.hoursThisWeek, 0),
    avgPerformance: Math.round(mockEmployees.reduce((sum, e) => sum + e.performance, 0) / mockEmployees.length),
  }), []);
  
  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return mockEmployees;
    const query = searchQuery.toLowerCase();
    return mockEmployees.filter(e => 
      e.name.toLowerCase().includes(query) ||
      e.role.toLowerCase().includes(query)
    );
  }, [searchQuery]);
  
  const expiringCerts = useMemo(() => {
    return mockEmployees.reduce((count, emp) => {
      return count + emp.certifications.filter(c => c.status !== 'valid').length;
    }, 0);
  }, []);
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👥 Équipe</h1>
          <p style={styles.subtitle}>Gérez vos employés, plannings et formations</p>
        </div>
        <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
          <input
            type="text"
            placeholder="🔍 Rechercher..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: '10px 16px',
              fontSize: 14,
              backgroundColor: tokens.colors.bg.tertiary,
              border: `1px solid ${tokens.colors.border}`,
              borderRadius: tokens.radius.md,
              color: tokens.colors.text.primary,
              outline: 'none',
              width: 200,
            }}
          />
          <button
            style={{
              ...styles.button,
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.bg.primary,
            }}
          >
            + Nouvel employé
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: tokens.colors.text.primary }}>{stats.total}</div>
          <div style={styles.statLabel}>Employés</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: tokens.colors.success }}>{stats.active}</div>
          <div style={styles.statLabel}>Actifs</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: tokens.colors.info }}>{stats.hoursWeek}h</div>
          <div style={styles.statLabel}>Heures cette semaine</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: tokens.colors.primary }}>{stats.avgPerformance}%</div>
          <div style={styles.statLabel}>Performance moyenne</div>
        </div>
      </div>
      
      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tab,
              backgroundColor: activeTab === tab.id ? tokens.colors.primary : tokens.colors.bg.tertiary,
              color: activeTab === tab.id ? tokens.colors.bg.primary : tokens.colors.text.secondary,
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {tab.id === 'training' && expiringCerts > 0 && (
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: tokens.radius.full,
                  fontSize: 11,
                  backgroundColor: tokens.colors.error,
                  color: '#fff',
                }}
              >
                {expiringCerts}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Content */}
      {activeTab === 'team' && (
        <div style={styles.grid}>
          {filteredEmployees.map(employee => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onView={setSelectedEmployee}
            />
          ))}
        </div>
      )}
      
      {activeTab === 'schedule' && (
        <ScheduleView employees={mockEmployees} />
      )}
      
      {activeTab === 'training' && (
        <div style={{ maxWidth: 800 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: tokens.colors.text.primary, marginBottom: tokens.spacing.md }}>
            ⚠️ Formations à renouveler
          </h3>
          <TrainingAlerts employees={mockEmployees} />
        </div>
      )}
      
      {activeTab === 'performance' && (
        <div style={styles.grid}>
          {[...mockEmployees]
            .sort((a, b) => b.performance - a.performance)
            .map((emp, i) => (
              <div
                key={emp.id}
                style={{
                  ...styles.statCard,
                  display: 'flex',
                  alignItems: 'center',
                  gap: tokens.spacing.md,
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 24, fontWeight: 700, color: tokens.colors.text.muted, width: 32 }}>
                  #{i + 1}
                </span>
                <span style={{ fontSize: 32 }}>{emp.avatar}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: tokens.colors.text.primary }}>{emp.name}</div>
                  <div style={{ fontSize: 12, color: tokens.colors.text.muted }}>{emp.role}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: getPerformanceColor(emp.performance) }}>
                    {emp.performance}%
                  </div>
                  <div style={{ fontSize: 11, color: tokens.colors.text.muted }}>{emp.hoursThisMonth}h ce mois</div>
                </div>
              </div>
            ))}
        </div>
      )}
      
      {/* Employee Modal */}
      {selectedEmployee && (
        <EmployeeModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};

export default TeamModule;
