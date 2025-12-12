/**
 * CHE·NU V5.0 - QUOTE BUILDER (Générateur de soumissions)
 */
import React, { useState, useMemo } from 'react';

const colors = { gold: '#D8B26A', stone: '#8D8371', emerald: '#3F7249', turquoise: '#3EB4A2', moss: '#2F4C39', slate: '#1E1F22', sand: '#E9E4D6', dark: '#0f1217', card: 'rgba(22, 27, 34, 0.95)', border: 'rgba(216, 178, 106, 0.15)', red: '#E54D4D', blue: '#4D8BE5', orange: '#F97316' };

interface QuoteItem { id: string; description: string; quantity: number; unit: string; unitPrice: number; category: string; }
interface Quote { id: string; number: string; clientName: string; clientEmail: string; projectName: string; projectAddress: string; items: QuoteItem[]; validUntil: string; status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'; notes: string; createdAt: string; margin: number; }

const TAX = { TPS: 0.05, TVQ: 0.09975 };
const formatC = (n: number) => n.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' });

const mockQuotes: Quote[] = [
  { id: 'q1', number: 'SOU-2024-001', clientName: 'Martin Lavoie', clientEmail: 'martin@email.com', projectName: 'Rénovation cuisine', projectAddress: '123 Rue Exemple, Montréal', items: [
    { id: 'i1', description: 'Démolition cuisine existante', quantity: 1, unit: 'forfait', unitPrice: 2500, category: 'Démolition' },
    { id: 'i2', description: 'Armoires sur mesure', quantity: 12, unit: 'pi lin.', unitPrice: 450, category: 'Menuiserie' },
    { id: 'i3', description: 'Comptoir quartz', quantity: 25, unit: 'pi²', unitPrice: 85, category: 'Finition' },
    { id: 'i4', description: 'Installation plomberie', quantity: 1, unit: 'forfait', unitPrice: 3200, category: 'Plomberie' },
    { id: 'i5', description: 'Installation électrique', quantity: 1, unit: 'forfait', unitPrice: 2800, category: 'Électricité' },
  ], validUntil: '2024-12-31', status: 'sent', notes: 'Délai estimé: 4-6 semaines', createdAt: '2024-12-01', margin: 25 },
  { id: 'q2', number: 'SOU-2024-002', clientName: 'Sophie Tremblay', clientEmail: 'sophie@email.com', projectName: 'Salle de bain principale', projectAddress: '456 Ave des Pins, Laval', items: [
    { id: 'i6', description: 'Démolition salle de bain', quantity: 1, unit: 'forfait', unitPrice: 1800, category: 'Démolition' },
    { id: 'i7', description: 'Céramique plancher + murs', quantity: 180, unit: 'pi²', unitPrice: 12, category: 'Finition' },
    { id: 'i8', description: 'Vanité double', quantity: 1, unit: 'unité', unitPrice: 2200, category: 'Mobilier' },
  ], validUntil: '2024-12-20', status: 'accepted', notes: '', createdAt: '2024-11-28', margin: 30 },
  { id: 'q3', number: 'SOU-2024-003', clientName: 'Jean-Pierre Roy', clientEmail: 'jp.roy@email.com', projectName: 'Terrasse extérieure', projectAddress: '789 Boul. du Parc, Longueuil', items: [
    { id: 'i9', description: 'Structure terrasse bois traité', quantity: 200, unit: 'pi²', unitPrice: 35, category: 'Structure' },
    { id: 'i10', description: 'Rampe aluminium', quantity: 40, unit: 'pi lin.', unitPrice: 65, category: 'Finition' },
  ], validUntil: '2024-12-15', status: 'draft', notes: 'En attente confirmation dimensions', createdAt: '2024-12-05', margin: 20 },
];

const itemLibrary = [
  { desc: 'Démolition générale', unit: 'forfait', price: 2000, cat: 'Démolition' },
  { desc: 'Main d\'oeuvre générale', unit: 'heure', price: 65, cat: 'Main d\'oeuvre' },
  { desc: 'Gypse 1/2"', unit: 'feuille', price: 18, cat: 'Matériaux' },
  { desc: 'Peinture intérieure', unit: 'pi²', price: 4, cat: 'Finition' },
  { desc: 'Céramique pose', unit: 'pi²', price: 8, cat: 'Finition' },
  { desc: 'Électricien', unit: 'heure', price: 85, cat: 'Électricité' },
  { desc: 'Plombier', unit: 'heure', price: 90, cat: 'Plomberie' },
];

const StatusBadge = ({ status }: { status: Quote['status'] }) => {
  const cfg: Record<string, { l: string; c: string }> = { draft: { l: '📝 Brouillon', c: colors.stone }, sent: { l: '📤 Envoyée', c: colors.blue }, accepted: { l: '✅ Acceptée', c: colors.emerald }, rejected: { l: '❌ Refusée', c: colors.red }, expired: { l: '⏰ Expirée', c: colors.orange } };
  const c = cfg[status];
  return <span style={{ padding: '4px 10px', background: `${c.c}20`, color: c.c, borderRadius: 20, fontSize: 11 }}>{c.l}</span>;
};

const QuoteBuilder: React.FC = () => {
  const [quotes, setQuotes] = useState(mockQuotes);
  const [selected, setSelected] = useState<Quote | null>(null);
  const [editing, setEditing] = useState<Quote | null>(null);
  const [view, setView] = useState<'list' | 'edit' | 'preview'>('list');
  const [filter, setFilter] = useState('all');

  const filtered = quotes.filter(q => filter === 'all' || q.status === filter);
  const stats = useMemo(() => ({
    total: quotes.length,
    sent: quotes.filter(q => q.status === 'sent').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    totalValue: quotes.filter(q => q.status === 'accepted').reduce((s, q) => s + q.items.reduce((t, i) => t + i.quantity * i.unitPrice, 0), 0),
  }), [quotes]);

  const calcTotals = (items: QuoteItem[], margin: number) => {
    const cost = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const withMargin = cost * (1 + margin / 100);
    const tps = withMargin * TAX.TPS;
    const tvq = withMargin * TAX.TVQ;
    return { cost, withMargin, tps, tvq, total: withMargin + tps + tvq };
  };

  const createQuote = () => {
    const newQ: Quote = { id: `q-${Date.now()}`, number: `SOU-2024-${String(quotes.length + 1).padStart(3, '0')}`, clientName: '', clientEmail: '', projectName: '', projectAddress: '', items: [], validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], status: 'draft', notes: '', createdAt: new Date().toISOString().split('T')[0], margin: 25 };
    setEditing(newQ);
    setView('edit');
  };

  const saveQuote = () => {
    if (!editing) return;
    setQuotes(quotes.find(q => q.id === editing.id) ? quotes.map(q => q.id === editing.id ? editing : q) : [...quotes, editing]);
    setSelected(editing);
    setView('list');
  };

  const addItem = () => {
    if (!editing) return;
    setEditing({ ...editing, items: [...editing.items, { id: `i-${Date.now()}`, description: '', quantity: 1, unit: 'unité', unitPrice: 0, category: 'Général' }] });
  };

  const updateItem = (idx: number, item: QuoteItem) => {
    if (!editing) return;
    const items = [...editing.items];
    items[idx] = item;
    setEditing({ ...editing, items });
  };

  const removeItem = (idx: number) => {
    if (!editing) return;
    setEditing({ ...editing, items: editing.items.filter((_, i) => i !== idx) });
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.dark, color: colors.sand, fontFamily: 'Inter' }}>
      <div style={{ padding: '20px 32px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between' }}>
        <div><h1 style={{ fontSize: 24, margin: 0 }}>📑 Soumissions</h1><p style={{ color: colors.stone, margin: '4px 0 0', fontSize: 13 }}>{stats.total} soumissions • {formatC(stats.totalValue)} acceptées</p></div>
        <button onClick={createQuote} style={{ padding: '12px 24px', background: colors.gold, border: 'none', borderRadius: 10, color: colors.dark, fontWeight: 600, cursor: 'pointer' }}>+ Nouvelle soumission</button>
      </div>

      {view === 'list' && (
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', height: 'calc(100vh - 80px)' }}>
          <div style={{ borderRight: `1px solid ${colors.border}`, padding: 20, overflow: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16, textAlign: 'center' }}><div style={{ color: colors.emerald, fontSize: 20, fontWeight: 700 }}>{stats.accepted}</div><div style={{ color: colors.stone, fontSize: 11 }}>Acceptées</div></div>
              <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16, textAlign: 'center' }}><div style={{ color: colors.gold, fontSize: 20, fontWeight: 700 }}>{stats.sent}</div><div style={{ color: colors.stone, fontSize: 11 }}>En attente</div></div>
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand, marginBottom: 16 }}>
              <option value="all">Toutes ({stats.total})</option><option value="draft">Brouillons</option><option value="sent">Envoyées</option><option value="accepted">Acceptées</option><option value="rejected">Refusées</option>
            </select>
            {filtered.map(q => {
              const t = calcTotals(q.items, q.margin);
              return (
                <div key={q.id} onClick={() => setSelected(q)} style={{ padding: 16, background: selected?.id === q.id ? `${colors.gold}10` : colors.card, border: `1px solid ${selected?.id === q.id ? colors.gold : colors.border}`, borderRadius: 12, marginBottom: 10, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><div style={{ fontWeight: 600 }}>{q.number}</div><StatusBadge status={q.status} /></div>
                  <div style={{ color: colors.sand, marginBottom: 4 }}>{q.projectName || 'Sans titre'}</div>
                  <div style={{ color: colors.stone, fontSize: 13 }}>{q.clientName || 'Client non défini'}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}><span style={{ color: colors.stone, fontSize: 12 }}>Valide: {q.validUntil}</span><span style={{ color: colors.gold, fontWeight: 600 }}>{formatC(t.total)}</span></div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: 24, overflow: 'auto' }}>
            {selected ? (() => {
              const t = calcTotals(selected.items, selected.margin);
              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <StatusBadge status={selected.status} />
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={() => { setEditing(selected); setView('edit'); }} style={{ padding: '10px 20px', background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand, cursor: 'pointer' }}>✏️ Modifier</button>
                      <button style={{ padding: '10px 20px', background: colors.moss, border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>📄 PDF</button>
                      {selected.status === 'draft' && <button style={{ padding: '10px 20px', background: colors.turquoise, border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>📤 Envoyer</button>}
                    </div>
                  </div>
                  <div style={{ background: '#fff', color: '#1a1a1a', padding: 40, borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
                      <div><h1 style={{ margin: 0, fontSize: 28 }}>SOUMISSION</h1><div style={{ color: colors.gold }}>{selected.number}</div></div>
                      <div style={{ textAlign: 'right', fontSize: 13 }}><strong>Services Pro Construction</strong><br />4567 Rue du Commerce, Montréal<br />514-555-0000</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                      <div><div style={{ color: '#888', fontSize: 11 }}>CLIENT</div><strong>{selected.clientName}</strong><br />{selected.clientEmail}</div>
                      <div style={{ textAlign: 'right' }}><div style={{ color: '#888', fontSize: 11 }}>PROJET</div><strong>{selected.projectName}</strong><br />{selected.projectAddress}</div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
                      <thead><tr style={{ borderBottom: '2px solid #ddd' }}><th style={{ textAlign: 'left', padding: 8, fontSize: 11, color: '#888' }}>DESCRIPTION</th><th style={{ textAlign: 'center', padding: 8, fontSize: 11, color: '#888' }}>QTÉ</th><th style={{ textAlign: 'center', padding: 8, fontSize: 11, color: '#888' }}>UNITÉ</th><th style={{ textAlign: 'right', padding: 8, fontSize: 11, color: '#888' }}>PRIX</th><th style={{ textAlign: 'right', padding: 8, fontSize: 11, color: '#888' }}>TOTAL</th></tr></thead>
                      <tbody>{selected.items.map(item => (<tr key={item.id} style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: 8 }}>{item.description}<br /><span style={{ fontSize: 11, color: '#888' }}>{item.category}</span></td><td style={{ padding: 8, textAlign: 'center' }}>{item.quantity}</td><td style={{ padding: 8, textAlign: 'center' }}>{item.unit}</td><td style={{ padding: 8, textAlign: 'right' }}>{formatC(item.unitPrice)}</td><td style={{ padding: 8, textAlign: 'right', fontWeight: 500 }}>{formatC(item.quantity * item.unitPrice)}</td></tr>))}</tbody>
                    </table>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{ width: 280 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span>Sous-total</span><span>{formatC(t.cost)}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#666' }}><span>Marge ({selected.margin}%)</span><span>{formatC(t.withMargin - t.cost)}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#666', fontSize: 13 }}><span>TPS (5%)</span><span>{formatC(t.tps)}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#666', fontSize: 13 }}><span>TVQ (9.975%)</span><span>{formatC(t.tvq)}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '2px solid #333', fontSize: 18, fontWeight: 700 }}><span>TOTAL</span><span style={{ color: colors.moss }}>{formatC(t.total)}</span></div>
                      </div>
                    </div>
                    {selected.notes && <div style={{ marginTop: 20, padding: 16, background: '#f5f5f5', borderRadius: 8, fontSize: 13 }}><strong>Notes:</strong> {selected.notes}</div>}
                    <div style={{ marginTop: 20, textAlign: 'center', color: '#888', fontSize: 11 }}>Valide jusqu'au {selected.validUntil}</div>
                  </div>
                </div>
              );
            })() : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: colors.stone }}><span style={{ fontSize: 48, marginBottom: 16 }}>📑</span>Sélectionnez une soumission</div>}
          </div>
        </div>
      )}

      {view === 'edit' && editing && (
        <div style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ margin: 0 }}>✏️ {quotes.find(q => q.id === editing.id) ? 'Modifier' : 'Nouvelle'} soumission</h2>
            <div style={{ display: 'flex', gap: 12 }}><button onClick={() => setView('list')} style={{ padding: '10px 20px', background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand, cursor: 'pointer' }}>Annuler</button><button onClick={saveQuote} style={{ padding: '10px 20px', background: colors.gold, border: 'none', borderRadius: 8, color: colors.dark, fontWeight: 600, cursor: 'pointer' }}>💾 Sauvegarder</button></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div><label style={{ color: colors.stone, fontSize: 12 }}>Nom du client</label><input value={editing.clientName} onChange={e => setEditing({ ...editing, clientName: e.target.value })} style={{ width: '100%', padding: 12, background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand, marginTop: 6 }} /></div>
            <div><label style={{ color: colors.stone, fontSize: 12 }}>Email client</label><input value={editing.clientEmail} onChange={e => setEditing({ ...editing, clientEmail: e.target.value })} style={{ width: '100%', padding: 12, background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand, marginTop: 6 }} /></div>
            <div><label style={{ color: colors.stone, fontSize: 12 }}>Nom du projet</label><input value={editing.projectName} onChange={e => setEditing({ ...editing, projectName: e.target.value })} style={{ width: '100%', padding: 12, background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand, marginTop: 6 }} /></div>
            <div><label style={{ color: colors.stone, fontSize: 12 }}>Adresse projet</label><input value={editing.projectAddress} onChange={e => setEditing({ ...editing, projectAddress: e.target.value })} style={{ width: '100%', padding: 12, background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand, marginTop: 6 }} /></div>
            <div><label style={{ color: colors.stone, fontSize: 12 }}>Valide jusqu'au</label><input type="date" value={editing.validUntil} onChange={e => setEditing({ ...editing, validUntil: e.target.value })} style={{ width: '100%', padding: 12, background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand, marginTop: 6 }} /></div>
            <div><label style={{ color: colors.stone, fontSize: 12 }}>Marge (%)</label><input type="number" value={editing.margin} onChange={e => setEditing({ ...editing, margin: +e.target.value })} style={{ width: '100%', padding: 12, background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand, marginTop: 6 }} /></div>
          </div>
          <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px' }}>📦 Articles</h3>
            {editing.items.map((item, idx) => (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 80px 80px 100px 100px 40px', gap: 10, marginBottom: 10 }}>
                <input value={item.description} onChange={e => updateItem(idx, { ...item, description: e.target.value })} placeholder="Description" style={{ padding: 10, background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.sand }} />
                <input type="number" value={item.quantity} onChange={e => updateItem(idx, { ...item, quantity: +e.target.value })} style={{ padding: 10, background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.sand, textAlign: 'center' }} />
                <input value={item.unit} onChange={e => updateItem(idx, { ...item, unit: e.target.value })} style={{ padding: 10, background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.sand, textAlign: 'center' }} />
                <input type="number" value={item.unitPrice} onChange={e => updateItem(idx, { ...item, unitPrice: +e.target.value })} style={{ padding: 10, background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.sand, textAlign: 'right' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.gold }}>{formatC(item.quantity * item.unitPrice)}</div>
                <button onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', color: colors.red, cursor: 'pointer', fontSize: 18 }}>✕</button>
              </div>
            ))}
            <button onClick={addItem} style={{ padding: 10, background: 'transparent', border: `1px dashed ${colors.border}`, borderRadius: 8, color: colors.stone, cursor: 'pointer', width: '100%' }}>+ Ajouter article</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 300, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20 }}>
              {(() => { const t = calcTotals(editing.items, editing.margin); return <>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span>Coût</span><span>{formatC(t.cost)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: colors.stone }}><span>Marge</span><span>{formatC(t.withMargin - t.cost)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: colors.stone, fontSize: 13 }}><span>TPS</span><span>{formatC(t.tps)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: colors.stone, fontSize: 13 }}><span>TVQ</span><span>{formatC(t.tvq)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: `1px solid ${colors.border}`, fontSize: 18, fontWeight: 700 }}><span>Total</span><span style={{ color: colors.gold }}>{formatC(t.total)}</span></div>
              </>; })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteBuilder;
