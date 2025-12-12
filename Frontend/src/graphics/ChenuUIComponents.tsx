/**
 * CHE·NU V25 - LIGHTWEIGHT UI COMPONENTS
 * Beautiful, performant, zero-lag
 */

import React, { useState, useEffect, ReactNode } from 'react';

const theme = {
  colors: {
    gold: '#D8B26A',
    emerald: '#3F7249',
    turquoise: '#3EB4A2',
    dark: '#1A1A1A',
    darker: '#0D0D0D',
    light: '#F5F5F0',
    muted: '#6B7280',
    border: '#2A2A2A',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  radius: { sm: 6, md: 10, lg: 16, xl: 24, full: 9999 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// BUTTON
// ═══════════════════════════════════════════════════════════════════════════════

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md', loading, disabled, onClick,
}) => {
  const [hover, setHover] = useState(false);
  const sizes = { sm: '8px 14px', md: '10px 18px', lg: '14px 24px' };
  const variants: Record<string, any> = {
    primary: { bg: hover ? '#E8C88A' : theme.colors.gold, color: theme.colors.darker },
    secondary: { bg: hover ? `${theme.colors.gold}22` : 'transparent', color: theme.colors.gold, border: `1px solid ${theme.colors.gold}55` },
    ghost: { bg: hover ? `${theme.colors.light}08` : 'transparent', color: theme.colors.light },
    danger: { bg: hover ? '#dc2626' : theme.colors.error, color: '#fff' },
  };
  const v = variants[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: sizes[size], fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
        backgroundColor: v.bg, color: v.color, border: v.border || 'none',
        borderRadius: theme.radius.md, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, transition: 'all 0.15s ease',
      }}
    >
      {loading && <span style={{ width: 16, height: 16, border: `2px solid ${v.color}44`, borderTopColor: v.color, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
      {children}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INPUT
// ═══════════════════════════════════════════════════════════════════════════════

interface InputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ value, onChange, placeholder, icon, error }) => {
  const [focus, setFocus] = useState(false);
  const borderColor = error ? theme.colors.error : focus ? theme.colors.gold : theme.colors.border;

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        backgroundColor: theme.colors.dark, border: `1px solid ${borderColor}`,
        borderRadius: theme.radius.md, transition: 'all 0.2s',
        boxShadow: focus ? `0 0 0 3px ${theme.colors.gold}22` : 'none',
      }}>
        {icon && <span style={{ color: theme.colors.muted }}>{icon}</span>}
        <input
          value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: theme.colors.light, fontSize: 14, fontFamily: 'inherit' }}
        />
      </div>
      {error && <div style={{ marginTop: 6, fontSize: 12, color: theme.colors.error }}>⚠ {error}</div>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CARD
// ═══════════════════════════════════════════════════════════════════════════════

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  accentColor?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, title, subtitle, icon, variant = 'default', accentColor, onClick }) => {
  const [hover, setHover] = useState(false);
  const variants: Record<string, any> = {
    default: { bg: theme.colors.dark, border: `1px solid ${theme.colors.border}` },
    elevated: { bg: `linear-gradient(135deg, ${theme.colors.dark}, ${theme.colors.darker})`, boxShadow: '0 4px 12px rgba(0,0,0,0.4)' },
    outlined: { bg: 'transparent', border: `1px solid ${accentColor || theme.colors.gold}44` },
  };
  const v = variants[variant];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: v.bg, border: v.border || 'none', borderRadius: theme.radius.lg, padding: 20,
        position: 'relative', overflow: 'hidden', cursor: onClick ? 'pointer' : 'default',
        transform: onClick && hover ? 'translateY(-2px)' : 'none', transition: 'transform 0.2s',
        boxShadow: v.boxShadow || 'none',
      }}
    >
      {accentColor && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accentColor }} />}
      {(title || icon) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: children ? 16 : 0 }}>
          {icon && <div style={{ color: accentColor || theme.colors.gold }}>{icon}</div>}
          <div>
            {title && <div style={{ fontSize: 16, fontWeight: 600, color: theme.colors.light }}>{title}</div>}
            {subtitle && <div style={{ fontSize: 13, color: theme.colors.muted, marginTop: 4 }}>{subtitle}</div>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BADGE
// ═══════════════════════════════════════════════════════════════════════════════

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', dot }) => {
  const colors: Record<string, string> = { default: theme.colors.gold, success: theme.colors.success, warning: theme.colors.warning, error: theme.colors.error, info: theme.colors.info };
  const color = colors[variant];

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', fontSize: 11, fontWeight: 500, color, backgroundColor: `${color}22`, borderRadius: theme.radius.full }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color }} />}
      {children}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// AVATAR
// ═══════════════════════════════════════════════════════════════════════════════

interface AvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away';
}

export const Avatar: React.FC<AvatarProps> = ({ name = '?', size = 'md', status }) => {
  const sizes: Record<string, number> = { sm: 28, md: 36, lg: 48 };
  const s = sizes[size];
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const hue = name.split('').reduce((h, c) => c.charCodeAt(0) + ((h << 5) - h), 0) % 360;
  const statusColors: Record<string, string> = { online: theme.colors.success, offline: theme.colors.muted, away: theme.colors.warning };

  return (
    <div style={{ position: 'relative', width: s, height: s }}>
      <div style={{ width: s, height: s, borderRadius: '50%', backgroundColor: `hsl(${hue}, 60%, 45%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s * 0.4, fontWeight: 600, color: '#fff' }}>
        {initials}
      </div>
      {status && <div style={{ position: 'absolute', bottom: 0, right: 0, width: s * 0.3, height: s * 0.3, borderRadius: '50%', backgroundColor: statusColors[status], border: `2px solid ${theme.colors.dark}` }} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════════════════════════

interface Tab { id: string; label: string; badge?: number; }
interface TabsProps { tabs: Tab[]; activeTab: string; onChange: (id: string) => void; variant?: 'default' | 'pills' | 'underline'; }

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, variant = 'default' }) => (
  <div style={{
    display: 'flex', gap: variant === 'pills' ? 8 : 0,
    borderBottom: variant === 'underline' ? `1px solid ${theme.colors.border}` : 'none',
    backgroundColor: variant === 'default' ? theme.colors.dark : 'transparent',
    borderRadius: variant === 'default' ? theme.radius.md : 0, padding: variant === 'default' ? 4 : 0,
  }}>
    {tabs.map(tab => {
      const active = tab.id === activeTab;
      return (
        <button key={tab.id} onClick={() => onChange(tab.id)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: variant === 'underline' ? '12px 16px' : '8px 16px',
          fontSize: 14, fontWeight: active ? 600 : 400, fontFamily: 'inherit',
          color: active ? theme.colors.gold : theme.colors.muted,
          backgroundColor: variant === 'pills' ? (active ? `${theme.colors.gold}22` : 'transparent') : variant === 'default' ? (active ? theme.colors.darker : 'transparent') : 'transparent',
          border: variant === 'pills' && active ? `1px solid ${theme.colors.gold}44` : '1px solid transparent',
          borderBottom: variant === 'underline' ? `2px solid ${active ? theme.colors.gold : 'transparent'}` : 'none',
          borderRadius: variant === 'underline' ? 0 : variant === 'pills' ? theme.radius.full : theme.radius.sm,
          cursor: 'pointer', transition: 'all 0.15s', marginBottom: variant === 'underline' ? -1 : 0,
        }}>
          {tab.label}
          {tab.badge !== undefined && <span style={{ padding: '2px 6px', fontSize: 11, fontWeight: 600, backgroundColor: active ? theme.colors.gold : theme.colors.muted, color: theme.colors.darker, borderRadius: theme.radius.full }}>{tab.badge}</span>}
        </button>
      );
    })}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// TOGGLE
// ═══════════════════════════════════════════════════════════════════════════════

interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; label?: string; }

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
    <div onClick={() => onChange(!checked)} style={{ width: 48, height: 26, borderRadius: 13, backgroundColor: checked ? theme.colors.gold : theme.colors.border, position: 'relative', transition: 'background 0.2s' }}>
      <div style={{ position: 'absolute', top: 4, left: checked ? 26 : 4, width: 18, height: 18, borderRadius: '50%', backgroundColor: theme.colors.light, transition: 'left 0.2s' }} />
    </div>
    {label && <span style={{ fontSize: 14, color: theme.colors.light }}>{label}</span>}
  </label>
);

// ═══════════════════════════════════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════════════════════════════════

interface TooltipProps { content: string; children: ReactNode; }

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8, padding: '6px 10px', backgroundColor: theme.colors.light, color: theme.colors.darker, fontSize: 12, fontWeight: 500, borderRadius: theme.radius.sm, whiteSpace: 'nowrap', zIndex: 1000, animation: 'fadeIn 0.15s' }}>
          {content}
        </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SKELETON
// ═══════════════════════════════════════════════════════════════════════════════

interface SkeletonProps { width?: string | number; height?: number; variant?: 'text' | 'circular'; }

export const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = 20, variant = 'text' }) => (
  <div style={{ width, height: variant === 'circular' ? width : height, borderRadius: variant === 'circular' ? '50%' : theme.radius.sm, backgroundColor: theme.colors.border, animation: 'pulse 1.5s ease-in-out infinite' }}>
    <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════════════════════════════════════

interface ModalProps { isOpen: boolean; onClose: () => void; title?: string; children: ReactNode; }

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 480, backgroundColor: theme.colors.dark, borderRadius: theme.radius.xl, border: `1px solid ${theme.colors.border}`, overflow: 'hidden', animation: 'slideUp 0.2s' }}>
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${theme.colors.border}` }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: theme.colors.light }}>{title}</h2>
            <button onClick={onClose} style={{ padding: 8, background: 'transparent', border: 'none', color: theme.colors.muted, cursor: 'pointer', fontSize: 18 }}>✕</button>
          </div>
        )}
        <div style={{ padding: 20 }}>{children}</div>
      </div>
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════════════════════════════

interface ToastProps { message: string; variant?: 'success' | 'warning' | 'error' | 'info'; onClose?: () => void; }

export const Toast: React.FC<ToastProps> = ({ message, variant = 'success', onClose }) => {
  const colors: Record<string, string> = { success: theme.colors.success, warning: theme.colors.warning, error: theme.colors.error, info: theme.colors.info };
  const icons: Record<string, string> = { success: '✓', warning: '⚠', error: '✕', info: 'ℹ' };
  const color = colors[variant];

  useEffect(() => { const t = setTimeout(() => onClose?.(), 4000); return () => clearTimeout(t); }, [onClose]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', backgroundColor: theme.colors.dark, border: `1px solid ${color}44`, borderLeft: `3px solid ${color}`, borderRadius: theme.radius.md, minWidth: 280, animation: 'slideIn 0.3s' }}>
      <span style={{ color, fontSize: 16 }}>{icons[variant]}</span>
      <span style={{ flex: 1, color: theme.colors.light, fontSize: 14 }}>{message}</span>
      {onClose && <button onClick={onClose} style={{ padding: 4, background: 'transparent', border: 'none', color: theme.colors.muted, cursor: 'pointer' }}>✕</button>}
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO
// ═══════════════════════════════════════════════════════════════════════════════

const UIDemo: React.FC = () => {
  const [input, setInput] = useState('');
  const [tab, setTab] = useState('tab1');
  const [toggle, setToggle] = useState(true);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState(false);
  const tabs = [{ id: 'tab1', label: 'Overview', badge: 3 }, { id: 'tab2', label: 'Analytics' }, { id: 'tab3', label: 'Reports' }];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.darker, color: theme.colors.light, padding: 40, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 40, background: `linear-gradient(135deg, ${theme.colors.gold}, ${theme.colors.turquoise})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CHE·NU UI Components</h1>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16, color: theme.colors.gold }}>Buttons</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16, color: theme.colors.gold }}>Input</h2>
        <div style={{ maxWidth: 400 }}>
          <Input value={input} onChange={setInput} placeholder="Type something..." icon={<span>🔍</span>} />
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16, color: theme.colors.gold }}>Cards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          <Card title="Default" subtitle="Basic card"><p style={{ margin: 0, color: theme.colors.muted }}>Content here.</p></Card>
          <Card title="Elevated" variant="elevated" icon={<span>⚡</span>}><p style={{ margin: 0, color: theme.colors.muted }}>With shadow.</p></Card>
          <Card title="Accent" accentColor={theme.colors.emerald} variant="outlined"><p style={{ margin: 0, color: theme.colors.muted }}>Colored border.</p></Card>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16, color: theme.colors.gold }}>Badges & Avatars</h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge>Default</Badge>
          <Badge variant="success" dot>Active</Badge>
          <Badge variant="warning">Pending</Badge>
          <Avatar name="John Doe" status="online" />
          <Avatar name="Jane" status="away" />
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16, color: theme.colors.gold }}>Tabs</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
          <Tabs tabs={tabs} activeTab={tab} onChange={setTab} variant="pills" />
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16, color: theme.colors.gold }}>Toggle & Tooltip</h2>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Toggle checked={toggle} onChange={setToggle} label="Notifications" />
          <Tooltip content="Tooltip!"><Button variant="secondary">Hover</Button></Tooltip>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16, color: theme.colors.gold }}>Skeleton</h2>
        <div style={{ display: 'flex', gap: 16 }}>
          <Skeleton variant="circular" width={48} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton width="60%" />
            <Skeleton width="100%" height={12} />
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 18, marginBottom: 16, color: theme.colors.gold }}>Modal & Toast</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button onClick={() => setModal(true)}>Open Modal</Button>
          <Button variant="secondary" onClick={() => setToast(true)}>Show Toast</Button>
        </div>
      </section>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Example Modal">
        <p style={{ margin: 0, marginBottom: 20, color: theme.colors.muted }}>Lightweight modal with backdrop blur.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
          <Button onClick={() => setModal(false)}>Confirm</Button>
        </div>
      </Modal>

      {toast && <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}><Toast message="Success!" variant="success" onClose={() => setToast(false)} /></div>}
    </div>
  );
};

export { theme };
export default UIDemo;
