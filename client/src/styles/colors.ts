// Brand Colors
export const colors = {
  brand: {
    orange: '#F97316',
    orangeHover: '#EA580C',
    orangeSoft: '#FFEDD5',
    blue: '#2563EB',
    blueHover: '#1D4ED8',
    blueSoft: '#DBEAFE',
  },
  
  background: {
    main: '#F8FAFC',
    surface: '#FFFFFF',
    muted: '#F1F5F9',
  },
  
  border: {
    light: '#E5E7EB',
  },
  
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#94A3B8',
    inverse: '#FFFFFF',
  },
  
  status: {
    success: '#22C55E',
    successSoft: '#DCFCE7',
    error: '#EF4444',
    errorSoft: '#FEE2E2',
    warning: '#FACC15',
    warningSoft: '#FEF9C3',
    info: '#38BDF8',
    infoSoft: '#E0F2FE',
  },
} as const;

export type ColorScheme = typeof colors;
