export const theme = {
    colors: {
      primary: '#FF3B30',
      secondary: '#34C759',
      background: '#F2F2F7',
      card: '#FFFFFF',
      text: '#000000',
      textSecondary: '#8E8E93',
      border: '#C7C7CC',
      notification: '#FF3B30',
      success: '#34C759',
      warning: '#FFCC00',
      error: '#FF3B30',
      white: '#FFFFFF',
      black: '#000000',
      gray: {
        100: '#F2F2F7',
        200: '#E5E5EA',
        300: '#D1D1D6',
        400: '#C7C7CC',
        500: '#AEAEB2',
        600: '#8E8E93',
      },
      gold: '#FFD700',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      bold: '700',
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      full: 9999,
    },
    shadows: {
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
      },
    },
  };
  
  export type Theme = typeof theme;
  
  // Helper function to use the theme in styled-components (if you decide to use it)
  export function useTheme() {
    return theme;
  }