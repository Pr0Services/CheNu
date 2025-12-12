/**
 * CHE·NU V5.0 - SMART CALENDAR
 */
import React, { useState } from 'react';

const colors = { gold: '#D8B26A', stone: '#8D8371', emerald: '#3F7249', turquoise: '#3EB4A2', moss: '#2F4C39', slate: '#1E1F22', sand: '#E9E4D6', dark: '#0f1217', card: 'rgba(22, 27, 34, 0.95)', border: 'rgba(216, 178, 106, 0.15)', red: '#E54D4D', blue: '#4D8BE5', orange: '#F97316', purple: '#8B5CF6' };

interface Event { id: string; title: string; date: string; startTime: string; endTime: string; category: string; location?: string; description?: string; attendees?: string[]; }

const categoryColors: Record<string, string> = { 'Réunion': colors.blue, 'Chantier': colors.emerald, 'Livraison': colors.orange, 'Inspection': colors.purple, 'Personnel': colors.turquoise, 'Autre': colors.stone };

const mockEvents: Event[] = [
  { id: 'e1', title: 'Réunion équipe', date: '2024-12-05', startTime: '09:00', endTime: '10:00', category: 'Réunion', location: 'Bureau', attendees: ['Jean', 'Marc'] },
  { id: 'e2', title: 'Visite chantier Tremblay', date: '2024-12-05', startTime: '14:00', endTime: '16:00', category: 'Chantier', location: '123 Rue Exemple' },
  { id: 'e3', title: 'Livraison matériaux', date: '2024-12-06', startTime: '08:00', endTime: '09:00', category: 'Livraison', description: 'Béton + acier' },
  { id: 'e4', title: 'Inspection RBQ', date: '2024-12-06', startTime: '13:00', endTime: '15:00', category: 'Inspection', location: 'Chantier Plaza' },
  { id: 'e5', title: 'Rendez-vous client', date: '2024-12-07', startTime: '10:00', endTime: '11:30', category: 'Réunion', attendees: ['Sophie Tremblay'] },
  { id: 'e6', title: 'Formation sécurité', date: '2024-12-09', startTime: '08:00', endTime: '12:00', category: 'Autre', location: 'Centre CNESST' },
  { id: 'e7', title: 'Suivi projet Plaza', date: '2024-12-10', startTime: '09:00', endTime: '10:30', category: 'Chantier' },
];

const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const SmartCalendar: React.FC = () => {
  const [events] = useState(mockEvents);
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 5)); // Dec 5, 2024
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<string | null>('2024-12-05');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = () => setCurrentDate(new Date());

  const formatDate = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const getEventsForDate = (dateStr: string) => events.filter(e => e.date === dateStr);

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Build calendar grid
  const calendarDays: { day: number; currentMonth: boolean; date: string }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) calendarDays.push({ day: prevMonthDays - i, currentMonth: false, date: '' });
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push({ day: i, currentMonth: true, date: formatDate(i) });
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) calendarDays.push({ day: i, currentMonth: false, date: '' });

  return (
    <div style={{ minHeight: '100vh', background: colors.dark, color: colors.sand, fontFamily: 'Inter' }}>
      <div style={{ padding: '20px 32px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 style={{ fontSize: 24, margin: 0 }}>📅 Calendrier</h1></div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', background: colors.slate, borderRadius: 8, padding: 4 }}>
            {(['month', 'week', 'day'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: '8px 16px', background: view === v ? colors.gold : 'transparent', border: 'none', borderRadius: 6, color: view === v ? colors.dark : colors.sand, cursor: 'pointer', textTransform: 'capitalize' }}>{v === 'month' ? 'Mois' : v === 'week' ? 'Semaine' : 'Jour'}</button>
            ))}
          </div>
          <button onClick={() => setSelectedEvent({ id: '', title: '', date: selectedDate || formatDate(new Date().getDate()), startTime: '09:00', endTime: '10:00', category: 'Autre' })} style={{ padding: '10px 20px', background: colors.gold, border: 'none', borderRadius: 10, color: colors.dark, fontWeight: 600, cursor: 'pointer' }}>+ Événement</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', height: 'calc(100vh - 80px)' }}>
        {/* Calendar Grid */}
        <div style={{ padding: 24 }}>
          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={prevMonth} style={{ background: colors.slate, border: 'none', borderRadius: 8, padding: '8px 12px', color: colors.sand, cursor: 'pointer' }}>←</button>
              <h2 style={{ margin: 0, fontSize: 20, minWidth: 200, textAlign: 'center' }}>{months[month]} {year}</h2>
              <button onClick={nextMonth} style={{ background: colors.slate, border: 'none', borderRadius: 8, padding: '8px 12px', color: colors.sand, cursor: 'pointer' }}>→</button>
            </div>
            <button onClick={today} style={{ background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '8px 16px', color: colors.sand, cursor: 'pointer' }}>Aujourd'hui</button>
          </div>

          {/* Week Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
            {daysOfWeek.map(d => <div key={d} style={{ textAlign: 'center', color: colors.stone, fontSize: 12, padding: 8 }}>{d}</div>)}
          </div>

          {/* Calendar Days */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {calendarDays.map((d, i) => {
              const dayEvents = d.currentMonth ? getEventsForDate(d.date) : [];
              const isSelected = d.date === selectedDate;
              const isToday = d.date === '2024-12-05'; // Mock today
              return (
                <div key={i} onClick={() => d.currentMonth && setSelectedDate(d.date)} style={{
                  background: isSelected ? `${colors.gold}20` : colors.card,
                  border: `1px solid ${isSelected ? colors.gold : isToday ? colors.turquoise : colors.border}`,
                  borderRadius: 8, padding: 8, minHeight: 90, cursor: d.currentMonth ? 'pointer' : 'default',
                  opacity: d.currentMonth ? 1 : 0.3,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: isToday ? colors.turquoise : colors.sand, fontWeight: isToday ? 700 : 400 }}>{d.day}</span>
                    {dayEvents.length > 0 && <span style={{ background: colors.gold, color: colors.dark, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>{dayEvents.length}</span>}
                  </div>
                  {dayEvents.slice(0, 2).map(e => (
                    <div key={e.id} onClick={ev => { ev.stopPropagation(); setSelectedEvent(e); }} style={{
                      background: `${categoryColors[e.category] || colors.stone}30`,
                      borderLeft: `3px solid ${categoryColors[e.category] || colors.stone}`,
                      padding: '2px 6px', marginBottom: 2, borderRadius: 4, fontSize: 10, color: colors.sand,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer',
                    }}>{e.title}</div>
                  ))}
                  {dayEvents.length > 2 && <div style={{ color: colors.stone, fontSize: 10 }}>+{dayEvents.length - 2} autres</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar - Day Detail */}
        <div style={{ borderLeft: `1px solid ${colors.border}`, padding: 20, overflow: 'auto' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>
            {selectedDate ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Sélectionnez un jour'}
          </h3>

          {selectedDate && (
            <>
              {selectedDateEvents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: colors.stone }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                  Aucun événement
                </div>
              ) : (
                selectedDateEvents.map(e => (
                  <div key={e.id} onClick={() => setSelectedEvent(e)} style={{
                    background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12,
                    padding: 16, marginBottom: 12, cursor: 'pointer', borderLeft: `4px solid ${categoryColors[e.category] || colors.stone}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600 }}>{e.title}</span>
                      <span style={{ padding: '2px 8px', background: `${categoryColors[e.category]}30`, color: categoryColors[e.category], borderRadius: 10, fontSize: 10 }}>{e.category}</span>
                    </div>
                    <div style={{ color: colors.turquoise, fontSize: 13, marginBottom: 4 }}>🕐 {e.startTime} - {e.endTime}</div>
                    {e.location && <div style={{ color: colors.stone, fontSize: 12 }}>📍 {e.location}</div>}
                    {e.attendees && e.attendees.length > 0 && <div style={{ color: colors.stone, fontSize: 12, marginTop: 4 }}>👥 {e.attendees.join(', ')}</div>}
                  </div>
                ))
              )}

              {/* Quick Add */}
              <button style={{ width: '100%', padding: 12, background: 'transparent', border: `1px dashed ${colors.border}`, borderRadius: 10, color: colors.stone, cursor: 'pointer', marginTop: 12 }}>+ Ajouter événement</button>
            </>
          )}

          {/* Categories Legend */}
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${colors.border}` }}>
            <h4 style={{ color: colors.stone, fontSize: 12, margin: '0 0 12px' }}>CATÉGORIES</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(categoryColors).map(([cat, col]) => (
                <span key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: colors.sand }}>
                  <span style={{ width: 10, height: 10, background: col, borderRadius: 3 }} />{cat}
                </span>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${colors.border}` }}>
            <h4 style={{ color: colors.stone, fontSize: 12, margin: '0 0 12px' }}>À VENIR</h4>
            {events.slice(0, 4).map(e => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                <div style={{ width: 4, height: 30, background: categoryColors[e.category], borderRadius: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{e.title}</div>
                  <div style={{ fontSize: 11, color: colors.stone }}>{e.date} • {e.startTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && selectedEvent.id && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedEvent(null)}>
          <div style={{ background: colors.dark, border: `1px solid ${colors.border}`, borderRadius: 16, width: 450, padding: 24 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>{selectedEvent.title}</h2>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', color: colors.stone, fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ marginBottom: 16 }}><span style={{ padding: '4px 12px', background: `${categoryColors[selectedEvent.category]}30`, color: categoryColors[selectedEvent.category], borderRadius: 20, fontSize: 12 }}>{selectedEvent.category}</span></div>
            <div style={{ marginBottom: 12 }}><span style={{ color: colors.stone, fontSize: 12 }}>Date</span><div>{selectedEvent.date}</div></div>
            <div style={{ marginBottom: 12 }}><span style={{ color: colors.stone, fontSize: 12 }}>Heure</span><div style={{ color: colors.turquoise }}>{selectedEvent.startTime} - {selectedEvent.endTime}</div></div>
            {selectedEvent.location && <div style={{ marginBottom: 12 }}><span style={{ color: colors.stone, fontSize: 12 }}>Lieu</span><div>{selectedEvent.location}</div></div>}
            {selectedEvent.description && <div style={{ marginBottom: 12 }}><span style={{ color: colors.stone, fontSize: 12 }}>Description</span><div>{selectedEvent.description}</div></div>}
            {selectedEvent.attendees && <div style={{ marginBottom: 12 }}><span style={{ color: colors.stone, fontSize: 12 }}>Participants</span><div>{selectedEvent.attendees.join(', ')}</div></div>}
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button style={{ flex: 1, padding: 12, background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand, cursor: 'pointer' }}>✏️ Modifier</button>
              <button style={{ flex: 1, padding: 12, background: `${colors.red}20`, border: `1px solid ${colors.red}`, borderRadius: 8, color: colors.red, cursor: 'pointer' }}>🗑️ Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartCalendar;
