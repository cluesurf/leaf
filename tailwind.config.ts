import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import COLORS from './utility/colors'

const config: Config = {
  content: [
    './component/**/*.{js,ts,jsx,tsx,mdx}',
    './utility/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hook/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        print: { raw: 'print' },
        screen: { raw: 'screen' },
      },
      animation: {
        'fade-in-out': 'fade-in-out 0.8s linear',
        'fade-out-fast': 'fade-out 50ms linear',
        'fade-in-fast': 'fade-in 50ms linear',
        'fade-in-medium': 'fade-in 120ms linear',
        'toast-swipe-end': 'toastSlideRight 100ms ease-out',
        pulsate: `pulsate 300ms ease-in-out`,
        // Dropdown menu
        'scale-in': 'scale-in 0.2s ease-in-out',
        'slide-down': 'slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        // Tooltip
        'slide-up-fade':
          'slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right-fade':
          'slide-right-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down-fade':
          'slide-down-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left-fade':
          'slide-left-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        // Navigation menu
        'enter-from-right': 'enter-from-right 0.25s ease',
        'enter-from-left': 'enter-from-left 0.25s ease',
        'exit-to-right': 'exit-to-right 0.25s ease',
        'exit-to-left': 'exit-to-left 0.25s ease',
        'scale-in-content': 'scale-in-content 0.2s ease',
        'scale-out-content': 'scale-out-content 0.2s ease',
        'fade-in': 'fade-in 0.2s ease',
        'fade-out': 'fade-out 0.2s ease',
        // Toast
        'toast-hide': 'toast-hide 100ms ease-in forwards',
        'toast-slide-in-right':
          'toast-slide-in-right 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-slide-in-bottom':
          'toast-slide-in-bottom 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-swipe-out-x':
          'toast-swipe-out-x 100ms ease-out forwards',
        'toast-swipe-out-y':
          'toast-swipe-out-y 100ms ease-out forwards',
      },

      keyframes: {
        // Dropdown menu
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Tooltip
        'slide-up-fade': {
          '0%': { opacity: '0', transform: 'translateY(2px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-right-fade': {
          '0%': { opacity: '0', transform: 'translateX(-2px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-down-fade': {
          '0%': { opacity: '0', transform: 'translateY(-2px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-left-fade': {
          '0%': { opacity: '0', transform: 'translateX(2px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        // Navigation menu
        'enter-from-right': {
          '0%': { transform: 'translateX(200px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'enter-from-left': {
          '0%': { transform: 'translateX(-200px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'exit-to-right': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(200px)', opacity: '0' },
        },
        'exit-to-left': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-200px)', opacity: '0' },
        },
        'scale-in-content': {
          '0%': {
            transform: 'rotateX(-30deg) scale(0.9)',
            opacity: '0',
          },
          '100%': { transform: 'rotateX(0deg) scale(1)', opacity: '1' },
        },
        'scale-out-content': {
          '0%': { transform: 'rotateX(0deg) scale(1)', opacity: '1' },
          '100%': {
            transform: 'rotateX(-10deg) scale(0.95)',
            opacity: '0',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        // Toast
        'toast-hide': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'toast-slide-in-right': {
          '0%': { transform: `translateX(calc(100% + 1rem))` },
          '100%': { transform: 'translateX(0)' },
        },
        'toast-slide-in-bottom': {
          '0%': { transform: `translateY(calc(100% + 1rem))` },
          '100%': { transform: 'translateY(0)' },
        },
        'toast-swipe-out-x': {
          '0%': {
            transform: 'translateX(var(--radix-toast-swipe-end-x))',
          },
          '100%': {
            transform: `translateX(calc(100% + 1rem))`,
          },
        },
        'toast-swipe-out-y': {
          '0%': {
            transform: 'translateY(var(--radix-toast-swipe-end-y))',
          },
          '100%': {
            transform: `translateY(calc(100% + 1rem))`,
          },
        },
      },
      fontSize: {
        'super-mega': ['128px', '1.2'],
        mega: ['96px', '1.2'],
        hlarge: ['72px', '1.2'],
        'h1-large': ['44px', '1.2'],
        'h2-large': ['32px', '1.2'],
        'h3-large': ['24px', '1.2'],
        'h4-large': ['22px', '1.2'],
        'h5-large': ['20px', '1.2'],
        'h6-large': ['18px', '1.2'],
        'base-large': ['16px', '1.7'],
        'sm-large': ['14px', '1.7'],
        'xs-large': ['12px', '1.7'],
        'xxs-large': ['11px', '1.7'],

        h1: ['44px', '1.2'],
        h2: ['32px', '1.2'],
        h3: ['24px', '1.2'],
        h4: ['22px', '1.2'],
        h5: ['20px', '1.2'],
        h6: ['18px', '1.2'],
        xl: ['20px', '1.7'],
        base: ['16px', '1.7'],
        sm: ['14px', '1.7'],
        xs: ['12px', '1.7'],
        xxs: ['11px', '1.7'],
      },
      text: {
        h1: ['56px', '1.7'],
        h2: ['42px', '1.7'],
        h3: ['32px', '1.7'],
        h4: ['24px', '1.7'],
        h5: ['20px', '1.7'],
        xl: ['20px', '1.7'],
        lg: ['18px', '1.7'],
        base: ['16px', '1.7'],
        sm: ['14px', '1.7'],
        xs: ['12px', '1.7'],
        xxs: ['10px', '1.7'],
      },
      colors: {
        purple: {
          400: '#9248fc',
        },
        gray: {
          75: '#fafbfc',
        },
        base: {
          50: 'var(--color-base-50)',
          100: 'var(--color-base-100)',
          200: 'var(--color-base-200)',
          300: 'var(--color-base-300)',
          400: 'var(--color-base-400)',
        },
        contrast: {
          50: 'var(--color-contrast-50)',
          100: 'var(--color-contrast-100)',
          200: 'var(--color-contrast-200)',
          300: 'var(--color-contrast-300)',
          400: 'var(--color-contrast-400)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      spacing: {
        52: '52px',
        1: '1px',
        10: '10px',
        7: '7px',
        16: '16px',
        6: '6px',
        5: '5px',
        8: '8px',
        2: '2px',
        4: '4px',
        12: '12px',
        20: '20px',
        24: '24px',
        32: '32px',
        40: '40px',
        48: '48px',
        64: '64px',
        80: '80px',
        96: '96px',
        128: '128px',
        1152: '1152px',
      },
      scale: {
        80: '0.8',
      },
      letterSpacing: {
        'wide-015': '.015rem',
        'narrow-05': '-.05rem',
      },
      width: {
        18: '18px',
        14: '14px',
        40: '40px',
        28: '28px',
        56: '56px',
        52: '52px',
        16: '16px',
        8: '8px',
        2: '2px',
        4: '4px',
        12: '12px',
        20: '20px',
        24: '24px',
        32: '32px',
        48: '48px',
        64: '64px',
        80: '80px',
        96: '96px',
        112: '112px',
        128: '128px',
        192: '192px',
        256: '256px',
        1152: '1152px',
        812: '812px',
      },
      borderRadius: {
        sm: '4px',
        lg: '16px',
        '2xl': '32px',
        'large-circle': '128px',
      },
      maxHeight: {
        256: '256px',
        224: '224px',
        248: '248px',
        192: '192px',
        '2-3-screen-minus-nav': 'calc(66vh - 32px)',
        'screen-minus-nav': 'calc(100vh - 64px)',
        'select-content':
          'var(--radix-select-content-available-height)',
      },
      maxWidth: {
        224: '224px',
        248: '248px',
        256: '256px',
        192: '192px',
        320: '320px',
        324: '324px',
        384: '384px',
        576: '576px',
        768: '768px',
        960: '960px',
        888: '888px',
        288: '288px',
        96: '96px',
        1152: '1152px',
      },
      willChange: {
        'transform-opacity': 'transform, opacity',
      },
      boxShadow: {
        metal: `rgba(14, 63, 126, 0.06) 0px 0px 0px 1px, rgba(42, 51, 70, 0.03) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 2px 2px -1px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.03) 0px 5px 5px -2.5px, rgba(42, 51, 70, 0.03) 0px 10px 10px -5px, rgba(42, 51, 70, 0.03) 0px 24px 24px -8px`,
        'metal-bottom': `rgba(14, 63, 126, 0.06) 0px 0px 0px 1px, rgba(42, 51, 70, 0.03) 0px -1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px -2px 2px -1px, rgba(42, 51, 70, 0.04) 0px -3px 3px -1.5px, rgba(42, 51, 70, 0.03) 0px -5px 5px -2.5px, rgba(42, 51, 70, 0.03) 0px -10px 10px -5px, rgba(42, 51, 70, 0.03) 0px -24px 24px -8px`,

        'metal-dark': `rgba(244, 244, 245, 0.06) 0px 0px 0px 1px, rgba(82, 82, 91, 0.03) 0px 1px 1px -0.5px, rgba(82, 82, 91, 0.04) 0px 2px 2px -1px, rgba(82, 82, 91, 0.04) 0px 3px 3px -1.5px, rgba(82, 82, 91, 0.03) 0px 5px 5px -2.5px, rgba(82, 82, 91, 0.03) 0px 10px 10px -5px, rgba(82, 82, 91, 0.03) 0px 24px 24px -8px`,
        'metal-bottom-dark': `rgba(244, 244, 245, 0.06) 0px 0px 0px 1px, rgba(82, 82, 91, 0.03) 0px -1px 1px -0.5px, rgba(82, 82, 91, 0.04) 0px -2px 2px -1px, rgba(82, 82, 91, 0.04) 0px -3px 3px -1.5px, rgba(82, 82, 91, 0.03) 0px -5px 5px -2.5px, rgba(82, 82, 91, 0.03) 0px -10px 10px -5px, rgba(82, 82, 91, 0.03) 0px -24px 24px -8px`,
        small1: `rgba(0, 0, 0, 0.05) 0px 0px 0px 1px`,
        small2: `rgba(0, 0, 0, 0.05) 0px 0px 0px 2px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px`,
        metal2: `rgba(0, 0, 0, 0.05) 0px 0px 0px 1px`,
        nav: `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px`,
        normal: `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px`,
        thead: `inset 0px -4px 0px rgba(229, 231, 235, 1)`,
        'thead-dark': `inset 0px -4px 0px rgba(3, 7, 18, 1)`,
        xl: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
        small: `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px`,
        tiny: '0px 5px 2px -2px rgba(0, 0, 0, 0.2)',
        around: `rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px`,
        medium:
          'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
        'medium-green':
          'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
        '3xl': `rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px, rgba(50, 50, 93, 0.25) 0px -13px 27px -5px, rgba(0, 0, 0, 0.3) 0px -8px 16px -8px`,
        // '3xl-dark': `rgba(153, 153, 153, 0.3) 0px 8px 16px -8px, rgba(153, 153, 153, 0.3) 0px -8px 16px -8px`,
        '3xl-dark':
          'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px, rgba(50, 50, 93, 0.25) 0px -13px 27px -5px, rgba(0, 0, 0, 0.3) 0px -8px 16px -8px',
        '4xl': `0 20px 68px rgba(0, 0, 0, 0.55)`,
      },
      minHeight: {
        128: '128px',
        'screen-minus-nav': 'calc(100vh - 64px)',
        'half-screen-minus-nav-padding': 'calc(50vh - 64px)',
        '1-2-screen-minus-nav': 'calc(50vh - 32px)',
        '50vh': '50vh',
        '40vh': '40vh',
      },
      minWidth: {
        768: '768px',
      },
      height: {
        14: '14px',
        18: '18px',
        72: '72px',
        36: '36px',
        38: '38px',
        44: '44px',
        28: '28px',
        40: '40px',
        512: '512px',
        'screen-minus-nav': 'calc(100vh - 64px)',
        'screen-minus-nav-padding': 'calc(100vh - 64px - 64px)',
        'half-screen-minus-nav-padding': 'calc(50vh - 64px)',
        'half-screen-input': 'calc(50vh - 64px - 38px)',
        1: '1px',
        256: '256px',
        '70vh': '70vh',
        '20vh': '20vh',
        '30vh': '30vh',
        48: '48px',
        192: '192px',
        'half-screen-minus-nav': 'calc(50vh)',
        '1-3-screen-minus-nav': 'calc(33vh - 32px)',
        '1-2-screen-minus-nav': 'calc(50vh - 32px)',
        '2-3-screen-minus-nav': 'calc(66vh - 32px)',
        1024: '1024px',
      },
      zIndex: {
        100: '100',
        200: '200',
        1000: '1000',
        2000: '2000',
        2200: '2200',
        3000: '3000',
        3100: '3100',
        4000: '4000',
        4200: '4200',
        10000: '10000',
      },
      translate: {
        'toast-swipe-move': 'var(--radix-toast-swipe-move-x)',
        'toast-swipe-cancel': '0',
        4: '4px',
        2: '2px',
        60: '60px',
        36: '36px',
        28: '28px',
        30: '30px',
        32: '32px',
        34: '34px',
        full: 'calc(100cqw - 100%)',
      },
      lineHeight: {
        content: '1.7',
        base: '1',
        '1-2': '1.2',
        mid: '1.4',
      },
      borderWidth: {
        1: '1px',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  darkMode: 'media',
  safelist: [...COLORS.used],
  plugins: [require('tailwindcss-radix')()],
}

export default config

console.log(COLORS.used)
