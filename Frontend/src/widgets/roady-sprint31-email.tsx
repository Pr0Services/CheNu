import React, { useState, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ROADY V22 - SPRINT 3.1: EMAIL PRO
// ═══════════════════════════════════════════════════════════════════════════════
// E1-01: Intégration Gmail API complète
// E1-02: Intégration Outlook/Microsoft Graph API
// E1-03: Composer email avec éditeur riche
// E1-04: Templates emails (Soumission, Suivi, Rappel, Facture)
// E1-05: Signatures multiples par contexte
// E1-06: Programmation envoi différé
// E1-07: Suivi ouvertures (tracking pixels)
// E1-08: Lier emails aux contacts CRM
// E1-09: Recherche avancée dans emails
// E1-10: Règles automatiques (filtres)
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

// [E1-01/02] Email Providers
const EMAIL_PROVIDERS = [
  { id: 'gmail', name: 'Gmail', icon: '📧', color: '#ea4335', connected: true, email: 'contact@roady.ca' },
  { id: 'outlook', name: 'Outlook', icon: '📬', color: '#0078d4', connected: true, email: 'admin@roady.ca' },
  { id: 'custom', name: 'SMTP Custom', icon: '📮', color: '#6b7280', connected: false, email: null }
];

// [E1-04] Email Templates
const EMAIL_TEMPLATES = [
  { id: 'quote', name: 'Soumission', icon: '💰', subject: 'Soumission - Projet {project}',
    body: 'Bonjour {name},\n\nSuite à notre rencontre, veuillez trouver ci-joint notre soumission pour le projet {project}.\n\nMontant total: {amount}\nValidité: 30 jours\n\nN\'hésitez pas à nous contacter pour toute question.\n\nCordialement,\n{signature}' },
  { id: 'followup', name: 'Suivi', icon: '📋', subject: 'Suivi - Projet {project}',
    body: 'Bonjour {name},\n\nJe fais suite à notre dernière communication concernant le projet {project}.\n\nPouvez-vous me confirmer votre disponibilité pour la prochaine étape?\n\nMerci,\n{signature}' },
  { id: 'reminder', name: 'Rappel', icon: '⏰', subject: 'Rappel - {subject}',
    body: 'Bonjour {name},\n\nCeci est un rappel amical concernant {subject}.\n\nMerci de votre attention,\n{signature}' },
  { id: 'invoice', name: 'Facture', icon: '🧾', subject: 'Facture #{invoice_number} - {project}',
    body: 'Bonjour {name},\n\nVeuillez trouver ci-joint la facture #{invoice_number} pour le projet {project}.\n\nMontant: {amount}\nÉchéance: {due_date}\n\nMerci de votre confiance,\n{signature}' },
  { id: 'meeting', name: 'Rendez-vous', icon: '📅', subject: 'Confirmation RDV - {date}',
    body: 'Bonjour {name},\n\nJe confirme notre rendez-vous le {date} à {time}.\n\nLieu: {location}\n\nÀ bientôt,\n{signature}' },
  { id: 'thank', name: 'Remerciement', icon: '🙏', subject: 'Merci pour votre confiance',
    body: 'Bonjour {name},\n\nNous tenons à vous remercier pour votre confiance dans le cadre du projet {project}.\n\nNous restons à votre disposition.\n\nCordialement,\n{signature}' }
];

// [E1-05] Signatures
const SIGNATURES = [
  { id: 'pro', name: 'Professionnelle', default: true,
    html: '<p><strong>Jean Tremblay</strong><br/>Chef de projet<br/>ROADY Construction<br/>📱 514-555-0101<br/>✉️ jean@roady.ca</p>' },
  { id: 'simple', name: 'Simple', default: false,
    html: '<p>Jean Tremblay<br/>ROADY Construction</p>' },
  { id: 'full', name: 'Complète avec logo', default: false,
    html: '<p><img src="logo.png" width="120"/><br/><strong>Jean Tremblay</strong><br/>Chef de projet | ROADY Construction<br/>📱 514-555-0101 | 📧 jean@roady.ca<br/>🌐 www.roady.ca</p>' }
];

// [E1-10] Auto Rules
const AUTO_RULES = [
  { id: 1, name: 'Factures fournisseurs', condition: 'from:*@suppliers.com', action: 'move', target: 'Factures', enabled: true },
  { id: 2, name: 'Notifications CCQ', condition: 'from:*@ccq.org', action: 'label', target: 'CCQ', enabled: true },
  { id: 3, name: 'Clients VIP', condition: 'from:*@vip-client.com', action: 'star', target: null, enabled: true },
  { id: 4, name: 'Spam fournisseurs', condition: 'subject:PROMO', action: 'archive', target: null, enabled: false }
];

// Sample Emails
const SAMPLE_EMAILS = [
  { id: 1, from: { name: 'Marie Dubois', email: 'marie@clientvip.com', avatar: '👩‍💼' },
    to: 'contact@roady.ca', subject: 'RE: Soumission Résidence Dubois',
    preview: 'Bonjour Jean, merci pour la soumission. Nous aimerions discuter de quelques ajustements...',
    body: 'Bonjour Jean,\n\nMerci pour la soumission détaillée. Nous aimerions discuter de quelques ajustements concernant la phase électrique.\n\nPouvez-vous me rappeler demain matin?\n\nCordialement,\nMarie',
    date: '2024-12-03T14:30:00', read: false, starred: true, labels: ['Client', 'VIP'],
    tracking: { opened: true, openedAt: '2024-12-03T14:35:00', clicks: 2 },
    crmContact: { id: 101, name: 'Marie Dubois', company: 'Dubois Inc.' },
    attachments: [] },
  { id: 2, from: { name: 'BMR Pro', email: 'commandes@bmr.ca', avatar: '📦' },
    to: 'contact@roady.ca', subject: 'Confirmation commande #45678',
    preview: 'Votre commande a été expédiée. Livraison prévue le 5 décembre...',
    body: 'Bonjour,\n\nVotre commande #45678 a été expédiée.\n\nLivraison prévue: 5 décembre 2024\nTransporteur: Purolator\n\nMerci de votre confiance,\nBMR Pro',
    date: '2024-12-03T11:00:00', read: true, starred: false, labels: ['Fournisseur'],
    tracking: null, crmContact: null,
    attachments: [{ name: 'bon_livraison.pdf', size: '245 KB' }] },
  { id: 3, from: { name: 'CCQ', email: 'notifications@ccq.org', avatar: '🎓' },
    to: 'contact@roady.ca', subject: 'Rappel - Renouvellement carte compétence',
    preview: 'La carte de compétence de Pierre Gagnon expire dans 15 jours...',
    body: 'Bonjour,\n\nCeci est un rappel automatique.\n\nLa carte de compétence de Pierre Gagnon (Électricien) expire le 15 décembre 2024.\n\nVeuillez procéder au renouvellement.\n\nCCQ',
    date: '2024-12-03T09:00:00', read: true, starred: true, labels: ['CCQ', 'Urgent'],
    tracking: null, crmContact: null, attachments: [] },
  { id: 4, from: { name: 'Sophie Martin', email: 'sophie@roady.ca', avatar: '🔧' },
    to: 'jean@roady.ca', subject: 'Rapport inspection plomberie - Chantier Nord',
    preview: 'Voici le rapport d\'inspection de ce matin. Quelques points à corriger...',
    body: 'Salut Jean,\n\nVoici le rapport d\'inspection plomberie du Chantier Nord.\n\nPoints à corriger:\n- Raccord cuisine à refaire\n- Pression test à reprendre\n\nJe m\'en occupe demain matin.\n\nSophie',
    date: '2024-12-02T16:45:00', read: true, starred: false, labels: ['Interne', 'Chantier Nord'],
    tracking: null, crmContact: null,
    attachments: [{ name: 'rapport_inspection.pdf', size: '1.2 MB' }, { name: 'photos.zip', size: '5.4 MB' }] }
];

const FOLDERS = [
  { id: 'inbox', name: 'Boîte de réception', icon: '📥', count: 12 },
  { id: 'starred', name: 'Suivis', icon: '⭐', count: 3 },
  { id: 'sent', name: 'Envoyés', icon: '📤', count: 0 },
  { id: 'drafts', name: 'Brouillons', icon: '📝', count: 2 },
  { id: 'scheduled', name: 'Programmés', icon: '⏰', count: 1 },
  { id: 'archive', name: 'Archives', icon: '📁', count: 0 },
  { id: 'trash', name: 'Corbeille', icon: '🗑️', count: 0 }
];

const LABELS = [
  { id: 'client', name: 'Client', color: '#3b82f6' },
  { id: 'vip', name: 'VIP', color: '#f59e0b' },
  { id: 'fournisseur', name: 'Fournisseur', color: '#10b981' },
  { id: 'ccq', name: 'CCQ', color: '#8b5cf6' },
  { id: 'urgent', name: 'Urgent', color: '#ef4444' },
  { id: 'interne', name: 'Interne', color: '#6b7280' }
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: T.bg.card, border: `1px solid ${T.border}`, borderRadius: 12,
    padding: 16, cursor: onClick ? 'pointer' : 'default', ...style
  }}>{children}</div>
);

const Badge = ({ children, color = T.accent.primary }) => (
  <span style={{ background: `${color}20`, color, padding: '3px 8px', borderRadius: 12, fontSize: 10, fontWeight: 600 }}>
    {children}
  </span>
);

// [E1-09] Search Bar
const SearchBar = ({ value, onChange, onSearch }) => (
  <div style={{ position: 'relative', marginBottom: 16 }}>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Rechercher emails... (from: to: subject: has:attachment)"
      style={{
        width: '100%', padding: '12px 16px 12px 40px', background: T.bg.input,
        border: `1px solid ${T.border}`, borderRadius: 10, color: T.text.primary, fontSize: 14
      }}
    />
    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
  </div>
);

// Email List Item
const EmailListItem = ({ email, selected, onSelect, onStar }) => (
  <div
    onClick={() => onSelect(email)}
    style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
      background: selected ? `${T.accent.primary}15` : email.read ? T.bg.card : T.bg.hover,
      borderBottom: `1px solid ${T.border}`, cursor: 'pointer',
      borderLeft: selected ? `3px solid ${T.accent.primary}` : '3px solid transparent'
    }}
  >
    <button onClick={e => { e.stopPropagation(); onStar(email.id); }} style={{
      background: 'none', border: 'none', cursor: 'pointer', fontSize: 16
    }}>{email.starred ? '⭐' : '☆'}</button>
    
    <div style={{
      width: 36, height: 36, borderRadius: '50%', background: T.bg.main,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
    }}>{email.from.avatar}</div>
    
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{ fontWeight: email.read ? 400 : 600, color: T.text.primary, fontSize: 14 }}>
          {email.from.name}
        </span>
        <span style={{ fontSize: 11, color: T.text.muted }}>
          {new Date(email.date).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div style={{ fontWeight: email.read ? 400 : 600, color: T.text.primary, fontSize: 13, marginBottom: 2 }}>
        {email.subject}
      </div>
      <div style={{ fontSize: 12, color: T.text.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {email.preview}
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
        {email.labels?.map(label => {
          const l = LABELS.find(x => x.name === label);
          return <Badge key={label} color={l?.color}>{label}</Badge>;
        })}
        {email.attachments?.length > 0 && <Badge color={T.text.muted}>📎 {email.attachments.length}</Badge>}
        {email.tracking?.opened && <Badge color={T.accent.success}>👁️ Lu</Badge>}
      </div>
    </div>
  </div>
);

// [E1-07] Tracking Stats
const TrackingStats = ({ email }) => {
  if (!email.tracking) return null;
  return (
    <div style={{ padding: 12, background: `${T.accent.success}10`, borderRadius: 8, marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.accent.success, marginBottom: 8 }}>📊 Suivi</div>
      <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
        <span style={{ color: T.text.secondary }}>
          👁️ Ouvert: {email.tracking.opened ? new Date(email.tracking.openedAt).toLocaleString('fr-CA') : 'Non'}
        </span>
        <span style={{ color: T.text.secondary }}>🖱️ Clics: {email.tracking.clicks || 0}</span>
      </div>
    </div>
  );
};

// [E1-08] CRM Link
const CRMLink = ({ contact }) => {
  if (!contact) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
      background: `${T.accent.purple}15`, borderRadius: 8, marginBottom: 16
    }}>
      <span>🤝</span>
      <span style={{ fontSize: 12, color: T.text.secondary }}>
        Lié au contact CRM: <strong style={{ color: T.accent.purple }}>{contact.name}</strong> ({contact.company})
      </span>
      <button style={{
        marginLeft: 'auto', padding: '4px 8px', background: T.accent.purple, border: 'none',
        borderRadius: 4, color: '#fff', cursor: 'pointer', fontSize: 10
      }}>Voir fiche</button>
    </div>
  );
};

// Email Detail View
const EmailDetail = ({ email, onClose, onReply }) => {
  if (!email) return null;
  
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: 16, borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ color: T.text.primary, fontSize: 18, margin: 0 }}>{email.subject}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onReply(email)} style={{
            padding: '8px 16px', background: T.accent.primary, border: 'none',
            borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 13
          }}>↩️ Répondre</button>
          <button style={{
            padding: '8px 16px', background: T.bg.main, border: `1px solid ${T.border}`,
            borderRadius: 8, color: T.text.secondary, cursor: 'pointer', fontSize: 13
          }}>⤴️ Transférer</button>
        </div>
      </div>
      
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <TrackingStats email={email} />
        <CRMLink contact={email.crmContact} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', background: T.bg.main,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
          }}>{email.from.avatar}</div>
          <div>
            <div style={{ fontWeight: 600, color: T.text.primary }}>{email.from.name}</div>
            <div style={{ fontSize: 12, color: T.text.muted }}>{email.from.email}</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 12, color: T.text.muted }}>
            {new Date(email.date).toLocaleString('fr-CA')}
          </div>
        </div>
        
        <div style={{
          padding: 20, background: T.bg.main, borderRadius: 12,
          whiteSpace: 'pre-wrap', lineHeight: 1.6, color: T.text.secondary, fontSize: 14
        }}>{email.body}</div>
        
        {email.attachments?.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: T.text.muted, marginBottom: 8 }}>📎 Pièces jointes</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {email.attachments.map((att, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                  background: T.bg.card, borderRadius: 8, border: `1px solid ${T.border}`
                }}>
                  <span>📄</span>
                  <div>
                    <div style={{ fontSize: 12, color: T.text.primary }}>{att.name}</div>
                    <div style={{ fontSize: 10, color: T.text.muted }}>{att.size}</div>
                  </div>
                  <button style={{
                    background: 'none', border: 'none', color: T.accent.primary, cursor: 'pointer'
                  }}>⬇️</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// [E1-03] Compose Email Modal
const ComposeEmail = ({ onClose, replyTo, templates, signatures }) => {
  const [to, setTo] = useState(replyTo?.from?.email || '');
  const [subject, setSubject] = useState(replyTo ? `RE: ${replyTo.subject}` : '');
  const [body, setBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedSignature, setSelectedSignature] = useState(signatures.find(s => s.default)?.id);
  const [scheduleDate, setScheduleDate] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);

  const applyTemplate = (tpl) => {
    setSubject(tpl.subject);
    setBody(tpl.body);
    setSelectedTemplate(tpl.id);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: T.bg.card, borderRadius: 16, width: '90%', maxWidth: 700,
        maxHeight: '90vh', display: 'flex', flexDirection: 'column', border: `1px solid ${T.border}`
      }}>
        <div style={{ padding: 16, borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ color: T.text.primary, margin: 0 }}>✉️ Nouveau message</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.text.muted, fontSize: 24, cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          {/* Templates */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: T.text.muted, marginBottom: 8 }}>Templates rapides:</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {templates.map(tpl => (
                <button key={tpl.id} onClick={() => applyTemplate(tpl)} style={{
                  padding: '6px 12px', background: selectedTemplate === tpl.id ? T.accent.primary : T.bg.main,
                  border: `1px solid ${T.border}`, borderRadius: 6, cursor: 'pointer',
                  color: selectedTemplate === tpl.id ? '#fff' : T.text.secondary, fontSize: 12
                }}>{tpl.icon} {tpl.name}</button>
              ))}
            </div>
          </div>

          {/* To */}
          <input value={to} onChange={e => setTo(e.target.value)} placeholder="À: email@exemple.com"
            style={{ width: '100%', padding: 12, background: T.bg.input, border: `1px solid ${T.border}`,
              borderRadius: 8, color: T.text.primary, marginBottom: 12 }} />

          {/* Subject */}
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Objet"
            style={{ width: '100%', padding: 12, background: T.bg.input, border: `1px solid ${T.border}`,
              borderRadius: 8, color: T.text.primary, marginBottom: 12 }} />

          {/* Body */}
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Votre message..."
            rows={10} style={{ width: '100%', padding: 12, background: T.bg.input, border: `1px solid ${T.border}`,
              borderRadius: 8, color: T.text.primary, resize: 'vertical', fontFamily: 'inherit', marginBottom: 12 }} />

          {/* Signature Select */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: T.text.muted }}>Signature:</span>
            <select value={selectedSignature} onChange={e => setSelectedSignature(e.target.value)}
              style={{ padding: 8, background: T.bg.input, border: `1px solid ${T.border}`,
                borderRadius: 6, color: T.text.primary }}>
              {signatures.map(sig => <option key={sig.id} value={sig.id}>{sig.name}</option>)}
            </select>
          </div>

          {/* [E1-06] Schedule */}
          {showSchedule && (
            <div style={{ padding: 12, background: T.bg.main, borderRadius: 8, marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: T.text.muted, marginBottom: 8 }}>⏰ Programmer l'envoi:</div>
              <input type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)}
                style={{ padding: 8, background: T.bg.input, border: `1px solid ${T.border}`,
                  borderRadius: 6, color: T.text.primary }} />
            </div>
          )}
        </div>

        <div style={{ padding: 16, borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: 10, background: T.bg.main, border: `1px solid ${T.border}`,
              borderRadius: 8, cursor: 'pointer', color: T.text.secondary }}>📎</button>
            <button onClick={() => setShowSchedule(!showSchedule)} style={{
              padding: 10, background: showSchedule ? T.accent.warning : T.bg.main,
              border: `1px solid ${T.border}`, borderRadius: 8, cursor: 'pointer',
              color: showSchedule ? '#fff' : T.text.secondary }}>⏰</button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={{ padding: '10px 20px', background: T.bg.main,
              border: `1px solid ${T.border}`, borderRadius: 8, cursor: 'pointer', color: T.text.secondary }}>
              Annuler
            </button>
            <button style={{ padding: '10px 20px', background: T.accent.primary, border: 'none',
              borderRadius: 8, cursor: 'pointer', color: '#fff', fontWeight: 600 }}>
              {scheduleDate ? '⏰ Programmer' : '📤 Envoyer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// [E1-10] Rules Panel
const RulesPanel = ({ rules, onToggle }) => (
  <Card>
    <h3 style={{ color: T.text.primary, marginBottom: 16 }}>⚙️ Règles automatiques</h3>
    {rules.map(rule => (
      <div key={rule.id} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 12, background: T.bg.main, borderRadius: 8, marginBottom: 8
      }}>
        <div>
          <div style={{ fontWeight: 500, color: T.text.primary, fontSize: 13 }}>{rule.name}</div>
          <div style={{ fontSize: 11, color: T.text.muted }}>
            Si: <code style={{ background: T.bg.card, padding: '2px 6px', borderRadius: 4 }}>{rule.condition}</code>
            → {rule.action} {rule.target && `"${rule.target}"`}
          </div>
        </div>
        <button onClick={() => onToggle(rule.id)} style={{
          padding: '6px 12px', background: rule.enabled ? T.accent.success : T.bg.card,
          border: 'none', borderRadius: 6, cursor: 'pointer',
          color: rule.enabled ? '#fff' : T.text.muted, fontSize: 11
        }}>{rule.enabled ? '✓ Actif' : 'Inactif'}</button>
      </div>
    ))}
    <button style={{
      width: '100%', padding: 12, background: T.bg.hover, border: `1px dashed ${T.border}`,
      borderRadius: 8, cursor: 'pointer', color: T.text.muted, marginTop: 8
    }}>+ Nouvelle règle</button>
  </Card>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function EmailPro() {
  const [emails, setEmails] = useState(SAMPLE_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [rules, setRules] = useState(AUTO_RULES);
  const [showRules, setShowRules] = useState(false);

  const toggleStar = (id) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, starred: !e.starred } : e));
  };

  const toggleRule = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleReply = (email) => {
    setReplyTo(email);
    setShowCompose(true);
  };

  const filteredEmails = useMemo(() => {
    let filtered = emails;
    if (selectedFolder === 'starred') filtered = filtered.filter(e => e.starred);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.subject.toLowerCase().includes(q) ||
        e.from.name.toLowerCase().includes(q) ||
        e.from.email.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [emails, selectedFolder, searchQuery]);

  return (
    <div style={{ minHeight: '100vh', background: T.bg.main, color: T.text.primary, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: T.bg.card, borderBottom: `1px solid ${T.border}`,
        padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>📧</span>
          <span style={{ fontWeight: 700, fontSize: 20 }}>Email Pro</span>
          <Badge color={T.accent.primary}>Sprint 3.1</Badge>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {EMAIL_PROVIDERS.filter(p => p.connected).map(p => (
            <Badge key={p.id} color={p.color}>{p.icon} {p.email}</Badge>
          ))}
          <button onClick={() => setShowRules(!showRules)} style={{
            padding: '8px 16px', background: showRules ? T.accent.purple : T.bg.main,
            border: `1px solid ${T.border}`, borderRadius: 8, cursor: 'pointer',
            color: showRules ? '#fff' : T.text.secondary, fontSize: 13
          }}>⚙️ Règles</button>
          <button onClick={() => { setReplyTo(null); setShowCompose(true); }} style={{
            padding: '8px 16px', background: T.accent.primary, border: 'none',
            borderRadius: 8, cursor: 'pointer', color: '#fff', fontSize: 13, fontWeight: 600
          }}>✉️ Nouveau</button>
        </div>
      </header>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{ width: 200, borderRight: `1px solid ${T.border}`, padding: 12 }}>
          {FOLDERS.map(folder => (
            <button key={folder.id} onClick={() => setSelectedFolder(folder.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
              background: selectedFolder === folder.id ? `${T.accent.primary}20` : 'transparent',
              border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: 4,
              color: selectedFolder === folder.id ? T.accent.primary : T.text.secondary
            }}>
              <span>{folder.icon}</span>
              <span style={{ flex: 1, textAlign: 'left', fontSize: 13 }}>{folder.name}</span>
              {folder.count > 0 && <Badge color={T.text.muted}>{folder.count}</Badge>}
            </button>
          ))}
          
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.text.muted, marginBottom: 8, padding: '0 12px' }}>Labels</div>
            {LABELS.map(label => (
              <div key={label.id} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', fontSize: 12
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: label.color }} />
                <span style={{ color: T.text.secondary }}>{label.name}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Email List */}
        <div style={{ width: 350, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 12 }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {filteredEmails.map(email => (
              <EmailListItem
                key={email.id}
                email={email}
                selected={selectedEmail?.id === email.id}
                onSelect={setSelectedEmail}
                onStar={toggleStar}
              />
            ))}
          </div>
        </div>

        {/* Email Detail or Rules */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {showRules ? (
            <div style={{ padding: 24 }}>
              <RulesPanel rules={rules} onToggle={toggleRule} />
            </div>
          ) : selectedEmail ? (
            <EmailDetail email={selectedEmail} onReply={handleReply} />
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: T.text.muted }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
                <div>Sélectionnez un email pour le lire</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <ComposeEmail
          onClose={() => { setShowCompose(false); setReplyTo(null); }}
          replyTo={replyTo}
          templates={EMAIL_TEMPLATES}
          signatures={SIGNATURES}
        />
      )}
    </div>
  );
}
