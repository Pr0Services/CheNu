import React, { useState, forwardRef } from 'react';
import { colors, radius, transitions, space, typography, shadows } from '../design-system/tokens';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — UI KIT: INPUTS
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Components: Input, Textarea, Select, Checkbox, Radio, Switch
 * States: default, focused, error, success, disabled
 * 
 * Usage:
 *   <Input label="Email" placeholder="you@example.com" />
 *   <Input error="Email invalide" />
 *   <Select options={[...]} />
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// BASE INPUT STYLES
// ─────────────────────────────────────────────────────────────────────────────

const inputBase = {
  width: '100%',
  padding: '12px 16px',
  background: colors.background.input,
  color: colors.text.primary,
  border: `1px solid ${colors.border.default}`,
  borderRadius: radius.md,
  fontFamily: typography.fontFamily.body,
  fontSize: typography.fontSize.base,
  lineHeight: 1.5,
  transition: transitions.all,
  outline: 'none',
};

const inputStates = {
  default: {
    borderColor: colors.border.default,
  },
  focused: {
    borderColor: colors.sacredGold,
    boxShadow: `0 0 0 3px ${colors.sacredGold}20`,
  },
  error: {
    borderColor: colors.status.error,
    boxShadow: `0 0 0 3px ${colors.status.error}20`,
  },
  success: {
    borderColor: colors.jungleEmerald,
    boxShadow: `0 0 0 3px ${colors.jungleEmerald}20`,
  },
  disabled: {
    background: colors.background.tertiary,
    color: colors.text.muted,
    cursor: 'not-allowed',
    opacity: 0.6,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// INPUT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const Input = forwardRef(function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  success,
  hint,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  size = 'md',
  fullWidth = true,
  className,
  style,
  ...props
}, ref) {
  const [isFocused, setIsFocused] = useState(false);
  
  const state = disabled ? 'disabled' : 
                error ? 'error' : 
                success ? 'success' : 
                isFocused ? 'focused' : 'default';
  
  const sizes = {
    sm: { padding: '8px 12px', fontSize: typography.fontSize.sm },
    md: { padding: '12px 16px', fontSize: typography.fontSize.base },
    lg: { padding: '16px 20px', fontSize: typography.fontSize.md },
  };

  const inputStyle = {
    ...inputBase,
    ...sizes[size],
    ...inputStates[state],
    width: fullWidth ? '100%' : 'auto',
    paddingLeft: leftIcon ? '44px' : sizes[size].padding.split(' ')[1],
    paddingRight: rightIcon ? '44px' : sizes[size].padding.split(' ')[1],
    ...style,
  };

  return (
    <div className={className} style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: space.xs,
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
          color: colors.text.primary,
        }}>
          {label}
          {required && <span style={{ color: colors.status.error, marginLeft: '4px' }}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <span style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: colors.text.muted,
            fontSize: '18px',
            pointerEvents: 'none',
          }}>
            {leftIcon}
          </span>
        )}
        
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={!!error}
          aria-describedby={error ? 'error-msg' : hint ? 'hint-msg' : undefined}
          {...props}
        />
        
        {rightIcon && (
          <span style={{
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: colors.text.muted,
            fontSize: '18px',
          }}>
            {rightIcon}
          </span>
        )}
      </div>
      
      {error && (
        <p id="error-msg" style={{
          margin: `${space.xs} 0 0`,
          fontSize: typography.fontSize.sm,
          color: colors.status.error,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span>⚠️</span> {error}
        </p>
      )}
      
      {success && !error && (
        <p style={{
          margin: `${space.xs} 0 0`,
          fontSize: typography.fontSize.sm,
          color: colors.jungleEmerald,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span>✓</span> {success}
        </p>
      )}
      
      {hint && !error && !success && (
        <p id="hint-msg" style={{
          margin: `${space.xs} 0 0`,
          fontSize: typography.fontSize.sm,
          color: colors.text.muted,
        }}>
          {hint}
        </p>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// TEXTAREA COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const Textarea = forwardRef(function Textarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  rows = 4,
  disabled = false,
  required = false,
  resize = 'vertical',
  style,
  ...props
}, ref) {
  const [isFocused, setIsFocused] = useState(false);
  
  const state = disabled ? 'disabled' : 
                error ? 'error' : 
                isFocused ? 'focused' : 'default';

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: space.xs,
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
          color: colors.text.primary,
        }}>
          {label}
          {required && <span style={{ color: colors.status.error, marginLeft: '4px' }}>*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        style={{
          ...inputBase,
          ...inputStates[state],
          resize,
          minHeight: '100px',
          ...style,
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      
      {error && (
        <p style={{
          margin: `${space.xs} 0 0`,
          fontSize: typography.fontSize.sm,
          color: colors.status.error,
        }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SELECT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const Select = forwardRef(function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Sélectionner...',
  error,
  disabled = false,
  required = false,
  style,
  ...props
}, ref) {
  const [isFocused, setIsFocused] = useState(false);
  
  const state = disabled ? 'disabled' : 
                error ? 'error' : 
                isFocused ? 'focused' : 'default';

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: space.xs,
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
          color: colors.text.primary,
        }}>
          {label}
          {required && <span style={{ color: colors.status.error, marginLeft: '4px' }}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          style={{
            ...inputBase,
            ...inputStates[state],
            appearance: 'none',
            paddingRight: '44px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            ...style,
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option 
              key={opt.value} 
              value={opt.value}
              disabled={opt.disabled}
            >
              {opt.label}
            </option>
          ))}
        </select>
        
        <span style={{
          position: 'absolute',
          right: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: colors.text.muted,
          pointerEvents: 'none',
        }}>
          ▾
        </span>
      </div>
      
      {error && (
        <p style={{
          margin: `${space.xs} 0 0`,
          fontSize: typography.fontSize.sm,
          color: colors.status.error,
        }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// CHECKBOX COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  indeterminate = false,
  style,
  ...props
}) {
  return (
    <label style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: space.sm,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      ...style,
    }}>
      <span style={{
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: checked ? colors.sacredGold : colors.background.input,
        border: `2px solid ${checked ? colors.sacredGold : colors.border.strong}`,
        borderRadius: radius.sm,
        transition: transitions.fast,
      }}>
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path 
              d="M2 6L5 9L10 3" 
              stroke={colors.darkSlate} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
        {indeterminate && !checked && (
          <span style={{
            width: '8px',
            height: '2px',
            background: colors.sacredGold,
            borderRadius: '1px',
          }} />
        )}
      </span>
      
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{ display: 'none' }}
        {...props}
      />
      
      {label && (
        <span style={{
          fontSize: typography.fontSize.base,
          color: colors.text.primary,
        }}>
          {label}
        </span>
      )}
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SWITCH COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function Switch({
  label,
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  style,
  ...props
}) {
  const sizes = {
    sm: { width: '36px', height: '20px', thumb: '14px' },
    md: { width: '44px', height: '24px', thumb: '18px' },
    lg: { width: '52px', height: '28px', thumb: '22px' },
  };
  
  const s = sizes[size];

  return (
    <label style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: space.sm,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      ...style,
    }}>
      <span style={{
        position: 'relative',
        width: s.width,
        height: s.height,
        background: checked ? colors.sacredGold : colors.background.tertiary,
        borderRadius: radius.full,
        transition: transitions.smooth,
      }}>
        <span style={{
          position: 'absolute',
          top: '3px',
          left: checked ? `calc(100% - ${s.thumb} - 3px)` : '3px',
          width: s.thumb,
          height: s.thumb,
          background: checked ? colors.darkSlate : colors.text.secondary,
          borderRadius: '50%',
          transition: transitions.smooth,
          boxShadow: shadows.sm,
        }} />
      </span>
      
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{ display: 'none' }}
        {...props}
      />
      
      {label && (
        <span style={{
          fontSize: typography.fontSize.base,
          color: colors.text.primary,
        }}>
          {label}
        </span>
      )}
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH INPUT
// ─────────────────────────────────────────────────────────────────────────────

export function SearchInput({
  value,
  onChange,
  placeholder = 'Rechercher...',
  onClear,
  shortcut = '⌘K',
  style,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      ...style,
    }}>
      <span style={{
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: colors.text.muted,
        fontSize: '18px',
        pointerEvents: 'none',
      }}>
        🔍
      </span>
      
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          ...inputBase,
          ...inputStates[isFocused ? 'focused' : 'default'],
          paddingLeft: '44px',
          paddingRight: shortcut ? '60px' : value ? '44px' : '16px',
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      
      {value && onClear && (
        <button
          onClick={onClear}
          style={{
            position: 'absolute',
            right: shortcut ? '50px' : '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: colors.text.muted,
            cursor: 'pointer',
            padding: '4px',
            fontSize: '16px',
          }}
          aria-label="Effacer"
        >
          ✕
        </button>
      )}
      
      {shortcut && (
        <kbd style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          padding: '4px 8px',
          background: colors.background.tertiary,
          borderRadius: radius.sm,
          fontSize: typography.fontSize.xs,
          color: colors.text.muted,
          fontFamily: typography.fontFamily.mono,
        }}>
          {shortcut}
        </kbd>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export default Input;
