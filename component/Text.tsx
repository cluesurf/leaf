'use client'

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import FontsContext, { FontsContextInput } from '~/context/FontsContext'
import useSettings from '~/hook/useSettings'
import { Font, getScriptFont } from '~/utility/font'
import tone from '@termsurf/tone'
import clsx from 'clsx'
import React, {
  CSSProperties,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type JSX,
} from 'react'

const DEFAULT_FONT_CONFIG = {}

const processors = {
  tone: (text: string) => tone.make(text),
}

let _checkIsWaiting
let _checkIsWaitingFlag = true

function checkIsWaiting() {
  if (_checkIsWaiting) {
    return _checkIsWaiting
  }

  _checkIsWaiting = new Promise(res => {
    setTimeout(() => {
      _checkIsWaitingFlag = false
      res(_checkIsWaitingFlag)
    }, 700)
  })

  return _checkIsWaiting
}

let _checkIsWaitingLongEnough
let _checkIsWaitingLongEnoughFlag = false

function checkIsWaitingLongEnough() {
  if (_checkIsWaitingLongEnough) {
    return _checkIsWaitingLongEnough
  }

  _checkIsWaitingLongEnough = new Promise(res => {
    setTimeout(() => {
      _checkIsWaitingLongEnoughFlag = true
      res(_checkIsWaitingLongEnoughFlag)
    }, 500)
  })

  return _checkIsWaitingLongEnough
}

export type TInput = {
  className?: string
  processor?: 'tone'
  children?: React.ReactNode
  value?: string
  font?: string | Array<string>
  script?: string | Array<string>
  style?: CSSProperties
  background?: 'light' | 'medium' | 'heavy'
  bold?: boolean
  semibold?: boolean
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
  const [transitionState, setTransitionState] = useState<string>(
    checked ? 'head:enter' : 'base:hidden',
  )
  const [isBaseVisibleLongEnough, setIsBaseVisibleLongEnough] =
    useState(_checkIsWaitingLongEnoughFlag)
  const [isWaiting, setIsWaiting] = useState(
    !checked || _checkIsWaitingFlag,
  )
  const fontClassName = useMemo(
    () => getFontClassNames(fonts).join(' '),
    [fontsKey],
  )

  const handleTransitionOutEnd = useCallback(() => {
    setTransitionState('head:enter')
  }, [])

  useLayoutEffect(() => {
    checkIsWaiting().then(setIsWaiting)
    checkIsWaitingLongEnough().then(setIsBaseVisibleLongEnough)
  }, [])

  useLayoutEffect(() => {
    if (checked) {
      switch (transitionState) {
        case 'base:hidden':
          if (isWaiting) {
            setTransitionState('head:visible')
          } else {
            setTransitionState('head:enter')
          }
          break
        case 'base:visible':
          if (isBaseVisibleLongEnough) {
            setTransitionState('base:exit')
          }
          break
        case 'base:exit':
          break
        case 'head:enter':
          break
        case 'head:visible':
          break
      }
      setIsWaiting(false)
    } else if (!isWaiting) {
      setTransitionState('base:visible')
    }
  }, [checked, transitionState])

  useLayoutEffect(() => {
    let timer
    if (transitionState === 'base:exit') {
      timer = setTimeout(handleTransitionOutEnd, 300)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [transitionState, handleTransitionOutEnd])

  return {
    fontClassName,
    transitionState,
    handleTransitionOutEnd,
    lineHeights: fonts[0]?.lineHeight,
  }
}

export default function Text({
  className,
  value,
  children,
  font,
  script,
  processor,
  background = 'light',
  style = {},
  size,
  bold,
  semibold,
  tag = 'span',
  leading = 'body',
  ...props
}: TInput) {
  const text = processor
    ? processors[processor](value!)
    : (value ?? children)!

  const {
    lineHeights,
    handleTransitionOutEnd,
    fontClassName,
    transitionState,
  } = useText(font, script)
  const lineHeight = lineHeights?.[leading]

  const actualStyles = {
    fontWeight: bold ? 'bold' : semibold ? 'semibold' : undefined,
    ...style,
    fontSize: size,
    lineHeight,
  }

  const Tag = tag as keyof JSX.IntrinsicElements

  switch (transitionState) {
    case 'base:hidden':
      return (
        <Tag
          {...props}
          style={actualStyles}
          className={clsx(
            className,
            // animated && `transition-opacity duration-500`,
            `opacity-0`,
            `${fontClassName}-fallback`,
          )}
        >
          {text}
        </Tag>
      )
    case 'base:visible':
      return (
        <Tag
          {...props}
          style={actualStyles}
          className={clsx(
            className,
            // animated && `transition-opacity duration-500`,
            `opacity-1 transition-opacity duration-300`,
            `${fontClassName}-fallback`,
          )}
        >
          {text}
        </Tag>
      )
    case 'base:exit':
      return (
        <Tag
          {...props}
          style={actualStyles}
          onTransitionEnd={handleTransitionOutEnd}
          className={clsx(
            className,
            `transition-opacity duration-300`,
            `opacity-0`,
            `${fontClassName}-fallback`,
          )}
        >
          {text}
        </Tag>
      )
    case 'head:enter':
      return (
        <Tag
          {...props}
          style={actualStyles}
          className={clsx(
            className,
            `transition-opacity duration-500`,
            `opacity-1`,
            fontClassName,
          )}
        >
          {text}
        </Tag>
      )
    case 'head:visible':
      return (
        <Tag
          {...props}
          style={actualStyles}
          className={clsx(
            className,
            `opacity-1 transition-opacity duration-300`,
            fontClassName,
          )}
        >
          {text}
        </Tag>
      )
  }
}
