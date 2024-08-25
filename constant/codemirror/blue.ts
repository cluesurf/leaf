/**
 * @name dracula
 * @author dracula
 * Michael Kaminsky (http://github.com/mkaminsky11)
 * Original dracula color scheme by Zeno Rocha (https://github.com/zenorocha/dracula-theme)
 */
import { tags as t } from '@lezer/highlight'
import { createTheme, CreateThemeOptions } from './theme'

export const defaultLightSettings: CreateThemeOptions['settings'] = {
  background: 'rgb(239, 246, 255)',
  foreground: 'rgb(100, 116, 139)',
  foregroundFontWeight: 'bold',
  caret: 'rgb(37, 99, 235)',
  selection: 'rgb(96, 165, 250)',
  selectionMatch: 'rgb(191, 219, 254)',
  gutterBackground: 'transparent',
  gutterForeground: 'transparent',
  gutterBorder: 'transparent',
  lineHighlight: 'rgb(219, 234, 254)',
  selectionBackground: 'rgba(96, 165, 250, 0.5)',
}

export const defaultDarkSettings: CreateThemeOptions['settings'] = {
  background: 'rgb(23, 37, 84)',
  foreground: 'rgb(147, 197, 253)',
  foregroundFontWeight: 'bold',
  caret: 'rgb(37, 99, 235)',
  selection: 'rgb(59, 130, 246)',
  selectionMatch: 'rgb(37, 99, 235)',
  gutterBackground: 'transparent',
  gutterForeground: 'transparent',
  gutterBorder: 'transparent',
  lineHighlight: 'rgb(30, 64, 175)',
  selectionBackground: 'rgba(59, 130, 246, 0.5)',
}

const lightStyles = {
  string: 'rgb(37, 99, 235)',
  variableName: 'rgb(30, 41, 59)',
}

const darkStyles = {
  string: 'rgb(237, 233, 254)',
  variableName: 'rgb(203, 213, 225)',
}

export const blueTheme = (options?: Partial<CreateThemeOptions>) => {
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
        fontWeight: 'bold',
      },
      { tag: t.meta, color: 'rgb(148, 163, 184)' },
      {
        tag: [t.keyword, t.operator, t.tagName],
        color: '#ff79c6',
        fontWeight: 'bold',
      },
      {
        tag: [t.function(t.propertyName), t.propertyName],
        color: defaultStyles.variableName,
        fontWeight: 'bold',
      },
      {
        tag: [
          t.definition(t.variableName),
          t.function(t.variableName),
          t.className,
          t.attributeName,
        ],
        color: defaultStyles.variableName,
        fontWeight: 'bold',
      },
      { tag: t.atom, color: defaultStyles.string },
      { tag: t.null, color: 'rgb(239, 68, 68)', fontWeight: 'bold' },
      {
        tag: [t.number, t.bool],
        color: 'rgb(16, 185, 129)',
        fontWeight: 'bold',
      },
      {
        tag: [t.punctuation, t.bracket],
        color: 'rgb(148, 163, 184)',
      },

      ...styles,
    ],
  })
}
