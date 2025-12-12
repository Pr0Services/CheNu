/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU - LOGO COMPONENT                                ║
 * ║                                                                              ║
 * ║  Logo officiel CHE·NU - Pyramide maya avec végétation                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showText?: boolean;
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

const SIZES = {
  small: { logo: 32, text: 12 },
  medium: { logo: 48, text: 16 },
  large: { logo: 80, text: 24 },
  xlarge: { logo: 120, text: 32 },
};

export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  showText = true,
  variant = 'full',
  className,
}) => {
  const dimensions = SIZES[size];

  // Logo path - place your logo image at this path
  const logoPath = '/assets/images/chenu-logo.jpg';

  if (variant === 'text') {
    return (
      <span
        className={className}
        style={{
          fontSize: dimensions.text,
          fontWeight: 700,
          color: '#D8B26A',
          letterSpacing: 2,
          fontFamily: "'Cinzel', serif",
        }}
      >
        CHE·NU
      </span>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: dimensions.logo * 0.25,
      }}
    >
      {/* Logo Image */}
      {variant !== 'text' && (
        <div
          style={{
            width: dimensions.logo,
            height: dimensions.logo,
            borderRadius: dimensions.logo * 0.15,
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #1A2420 0%, #0D1210 100%)',
            boxShadow: '0 4px 20px rgba(216, 178, 106, 0.2)',
          }}
        >
          <img
            src={logoPath}
            alt="CHE·NU"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              // Fallback to styled text if image not found
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `
                <div style="
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: linear-gradient(135deg, #3F7249 0%, #2F5A39 100%);
                  color: #D8B26A;
                  font-weight: 700;
                  font-size: ${dimensions.logo * 0.35}px;
                ">🏛️</div>
              `;
            }}
          />
        </div>
      )}

      {/* Text */}
      {showText && variant !== 'icon' && (
        <div>
          <div
            style={{
              fontSize: dimensions.text,
              fontWeight: 700,
              color: '#E8F0E8',
              letterSpacing: 1.5,
              lineHeight: 1,
            }}
          >
            CHE·NU
          </div>
          {size !== 'small' && (
            <div
              style={{
                fontSize: dimensions.text * 0.5,
                color: '#8B9B8B',
                marginTop: 2,
              }}
            >
              Chez Nous
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
