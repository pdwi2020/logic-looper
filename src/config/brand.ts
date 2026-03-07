export const colors = {
  dark: '#222222',
  blue: '#414BEA',
  purple: '#7752FE',
  deepPurple: '#190482',
  accent: '#F05537',
  white: '#FFFFFF',
  lightGray: '#F6F5F5',
  darkGray: '#3D3B40',
  lightBlue: '#D9E2FF',
  lightSky: '#DDF2FD',
  lightPeriwinkle: '#C2D9FF',
  lightSteel: '#BFCFE7',
  lightLavender: '#F8EDFF',
} as const;

export type ColorToken = keyof typeof colors;

export const fonts = {
  primary: 'Poppins',
  secondary: 'Open Sans',
} as const;

export type FontToken = keyof typeof fonts;

export const iconLibraries = {
  fontAwesome: 'Font Awesome',
  bootstrapIcons: 'Bootstrap Icons',
  flaticon: 'Flaticon',
} as const;

export type IconLibrary = (typeof iconLibraries)[keyof typeof iconLibraries];

export const brandGradients = {
  hero: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.purple} 100%)`,
  action: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.purple} 100%)`,
  night: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.deepPurple} 100%)`,
  calm: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.lightSky} 100%)`,
  aura: `linear-gradient(135deg, ${colors.lightLavender} 0%, ${colors.lightPeriwinkle} 100%)`,
} as const;

export type BrandGradientToken = keyof typeof brandGradients;
