/**
 * @name dracula
 * @author dracula
 * Michael Kaminsky (http://github.com/mkaminsky11)
 * Original dracula color scheme by Zeno Rocha (https://github.com/zenorocha/dracula-theme)
 */
import { tags as t } from '@lezer/highlight'
import { createTheme, CreateThemeOptions } from './theme'

export const defaultLightSettings: CreateThemeOptions['settings'] = {
  background: 'rgb(245, 243, 255)',
  foreground: 'rgb(100, 116, 139)',
  foregroundFontWeight: 'semibold',
  caret: 'rgb(124, 58, 237)',
  selection: 'rgb(167, 139, 250)',
  selectionMatch: 'rgb(221, 214, 254)',
  gutterBackground: 'transparent',
  gutterForeground: 'transparent',
  gutterBorder: 'transparent',
  lineHighlight: 'rgb(237, 233, 254)',
  selectionBackground: 'rgba(167, 139, 250, 0.5)',
}

export const defaultDarkSettings: CreateThemeOptions['settings'] = {
  background: 'rgb(46, 16, 101)',
  foreground: 'rgb(196, 181, 253)',
  foregroundFontWeight: 'semibold',
  caret: 'rgb(124, 58, 237)',
  selection: 'rgb(139, 92, 246)',
  selectionMatch: 'rgb(124, 58, 237)',
  gutterBackground: 'transparent',
  gutterForeground: 'transparent',
  gutterBorder: 'transparent',
  lineHighlight: 'rgb(91, 33, 182)',
  selectionBackground: 'rgba(139, 92, 246, 0.5)',
}

const lightStyles = {
  string: 'rgb(124, 58, 237)',
  variableName: 'rgb(30, 41, 59)',
}

const darkStyles = {
  string: 'rgb(237, 233, 254)',
  variableName: 'rgb(203, 213, 225)',
}

export const purpleTheme = (options?: Partial<CreateThemeOptions>) => {
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
