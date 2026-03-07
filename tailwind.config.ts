import type { Config } from 'tailwindcss'
import { brandGradients, colors, fonts } from './src/config/brand'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-dark': colors.dark,
        'brand-blue': colors.blue,
        'brand-purple': colors.purple,
        'brand-deep-purple': colors.deepPurple,
        'brand-accent': colors.accent,
        'brand-white': colors.white,
        'brand-light-gray': colors.lightGray,
        'brand-dark-gray': colors.darkGray,
        'brand-light-blue': colors.lightBlue,
        'brand-light-sky': colors.lightSky,
        'brand-light-periwinkle': colors.lightPeriwinkle,
        'brand-light-steel': colors.lightSteel,
        'brand-light-lavender': colors.lightLavender,
      },
      fontFamily: {
        sans: [fonts.primary, 'sans-serif'],
        body: [fonts.secondary, 'sans-serif'],
      },
      backgroundImage: {
        'brand-hero': brandGradients.hero,
        'brand-action': brandGradients.action,
        'brand-night': brandGradients.night,
        'brand-calm': brandGradients.calm,
        'brand-aura': brandGradients.aura,
      },
    },
  },
  plugins: [],
} satisfies Config
