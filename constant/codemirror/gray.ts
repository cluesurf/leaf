/**
 * @name dracula
 * @author dracula
 * Michael Kaminsky (http://github.com/mkaminsky11)
 * Original dracula color scheme by Zeno Rocha (https://github.com/zenorocha/dracula-theme)
 */
import { tags as t } from '@lezer/highlight'
import { createTheme, CreateThemeOptions } from './theme'
import COLORS from '~/utility/colors'

export const defaultLightSettings: CreateThemeOptions['settings'] = {
  background: COLORS.tailwind.zinc100,
  foreground: 'rgb(100, 116, 139)',
  foregroundFontWeight: 'semibold',
  caret: COLORS.tailwind.zinc600,
  selection: COLORS.tailwind.zinc400,
  selectionMatch: COLORS.tailwind.zinc200,
  gutterBackground: 'transparent',
  gutterForeground: 'transparent',
  gutterBorder: 'transparent',
  lineHighlight: COLORS.tailwind.zinc200,
  selectionBackground: COLORS.tailwind.zinc400Half,
}

export const defaultDarkSettings: CreateThemeOptions['settings'] = {
  background: COLORS.tailwind.zinc900,
  foreground: COLORS.tailwind.zinc300,
  foregroundFontWeight: 'semibold',
  caret: COLORS.tailwind.zinc600,
  selection: COLORS.tailwind.zinc500,
  selectionMatch: COLORS.tailwind.zinc600,
  gutterBackground: 'transparent',
  gutterForeground: 'transparent',
  gutterBorder: 'transparent',
  lineHighlight: COLORS.tailwind.zinc800,
  selectionBackground: COLORS.tailwind.zinc500Half,
}

const lightStyles = {
  string: COLORS.tailwind.zinc600,
  variableName: COLORS.tailwind.zinc800,
}

const darkStyles = {
  string: COLORS.tailwind.zinc200,
  variableName: COLORS.tailwind.zinc300,
}

export const grayTheme = (options?: Partial<CreateThemeOptions>) => {
  const { theme = 'dark', settings = {}, styles = [] } = options || {}
  const defaultSettings =
    theme === 'dark' ? defaultDarkSettings : defaultLightSettings
  const defaultStyles = theme === 'dark' ? darkStyles : lightStyles
  return createTheme({
    theme: theme,
    settings: {
      ...defaultSettings,
      ...settings,
    },
    styles: [
      {
        tag: t.comment,
        color: 'rgb(148, 163, 184)',
        fontStyle: 'italic',
      },
      {
        tag: t.string,
        color: defaultStyles.string,
        fontWeight: 'semibold',
      },
      { tag: t.meta, color: 'rgb(148, 163, 184)' },
      {
        tag: [t.keyword, t.operator, t.tagName],
        color: '#ff79c6',
        fontWeight: 'semibold',
      },
      {
        tag: [t.function(t.propertyName), t.propertyName],
        color: defaultStyles.variableName,
        fontWeight: 'semibold',
      },
      {
        tag: [
          t.definition(t.variableName),
          t.function(t.variableName),
          t.className,
          t.attributeName,
        ],
        color: defaultStyles.variableName,
        fontWeight: 'semibold',
      },
      { tag: t.atom, color: defaultStyles.string },
      {
        tag: t.null,
        color: 'rgb(239, 68, 68)',
        fontWeight: 'semibold',
      },
      {
        tag: [t.number, t.bool],
        color: 'rgb(16, 185, 129)',
        fontWeight: 'semibold',
      },
      {
        tag: [t.punctuation, t.bracket],
        color: 'rgb(148, 163, 184)',
      },

      ...styles,
    ],
  })
}
