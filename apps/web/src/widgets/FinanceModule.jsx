/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — FINANCE MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 * Module Finance complet:
 * - Dashboard financier avec KPIs
 * - Facturation (création, envoi, suivi)
 * - Dépenses avec catégorisation
 * - Prévision trésorerie
 * - Rapports et exports
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
  actions: {
    display: 'flex',
    gap: tokens.spacing.sm,
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
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  kpiCard: {
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    border: `1px solid ${tokens.colors.border}`,
  },
  kpiLabel: {
    fontSize: 13,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.sm,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: 700,
    color: tokens.colors.text.primary,
  },
  kpiChange: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    fontWeight: 500,
    marginTop: tokens.spacing.sm,
    padding: '4px 8px',
    borderRadius: tokens.radius.sm,
  },
  card: {
    backgroundColor: tokens.colors.bg.card,
    borderRadius: tokens.radius.lg,
    border: `1px solid ${tokens.colors.border}`,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: tokens.spacing.lg,
    borderBottom: `1px solid ${tokens.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: tokens.colors.text.primary,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: 12,
    fontWeight: 600,
    color: tokens.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: `1px solid ${tokens.colors.border}`,
    backgroundColor: tokens.colors.bg.secondary,
  },
  td: {
    padding: '16px',
    fontSize: 14,
    color: tokens.colors.text.primary,
    borderBottom: `1px solid ${tokens.colors.border}`,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: tokens.radius.full,
    fontSize: 11,
    fontWeight: 500,
    textTransform: 'uppercase',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: tokens.spacing.lg,
  },
  emptyState: {
    padding: tokens.spacing.xl,
    textAlign: 'center',
    color: tokens.colors.text.muted,
  },
  filterBar: {
    display: 'flex',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.bg.secondary,
    borderRadius: tokens.radius.md,
  },
  filterInput: {
    flex: 1,
    padding: '8px 12px',
    fontSize: 14,
    backgroundColor: tokens.colors.bg.tertiary,
    border: `1px solid ${tokens.colors.border}`,
    borderRadius: tokens.radius.md,
    color: tokens.colors.text.primary,
    outline: 'none',
  },
  filterSelect: {
    padding: '8px 12px',
    fontSize: 14,
    backgroundColor: tokens.colors.bg.tertiary,
    border: `1px solid ${tokens.colors.border}`,
    borderRadius: tokens.radius.md,
    color: tokens.colors.text.primary,
    outline: 'none',
    minWidth: 150,
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
  modalFooter: {
    padding: tokens.spacing.lg,
    borderTop: `1px solid ${tokens.colors.border}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: tokens.spacing.sm,
  },
  formGroup: {
    marginBottom: tokens.spacing.md,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.xs,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: 14,
    backgroundColor: tokens.colors.bg.tertiary,
    border: `1px solid ${tokens.colors.border}`,
    borderRadius: tokens.radius.md,
    color: tokens.colors.text.primary,
    outline: 'none',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacing.md,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const mockInvoices = [
  { id: 'INV-001', client: 'Construction Tremblay', amount: 15750, status: 'paid', dueDate: '2024-11-15', paidDate: '2024-11-12', project: 'Rénovation cuisine' },
  { id: 'INV-002', client: 'Bergeron & Fils', amount: 28500, status: 'pending', dueDate: '2024-12-15', paidDate: null, project: 'Agrandissement garage' },
  { id: 'INV-003', client: 'ABC Industriel', amount: 45000, status: 'overdue', dueDate: '2024-11-30', paidDate: null, project: 'Entrepôt phase 1' },
  { id: 'INV-004', client: 'Résidences St-Denis', amount: 12300, status: 'draft', dueDate: null, paidDate: null, project: 'Condo 4B' },
  { id: 'INV-005', client: 'Construction Tremblay', amount: 8900, status: 'sent', dueDate: '2024-12-20', paidDate: null, project: 'Rénovation sdb' },
];

const mockExpenses = [
  { id: 'EXP-001', description: 'Matériaux - Bois franc', amount: 3450, category: 'materials', date: '2024-12-01', vendor: 'BMR Pro', project: 'Tremblay' },
  { id: 'EXP-002', description: 'Location excavatrice', amount: 1200, category: 'equipment', date: '2024-12-02', vendor: 'Lou-Tec', project: 'ABC Industriel' },
  { id: 'EXP-003', description: 'Carburant camions', amount: 485, category: 'transport', date: '2024-12-03', vendor: 'Petro-Canada', project: 'Général' },
  { id: 'EXP-004', description: 'Assurance chantier', amount: 2800, category: 'insurance', date: '2024-12-01', vendor: 'Desjardins', project: 'ABC Industriel' },
  { id: 'EXP-005', description: 'Sous-traitant électricité', amount: 5500, category: 'subcontractor', date: '2024-12-04', vendor: 'Électro Plus', project: 'Bergeron' },
];

const mockKPIs = {
  revenue: { value: 247850, change: 12.5, label: 'Revenus', icon: '💰' },
  expenses: { value: 98420, change: -5.2, label: 'Dépenses', icon: '📉' },
  profit: { value: 149430, change: 18.3, label: 'Profit net', icon: '📈' },
  outstanding: { value: 73500, change: 8.1, label: 'À recevoir', icon: '⏳' },
};

const expenseCategories = [
  { id: 'materials', label: 'Matériaux', icon: '🪵', color: '#f59e0b' },
  { id: 'equipment', label: 'Équipement', icon: '🔧', color: '#3b82f6' },
  { id: 'transport', label: 'Transport', icon: '🚛', color: '#8b5cf6' },
  { id: 'insurance', label: 'Assurances', icon: '🛡️', color: '#10b981' },
  { id: 'subcontractor', label: 'Sous-traitants', icon: '👷', color: '#ef4444' },
  { id: 'labor', label: 'Main d\'œuvre', icon: '💪', color: '#06b6d4' },
  { id: 'permits', label: 'Permis', icon: '📋', color: '#f97316' },
  { id: 'other', label: 'Autres', icon: '📦', color: '#6b7280' },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('fr-CA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case 'paid': return tokens.colors.success;
    case 'pending': return tokens.colors.warning;
    case 'overdue': return tokens.colors.error;
    case 'sent': return tokens.colors.info;
    case 'draft': return tokens.colors.text.muted;
    default: return tokens.colors.text.muted;
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'paid': return 'Payée';
    case 'pending': return 'En attente';
    case 'overdue': return 'En retard';
    case 'sent': return 'Envoyée';
    case 'draft': return 'Brouillon';
    default: return status;
  }
};

const getCategoryInfo = (categoryId) => {
  return expenseCategories.find(c => c.id === categoryId) || expenseCategories[expenseCategories.length - 1];
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const KPICard = ({ kpi }) => {
  const isPositive = kpi.change >= 0;
  
  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiLabel}>
        <span>{kpi.icon}</span>
        {kpi.label}
      </div>
      <div style={styles.kpiValue}>
        {formatCurrency(kpi.value)}
      </div>
      <div
        style={{
          ...styles.kpiChange,
          backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: isPositive ? tokens.colors.success : tokens.colors.error,
        }}
      >
        {isPositive ? '↑' : '↓'} {Math.abs(kpi.change)}%
        <span style={{ color: tokens.colors.text.muted, marginLeft: 4 }}>vs mois dernier</span>
      </div>
    </div>
  );
};

const InvoiceRow = ({ invoice, onAction }) => {
  const statusColor = getStatusColor(invoice.status);
  
  return (
    <tr>
      <td style={styles.td}>
        <div style={{ fontWeight: 600, color: tokens.colors.primary }}>{invoice.id}</div>
      </td>
      <td style={styles.td}>
        <div style={{ fontWeight: 500 }}>{invoice.client}</div>
        <div style={{ fontSize: 12, color: tokens.colors.text.muted }}>{invoice.project}</div>
      </td>
      <td style={styles.td}>
        <span style={{ fontWeight: 600 }}>{formatCurrency(invoice.amount)}</span>
      </td>
      <td style={styles.td}>
        <span
          style={{
            ...styles.badge,
            backgroundColor: `${statusColor}20`,
            color: statusColor,
          }}
        >
          {getStatusLabel(invoice.status)}
        </span>
      </td>
      <td style={styles.td}>
        {formatDate(invoice.dueDate)}
      </td>
      <td style={styles.td}>
        <div style={{ display: 'flex', gap: tokens.spacing.xs }}>
          <button
            onClick={() => onAction('view', invoice)}
            style={{
              ...styles.button,
              padding: '6px 10px',
              fontSize: 12,
              backgroundColor: tokens.colors.bg.tertiary,
              color: tokens.colors.text.secondary,
            }}
          >
            👁️
          </button>
          {invoice.status === 'draft' && (
            <button
              onClick={() => onAction('send', invoice)}
              style={{
                ...styles.button,
                padding: '6px 10px',
                fontSize: 12,
                backgroundColor: tokens.colors.info,
                color: '#fff',
              }}
            >
              📤
            </button>
          )}
          {invoice.status === 'overdue' && (
            <button
              onClick={() => onAction('remind', invoice)}
              style={{
                ...styles.button,
                padding: '6px 10px',
                fontSize: 12,
                backgroundColor: tokens.colors.warning,
                color: '#fff',
              }}
            >
              🔔
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

const ExpenseRow = ({ expense }) => {
  const category = getCategoryInfo(expense.category);
  
  return (
    <tr>
      <td style={styles.td}>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: tokens.radius.md,
              backgroundColor: `${category.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}
          >
            {category.icon}
          </span>
          <div>
            <div style={{ fontWeight: 500 }}>{expense.description}</div>
            <div style={{ fontSize: 12, color: tokens.colors.text.muted }}>{expense.vendor}</div>
          </div>
        </div>
      </td>
      <td style={styles.td}>
        <span
          style={{
            ...styles.badge,
            backgroundColor: `${category.color}20`,
            color: category.color,
          }}
        >
          {category.label}
        </span>
      </td>
      <td style={styles.td}>
        <span style={{ fontWeight: 600, color: tokens.colors.error }}>
          -{formatCurrency(expense.amount)}
        </span>
      </td>
      <td style={styles.td}>{formatDate(expense.date)}</td>
      <td style={styles.td}>
        <span style={{ color: tokens.colors.text.secondary }}>{expense.project}</span>
      </td>
    </tr>
  );
};

const CashflowChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.inflow, d.outflow, d.balance)));
  
  return (
    <div style={{ padding: tokens.spacing.md }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: tokens.spacing.md }}>
        {['Entrées', 'Sorties', 'Solde'].map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                backgroundColor: [tokens.colors.success, tokens.colors.error, tokens.colors.primary][i],
              }}
            />
            <span style={{ fontSize: 12, color: tokens.colors.text.secondary }}>{label}</span>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 150 }}>
        {data.map((item, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 120 }}>
              <div
                style={{
                  width: 12,
                  height: `${(item.inflow / maxValue) * 100}%`,
                  backgroundColor: tokens.colors.success,
                  borderRadius: 2,
                }}
              />
              <div
                style={{
                  width: 12,
                  height: `${(item.outflow / maxValue) * 100}%`,
                  backgroundColor: tokens.colors.error,
                  borderRadius: 2,
                }}
              />
              <div
                style={{
                  width: 12,
                  height: `${(item.balance / maxValue) * 100}%`,
                  backgroundColor: tokens.colors.primary,
                  borderRadius: 2,
                }}
              />
            </div>
            <span style={{ fontSize: 10, color: tokens.colors.text.muted }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExpenseBreakdown = ({ expenses }) => {
  const byCategory = useMemo(() => {
    const grouped = {};
    expenses.forEach(exp => {
      if (!grouped[exp.category]) grouped[exp.category] = 0;
      grouped[exp.category] += exp.amount;
    });
    return Object.entries(grouped)
      .map(([cat, amount]) => ({ ...getCategoryInfo(cat), amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);
  
  const total = byCategory.reduce((sum, cat) => sum + cat.amount, 0);
  
  return (
    <div style={{ padding: tokens.spacing.md }}>
      {byCategory.map((cat) => (
        <div key={cat.id} style={{ marginBottom: tokens.spacing.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: tokens.colors.text.primary }}>
              {cat.icon} {cat.label}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: tokens.colors.text.primary }}>
              {formatCurrency(cat.amount)}
            </span>
          </div>
          <div
            style={{
              height: 6,
              backgroundColor: tokens.colors.bg.tertiary,
              borderRadius: tokens.radius.sm,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(cat.amount / total) * 100}%`,
                backgroundColor: cat.color,
                borderRadius: tokens.radius.sm,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// INVOICE MODAL
// ─────────────────────────────────────────────────────────────────────────────

const InvoiceModal = ({ isOpen, onClose, invoice = null }) => {
  const [form, setForm] = useState({
    client: invoice?.client || '',
    project: invoice?.project || '',
    amount: invoice?.amount || '',
    dueDate: invoice?.dueDate || '',
    items: [{ description: '', quantity: 1, price: 0 }],
  });
  
  if (!isOpen) return null;
  
  const isEdit = !!invoice;
  
  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: '', quantity: 1, price: 0 }],
    });
  };
  
  const updateItem = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    setForm({ ...form, items: newItems });
  };
  
  const subtotal = form.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tps = subtotal * 0.05;
  const tvq = subtotal * 0.09975;
  const total = subtotal + tps + tvq;
  
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>
            {isEdit ? `Modifier ${invoice.id}` : '📄 Nouvelle Facture'}
          </h3>
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
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Client</label>
              <input
                style={styles.input}
                value={form.client}
                onChange={e => setForm({ ...form, client: e.target.value })}
                placeholder="Nom du client"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Projet</label>
              <input
                style={styles.input}
                value={form.project}
                onChange={e => setForm({ ...form, project: e.target.value })}
                placeholder="Nom du projet"
              />
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Date d'échéance</label>
            <input
              type="date"
              style={styles.input}
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Lignes de facturation</label>
            {form.items.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                <input
                  style={styles.input}
                  placeholder="Description"
                  value={item.description}
                  onChange={e => updateItem(i, 'description', e.target.value)}
                />
                <input
                  style={styles.input}
                  type="number"
                  placeholder="Qté"
                  value={item.quantity}
                  onChange={e => updateItem(i, 'quantity', parseInt(e.target.value) || 0)}
                />
                <input
                  style={styles.input}
                  type="number"
                  placeholder="Prix"
                  value={item.price}
                  onChange={e => updateItem(i, 'price', parseFloat(e.target.value) || 0)}
                />
              </div>
            ))}
            <button
              onClick={addItem}
              style={{
                ...styles.button,
                backgroundColor: tokens.colors.bg.tertiary,
                color: tokens.colors.text.secondary,
                width: '100%',
                justifyContent: 'center',
                marginTop: 8,
              }}
            >
              + Ajouter une ligne
            </button>
          </div>
          
          {/* Totals */}
          <div
            style={{
              padding: tokens.spacing.md,
              backgroundColor: tokens.colors.bg.tertiary,
              borderRadius: tokens.radius.md,
              marginTop: tokens.spacing.md,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: tokens.colors.text.secondary }}>Sous-total</span>
              <span style={{ color: tokens.colors.text.primary }}>{formatCurrency(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: tokens.colors.text.secondary }}>TPS (5%)</span>
              <span style={{ color: tokens.colors.text.primary }}>{formatCurrency(tps)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: tokens.colors.text.secondary }}>TVQ (9.975%)</span>
              <span style={{ color: tokens.colors.text.primary }}>{formatCurrency(tvq)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 8,
                borderTop: `1px solid ${tokens.colors.border}`,
              }}
            >
              <span style={{ fontWeight: 600, color: tokens.colors.text.primary }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: 18, color: tokens.colors.primary }}>
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>
        
        <div style={styles.modalFooter}>
          <button
            onClick={onClose}
            style={{
              ...styles.button,
              backgroundColor: tokens.colors.bg.tertiary,
              color: tokens.colors.text.secondary,
            }}
          >
            Annuler
          </button>
          <button
            style={{
              ...styles.button,
              backgroundColor: tokens.colors.bg.tertiary,
              color: tokens.colors.text.primary,
            }}
          >
            💾 Brouillon
          </button>
          <button
            style={{
              ...styles.button,
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.bg.primary,
            }}
          >
            📤 Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const FinanceModule = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [filter, setFilter] = useState({ search: '', status: 'all', category: 'all' });
  
  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
    { id: 'invoices', label: 'Factures', icon: '📄', count: mockInvoices.length },
    { id: 'expenses', label: 'Dépenses', icon: '💸', count: mockExpenses.length },
    { id: 'reports', label: 'Rapports', icon: '📈' },
  ];
  
  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter(inv => {
      if (filter.status !== 'all' && inv.status !== filter.status) return false;
      if (filter.search && !inv.client.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    });
  }, [filter]);
  
  const filteredExpenses = useMemo(() => {
    return mockExpenses.filter(exp => {
      if (filter.category !== 'all' && exp.category !== filter.category) return false;
      if (filter.search && !exp.description.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    });
  }, [filter]);
  
  const cashflowData = [
    { label: 'Sem 1', inflow: 35000, outflow: 22000, balance: 45000 },
    { label: 'Sem 2', inflow: 28000, outflow: 31000, balance: 42000 },
    { label: 'Sem 3', inflow: 42000, outflow: 25000, balance: 59000 },
    { label: 'Sem 4', inflow: 38000, outflow: 28000, balance: 69000 },
  ];
  
  const handleInvoiceAction = (action, invoice) => {
    console.log(action, invoice);
    if (action === 'view') {
      setInvoiceModal(invoice);
    }
  };
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>💰 Finance</h1>
          <p style={styles.subtitle}>Gérez vos factures, dépenses et trésorerie</p>
        </div>
        <div style={styles.actions}>
          <button
            style={{
              ...styles.button,
              backgroundColor: tokens.colors.bg.tertiary,
              color: tokens.colors.text.primary,
            }}
          >
            📥 Exporter
          </button>
          <button
            onClick={() => setInvoiceModal(true)}
            style={{
              ...styles.button,
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.bg.primary,
            }}
          >
            + Nouvelle Facture
          </button>
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
            {tab.count && (
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: tokens.radius.full,
                  fontSize: 11,
                  backgroundColor: activeTab === tab.id ? 'rgba(0,0,0,0.2)' : tokens.colors.bg.secondary,
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Content */}
      {activeTab === 'overview' && (
        <>
          {/* KPIs */}
          <div style={styles.kpiGrid}>
            {Object.values(mockKPIs).map((kpi, i) => (
              <KPICard key={i} kpi={kpi} />
            ))}
          </div>
          
          {/* Charts */}
          <div style={styles.grid2}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>📈 Trésorerie (4 semaines)</span>
              </div>
              <CashflowChart data={cashflowData} />
            </div>
            
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>📊 Répartition dépenses</span>
              </div>
              <ExpenseBreakdown expenses={mockExpenses} />
            </div>
          </div>
          
          {/* Recent Invoices */}
          <div style={{ ...styles.card, marginTop: tokens.spacing.lg }}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>📄 Factures récentes</span>
              <button
                onClick={() => setActiveTab('invoices')}
                style={{
                  ...styles.button,
                  backgroundColor: tokens.colors.bg.tertiary,
                  color: tokens.colors.text.secondary,
                  padding: '6px 12px',
                  fontSize: 12,
                }}
              >
                Voir tout →
              </button>
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>N°</th>
                  <th style={styles.th}>Client</th>
                  <th style={styles.th}>Montant</th>
                  <th style={styles.th}>Statut</th>
                  <th style={styles.th}>Échéance</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoices.slice(0, 3).map(invoice => (
                  <InvoiceRow key={invoice.id} invoice={invoice} onAction={handleInvoiceAction} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {activeTab === 'invoices' && (
        <div style={styles.card}>
          <div style={styles.filterBar}>
            <input
              style={styles.filterInput}
              placeholder="🔍 Rechercher une facture..."
              value={filter.search}
              onChange={e => setFilter({ ...filter, search: e.target.value })}
            />
            <select
              style={styles.filterSelect}
              value={filter.status}
              onChange={e => setFilter({ ...filter, status: e.target.value })}
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="sent">Envoyée</option>
              <option value="pending">En attente</option>
              <option value="paid">Payée</option>
              <option value="overdue">En retard</option>
            </select>
          </div>
          
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>N°</th>
                <th style={styles.th}>Client</th>
                <th style={styles.th}>Montant</th>
                <th style={styles.th}>Statut</th>
                <th style={styles.th}>Échéance</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(invoice => (
                <InvoiceRow key={invoice.id} invoice={invoice} onAction={handleInvoiceAction} />
              ))}
            </tbody>
          </table>
          
          {filteredInvoices.length === 0 && (
            <div style={styles.emptyState}>
              <p>Aucune facture trouvée</p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'expenses' && (
        <div style={styles.card}>
          <div style={styles.filterBar}>
            <input
              style={styles.filterInput}
              placeholder="🔍 Rechercher une dépense..."
              value={filter.search}
              onChange={e => setFilter({ ...filter, search: e.target.value })}
            />
            <select
              style={styles.filterSelect}
              value={filter.category}
              onChange={e => setFilter({ ...filter, category: e.target.value })}
            >
              <option value="all">Toutes les catégories</option>
              {expenseCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
              ))}
            </select>
            <button
              style={{
                ...styles.button,
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.bg.primary,
              }}
            >
              + Nouvelle dépense
            </button>
          </div>
          
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Catégorie</th>
                <th style={styles.th}>Montant</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Projet</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(expense => (
                <ExpenseRow key={expense.id} expense={expense} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === 'reports' && (
        <div style={styles.grid2}>
          {[
            { icon: '📊', title: 'Rapport mensuel', desc: 'Revenus, dépenses et marge', action: 'Générer' },
            { icon: '📈', title: 'Analyse de rentabilité', desc: 'Par projet et par client', action: 'Voir' },
            { icon: '💵', title: 'Rapport TPS/TVQ', desc: 'Pour déclaration fiscale', action: 'Exporter' },
            { icon: '📋', title: 'Comptes clients', desc: 'Âge des comptes à recevoir', action: 'Voir' },
          ].map((report, i) => (
            <div key={i} style={{ ...styles.card, padding: tokens.spacing.lg }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md }}>
                <span style={{ fontSize: 32 }}>{report.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: tokens.colors.text.primary, marginBottom: 4 }}>
                    {report.title}
                  </div>
                  <div style={{ fontSize: 13, color: tokens.colors.text.muted }}>
                    {report.desc}
                  </div>
                </div>
                <button
                  style={{
                    ...styles.button,
                    backgroundColor: tokens.colors.primary,
                    color: tokens.colors.bg.primary,
                  }}
                >
                  {report.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={!!invoiceModal}
        onClose={() => setInvoiceModal(false)}
        invoice={typeof invoiceModal === 'object' ? invoiceModal : null}
      />
    </div>
  );
};

export default FinanceModule;
