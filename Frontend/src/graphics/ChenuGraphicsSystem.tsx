/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║              CHE·NU V25 - LIGHTWEIGHT GRAPHICS SYSTEM                        ║
 * ║                                                                              ║
 * ║  Performant visuals: CSS-only, SVG, no heavy images                          ║
 * ║  Zero lag, 60fps animations, GPU-accelerated                                 ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// SACRED PALETTE - CHE·NU COLORS
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  // Sacred palette
  gold: '#D8B26A',
  goldLight: '#E8C88A',
  goldDark: '#B8924A',
  emerald: '#3F7249',
  emeraldLight: '#5F9269',
  turquoise: '#3EB4A2',
  turquoiseLight: '#5ED4C2',
  
  // Neutrals
  dark: '#1A1A1A',
  darker: '#0D0D0D',
  light: '#F5F5F0',
  muted: '#6B7280',
  
  // Space colors (10 espaces)
  spaces: {
    PERSONNEL: '#4ade80',
    SOCIAL_DIVERTISSEMENT: '#f472b6',
    SCHOLAR: '#a78bfa',
    MAISON: '#34d399',
    ENTREPRISE: '#3b82f6',
    PROJETS: '#8b5cf6',
    CREATIVE_STUDIO: '#f59e0b',
    GOUVERNEMENT: '#06b6d4',
    IMMOBILIER: '#ec4899',
    ASSOCIATIONS: '#14b8a6',
  },
  
  // Status colors
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTWEIGHT ICONS (Pure SVG, no external deps)
// ═══════════════════════════════════════════════════════════════════════════════

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const Icons = {
  // Navigation
  Home: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  ),
  
  Search: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
  ),
  
  Plus: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  
  Check: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  ),
  
  X: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  
  ChevronRight: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,18 15,12 9,6"/>
    </svg>
  ),
  
  ChevronDown: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6,9 12,15 18,9"/>
    </svg>
  ),
  
  // Actions
  Edit: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  
  Trash: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,6 5,6 21,6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  
  Download: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7,10 12,15 17,10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  
  Upload: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17,8 12,3 7,8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  
  // Data
  BarChart: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"/>
      <line x1="18" y1="20" x2="18" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  
  PieChart: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
      <path d="M22 12A10 10 0 0 0 12 2v10z"/>
    </svg>
  ),
  
  TrendingUp: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
      <polyline points="17,6 23,6 23,12"/>
    </svg>
  ),
  
  // Communication
  Bell: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  
  MessageCircle: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  ),
  
  // Nova AI
  Sparkles: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
      <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z"/>
      <path d="M19 13l1 2 1-2 2-1-2-1-1-2-1 2-2 1 2 1z"/>
    </svg>
  ),
  
  Zap: ({ size = 24, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
    </svg>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════════
// CSS-ONLY ANIMATED LOADER
// ═══════════════════════════════════════════════════════════════════════════════

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'nova';
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  color = COLORS.gold,
  variant = 'spinner' 
}) => {
  const sizes = { sm: 16, md: 24, lg: 40 };
  const s = sizes[size];

  if (variant === 'dots') {
    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: s / 3,
              height: s / 3,
              borderRadius: '50%',
              backgroundColor: color,
              animation: `chenu-bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
            }}
          />
        ))}
        <style>{`
          @keyframes chenu-bounce {
            0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div
        style={{
          width: s,
          height: s,
          borderRadius: '50%',
          backgroundColor: color,
          animation: 'chenu-pulse 1.5s ease-in-out infinite',
        }}
      >
        <style>{`
          @keyframes chenu-pulse {
            0% { transform: scale(0.8); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.5; }
            100% { transform: scale(0.8); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'nova') {
    return (
      <div style={{ position: 'relative', width: s, height: s }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `conic-gradient(from 0deg, transparent, ${color})`,
            animation: 'chenu-nova-spin 1s linear infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 3,
            borderRadius: '50%',
            backgroundColor: COLORS.dark,
          }}
        />
        <style>{`
          @keyframes chenu-nova-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Default spinner
  return (
    <div
      style={{
        width: s,
        height: s,
        border: `2px solid ${color}22`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'chenu-spin 0.8s linear infinite',
      }}
    >
      <style>{`
        @keyframes chenu-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTWEIGHT PROGRESS BARS
// ═══════════════════════════════════════════════════════════════════════════════

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  height?: number;
  showLabel?: boolean;
  animated?: boolean;
  gradient?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = COLORS.gold,
  height = 8,
  showLabel = false,
  animated = true,
  gradient = false,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  const bgColor = gradient 
    ? `linear-gradient(90deg, ${COLORS.emerald}, ${COLORS.turquoise}, ${COLORS.gold})`
    : color;

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          height,
          backgroundColor: `${color}22`,
          borderRadius: height / 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${clampedValue}%`,
            height: '100%',
            background: bgColor,
            borderRadius: height / 2,
            transition: animated ? 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {animated && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                animation: 'chenu-shimmer 2s infinite',
              }}
            />
          )}
        </div>
      </div>
      {showLabel && (
        <div style={{ 
          marginTop: 4, 
          fontSize: 12, 
          color: COLORS.muted,
          textAlign: 'right',
        }}>
          {clampedValue.toFixed(0)}%
        </div>
      )}
      <style>{`
        @keyframes chenu-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CIRCULAR PROGRESS / GAUGE
// ═══════════════════════════════════════════════════════════════════════════════

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showValue?: boolean;
  label?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 100,
  strokeWidth = 8,
  color = COLORS.gold,
  showValue = true,
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`${color}22`}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      {showValue && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: size / 4, fontWeight: 700, color }}>
            {value.toFixed(0)}%
          </span>
          {label && (
            <span style={{ fontSize: size / 8, color: COLORS.muted, marginTop: 2 }}>
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MINI BAR CHART (CSS-only)
// ═══════════════════════════════════════════════════════════════════════════════

interface MiniBarChartProps {
  data: number[];
  height?: number;
  color?: string;
  gap?: number;
  animated?: boolean;
  labels?: string[];
}

export const MiniBarChart: React.FC<MiniBarChartProps> = ({
  data,
  height = 60,
  color = COLORS.gold,
  gap = 4,
  animated = true,
  labels,
}) => {
  const max = Math.max(...data, 1);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap,
          height,
        }}
      >
        {data.map((value, i) => {
          const barHeight = (value / max) * 100;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${barHeight}%`,
                backgroundColor: color,
                borderRadius: 4,
                minHeight: 4,
                opacity: 0.7 + (value / max) * 0.3,
                transition: animated ? 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                animation: animated ? `chenu-bar-grow 0.5s ease-out ${i * 0.05}s both` : 'none',
              }}
              title={value.toString()}
            />
          );
        })}
      </div>
      {labels && (
        <div style={{ display: 'flex', gap }}>
          {labels.map((label, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                fontSize: 10,
                color: COLORS.muted,
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      )}
      <style>{`
        @keyframes chenu-bar-grow {
          from { transform: scaleY(0); transform-origin: bottom; }
          to { transform: scaleY(1); transform-origin: bottom; }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPARKLINE (SVG lightweight)
// ═══════════════════════════════════════════════════════════════════════════════

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showArea?: boolean;
  animated?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 100,
  height = 30,
  color = COLORS.gold,
  showArea = true,
  animated = true,
}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });
  
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      {showArea && (
        <path
          d={areaPath}
          fill={`${color}22`}
          style={{
            animation: animated ? 'chenu-fade-in 0.5s ease-out' : 'none',
          }}
        />
      )}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: animated ? 1000 : 'none',
          strokeDashoffset: animated ? 1000 : 0,
          animation: animated ? 'chenu-draw-line 1s ease-out forwards' : 'none',
        }}
      />
      {/* End dot */}
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r={3}
        fill={color}
        style={{
          animation: animated ? 'chenu-pop 0.3s ease-out 0.8s both' : 'none',
        }}
      />
      <style>{`
        @keyframes chenu-draw-line {
          to { stroke-dashoffset: 0; }
        }
        @keyframes chenu-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes chenu-pop {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DONUT CHART (SVG)
// ═══════════════════════════════════════════════════════════════════════════════

interface DonutChartProps {
  data: { value: number; color: string; label?: string }[];
  size?: number;
  thickness?: number;
  showLegend?: boolean;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 120,
  thickness = 20,
  showLegend = true,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = radius * 2 * Math.PI;
  
  let currentOffset = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {data.map((item, i) => {
          const percentage = item.value / total;
          const strokeLength = circumference * percentage;
          const offset = currentOffset;
          currentOffset += strokeLength;
          
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={thickness}
              strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
              strokeDashoffset={-offset}
              style={{
                transition: 'stroke-dasharray 0.5s ease-out',
                animation: `chenu-donut-segment 0.5s ease-out ${i * 0.1}s both`,
              }}
            />
          );
        })}
      </svg>
      {showLegend && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {data.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  backgroundColor: item.color,
                }}
              />
              <span style={{ fontSize: 12, color: COLORS.light }}>
                {item.label || `Segment ${i + 1}`}
              </span>
              <span style={{ fontSize: 12, color: COLORS.muted, marginLeft: 'auto' }}>
                {((item.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      )}
      <style>{`
        @keyframes chenu-donut-segment {
          from { stroke-dasharray: 0 ${circumference}; }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════════════════════════════════

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label?: string };
  icon?: React.ReactNode;
  color?: string;
  sparklineData?: number[];
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = COLORS.gold,
  sparklineData,
}) => {
  const isPositiveTrend = trend && trend.value >= 0;

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${COLORS.darker} 0%, ${COLORS.dark} 100%)`,
        borderRadius: 16,
        padding: 20,
        border: `1px solid ${color}22`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle glow */}
      <div
        style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 4 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.light }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
              {subtitle}
            </div>
          )}
        </div>
        {icon && (
          <div style={{ color, opacity: 0.8 }}>
            {icon}
          </div>
        )}
      </div>
      
      {(trend || sparklineData) && (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          {trend && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                color: isPositiveTrend ? COLORS.status.success : COLORS.status.error,
              }}
            >
              <span style={{ transform: isPositiveTrend ? 'rotate(0)' : 'rotate(180deg)' }}>
                ↑
              </span>
              {Math.abs(trend.value).toFixed(1)}%
              {trend.label && (
                <span style={{ color: COLORS.muted, marginLeft: 4 }}>
                  {trend.label}
                </span>
              )}
            </div>
          )}
          {sparklineData && (
            <div style={{ marginLeft: 'auto' }}>
              <Sparkline 
                data={sparklineData} 
                width={60} 
                height={24} 
                color={isPositiveTrend ? COLORS.status.success : COLORS.status.error}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPACE BADGE (10 Espaces)
// ═══════════════════════════════════════════════════════════════════════════════

interface SpaceBadgeProps {
  space: keyof typeof COLORS.spaces;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const SPACE_ICONS: Record<string, string> = {
  PERSONNEL: '👤',
  SOCIAL_DIVERTISSEMENT: '🎉',
  SCHOLAR: '🎓',
  MAISON: '🏠',
  ENTREPRISE: '🏢',
  PROJETS: '📁',
  CREATIVE_STUDIO: '🎨',
  GOUVERNEMENT: '🏛️',
  IMMOBILIER: '🏘️',
  ASSOCIATIONS: '🤝',
};

const SPACE_LABELS: Record<string, string> = {
  PERSONNEL: 'Personnel',
  SOCIAL_DIVERTISSEMENT: 'Social',
  SCHOLAR: 'Scholar',
  MAISON: 'Maison',
  ENTREPRISE: 'Entreprise',
  PROJETS: 'Projets',
  CREATIVE_STUDIO: 'Créatif',
  GOUVERNEMENT: 'Gouv.',
  IMMOBILIER: 'Immo.',
  ASSOCIATIONS: 'Assoc.',
};

export const SpaceBadge: React.FC<SpaceBadgeProps> = ({
  space,
  size = 'md',
  showLabel = true,
}) => {
  const color = COLORS.spaces[space] || COLORS.gold;
  const sizes = {
    sm: { padding: '4px 8px', fontSize: 11, iconSize: 12 },
    md: { padding: '6px 12px', fontSize: 12, iconSize: 14 },
    lg: { padding: '8px 16px', fontSize: 14, iconSize: 16 },
  };
  const s = sizes[size];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: s.padding,
        backgroundColor: `${color}22`,
        border: `1px solid ${color}44`,
        borderRadius: 20,
        fontSize: s.fontSize,
        color: color,
        fontWeight: 500,
      }}
    >
      <span style={{ fontSize: s.iconSize }}>{SPACE_ICONS[space]}</span>
      {showLabel && <span>{SPACE_LABELS[space]}</span>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATED BACKGROUND PATTERNS
// ═══════════════════════════════════════════════════════════════════════════════

interface PatternBackgroundProps {
  variant?: 'grid' | 'dots' | 'waves' | 'gradient';
  color?: string;
  opacity?: number;
}

export const PatternBackground: React.FC<PatternBackgroundProps> = ({
  variant = 'grid',
  color = COLORS.gold,
  opacity = 0.05,
}) => {
  if (variant === 'gradient') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 20%, ${color}15 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, ${COLORS.turquoise}10 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />
    );
  }

  if (variant === 'dots') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          opacity,
          pointerEvents: 'none',
        }}
      />
    );
  }

  if (variant === 'waves') {
    return (
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          opacity,
          pointerEvents: 'none',
        }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill={color}
          d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
              M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,144C672,149,768,203,864,218.7C960,235,1056,213,1152,181.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
              M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
            "
          />
        </path>
      </svg>
    );
  }

  // Default: grid
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATED NUMBER COUNTER
// ═══════════════════════════════════════════════════════════════════════════════

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  decimals = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(startValue + (value - startValue) * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {displayValue.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      {suffix}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const GraphicsDemo: React.FC = () => {
  const [progress, setProgress] = useState(65);
  
  // Simulate data changes
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => Math.min(100, Math.max(0, p + (Math.random() - 0.5) * 10)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const sparklineData = [30, 45, 35, 50, 49, 60, 70, 65, 75, 80, 85, 90];
  const barData = [40, 65, 45, 80, 55, 70, 90];
  const barLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  const donutData = [
    { value: 35, color: COLORS.spaces.ENTREPRISE, label: 'Entreprise' },
    { value: 25, color: COLORS.spaces.PROJETS, label: 'Projets' },
    { value: 20, color: COLORS.spaces.PERSONNEL, label: 'Personnel' },
    { value: 20, color: COLORS.spaces.MAISON, label: 'Maison' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: COLORS.darker,
        color: COLORS.light,
        padding: 40,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <PatternBackground variant="gradient" />
      <PatternBackground variant="grid" opacity={0.03} />
      
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ 
            fontSize: 32, 
            fontWeight: 700, 
            margin: 0,
            background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.turquoise})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            CHE·NU Graphics System
          </h1>
          <p style={{ color: COLORS.muted, marginTop: 8 }}>
            Lightweight, performant, 60fps • No heavy images
          </p>
        </div>

        {/* Loaders */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: COLORS.gold }}>Loaders</h2>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <Loader variant="spinner" size="lg" />
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 8 }}>Spinner</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Loader variant="dots" size="lg" />
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 8 }}>Dots</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Loader variant="pulse" size="lg" />
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 8 }}>Pulse</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Loader variant="nova" size="lg" />
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 8 }}>Nova</div>
            </div>
          </div>
        </section>

        {/* Progress Bars */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: COLORS.gold }}>Progress Bars</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
            <ProgressBar value={progress} showLabel />
            <ProgressBar value={45} color={COLORS.emerald} />
            <ProgressBar value={80} gradient />
          </div>
        </section>

        {/* Circular Progress */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: COLORS.gold }}>Circular Progress</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <CircularProgress value={progress} color={COLORS.gold} label="Tâches" />
            <CircularProgress value={45} color={COLORS.emerald} size={80} label="Budget" />
            <CircularProgress value={90} color={COLORS.turquoise} size={120} label="Projet" />
          </div>
        </section>

        {/* Charts */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: COLORS.gold }}>Charts</h2>
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8 }}>Bar Chart</div>
              <div style={{ width: 200 }}>
                <MiniBarChart data={barData} labels={barLabels} height={80} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8 }}>Sparkline</div>
              <Sparkline data={sparklineData} width={150} height={40} color={COLORS.emerald} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8 }}>Donut Chart</div>
              <DonutChart data={donutData} />
            </div>
          </div>
        </section>

        {/* Stat Cards */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: COLORS.gold }}>Stat Cards</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            <StatCard
              title="Revenus"
              value={<AnimatedNumber value={125000} prefix="$" suffix=" CAD" />}
              subtitle="Ce mois"
              trend={{ value: 12.5, label: 'vs mois dernier' }}
              icon={<Icons.TrendingUp size={24} />}
              color={COLORS.emerald}
              sparklineData={sparklineData}
            />
            <StatCard
              title="Tâches complétées"
              value={<AnimatedNumber value={47} />}
              subtitle="Cette semaine"
              trend={{ value: -5.2, label: 'vs semaine dernière' }}
              icon={<Icons.Check size={24} />}
              color={COLORS.gold}
              sparklineData={[80, 75, 70, 65, 60, 55, 50]}
            />
            <StatCard
              title="Messages"
              value={<AnimatedNumber value={234} />}
              subtitle="Non lus"
              icon={<Icons.MessageCircle size={24} />}
              color={COLORS.turquoise}
            />
          </div>
        </section>

        {/* Space Badges */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: COLORS.gold }}>Space Badges</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.keys(COLORS.spaces).map(space => (
              <SpaceBadge key={space} space={space as keyof typeof COLORS.spaces} size="md" />
            ))}
          </div>
        </section>

        {/* Icons */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: COLORS.gold }}>Icons (SVG)</h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {Object.entries(Icons).map(([name, Icon]) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  padding: 12,
                  backgroundColor: `${COLORS.gold}11`,
                  borderRadius: 8,
                  minWidth: 60,
                }}
              >
                <Icon size={20} color={COLORS.gold} />
                <span style={{ fontSize: 10, color: COLORS.muted }}>{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div style={{ 
          marginTop: 60, 
          paddingTop: 20, 
          borderTop: `1px solid ${COLORS.gold}22`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <Icons.Zap size={16} color={COLORS.gold} />
          <span style={{ fontSize: 12, color: COLORS.muted }}>
            CHE·NU V25 • All graphics CSS/SVG only • Zero external images
          </span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  COLORS,
  Icons,
  Loader,
  ProgressBar,
  CircularProgress,
  MiniBarChart,
  Sparkline,
  DonutChart,
  StatCard,
  SpaceBadge,
  PatternBackground,
  AnimatedNumber,
};

export default GraphicsDemo;
