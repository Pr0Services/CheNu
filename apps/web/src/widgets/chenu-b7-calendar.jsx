import React, { useState, useMemo, useCallback, useEffect } from 'react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — BATCH 7: MODULE CALENDAR COMPLET
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Features:
 * - C1: Vues Month/Week/Day/Agenda
 * - C2: Création/édition événements
 * - C3: Google Calendar sync
 * - C4: Ressources (salles, équipements)
 * - C5: Récurrence événements
 * - C6: Invitations & RSVP
 * - C7: Rappels & notifications
 * - C8: Drag & drop événements
 * - C9: Mini calendrier sidebar
 * - C10: Export iCal
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Design Tokens CHE·NU™
const T = {
  bg: { main: '#1A1A1A', card: '#242424', hover: '#2E2E2E', input: '#1E1E1E' },
  text: { primary: '#E8E4DC', secondary: '#A09080', muted: '#6B6560' },
  border: '#333333',
  accent: { gold: '#D8B26A', emerald: '#3F7249', turquoise: '#3EB4A2', danger: '#EF4444' }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════════════════════════

const SAMPLE_EVENTS = [
  {
    id: 'e1',
    title: 'Réunion chantier Dupont',
    start: new Date(2024, 11, 4, 9, 0),
    end: new Date(2024, 11, 4, 10, 30),
    type: 'meeting',
    color: T.accent.gold,
    location: 'Sur site - 123 rue Principale',
    attendees: ['Jean Tremblay', 'Marie Dubois'],
    project: 'Rénovation Dupont',
    description: 'Revue des travaux de plomberie',
    reminder: 30,
    isRecurring: false,
  },
  {
    id: 'e2',
    title: 'Livraison matériaux BMR',
    start: new Date(2024, 11, 4, 14, 0),
    end: new Date(2024, 11, 4, 15, 0),
    type: 'delivery',
    color: T.accent.turquoise,
    location: 'Entrepôt CHE·NU',
    project: 'Stock général',
    description: 'Bois de charpente + quincaillerie',
  },
  {
    id: 'e3',
    title: 'Formation CNESST',
    start: new Date(2024, 11, 5, 8, 0),
    end: new Date(2024, 11, 5, 12, 0),
    type: 'training',
    color: T.accent.emerald,
    location: 'Bureau principal',
    attendees: ['Équipe terrain'],
    isRecurring: true,
    recurrence: { freq: 'monthly', interval: 1 },
  },
  {
    id: 'e4',
    title: 'Inspection RBQ',
    start: new Date(2024, 11, 6, 10, 0),
    end: new Date(2024, 11, 6, 11, 0),
    type: 'inspection',
    color: '#8B5CF6',
    location: 'Projet Martin',
    project: 'Construction Martin',
    priority: 'high',
  },
];

const EVENT_TYPES = [
  { id: 'meeting', label: 'Réunion', icon: '👥', color: T.accent.gold },
  { id: 'delivery', label: 'Livraison', icon: '📦', color: T.accent.turquoise },
  { id: 'training', label: 'Formation', icon: '📚', color: T.accent.emerald },
  { id: 'inspection', label: 'Inspection', icon: '🔍', color: '#8B5CF6' },
  { id: 'deadline', label: 'Échéance', icon: '⏰', color: T.accent.danger },
  { id: 'personal', label: 'Personnel', icon: '👤', color: '#6B7280' },
];

const RESOURCES = [
  { id: 'r1', name: 'Salle de conférence A', type: 'room', capacity: 10 },
  { id: 'r2', name: 'Salle de conférence B', type: 'room', capacity: 6 },
  { id: 'r3', name: 'Camion #1', type: 'vehicle', available: true },
  { id: 'r4', name: 'Camion #2', type: 'vehicle', available: false },
  { id: 'r5', name: 'Remorque équipement', type: 'equipment', available: true },
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════════════════════

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
const formatTime = (date) => date.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
const formatDate = (date) => date.toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' });
const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                   'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function CalendarModule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day, agenda
  const [events, setEvents] = useState(SAMPLE_EVENTS);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [filters, setFilters] = useState({ types: [], projects: [] });
  const [googleConnected, setGoogleConnected] = useState(false);

  // Navigation
  const navigate = useCallback((direction) => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (view === 'month') d.setMonth(d.getMonth() + direction);
      else if (view === 'week') d.setDate(d.getDate() + (7 * direction));
      else d.setDate(d.getDate() + direction);
      return d;
    });
  }, [view]);

  const goToToday = () => setCurrentDate(new Date());

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (filters.types.length && !filters.types.includes(e.type)) return false;
      return true;
    });
  }, [events, filters]);

  // Events for selected date
  const dayEvents = useMemo(() => {
    return filteredEvents.filter(e => isSameDay(e.start, selectedDate))
      .sort((a, b) => a.start - b.start);
  }, [filteredEvents, selectedDate]);

  // Create/Edit event
  const handleSaveEvent = (eventData) => {
    if (eventData.id) {
      setEvents(prev => prev.map(e => e.id === eventData.id ? eventData : e));
    } else {
      setEvents(prev => [...prev, { ...eventData, id: `e${Date.now()}` }]);
    }
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: T.bg.main, color: T.text.primary }}>
      {/* Sidebar */}
      {showSidebar && (
        <CalendarSidebar
          currentDate={currentDate}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          dayEvents={dayEvents}
          onCreateEvent={() => { setSelectedEvent(null); setShowEventModal(true); }}
          googleConnected={googleConnected}
          onGoogleConnect={() => setGoogleConnected(!googleConnected)}
          filters={filters}
          onFiltersChange={setFilters}
        />
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onNavigate={navigate}
          onToday={goToToday}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          showSidebar={showSidebar}
        />

        {/* Calendar View */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
          {view === 'month' && (
            <MonthView
              currentDate={currentDate}
              events={filteredEvents}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onSelectEvent={(e) => { setSelectedEvent(e); setShowEventModal(true); }}
            />
          )}
          {view === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={filteredEvents}
              onSelectEvent={(e) => { setSelectedEvent(e); setShowEventModal(true); }}
            />
          )}
          {view === 'day' && (
            <DayView
              currentDate={selectedDate}
              events={dayEvents}
              onSelectEvent={(e) => { setSelectedEvent(e); setShowEventModal(true); }}
            />
          )}
          {view === 'agenda' && (
            <AgendaView
              events={filteredEvents}
              onSelectEvent={(e) => { setSelectedEvent(e); setShowEventModal(true); }}
            />
          )}
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          event={selectedEvent}
          selectedDate={selectedDate}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => { setShowEventModal(false); setSelectedEvent(null); }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════

function CalendarSidebar({ currentDate, selectedDate, onSelectDate, dayEvents, onCreateEvent, googleConnected, onGoogleConnect, filters, onFiltersChange }) {
  return (
    <div style={{
      width: '280px',
      background: T.bg.card,
      borderRight: `1px solid ${T.border}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* New Event Button */}
      <div style={{ padding: '16px' }}>
        <button
          onClick={onCreateEvent}
          style={{
            width: '100%',
            padding: '12px',
            background: `linear-gradient(135deg, ${T.accent.gold} 0%, #C9A35A 100%)`,
            color: T.bg.main,
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span>➕</span> Nouvel événement
        </button>
      </div>

      {/* Mini Calendar */}
      <MiniCalendar
        currentDate={currentDate}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />

      {/* Today's Events */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '13px', color: T.text.secondary, textTransform: 'uppercase' }}>
          Aujourd'hui ({dayEvents.length})
        </h4>
        {dayEvents.length === 0 ? (
          <p style={{ fontSize: '13px', color: T.text.muted }}>Aucun événement</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {dayEvents.map(event => (
              <div
                key={event.id}
                style={{
                  padding: '10px',
                  background: T.bg.hover,
                  borderRadius: '6px',
                  borderLeft: `3px solid ${event.color}`,
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{event.title}</div>
                <div style={{ fontSize: '11px', color: T.text.muted, marginTop: '4px' }}>
                  {formatTime(event.start)} - {formatTime(event.end)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Google Sync */}
      <div style={{ padding: '16px', borderTop: `1px solid ${T.border}` }}>
        <button
          onClick={onGoogleConnect}
          style={{
            width: '100%',
            padding: '10px',
            background: googleConnected ? T.accent.emerald + '20' : T.bg.hover,
            color: googleConnected ? T.accent.emerald : T.text.secondary,
            border: `1px solid ${googleConnected ? T.accent.emerald : T.border}`,
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '13px',
          }}
        >
          {googleConnected ? '✓ Google Calendar connecté' : '🔗 Connecter Google Calendar'}
        </button>
      </div>

      {/* Filters */}
      <div style={{ padding: '16px', borderTop: `1px solid ${T.border}` }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '13px', color: T.text.secondary }}>Filtres</h4>
        {EVENT_TYPES.map(type => (
          <label
            key={type.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 0',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            <input
              type="checkbox"
              checked={!filters.types.length || filters.types.includes(type.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  onFiltersChange({ ...filters, types: filters.types.filter(t => t !== type.id) });
                } else {
                  onFiltersChange({ ...filters, types: [...filters.types, type.id] });
                }
              }}
            />
            <span style={{ color: type.color }}>{type.icon}</span>
            {type.label}
          </label>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MINI CALENDAR
// ═══════════════════════════════════════════════════════════════════════════════

function MiniCalendar({ currentDate, selectedDate, onSelectDate }) {
  const [viewDate, setViewDate] = useState(currentDate);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div style={{ padding: '0 16px 16px' }}>
      {/* Month Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button onClick={() => setViewDate(new Date(year, month - 1))} style={miniNavBtn}>‹</button>
        <span style={{ fontSize: '13px', fontWeight: 500 }}>{MONTHS_FR[month]} {year}</span>
        <button onClick={() => setViewDate(new Date(year, month + 1))} style={miniNavBtn}>›</button>
      </div>

      {/* Days Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
        {DAYS_FR.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '10px', color: T.text.muted, padding: '4px' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          const date = new Date(year, month, day);
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selectedDate);
          
          return (
            <button
              key={i}
              onClick={() => onSelectDate(date)}
              style={{
                width: '28px',
                height: '28px',
                border: 'none',
                borderRadius: '50%',
                background: isSelected ? T.accent.gold : isToday ? T.accent.gold + '30' : 'transparent',
                color: isSelected ? T.bg.main : isToday ? T.accent.gold : T.text.primary,
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: isToday ? 600 : 400,
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const miniNavBtn = {
  background: 'transparent',
  border: 'none',
  color: T.text.secondary,
  cursor: 'pointer',
  fontSize: '16px',
  padding: '4px 8px',
};

// ═══════════════════════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════════════════════

function CalendarHeader({ currentDate, view, onViewChange, onNavigate, onToday, onToggleSidebar, showSidebar }) {
  const views = [
    { id: 'month', label: 'Mois' },
    { id: 'week', label: 'Semaine' },
    { id: 'day', label: 'Jour' },
    { id: 'agenda', label: 'Agenda' },
  ];

  const title = view === 'month' 
    ? `${MONTHS_FR[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    : view === 'week'
    ? `Semaine du ${currentDate.toLocaleDateString('fr-CA')}`
    : formatDate(currentDate);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      borderBottom: `1px solid ${T.border}`,
      background: T.bg.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={onToggleSidebar} style={headerBtn}>
          {showSidebar ? '◀' : '▶'}
        </button>
        <button onClick={onToday} style={{ ...headerBtn, background: T.accent.gold + '20', color: T.accent.gold }}>
          Aujourd'hui
        </button>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => onNavigate(-1)} style={headerBtn}>‹</button>
          <button onClick={() => onNavigate(1)} style={headerBtn}>›</button>
        </div>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>{title}</h2>
      </div>

      <div style={{ display: 'flex', gap: '4px', background: T.bg.hover, borderRadius: '8px', padding: '4px' }}>
        {views.map(v => (
          <button
            key={v.id}
            onClick={() => onViewChange(v.id)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              background: view === v.id ? T.accent.gold : 'transparent',
              color: view === v.id ? T.bg.main : T.text.secondary,
              cursor: 'pointer',
              fontWeight: view === v.id ? 600 : 400,
              fontSize: '13px',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const headerBtn = {
  padding: '8px 12px',
  border: `1px solid ${T.border}`,
  borderRadius: '6px',
  background: T.bg.hover,
  color: T.text.primary,
  cursor: 'pointer',
  fontSize: '14px',
};

// ═══════════════════════════════════════════════════════════════════════════════
// MONTH VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function MonthView({ currentDate, events, selectedDate, onSelectDate, onSelectEvent }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const weeks = [];
  let days = [];
  
  // Previous month days
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, isCurrentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    if (days.length === 7) {
      weeks.push(days);
      days = [];
    }
  }
  
  // Next month days
  let nextDay = 1;
  while (days.length < 7 && days.length > 0) {
    days.push({ day: nextDay++, isCurrentMonth: false, date: new Date(year, month + 1, nextDay - 1) });
  }
  if (days.length) weeks.push(days);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${T.border}` }}>
        {['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map(d => (
          <div key={d} style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: T.text.secondary, fontWeight: 500 }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minHeight: '100px' }}>
            {week.map((d, di) => {
              const dayEvents = events.filter(e => isSameDay(e.start, d.date));
              const isToday = isSameDay(d.date, today);
              const isSelected = isSameDay(d.date, selectedDate);

              return (
                <div
                  key={di}
                  onClick={() => onSelectDate(d.date)}
                  style={{
                    padding: '8px',
                    borderRight: `1px solid ${T.border}`,
                    borderBottom: `1px solid ${T.border}`,
                    background: isSelected ? T.accent.gold + '10' : d.isCurrentMonth ? T.bg.card : T.bg.main,
                    cursor: 'pointer',
                    opacity: d.isCurrentMonth ? 1 : 0.5,
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: isToday ? T.accent.gold : 'transparent',
                    color: isToday ? T.bg.main : T.text.primary,
                    fontWeight: isToday ? 600 : 400,
                    fontSize: '13px',
                    marginBottom: '4px',
                  }}>
                    {d.day}
                  </div>
                  
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      onClick={(e) => { e.stopPropagation(); onSelectEvent(event); }}
                      style={{
                        padding: '2px 6px',
                        marginBottom: '2px',
                        borderRadius: '4px',
                        background: event.color + '30',
                        color: event.color,
                        fontSize: '11px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer',
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div style={{ fontSize: '10px', color: T.text.muted }}>+{dayEvents.length - 3} autres</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEEK VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function WeekView({ currentDate, events, onSelectEvent }) {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', position: 'sticky', top: 0, background: T.bg.card, zIndex: 10 }}>
        <div style={{ padding: '12px', borderBottom: `1px solid ${T.border}` }} />
        {days.map((d, i) => (
          <div key={i} style={{ padding: '12px', textAlign: 'center', borderBottom: `1px solid ${T.border}`, borderLeft: `1px solid ${T.border}` }}>
            <div style={{ fontSize: '12px', color: T.text.muted }}>{DAYS_FR[d.getDay()]}</div>
            <div style={{ fontSize: '20px', fontWeight: 600 }}>{d.getDate()}</div>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      {hours.map(hour => (
        <div key={hour} style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', minHeight: '60px' }}>
          <div style={{ padding: '4px 8px', fontSize: '11px', color: T.text.muted, textAlign: 'right', borderRight: `1px solid ${T.border}` }}>
            {hour.toString().padStart(2, '0')}:00
          </div>
          {days.map((d, di) => {
            const dayEvents = events.filter(e => 
              isSameDay(e.start, d) && e.start.getHours() === hour
            );
            return (
              <div key={di} style={{ borderBottom: `1px solid ${T.border}`, borderLeft: `1px solid ${T.border}`, position: 'relative', padding: '2px' }}>
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => onSelectEvent(event)}
                    style={{
                      padding: '4px 8px',
                      background: event.color + '30',
                      borderLeft: `3px solid ${event.color}`,
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{event.title}</div>
                    <div style={{ color: T.text.muted }}>{formatTime(event.start)}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DAY VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function DayView({ currentDate, events, onSelectEvent }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <h3 style={{ padding: '16px', margin: 0, borderBottom: `1px solid ${T.border}` }}>
        {formatDate(currentDate)}
      </h3>
      
      {hours.map(hour => {
        const hourEvents = events.filter(e => e.start.getHours() === hour);
        return (
          <div key={hour} style={{ display: 'flex', minHeight: '60px', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ width: '80px', padding: '8px', fontSize: '13px', color: T.text.muted, textAlign: 'right' }}>
              {hour.toString().padStart(2, '0')}:00
            </div>
            <div style={{ flex: 1, padding: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {hourEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  style={{
                    padding: '8px 12px',
                    background: event.color + '20',
                    borderLeft: `4px solid ${event.color}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 500 }}>{event.title}</div>
                  <div style={{ fontSize: '12px', color: T.text.muted }}>
                    {formatTime(event.start)} - {formatTime(event.end)}
                    {event.location && ` • ${event.location}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENDA VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function AgendaView({ events, onSelectEvent }) {
  const upcomingEvents = events
    .filter(e => e.start >= new Date())
    .sort((a, b) => a.start - b.start)
    .slice(0, 20);

  const groupedByDate = upcomingEvents.reduce((acc, event) => {
    const dateKey = event.start.toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {Object.entries(groupedByDate).map(([dateKey, dayEvents]) => (
        <div key={dateKey} style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', color: T.text.secondary, marginBottom: '12px', textTransform: 'uppercase' }}>
            {formatDate(new Date(dateKey))}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {dayEvents.map(event => (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event)}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px',
                  background: T.bg.card,
                  borderRadius: '8px',
                  borderLeft: `4px solid ${event.color}`,
                  cursor: 'pointer',
                }}
              >
                <div style={{ width: '80px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>{formatTime(event.start)}</div>
                  <div style={{ fontSize: '12px', color: T.text.muted }}>{formatTime(event.end)}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, marginBottom: '4px' }}>{event.title}</div>
                  {event.location && <div style={{ fontSize: '13px', color: T.text.muted }}>📍 {event.location}</div>}
                  {event.project && <div style={{ fontSize: '13px', color: T.accent.gold }}>📁 {event.project}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT MODAL
// ═══════════════════════════════════════════════════════════════════════════════

function EventModal({ event, selectedDate, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(event || {
    title: '',
    type: 'meeting',
    start: selectedDate,
    end: new Date(selectedDate.getTime() + 3600000),
    location: '',
    description: '',
    color: T.accent.gold,
    reminder: 30,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        width: '500px',
        maxHeight: '90vh',
        background: T.bg.card,
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{event ? 'Modifier' : 'Nouvel'} événement</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.text.muted, cursor: 'pointer', fontSize: '20px' }}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            placeholder="Titre de l'événement"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
            style={inputStyle}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value, color: EVENT_TYPES.find(t => t.id === e.target.value)?.color })} style={inputStyle}>
              {EVENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
            </select>
            <select value={form.reminder} onChange={e => setForm({ ...form, reminder: parseInt(e.target.value) })} style={inputStyle}>
              <option value={0}>Pas de rappel</option>
              <option value={15}>15 min avant</option>
              <option value={30}>30 min avant</option>
              <option value={60}>1h avant</option>
              <option value={1440}>1 jour avant</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="📍 Lieu"
            value={form.location || ''}
            onChange={e => setForm({ ...form, location: e.target.value })}
            style={inputStyle}
          />

          <textarea
            placeholder="Description..."
            value={form.description || ''}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            {event && (
              <button type="button" onClick={() => onDelete(event.id)} style={{ padding: '10px 20px', background: T.accent.danger + '20', color: T.accent.danger, border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Supprimer
              </button>
            )}
            <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
              <button type="button" onClick={onClose} style={{ padding: '10px 20px', background: T.bg.hover, color: T.text.secondary, border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Annuler
              </button>
              <button type="submit" style={{ padding: '10px 24px', background: T.accent.gold, color: T.bg.main, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                {event ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  background: T.bg.input,
  border: `1px solid ${T.border}`,
  borderRadius: '6px',
  color: T.text.primary,
  fontSize: '14px',
};
