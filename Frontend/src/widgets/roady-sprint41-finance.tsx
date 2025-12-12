import React, { useState, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ROADY V22 - SPRINT 4.1: FINANCE AVANCÉE
// ═══════════════════════════════════════════════════════════════════════════════
// FIN-01: QuickBooks Online API
// FIN-02: Sage API
// FIN-03: Cash flow forecast (prévisions trésorerie)
// FIN-04: Rapprochement bancaire automatique
// FIN-05: Alertes seuils (solde bas, gros débit)
// FIN-06: Stripe - paiements en ligne
// FIN-07: Square - paiements terrain
// FIN-08: Facturation automatique depuis projets
// FIN-09: Suivi paiements clients avec relances
// FIN-10: Export comptable multi-format
// ═══════════════════════════════════════════════════════════════════════════════

const T = {
  bg: { main: '#0a0a0f', card: '#12121a', hover: '#1a1a25', input: '#0d0d12' },
  text: { primary: '#ffffff', secondary: '#a0a0b0', muted: '#6b7280' },
  border: '#2a2a3a',
  accent: { primary: '#3b82f6', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', purple: '#8b5cf6' }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

// [FIN-01/02] Accounting Integrations
const ACCOUNTING_INTEGRATIONS = [
  { id: 'quickbooks', name: 'QuickBooks Online', icon: '📗', color: '#2CA01C', connected: true, lastSync: '2024-12-03 14:30' },
  { id: 'sage', name: 'Sage', icon: '📘', color: '#00A651', connected: false, lastSync: null },
  { id: 'xero', name: 'Xero', icon: '📙', color: '#13B5EA', connected: false, lastSync: null }
];

// [FIN-06/07] Payment Processors
const PAYMENT_PROCESSORS = [
  { id: 'stripe', name: 'Stripe', icon: '💳', color: '#635BFF', connected: true, mode: 'live' },
  { id: 'square', name: 'Square', icon: '⬜', color: '#006AFF', connected: true, mode: 'live' },
  { id: 'interac', name: 'Interac', icon: '🍁', color: '#FFCC00', connected: true, mode: 'live' }
];

// Bank Accounts
const BANK_ACCOUNTS = [
  { id: 1, name: 'Compte Opérations', bank: 'Desjardins', type: 'checking', balance: 45780.50, currency: 'CAD', lastSync: '2024-12-03 15:00' },
  { id: 2, name: 'Compte Épargne', bank: 'Desjardins', type: 'savings', balance: 125000.00, currency: 'CAD', lastSync: '2024-12-03 15:00' },
  { id: 3, name: 'Ligne de Crédit', bank: 'TD', type: 'credit', balance: -15000.00, limit: 100000, currency: 'CAD', lastSync: '2024-12-03 14:00' }
];

// [FIN-03] Cash Flow Data
const CASH_FLOW_FORECAST = [
  { month: 'Déc 24', income: 85000, expenses: 62000, projected: 45780 + 23000 },
  { month: 'Jan 25', income: 72000, expenses: 58000, projected: 68780 + 14000 },
  { month: 'Fév 25', income: 95000, expenses: 70000, projected: 82780 + 25000 },
  { month: 'Mar 25', income: 110000, expenses: 75000, projected: 107780 + 35000 },
  { month: 'Avr 25', income: 125000, expenses: 80000, projected: 142780 + 45000 },
  { month: 'Mai 25', income: 140000, expenses: 85000, projected: 187780 + 55000 }
];

// Transactions for reconciliation
const TRANSACTIONS = [
  { id: 1, date: '2024-12-03', description: 'Paiement Client - Dubois', amount: 15000, type: 'credit', category: 'Revenus', matched: true, invoiceId: 'INV-2024-045' },
  { id: 2, date: '2024-12-03', description: 'BMR Pro - Matériaux', amount: -3450.75, type: 'debit', category: 'Matériaux', matched: true, invoiceId: 'PO-2024-123' },
  { id: 3, date: '2024-12-02', description: 'Hydro-Québec', amount: -425.00, type: 'debit', category: 'Utilities', matched: true, invoiceId: null },
  { id: 4, date: '2024-12-02', description: 'Virement - Inconnu', amount: 2500, type: 'credit', category: null, matched: false, invoiceId: null },
  { id: 5, date: '2024-12-01', description: 'Paie - Employés', amount: -18500, type: 'debit', category: 'Salaires', matched: true, invoiceId: 'PAY-2024-48' },
  { id: 6, date: '2024-12-01', description: 'Location équipement', amount: -1200, type: 'debit', category: 'Location', matched: false, invoiceId: null }
];

// [FIN-05] Alerts
const ALERTS = [
  { id: 1, type: 'low_balance', severity: 'warning', message: 'Solde compte opérations < 50,000$', threshold: 50000, current: 45780, date: '2024-12-03' },
  { id: 2, type: 'large_debit', severity: 'info', message: 'Débit important: Paie 18,500$', amount: 18500, date: '2024-12-01' },
  { id: 3, type: 'payment_due', severity: 'danger', message: '3 factures en retard de paiement', count: 3, total: 12500, date: '2024-12-03' }
];

// [FIN-08/09] Invoices
const INVOICES = [
  { id: 'INV-2024-048', client: 'Marie Dubois', project: 'Résidence Dubois', amount: 25000, paid: 15000, status: 'partial', dueDate: '2024-12-15', reminders: 0 },
  { id: 'INV-2024-047', client: 'Centre Commercial Laval', project: 'CC Laval Phase 2', amount: 85000, paid: 85000, status: 'paid', dueDate: '2024-11-30', reminders: 0 },
  { id: 'INV-2024-046', client: 'Jean Tremblay', project: 'Réno Cuisine', amount: 8500, paid: 0, status: 'overdue', dueDate: '2024-11-20', reminders: 2 },
  { id: 'INV-2024-045', client: 'Sophie Martin', project: 'Extension Garage', amount: 12000, paid: 0, status: 'overdue', dueDate: '2024-11-25', reminders: 1 },
  { id: 'INV-2024-044', client: 'Pierre Gagnon', project: 'Électricité Bureau', amount: 4500, paid: 0, status: 'sent', dueDate: '2024-12-20', reminders: 0 }
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const Card = ({ children, style = {} }) => (
  <div style={{ background: T.bg.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16, ...style }}>{children}</div>
);

const Badge = ({ children, color = T.accent.primary }) => (
  <span style={{ background: `${color}20`, color, padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{children}</span>
);

const formatMoney = (amount) => new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount);

// Stats Card
const StatCard = ({ icon, label, value, subtext, color = T.accent.primary, trend }) => (
  <Card style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
    <div style={{ fontSize: 12, color: T.text.muted, marginBottom: 4 }}>{label}</div>
    {trend && (
      <div style={{ fontSize: 11, color: trend > 0 ? T.accent.success : T.accent.danger }}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs mois dernier
      </div>
    )}
    {subtext && <div style={{ fontSize: 11, color: T.text.muted }}>{subtext}</div>}
  </Card>
);

// [FIN-03] Cash Flow Chart
const CashFlowChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.income, d.expenses, d.projected)));
  
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ color: T.text.primary, margin: 0 }}>📈 Prévisions Trésorerie</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 11, color: T.accent.success }}>● Revenus</span>
          <span style={{ fontSize: 11, color: T.accent.danger }}>● Dépenses</span>
          <span style={{ fontSize: 11, color: T.accent.primary }}>● Solde projeté</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 200 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 150 }}>
              <div style={{ width: 12, background: T.accent.success, borderRadius: 4, height: `${(d.income / maxValue) * 100}%` }} title={`Revenus: ${formatMoney(d.income)}`} />
              <div style={{ width: 12, background: T.accent.danger, borderRadius: 4, height: `${(d.expenses / maxValue) * 100}%` }} title={`Dépenses: ${formatMoney(d.expenses)}`} />
              <div style={{ width: 12, background: T.accent.primary, borderRadius: 4, height: `${(d.projected / maxValue) * 100}%` }} title={`Projeté: ${formatMoney(d.projected)}`} />
            </div>
            <div style={{ fontSize: 10, color: T.text.muted }}>{d.month}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// [FIN-04] Bank Reconciliation
const BankReconciliation = ({ transactions, onMatch }) => {
  const unmatched = transactions.filter(t => !t.matched);
  
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ color: T.text.primary, margin: 0 }}>🔄 Rapprochement Bancaire</h3>
        <Badge color={unmatched.length > 0 ? T.accent.warning : T.accent.success}>
          {unmatched.length} à rapprocher
        </Badge>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {transactions.map(t => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: 12,
            background: t.matched ? T.bg.main : `${T.accent.warning}10`,
            borderRadius: 8, borderLeft: `3px solid ${t.matched ? T.accent.success : T.accent.warning}`
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: t.amount > 0 ? `${T.accent.success}20` : `${T.accent.danger}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {t.amount > 0 ? '↓' : '↑'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, color: T.text.primary, fontSize: 13 }}>{t.description}</div>
              <div style={{ fontSize: 11, color: T.text.muted }}>{t.date} • {t.category || 'Non catégorisé'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, color: t.amount > 0 ? T.accent.success : T.accent.danger }}>
                {formatMoney(t.amount)}
              </div>
              {t.matched ? (
                <Badge color={T.accent.success}>✓ Rapproché</Badge>
              ) : (
                <button onClick={() => onMatch(t.id)} style={{
                  padding: '4px 10px', background: T.accent.primary, border: 'none',
                  borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 11
                }}>Rapprocher</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// [FIN-05] Alerts Panel
const AlertsPanel = ({ alerts }) => {
  const severityColors = { danger: T.accent.danger, warning: T.accent.warning, info: T.accent.primary };
  const severityIcons = { danger: '🚨', warning: '⚠️', info: 'ℹ️' };
  
  return (
    <Card>
      <h3 style={{ color: T.text.primary, marginBottom: 16 }}>🔔 Alertes Financières</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {alerts.map(alert => (
          <div key={alert.id} style={{
            padding: 12, background: `${severityColors[alert.severity]}10`,
            borderRadius: 8, borderLeft: `3px solid ${severityColors[alert.severity]}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{severityIcons[alert.severity]}</span>
              <span style={{ fontWeight: 500, color: T.text.primary, fontSize: 13 }}>{alert.message}</span>
            </div>
            <div style={{ fontSize: 11, color: T.text.muted, marginTop: 4 }}>{alert.date}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// [FIN-08/09] Invoices Panel
const InvoicesPanel = ({ invoices, onRemind }) => {
  const statusConfig = {
    paid: { color: T.accent.success, label: 'Payé', icon: '✓' },
    partial: { color: T.accent.warning, label: 'Partiel', icon: '◐' },
    sent: { color: T.accent.primary, label: 'Envoyé', icon: '→' },
    overdue: { color: T.accent.danger, label: 'En retard', icon: '!' },
    draft: { color: T.text.muted, label: 'Brouillon', icon: '○' }
  };

  const totalDue = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + (i.amount - i.paid), 0);
  const overdueCount = invoices.filter(i => i.status === 'overdue').length;

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ color: T.text.primary, margin: 0 }}>🧾 Factures</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <Badge color={T.accent.warning}>{formatMoney(totalDue)} à recevoir</Badge>
          {overdueCount > 0 && <Badge color={T.accent.danger}>{overdueCount} en retard</Badge>}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {invoices.map(inv => {
          const status = statusConfig[inv.status];
          const progress = (inv.paid / inv.amount) * 100;
          
          return (
            <div key={inv.id} style={{
              padding: 12, background: T.bg.main, borderRadius: 8,
              borderLeft: `3px solid ${status.color}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <span style={{ fontWeight: 600, color: T.text.primary }}>{inv.id}</span>
                  <span style={{ color: T.text.muted, marginLeft: 8, fontSize: 12 }}>{inv.client}</span>
                </div>
                <Badge color={status.color}>{status.icon} {status.label}</Badge>
              </div>
              <div style={{ fontSize: 12, color: T.text.secondary, marginBottom: 8 }}>{inv.project}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 6, background: T.bg.card, borderRadius: 3 }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: status.color, borderRadius: 3 }} />
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text.primary }}>
                  {formatMoney(inv.paid)} / {formatMoney(inv.amount)}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div style={{ fontSize: 11, color: T.text.muted }}>
                  Échéance: {inv.dueDate} {inv.reminders > 0 && `• ${inv.reminders} relance(s)`}
                </div>
                {inv.status === 'overdue' && (
                  <button onClick={() => onRemind(inv.id)} style={{
                    padding: '4px 10px', background: T.accent.warning, border: 'none',
                    borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 11
                  }}>📧 Relancer</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <button style={{
        width: '100%', marginTop: 12, padding: 12, background: T.accent.primary, border: 'none',
        borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 600
      }}>+ Nouvelle Facture</button>
    </Card>
  );
};

// Integrations Panel
const IntegrationsPanel = ({ accounting, payments }) => (
  <Card>
    <h3 style={{ color: T.text.primary, marginBottom: 16 }}>🔌 Intégrations</h3>
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, color: T.text.muted, marginBottom: 8 }}>Comptabilité</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {accounting.map(a => (
          <div key={a.id} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
            background: a.connected ? `${a.color}15` : T.bg.main,
            border: `1px solid ${a.connected ? a.color : T.border}`,
            borderRadius: 8
          }}>
            <span>{a.icon}</span>
            <span style={{ fontSize: 12, color: T.text.primary }}>{a.name}</span>
            {a.connected ? (
              <Badge color={T.accent.success}>✓</Badge>
            ) : (
              <button style={{ padding: '2px 8px', background: a.color, border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontSize: 10 }}>Connecter</button>
            )}
          </div>
        ))}
      </div>
    </div>
    <div>
      <div style={{ fontSize: 12, color: T.text.muted, marginBottom: 8 }}>Paiements</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {payments.map(p => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
            background: `${p.color}15`, border: `1px solid ${p.color}`, borderRadius: 8
          }}>
            <span>{p.icon}</span>
            <span style={{ fontSize: 12, color: T.text.primary }}>{p.name}</span>
            <Badge color={T.accent.success}>{p.mode}</Badge>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

// [FIN-10] Export Panel
const ExportPanel = () => {
  const formats = [
    { id: 'csv', name: 'CSV', icon: '📄' },
    { id: 'excel', name: 'Excel', icon: '📊' },
    { id: 'pdf', name: 'PDF', icon: '📕' },
    { id: 'qbo', name: 'QuickBooks', icon: '📗' },
    { id: 'sage', name: 'Sage', icon: '📘' }
  ];

  return (
    <Card>
      <h3 style={{ color: T.text.primary, marginBottom: 16 }}>📥 Export Comptable</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {formats.map(f => (
          <button key={f.id} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
            background: T.bg.main, border: `1px solid ${T.border}`, borderRadius: 8,
            color: T.text.secondary, cursor: 'pointer', fontSize: 12
          }}>
            {f.icon} {f.name}
          </button>
        ))}
      </div>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function FinanceAdvanced() {
  const [transactions, setTransactions] = useState(TRANSACTIONS);
  const [view, setView] = useState('dashboard');

  const matchTransaction = (id) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, matched: true } : t));
  };

  const totalBalance = BANK_ACCOUNTS.reduce((sum, a) => sum + a.balance, 0);
  const monthlyIncome = CASH_FLOW_FORECAST[0].income;
  const monthlyExpenses = CASH_FLOW_FORECAST[0].expenses;

  const views = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'reconciliation', icon: '🔄', label: 'Rapprochement' },
    { id: 'invoices', icon: '🧾', label: 'Factures' },
    { id: 'settings', icon: '⚙️', label: 'Paramètres' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: T.bg.main, color: T.text.primary }}>
      {/* Header */}
      <header style={{ background: T.bg.card, borderBottom: `1px solid ${T.border}`, padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>💰</span>
          <span style={{ fontWeight: 700, fontSize: 20 }}>Finance Avancée</span>
          <Badge color={T.accent.success}>Sprint 4.1</Badge>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {views.map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: view === v.id ? T.accent.primary : T.bg.main,
              color: view === v.id ? '#fff' : T.text.secondary
            }}>{v.icon} {v.label}</button>
          ))}
        </div>
      </header>

      {/* Main */}
      <main style={{ padding: 24 }}>
        {view === 'dashboard' && (
          <>
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
              <StatCard icon="🏦" label="Solde Total" value={formatMoney(totalBalance)} color={T.accent.success} trend={12} />
              <StatCard icon="📈" label="Revenus (Déc)" value={formatMoney(monthlyIncome)} color={T.accent.success} trend={8} />
              <StatCard icon="📉" label="Dépenses (Déc)" value={formatMoney(monthlyExpenses)} color={T.accent.danger} trend={-3} />
              <StatCard icon="💳" label="À recevoir" value={formatMoney(54500)} color={T.accent.warning} subtext="5 factures" />
            </div>

            {/* Charts & Alerts */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
              <CashFlowChart data={CASH_FLOW_FORECAST} />
              <AlertsPanel alerts={ALERTS} />
            </div>

            {/* Bank Accounts */}
            <Card style={{ marginBottom: 24 }}>
              <h3 style={{ color: T.text.primary, marginBottom: 16 }}>🏦 Comptes Bancaires</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                {BANK_ACCOUNTS.map(account => (
                  <div key={account.id} style={{ padding: 16, background: T.bg.main, borderRadius: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, color: T.text.primary }}>{account.name}</span>
                      <Badge color={T.text.muted}>{account.bank}</Badge>
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: account.balance >= 0 ? T.accent.success : T.accent.danger }}>
                      {formatMoney(account.balance)}
                    </div>
                    {account.limit && (
                      <div style={{ fontSize: 11, color: T.text.muted }}>Limite: {formatMoney(account.limit)}</div>
                    )}
                    <div style={{ fontSize: 10, color: T.text.muted, marginTop: 4 }}>Sync: {account.lastSync}</div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {view === 'reconciliation' && <BankReconciliation transactions={transactions} onMatch={matchTransaction} />}
        
        {view === 'invoices' && <InvoicesPanel invoices={INVOICES} onRemind={(id) => console.log('Remind:', id)} />}
        
        {view === 'settings' && (
          <div style={{ display: 'grid', gap: 24, maxWidth: 800 }}>
            <IntegrationsPanel accounting={ACCOUNTING_INTEGRATIONS} payments={PAYMENT_PROCESSORS} />
            <ExportPanel />
          </div>
        )}
      </main>
    </div>
  );
}
