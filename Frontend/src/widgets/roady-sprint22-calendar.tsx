import React, { useState, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ROADY V22 - SPRINT 2.2: CALENDAR PRO
// ═══════════════════════════════════════════════════════════════════════════════
// C1-01: Intégration Google Calendar API (sync bidirectionnelle)
// C1-02: Intégration Microsoft Outlook API
// C1-03: Vue "Équipe" - calendriers superposés
// C1-04: Réservation ressources (équipements, véhicules)
// C1-05: Événements récurrents avec exceptions
// C1-06: Météo intégrée sur chaque jour
// C1-07: Temps de trajet automatique (Google Maps)
// C1-08: Invitations avec réponses (Accept/Decline/Maybe)
// C1-09: Vue Agenda (liste chronologique)
// C1-10: Intégration Calendly pour RDV clients
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
const TEAM_MEMBERS = [
  { id: 1, name: 'Jean Tremblay', role: 'Chef de projet', avatar: '👷', color: '#3b82f6' },
  { id: 2, name: 'Marie Dubois', role: 'Architecte', avatar: '👩‍💼', color: '#8b5cf6' },
  { id: 3, name: 'Pierre Gagnon', role: 'Électricien', avatar: '⚡', color: '#f59e0b' },
  { id: 4, name: 'Sophie Martin', role: 'Plombière', avatar: '🔧', color: '#10b981' },
  { id: 5, name: 'Luc Bergeron', role: 'Charpentier', avatar: '🪚', color: '#ef4444' }
];

const RESOURCES = [
  { id: 'r1', name: 'Excavatrice CAT 320', type: 'equipment', icon: '🚜', color: '#f59e0b' },
  { id: 'r2', name: 'Ford F-150 #1', type: 'vehicle', icon: '🚗', color: '#3b82f6' },
  { id: 'r3', name: 'Ford F-150 #2', type: 'vehicle', icon: '🚗', color: '#3b82f6' },
  { id: 'r4', name: 'Grue mobile', type: 'equipment', icon: '🏗️', color: '#8b5cf6' },
  { id: 'r5', name: 'Salle réunion A', type: 'room', icon: '🏢', color: '#10b981' }
];

const WEATHER_DATA = {
  '2024-12-03': { icon: '☀️', temp: -2, condition: 'Ensoleillé', wind: 15 },
  '2024-12-04': { icon: '🌤️', temp: 1, condition: 'Partiellement nuageux', wind: 20 },
  '2024-12-05': { icon: '🌨️', temp: -5, condition: 'Neige légère', wind: 25, alert: true },
  '2024-12-06': { icon: '❄️', temp: -12, condition: 'Très froid', wind: 30, alert: true },
  '2024-12-07': { icon: '🌤️', temp: -3, condition: 'Dégagement', wind: 10 }
};

const SAMPLE_EVENTS = [
  { id: 1, title: 'Réunion chantier Tremblay', start: '2024-12-03T09:00', end: '2024-12-03T10:30', 
    type: 'meeting', attendees: [1, 2], location: 'Sur site', color: '#3b82f6',
    travelTime: 25, resources: [], rsvp: { 1: 'accepted', 2: 'accepted' } },
  { id: 2, title: 'Inspection électrique', start: '2024-12-03T14:00', end: '2024-12-03T16:00',
    type: 'inspection', attendees: [3], location: '123 Rue Principale', color: '#f59e0b',
    travelTime: 15, resources: ['r2'], rsvp: { 3: 'accepted' } },
  { id: 3, title: 'Livraison matériaux', start: '2024-12-04T08:00', end: '2024-12-04T09:00',
    type: 'delivery', attendees: [1, 5], location: 'Chantier Laval', color: '#10b981',
    travelTime: 35, resources: ['r1', 'r3'], rsvp: { 1: 'accepted', 5: 'pending' } },
  { id: 4, title: 'Coulage béton', start: '2024-12-04T10:00', end: '2024-12-04T15:00',
    type: 'work', attendees: [1, 4, 5], location: 'Chantier Nord', color: '#8b5cf6',
    recurring: { freq: 'weekly', until: '2024-12-25' }, travelTime: 20, resources: ['r1'],
    rsvp: { 1: 'accepted', 4: 'accepted', 5: 'declined' } },
  { id: 5, title: 'RDV Client - Devis', start: '2024-12-05T11:00', end: '2024-12-05T12:00',
    type: 'client', attendees: [1, 2], location: 'Bureau', color: '#ec4899',
    calendly: true, travelTime: 0, resources: ['r5'], rsvp: { 1: 'accepted', 2: 'maybe' } }
];

const CALENDAR_SOURCES = [
  { id: 'roady', name: 'ROADY', icon: '🚀', color: '#4ade80', connected: true },
  { id: 'google', name: 'Google Calendar', icon: '📅', color: '#4285f4', connected: true },
  { id: 'outlook', name: 'Outlook', icon: '📧', color: '#0078d4', connected: false },
  { id: 'calendly', name: 'Calendly', icon: '📆', color: '#006bff', connected: true }
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
const Card = ({ children, style = {} }) => (
  <div style={{ background: T.bg.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16, ...style }}>
    {children}
  </div>
);

const Badge = ({ children, color = T.accent.primary }) => (
  <span style={{ background: `${color}20`, color, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
    {children}
  </span>
);

// [C1-06] Weather Widget
const WeatherWidget = ({ date }) => {
  const weather = WEATHER_DATA[date];
  if (!weather) return null;
  
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
      background: weather.alert ? `${T.accent.danger}15` : T.bg.main,
      borderRadius: 8, border: weather.alert ? `1px solid ${T.accent.danger}40` : 'none'
    }}>
      <span style={{ fontSize: 24 }}>{weather.icon}</span>
      <div>
        <div style={{ fontWeight: 600, color: T.text.primary }}>{weather.temp}°C</div>
        <div style={{ fontSize: 11, color: T.text.muted }}>{weather.condition}</div>
      </div>
      {weather.alert && <span style={{ fontSize: 12 }}>⚠️</span>}
    </div>
  );
};

// [C1-08] RSVP Badge
const RSVPBadge = ({ status }) => {
  const config = {
    accepted: { icon: '✓', color: T.accent.success, label: 'Accepté' },
    declined: { icon: '✗', color: T.accent.danger, label: 'Refusé' },
    maybe: { icon: '?', color: T.accent.warning, label: 'Peut-être' },
    pending: { icon: '•', color: T.text.muted, label: 'En attente' }
  };
  const c = config[status] || config.pending;
  return <Badge color={c.color}>{c.icon} {c.label}</Badge>;
};

// [C1-04] Resource Chip
const ResourceChip = ({ resourceId }) => {
  const resource = RESOURCES.find(r => r.id === resourceId);
  if (!resource) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px',
      background: `${resource.color}20`, borderRadius: 6, fontSize: 11
    }}>
      {resource.icon} {resource.name}
    </span>
  );
};

// Event Card
const EventCard = ({ event, compact = false }) => {
  const startTime = new Date(event.start).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
  const endTime = new Date(event.end).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div style={{
      background: T.bg.card, borderLeft: `4px solid ${event.color}`, borderRadius: 8,
      padding: compact ? 8 : 12, marginBottom: 8
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 600, color: T.text.primary, marginBottom: 4 }}>
            {event.title}
            {event.recurring && <span style={{ marginLeft: 6, fontSize: 12 }}>🔄</span>}
            {event.calendly && <span style={{ marginLeft: 6, fontSize: 12 }}>📆</span>}
          </div>
          <div style={{ fontSize: 12, color: T.text.muted }}>
            🕐 {startTime} - {endTime}
            {event.travelTime > 0 && <span style={{ marginLeft: 8 }}>🚗 {event.travelTime} min</span>}
          </div>
        </div>
        {!compact && (
          <div style={{ display: 'flex', gap: 4 }}>
            {event.attendees.slice(0, 3).map(id => {
              const member = TEAM_MEMBERS.find(m => m.id === id);
              return member ? (
                <div key={id} title={`${member.name} - ${event.rsvp?.[id] || 'pending'}`} style={{
                  width: 28, height: 28, borderRadius: '50%', background: `${member.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                  border: event.rsvp?.[id] === 'accepted' ? `2px solid ${T.accent.success}` : 
                         event.rsvp?.[id] === 'declined' ? `2px solid ${T.accent.danger}` : `2px solid ${T.border}`
                }}>{member.avatar}</div>
              ) : null;
            })}
          </div>
        )}
      </div>
      
      {!compact && (
        <>
          <div style={{ fontSize: 12, color: T.text.secondary, marginTop: 8 }}>
            📍 {event.location}
          </div>
          {event.resources?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {event.resources.map(rId => <ResourceChip key={rId} resourceId={rId} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// [C1-03] Team Calendar View
const TeamCalendarView = ({ events, selectedMembers, onToggleMember }) => (
  <Card>
    <h3 style={{ color: T.text.primary, marginBottom: 16 }}>👥 Vue Équipe</h3>
    
    {/* Member Filters */}
    <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
      {TEAM_MEMBERS.map(member => (
        <button
          key={member.id}
          onClick={() => onToggleMember(member.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
            background: selectedMembers.includes(member.id) ? `${member.color}30` : T.bg.main,
            border: `1px solid ${selectedMembers.includes(member.id) ? member.color : T.border}`,
            borderRadius: 20, cursor: 'pointer', color: T.text.primary, fontSize: 13
          }}
        >
          <span>{member.avatar}</span>
          <span>{member.name.split(' ')[0]}</span>
        </button>
      ))}
    </div>

    {/* Team Timeline */}
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(24, 40px)', gap: 1 }}>
        {/* Header */}
        <div style={{ background: T.bg.main, padding: 8, fontWeight: 600, fontSize: 12 }}>Membre</div>
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} style={{ background: T.bg.main, padding: 4, textAlign: 'center', fontSize: 10, color: T.text.muted }}>
            {i.toString().padStart(2, '0')}h
          </div>
        ))}
        
        {/* Member Rows */}
        {TEAM_MEMBERS.filter(m => selectedMembers.includes(m.id)).map(member => (
          <React.Fragment key={member.id}>
            <div style={{ background: T.bg.card, padding: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <span>{member.avatar}</span>
              <span>{member.name.split(' ')[0]}</span>
            </div>
            {Array.from({ length: 24 }, (_, hour) => {
              const hourEvents = events.filter(e => {
                const startHour = new Date(e.start).getHours();
                const endHour = new Date(e.end).getHours();
                return e.attendees.includes(member.id) && hour >= startHour && hour < endHour;
              });
              return (
                <div key={hour} style={{
                  background: hourEvents.length > 0 ? `${hourEvents[0].color}40` : T.bg.hover,
                  borderRadius: 2, minHeight: 30
                }} title={hourEvents[0]?.title} />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  </Card>
);

// [C1-04] Resource Booking
const ResourceBooking = ({ resources, events }) => {
  const [selectedDate] = useState('2024-12-04');
  
  return (
    <Card>
      <h3 style={{ color: T.text.primary, marginBottom: 16 }}>🚜 Réservation Ressources</h3>
      <div style={{ display: 'grid', gap: 12 }}>
        {resources.map(resource => {
          const booked = events.filter(e => e.resources?.includes(resource.id));
          const isAvailable = booked.length === 0;
          
          return (
            <div key={resource.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 12, background: T.bg.main, borderRadius: 8
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>{resource.icon}</span>
                <div>
                  <div style={{ fontWeight: 500, color: T.text.primary }}>{resource.name}</div>
                  <div style={{ fontSize: 12, color: T.text.muted }}>{resource.type}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {booked.length > 0 ? (
                  <Badge color={T.accent.warning}>Réservé ({booked.length})</Badge>
                ) : (
                  <Badge color={T.accent.success}>Disponible</Badge>
                )}
                <button style={{
                  padding: '6px 12px', background: T.accent.primary, border: 'none',
                  borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 12
                }}>Réserver</button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// [C1-01/02] Calendar Sources Panel
const CalendarSources = ({ sources, onToggle }) => (
  <Card style={{ marginBottom: 16 }}>
    <h3 style={{ color: T.text.primary, marginBottom: 12, fontSize: 14 }}>📅 Sources</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {sources.map(source => (
        <div key={source.id} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px', background: T.bg.main, borderRadius: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{source.icon}</span>
            <span style={{ fontSize: 13, color: T.text.primary }}>{source.name}</span>
          </div>
          <button
            onClick={() => onToggle(source.id)}
            style={{
              padding: '4px 10px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: source.connected ? T.accent.success : T.bg.card,
              color: source.connected ? '#fff' : T.text.muted, fontSize: 11
            }}
          >{source.connected ? '✓ Sync' : 'Connecter'}</button>
        </div>
      ))}
    </div>
  </Card>
);

// [C1-09] Agenda View
const AgendaView = ({ events }) => {
  const sortedEvents = [...events].sort((a, b) => new Date(a.start) - new Date(b.start));
  const groupedByDate = sortedEvents.reduce((acc, event) => {
    const date = event.start.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(groupedByDate).map(([date, dayEvents]) => (
        <div key={date} style={{ marginBottom: 20 }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${T.border}`
          }}>
            <div style={{ fontWeight: 600, color: T.text.primary }}>
              {new Date(date).toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <WeatherWidget date={date} />
          </div>
          {dayEvents.map(event => <EventCard key={event.id} event={event} />)}
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CALENDAR APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function CalendarPro() {
  const [view, setView] = useState('agenda');
  const [events] = useState(SAMPLE_EVENTS);
  const [sources, setSources] = useState(CALENDAR_SOURCES);
  const [selectedMembers, setSelectedMembers] = useState([1, 2, 3]);
  const [showNewEvent, setShowNewEvent] = useState(false);

  const toggleMember = (id) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const toggleSource = (id) => {
    setSources(prev => prev.map(s => 
      s.id === id ? { ...s, connected: !s.connected } : s
    ));
  };

  const views = [
    { id: 'agenda', icon: '📋', label: 'Agenda' },
    { id: 'team', icon: '👥', label: 'Équipe' },
    { id: 'resources', icon: '🚜', label: 'Ressources' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: T.bg.main, color: T.text.primary }}>
      {/* Header */}
      <header style={{
        background: T.bg.card, borderBottom: `1px solid ${T.border}`,
        padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>📅</span>
          <span style={{ fontWeight: 700, fontSize: 20 }}>Calendar Pro</span>
          <Badge color={T.accent.primary}>Sprint 2.2</Badge>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {views.map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: view === v.id ? T.accent.primary : T.bg.main,
              color: view === v.id ? '#fff' : T.text.secondary
            }}>{v.icon} {v.label}</button>
          ))}
          <button onClick={() => setShowNewEvent(true)} style={{
            padding: '10px 20px', background: T.accent.success, border: 'none',
            borderRadius: 10, color: '#fff', cursor: 'pointer', fontWeight: 600
          }}>+ Événement</button>
        </div>
      </header>

      {/* Main */}
      <main style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, padding: 24 }}>
        {/* Sidebar */}
        <aside>
          <CalendarSources sources={sources} onToggle={toggleSource} />
          <Card>
            <h3 style={{ color: T.text.primary, marginBottom: 12, fontSize: 14 }}>📊 Stats Semaine</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: T.text.muted }}>Événements</span>
                <span style={{ color: T.text.primary, fontWeight: 600 }}>{events.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: T.text.muted }}>Réunions</span>
                <span style={{ color: T.text.primary, fontWeight: 600 }}>{events.filter(e => e.type === 'meeting').length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: T.text.muted }}>Temps trajet total</span>
                <span style={{ color: T.text.primary, fontWeight: 600 }}>{events.reduce((s, e) => s + (e.travelTime || 0), 0)} min</span>
              </div>
            </div>
          </Card>
        </aside>

        {/* Content */}
        <div>
          {view === 'agenda' && <AgendaView events={events} />}
          {view === 'team' && <TeamCalendarView events={events} selectedMembers={selectedMembers} onToggleMember={toggleMember} />}
          {view === 'resources' && <ResourceBooking resources={RESOURCES} events={events} />}
        </div>
      </main>
    </div>
  );
}
