export const colors = {
  background: '#F7F8FC',
  surface: '#FFFFFF',
  border: '#E3E6EF',
  text: '#0B1220',
  muted: '#5B6475',
  subtle: '#8A93A6',
  primary: '#1A5AF0',
  primaryDark: '#1D4ED8',
  primarySoft: '#EEF3FF',
  hero: '#060A17',
  heroCircle: '#0E1A40',
  heroBadge: '#15224F',
  heroAccent: '#9CC3FF',
  success: '#059669',
  successSoft: '#ECFDF5',
  successBorder: '#A7F3D0',
  warning: '#B45309',
  warningSoft: '#FFFBEB',
  warningBorder: '#FDE68A',
  star: '#FBBF24',
  disabled: '#C7CEDD',
};

export const categoryColors: Record<string, { solid: string; soft: string; text: string }> = {
  'React Native': { solid: '#1D4ED8', soft: '#EFF6FF', text: '#1E40AF' },
  TypeScript: { solid: '#7C3AED', soft: '#F5F3FF', text: '#6D28D9' },
  'UI/UX': { solid: '#059669', soft: '#ECFDF5', text: '#047857' },
  JavaScript: { solid: '#F59E0B', soft: '#FFFBEB', text: '#B45309' },
  Architecture: { solid: '#0D9488', soft: '#F0FDFA', text: '#0F766E' },
  Backend: { solid: '#0284C7', soft: '#F0F9FF', text: '#0369A1' },
  Performance: { solid: '#DB2777', soft: '#FDF2F8', text: '#BE185D' },
  Testing: { solid: '#DC2626', soft: '#FEF2F2', text: '#B91C1C' },
  Navigation: { solid: '#4F46E5', soft: '#EEF2FF', text: '#4338CA' },
  State: { solid: '#C026D3', soft: '#FDF4FF', text: '#A21CAF' },
};

// Content never stretches past this width on large windows.
export const MAX_CONTENT_WIDTH = 720;
