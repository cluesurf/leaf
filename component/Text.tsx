/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import FontsContext, { FontsContextInput } from '~/context/FontsContext'
import useSettings from '~/hook/useSettings'
import { Font, getScriptFont } from '~/utility/font'
import tone from '@termsurf/tone'
import clsx from 'clsx'
import React, {
  CSSProperties,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'

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

  const fontsKey = fonts.map(font => font?.family).join(':')

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

  useLayoutEffect(() => {
    let timer

    if (checked) {
      if (!isInvisible) {
        timer = setTimeout(() => setIsReady(true), 500)
      } else {
        setIsReady(true)
      }

      setIsInvisible(false)
    }

    return () => clearTimeout(timer)
  }, [state, fontsKey, checked, isInvisible])

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
  const [isRendered, setIsRendered] = useState(!hiding)
  const [transitionState, setTransitionState] =
    useState<string>('start')
  const [animated, setAnimated] = useState(false)
  const lineHeight = lineHeights?.[leading]

  useLayoutEffect(() => {
    if (isReady) {
      if (!isRendered) {
        setTransitionState('fade-in')
      } else {
        setTransitionState('fade-out')
      }
    }
  }, [isReady, hiding])

  useLayoutEffect(() => {
    setIsRendered(!hiding)
  }, [hiding, isReady])

  const actualStyles = {
    ...style,
    fontSize: size,
    lineHeight,
  }

  const Tag = tag as keyof JSX.IntrinsicElements

  useEffect(() => {
    let timer
    if (transitionState === 'fade-out') {
      setAnimated(true)
      timer = setTimeout(() => setTransitionState('fade-in'), 300)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [transitionState])

  if (transitionState === 'fade-out') {
    return (
      <Tag
        {...props}
        style={actualStyles}
        className={clsx(
          className,
          `${fontClassName}-fallback fade-out`,
          'opacity-0',
          animated && `transition-opacity duration-300`,
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

  if (transitionState === 'fade-in') {
    return (
      <Tag
        {...props}
        style={actualStyles}
        className={clsx(
          className,
          animated && `transition-opacity duration-500`,
          `opacity-1`,
          fontClassName,
        )}
      >
        {text}
      </Tag>
    )
  }

  return (
    <Tag
      {...props}
      style={actualStyles}
      className={clsx(
        className,
        hiding ? `opacity-0` : `opacity-1`,
        `${fontClassName}-fallback`,
      )}
    >
      {text}
    </Tag>
  )
}
