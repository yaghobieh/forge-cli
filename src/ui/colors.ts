/**
 * Forge CLI Colors - Based on Bear UI pink theme
 */

export const COLORS = {
  // Bear primary pink palette
  primary: '#ec4899',
  primaryLight: '#f472b6',
  primaryDark: '#db2777',
  
  // Accent colors
  accent: '#8b5cf6',
  accentLight: '#a78bfa',
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Neutrals
  text: '#fafafa',
  muted: '#71717a',
  dim: '#52525b',
  
  // Gradient stops
  gradientStart: '#ec4899',
  gradientMid: '#8b5cf6',
  gradientEnd: '#3b82f6',
} as const;

export const GRADIENT_COLORS = ['#ec4899', '#d946ef', '#8b5cf6', '#6366f1', '#3b82f6'];
