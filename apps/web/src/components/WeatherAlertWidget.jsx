/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — WEATHER ALERT WIDGET
 * ═══════════════════════════════════════════════════════════════════════════════
 * Widget météo spécialisé construction avec:
 * - Conditions actuelles et prévisions 7 jours
 * - Alertes gel/verglas/canicule
 * - Impact sur les travaux (béton, peinture, toiture)
 * - Recommandations chantier
 * - Multi-sites avec géolocalisation
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';

const tokens = {
  colors: {
    sacredGold: '#D8B26A', cenoteTurquoise: '#3EB4A2', jungleEmerald: '#3F7249',
    ancientStone: '#8D8371', earthEmber: '#7A593A', darkSlate: '#1A1A1A',
    error: '#C45C4A', warning: '#FF9F43', info: '#54A0FF',
    bg: { primary: '#0f1217', secondary: '#161B22', tertiary: '#1E242C', card: 'rgba(22, 27, 34, 0.95)' },
    text: { primary: '#E9E4D6', secondary: '#A0998A', muted: '#6B6560' },
    border: 'rgba(216, 178, 106, 0.15)',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
};

// ─────────────────────────────────────────────────────────────────────────────
// WEATHER IMPACT RULES FOR CONSTRUCTION
// ─────────────────────────────────────────────────────────────────────────────

const WORK_IMPACTS = {
  concrete: {
    name: 'Béton / Coffrage',
    icon: '🧱',
    rules: [
      { condition: (w) => w.temp < 5, status: 'danger', message: 'Gel - Béton interdit sans protection' },
      { condition: (w) => w.temp < 10, status: 'warning', message: 'Froid - Additifs antigel requis' },
      { condition: (w) => w.temp > 30, status: 'warning', message: 'Chaleur - Cure humide obligatoire' },
      { condition: (w) => w.rain > 0, status: 'danger', message: 'Pluie - Reporter le coulage' },
      { condition: (w) => w.wind > 40, status: 'warning', message: 'Vent fort - Protéger les coffrages' },
    ],
  },
  roofing: {
    name: 'Toiture',
    icon: '🏠',
    rules: [
      { condition: (w) => w.rain > 0, status: 'danger', message: 'Pluie - Travaux impossibles' },
      { condition: (w) => w.wind > 50, status: 'danger', message: 'Vent violent - Arrêt obligatoire' },
      { condition: (w) => w.wind > 30, status: 'warning', message: 'Vent fort - Sécurité renforcée' },
      { condition: (w) => w.temp < 5, status: 'warning', message: 'Froid - Membrane fragilisée' },
      { condition: (w) => w.temp > 35, status: 'warning', message: 'Chaleur extrême - Pauses fréquentes' },
    ],
  },
  painting: {
    name: 'Peinture extérieure',
    icon: '🎨',
    rules: [
      { condition: (w) => w.humidity > 85, status: 'danger', message: 'Humidité trop élevée' },
      { condition: (w) => w.temp < 10, status: 'danger', message: 'Trop froid - Séchage compromis' },
      { condition: (w) => w.rain > 0, status: 'danger', message: 'Pluie - Reporter' },
      { condition: (w) => w.temp > 32, status: 'warning', message: 'Chaleur - Séchage trop rapide' },
    ],
  },
  excavation: {
    name: 'Excavation',
    icon: '🚜',
    rules: [
      { condition: (w) => w.rain > 10, status: 'danger', message: 'Forte pluie - Sol instable' },
      { condition: (w) => w.temp < -10, status: 'warning', message: 'Gel profond - Sol durci' },
      { condition: (w) => w.rain > 5, status: 'warning', message: 'Pluie - Surveiller les parois' },
    ],
  },
  crane: {
    name: 'Grue / Levage',
    icon: '🏗️',
    rules: [
      { condition: (w) => w.wind > 60, status: 'danger', message: 'Vent violent - Arrêt obligatoire' },
      { condition: (w) => w.wind > 45, status: 'warning', message: 'Vent fort - Charges réduites' },
      { condition: (w) => w.visibility < 500, status: 'danger', message: 'Visibilité réduite - Arrêt' },
      { condition: (w) => w.lightning, status: 'danger', message: 'Orage - Évacuer la grue' },
    ],
  },
};

const WEATHER_ICONS = {
  sunny: '☀️', partly_cloudy: '⛅', cloudy: '☁️', rain: '🌧️', 
  heavy_rain: '⛈️', snow: '❄️', fog: '🌫️', wind: '💨', storm: '⛈️',
};

const ALERT_LEVELS = {
  danger: { color: tokens.colors.error, bg: 'rgba(196, 92, 74, 0.15)', label: 'ARRÊT' },
  warning: { color: tokens.colors.warning, bg: 'rgba(255, 159, 67, 0.15)', label: 'ATTENTION' },
  ok: { color: tokens.colors.jungleEmerald, bg: 'rgba(63, 114, 73, 0.15)', label: 'OK' },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const mockSites = [
  { id: 's1', name: 'Chantier Tremblay', city: 'Brossard', lat: 45.4587, lng: -73.4599 },
  { id: 's2', name: 'Projet Lavoie', city: 'Longueuil', lat: 45.5312, lng: -73.5187 },
  { id: 's3', name: 'Extension Bouchard', city: 'Montréal', lat: 45.5017, lng: -73.5673 },
];

const generateMockWeather = (siteId) => {
  const base = {
    temp: Math.floor(Math.random() * 25) - 5, // -5 to 20°C (décembre)
    feels_like: 0,
    humidity: Math.floor(Math.random() * 40) + 50,
    wind: Math.floor(Math.random() * 50) + 5,
    wind_dir: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'][Math.floor(Math.random() * 8)],
    rain: Math.random() > 0.7 ? Math.floor(Math.random() * 15) : 0,
    snow: Math.random() > 0.8 ? Math.floor(Math.random() * 10) : 0,
    visibility: Math.floor(Math.random() * 5000) + 5000,
    uv: Math.floor(Math.random() * 5),
    condition: ['sunny', 'partly_cloudy', 'cloudy', 'rain', 'snow'][Math.floor(Math.random() * 5)],
    lightning: Math.random() > 0.95,
  };
  base.feels_like = base.temp - Math.floor(base.wind / 10);
  return base;
};

const generateForecast = () => {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const today = new Date().getDay();
  return Array.from({ length: 7 }, (_, i) => ({
    day: days[(today + i) % 7],
    date: new Date(Date.now() + i * 86400000).getDate(),
    high: Math.floor(Math.random() * 10) - 2,
    low: Math.floor(Math.random() * 10) - 10,
    condition: ['sunny', 'partly_cloudy', 'cloudy', 'rain', 'snow'][Math.floor(Math.random() * 5)],
    rain_chance: Math.floor(Math.random() * 100),
  }));
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const CurrentWeather = ({ weather, site }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.lg, padding: tokens.spacing.lg }}>
    <div style={{ fontSize: 64 }}>{WEATHER_ICONS[weather.condition]}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 48, fontWeight: 300, color: tokens.colors.text.primary }}>{weather.temp}°C</div>
      <div style={{ fontSize: 13, color: tokens.colors.text.secondary }}>Ressenti {weather.feels_like}°C</div>
      <div style={{ fontSize: 12, color: tokens.colors.text.muted, marginTop: tokens.spacing.xs }}>📍 {site.name}, {site.city}</div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, marginBottom: tokens.spacing.xs }}>
        <span style={{ fontSize: 14 }}>💧</span>
        <span style={{ color: tokens.colors.text.secondary, fontSize: 13 }}>{weather.humidity}%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, marginBottom: tokens.spacing.xs }}>
        <span style={{ fontSize: 14 }}>💨</span>
        <span style={{ color: tokens.colors.text.secondary, fontSize: 13 }}>{weather.wind} km/h {weather.wind_dir}</span>
      </div>
      {weather.rain > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
          <span style={{ fontSize: 14 }}>🌧️</span>
          <span style={{ color: tokens.colors.text.secondary, fontSize: 13 }}>{weather.rain} mm</span>
        </div>
      )}
      {weather.snow > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
          <span style={{ fontSize: 14 }}>❄️</span>
          <span style={{ color: tokens.colors.text.secondary, fontSize: 13 }}>{weather.snow} cm</span>
        </div>
      )}
    </div>
  </div>
);

const AlertBanner = ({ alerts }) => {
  if (alerts.length === 0) return null;
  const criticalAlerts = alerts.filter(a => a.status === 'danger');
  const warningAlerts = alerts.filter(a => a.status === 'warning');
  
  return (
    <div style={{ borderTop: `1px solid ${tokens.colors.border}` }}>
      {criticalAlerts.length > 0 && (
        <div style={{ padding: tokens.spacing.md, backgroundColor: ALERT_LEVELS.danger.bg, borderLeft: `4px solid ${ALERT_LEVELS.danger.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, marginBottom: tokens.spacing.xs }}>
            <span style={{ fontSize: 16 }}>🚨</span>
            <span style={{ fontWeight: 600, color: ALERT_LEVELS.danger.color, fontSize: 13 }}>ALERTES CRITIQUES</span>
          </div>
          {criticalAlerts.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, fontSize: 13, color: tokens.colors.text.primary, marginTop: tokens.spacing.xs }}>
              <span>{a.icon}</span>
              <span>{a.work}: {a.message}</span>
            </div>
          ))}
        </div>
      )}
      {warningAlerts.length > 0 && (
        <div style={{ padding: tokens.spacing.md, backgroundColor: ALERT_LEVELS.warning.bg, borderLeft: `4px solid ${ALERT_LEVELS.warning.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, marginBottom: tokens.spacing.xs }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontWeight: 600, color: ALERT_LEVELS.warning.color, fontSize: 13 }}>PRÉCAUTIONS</span>
          </div>
          {warningAlerts.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, fontSize: 12, color: tokens.colors.text.secondary, marginTop: tokens.spacing.xs }}>
              <span>{a.icon}</span>
              <span>{a.work}: {a.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const WorkStatusGrid = ({ weather }) => {
  const getWorkStatus = (workType) => {
    const work = WORK_IMPACTS[workType];
    for (const rule of work.rules) {
      if (rule.condition(weather)) {
        return { status: rule.status, message: rule.message };
      }
    }
    return { status: 'ok', message: 'Conditions favorables' };
  };

  return (
    <div style={{ padding: tokens.spacing.md, borderTop: `1px solid ${tokens.colors.border}` }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: tokens.colors.text.muted, marginBottom: tokens.spacing.md, textTransform: 'uppercase' }}>
        Impact sur les travaux
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: tokens.spacing.sm }}>
        {Object.entries(WORK_IMPACTS).map(([key, work]) => {
          const status = getWorkStatus(key);
          const level = ALERT_LEVELS[status.status];
          return (
            <div key={key} style={{ padding: tokens.spacing.sm, backgroundColor: level.bg, borderRadius: tokens.radius.md, border: `1px solid ${level.color}30` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs, marginBottom: tokens.spacing.xs }}>
                <span>{work.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: level.color }}>{level.label}</span>
              </div>
              <div style={{ fontSize: 11, color: tokens.colors.text.secondary }}>{work.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ForecastRow = ({ forecast }) => (
  <div style={{ display: 'flex', overflowX: 'auto', gap: tokens.spacing.sm, padding: tokens.spacing.md, borderTop: `1px solid ${tokens.colors.border}` }}>
    {forecast.map((day, i) => (
      <div key={i} style={{ flex: '0 0 auto', width: 70, textAlign: 'center', padding: tokens.spacing.sm, backgroundColor: i === 0 ? tokens.colors.bg.tertiary : 'transparent', borderRadius: tokens.radius.md }}>
        <div style={{ fontSize: 11, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? tokens.colors.sacredGold : tokens.colors.text.muted }}>{i === 0 ? "Auj." : day.day}</div>
        <div style={{ fontSize: 11, color: tokens.colors.text.muted }}>{day.date}</div>
        <div style={{ fontSize: 24, margin: `${tokens.spacing.xs}px 0` }}>{WEATHER_ICONS[day.condition]}</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: tokens.colors.text.primary }}>{day.high}°</div>
        <div style={{ fontSize: 11, color: tokens.colors.text.muted }}>{day.low}°</div>
        {day.rain_chance > 30 && <div style={{ fontSize: 10, color: tokens.colors.cenoteTurquoise }}>💧{day.rain_chance}%</div>}
      </div>
    ))}
  </div>
);

const SiteSelector = ({ sites, selected, onSelect }) => (
  <div style={{ display: 'flex', gap: tokens.spacing.xs, padding: `0 ${tokens.spacing.md}px`, overflowX: 'auto' }}>
    {sites.map(site => (
      <button key={site.id} onClick={() => onSelect(site.id)} style={{
        padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`,
        backgroundColor: selected === site.id ? tokens.colors.sacredGold : tokens.colors.bg.tertiary,
        color: selected === site.id ? tokens.colors.darkSlate : tokens.colors.text.secondary,
        border: 'none', borderRadius: tokens.radius.full, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
        fontWeight: selected === site.id ? 600 : 400,
      }}>
        📍 {site.name}
      </button>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const WeatherAlertWidget = ({ sites = mockSites }) => {
  const [selectedSite, setSelectedSite] = useState(sites[0]?.id);
  const site = sites.find(s => s.id === selectedSite) || sites[0];
  
  const weather = useMemo(() => generateMockWeather(selectedSite), [selectedSite]);
  const forecast = useMemo(() => generateForecast(), []);
  
  const alerts = useMemo(() => {
    const result = [];
    Object.entries(WORK_IMPACTS).forEach(([key, work]) => {
      for (const rule of work.rules) {
        if (rule.condition(weather)) {
          result.push({ work: work.name, icon: work.icon, status: rule.status, message: rule.message });
          break;
        }
      }
    });
    return result;
  }, [weather]);

  return (
    <div style={{ backgroundColor: tokens.colors.bg.card, borderRadius: tokens.radius.xl, border: `1px solid ${tokens.colors.border}`, overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: tokens.spacing.md, borderBottom: `1px solid ${tokens.colors.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
          <span style={{ fontSize: 20 }}>🌤️</span>
          <span style={{ fontWeight: 600, color: tokens.colors.text.primary }}>Météo Chantier</span>
        </div>
        <div style={{ fontSize: 11, color: tokens.colors.text.muted }}>Mis à jour il y a 15 min</div>
      </div>
      
      {/* Site Selector */}
      {sites.length > 1 && (
        <div style={{ padding: `${tokens.spacing.sm}px 0`, borderBottom: `1px solid ${tokens.colors.border}` }}>
          <SiteSelector sites={sites} selected={selectedSite} onSelect={setSelectedSite} />
        </div>
      )}
      
      {/* Current Weather */}
      <CurrentWeather weather={weather} site={site} />
      
      {/* Alerts */}
      <AlertBanner alerts={alerts} />
      
      {/* Work Status */}
      <WorkStatusGrid weather={weather} />
      
      {/* Forecast */}
      <ForecastRow forecast={forecast} />
      
      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: tokens.spacing.md, borderTop: `1px solid ${tokens.colors.border}` }}>
        <button style={{ padding: `${tokens.spacing.sm}px ${tokens.spacing.lg}px`, backgroundColor: tokens.colors.bg.tertiary, border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.md, color: tokens.colors.text.secondary, fontSize: 12, cursor: 'pointer' }}>
          📋 Rapport météo complet
        </button>
      </div>
    </div>
  );
};

export default WeatherAlertWidget;
