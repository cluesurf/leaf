/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, {
  CSSProperties,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import cx from 'classnames'
import tone from '@termsurf/tone'
import FontsContext, { FontsContextInput } from '~/context/FontsContext'
import useSettings from '~/hook/useSettings'
import { Font, getScriptFont } from '~/utility/font'

const DEFAULT_FONT_CONFIG = {}

const processors = {
  tone: (text: string) => tone.make(text),
}

export type TInput = {
  className?: string
  processor?: 'tone'
  children?: React.ReactNode
  value?: string
  font?: string | Array<string>
  script?: string | Array<string>
  theme?: 'base'
  style?: CSSProperties
  background?: 'light' | 'medium' | 'heavy'
  bold?: boolean
  size?: number
  tag?: keyof JSX.IntrinsicElements
  leading?: 'heading' | 'body' | 'base'
} & React.ComponentPropsWithoutRef<any>

function checkDocumentFont(text: string) {
  return false //typeof document !== 'undefined' && document.fonts.check(text)
}

function checkFonts(
  state: FontsContextInput,
  fonts: Array<Font | undefined>,
) {
  for (const font of fonts) {
    if (!font) {
      return false
    }

    if (
      !checkDocumentFont(`16px "${font}"`) &&
      !state.fonts[font.family]
    ) {
      return false
    }
  }
  return true
}

function getFontClassNames(fonts: Array<Font | undefined>) {
  const classNames: Array<string> = []
  for (const font of fonts) {
    if (font) {
      classNames.push(`font-${font.family.replace(/\s+/g, '')}`)
    }
  }
  return classNames
}

export function useText(
  font: string | Array<string> | undefined,
  script?: string | Array<string> | undefined,
) {
  const state = useContext(FontsContext)
  const scriptConfig = useSettings('scripts')
  const fontConfig = useSettings('fonts') ?? DEFAULT_FONT_CONFIG

  const fonts = useMemo<Array<Font>>(() => {
    if (Array.isArray(font)) {
      return font.map(name => fontConfig[name])
    }

    if (font) {
      return [font].map(name => fontConfig[name])
    }

    if (script && scriptConfig) {
      const scripts = Array.isArray(script) ? script : [script]
      const scriptFonts = scripts.map(script =>
        getScriptFont(scriptConfig, script),
      )

      return scriptFonts.map(name => fontConfig[name])
    }

    return ['Noto Sans Mono'].map(name => fontConfig[name])
  }, [font, script, scriptConfig, fontConfig])

  const fontsKey = fonts
    .filter(x => x)
    .map(font => font.family)
    .join(':')

  const checked = checkFonts(state, fonts)
  const [isReady, setIsReady] = useState(checked)
  const [isInvisible, setIsInvisible] = useState(!checked)
  const fontClassName = useMemo(
    () => getFontClassNames(fonts).join(' '),
    [fontsKey],
  )

  useEffect(() => {
    const timer = setTimeout(() => setIsInvisible(false), 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const checked = checkFonts(state, fonts)
    if (checked) {
      setIsReady(true)
      setIsInvisible(false)
    }
  }, [state, fontsKey])

  return [isReady, fontClassName, isInvisible, fonts[0]?.lineHeight]
}

export default function Text({
  className,
  value,
  children,
  font,
  script,
  processor,
  theme = 'base',
  background = 'light',
  style = {},
  size,
  bold,
  tag = 'span',
  leading = 'body',
  ...props
}: TInput) {
  const text = processor
    ? processors[processor](value!)
    : (value ?? children)!

  const [isReady, fontClassName, hiding, lineHeights] = useText(
    font,
    script,
  )
  const [startedReady] = useState(!hiding)
  const [isRendered, setIsRendered] = useState(!hiding)
  const [transitionState, setTransitionState] =
    useState<string>('fade-in')
  const [animated, setAnimated] = useState(false)
  const lineHeight = lineHeights?.[leading] ?? 1.7

  useEffect(() => {
    if (startedReady) {
      setTransitionState('fade-in')
    } else if (isReady) {
      if (!isRendered) {
        setTransitionState('fade-in')
      } else {
        setTransitionState('fade-out')
      }
    }
  }, [isReady, startedReady])

  useEffect(() => {
    setIsRendered(!hiding)
  }, [hiding, isReady])

  const actualStyles = {
    ...style,
    fontSize: size,
    lineHeight: lineHeight,
  }

  const Tag = tag as keyof JSX.IntrinsicElements

  if (transitionState === 'fade-out') {
    return (
      <Tag
        {...props}
        style={actualStyles}
        className={cx(
          className,
          `${fontClassName}-fallback`,
          'opacity-0 transition-opacity',
        )}
        onTransitionEnd={() => {
          setAnimated(true)
          setTransitionState('fade-in')
        }}
      >
        {text}
      </Tag>
    )
  }

  return (
    <Tag
      {...props}
      style={actualStyles}
      className={cx(
        className,
        animated ? `transition-opacity` : undefined,
        hiding ? `opacity-0` : `opacity-1`,
        isReady ? fontClassName : `${fontClassName}-fallback`,
      )}
    >
      {text}
    </Tag>
  )
}
