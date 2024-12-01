/**
 * @name dracula
 * @author dracula
 * Michael Kaminsky (http://github.com/mkaminsky11)
 * Original dracula color scheme by Zeno Rocha (https://github.com/zenorocha/dracula-theme)
 */
import { tags as t } from '@lezer/highlight'
import { createTheme, CreateThemeOptions } from './theme'

export const defaultLightSettings: CreateThemeOptions['settings'] = {
  background: 'rgb(243, 244, 246)',
  foreground: 'rgb(100, 116, 139)',
  foregroundFontWeight: 'bold',
  caret: 'rgb(75, 85, 99)',
  selection: 'rgb(156, 163, 175)',
  selectionMatch: 'rgb(229, 231, 235)',
  gutterBackground: 'transparent',
  gutterForeground: 'transparent',
  gutterBorder: 'transparent',
  lineHighlight: 'rgb(229, 231, 235)',
  selectionBackground: 'rgba(156, 163, 175, 0.5)',
}

export const defaultDarkSettings: CreateThemeOptions['settings'] = {
  background: 'rgb(46, 16, 101)',
  foreground: 'rgb(209, 213, 219)',
  foregroundFontWeight: 'bold',
  caret: 'rgb(75, 85, 99)',
  selection: 'rgb(107, 114, 128)',
  selectionMatch: 'rgb(75, 85, 99)',
  gutterBackground: 'transparent',
  gutterForeground: 'transparent',
  gutterBorder: 'transparent',
  lineHighlight: 'rgb(31, 41, 55)',
  selectionBackground: 'rgba(107, 114, 128, 0.5)',
}

const lightStyles = {
  string: 'rgb(75, 85, 99)',
  variableName: 'rgb(30, 41, 59)',
}

const darkStyles = {
  string: 'rgb(229, 231, 235)',
  variableName: 'rgb(203, 213, 225)',
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
