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
import { getScriptFont } from '~/utility/font'
import { FontName } from '~/constant/font'

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
} & React.ComponentPropsWithoutRef<any>

function checkDocumentFont(text: string) {
  return false //typeof document !== 'undefined' && document.fonts.check(text)
}

function checkFonts(state: FontsContextInput, fonts: Array<FontName>) {
  for (const font of fonts) {
    if (!checkDocumentFont(`16px "${font}"`) && !state.fonts[font]) {
      return false
    }
  }
  return true
}

function getFontClassNames(fonts: Array<string>) {
  const classNames: Array<string> = []
  for (const font of fonts) {
    classNames.push(`font-${font.replace(/\s+/g, '')}`)
  }
  return classNames
}

export function useText(
  font: string | Array<string> | undefined,
  script?: string | Array<string> | undefined,
) {
  const state = useContext(FontsContext)
  const scriptConfig = useSettings('scripts')

  const fonts = useMemo<Array<FontName>>(() => {
    if (Array.isArray(font)) {
      return font
    }

    if (font) {
      return [font]
    }

    if (script && scriptConfig) {
      const scripts = Array.isArray(script) ? script : [script]
      const scriptFonts = scripts.map(script =>
        getScriptFont(scriptConfig, script),
      )

      return scriptFonts
    }

    return ['Noto Sans Mono']
  }, [font, script, scriptConfig])

  const checked = checkFonts(state, fonts)
  const [isReady, setIsReady] = useState(checked)
  const [isInvisible, setIsInvisible] = useState(!checked)
  const fontClassName = getFontClassNames(fonts).join(' ')

  useLayoutEffect(() => {
    const timer = setTimeout(() => setIsInvisible(false), 500)

    return () => clearTimeout(timer)
  }, [])

  useLayoutEffect(() => {
    const checked = checkFonts(state, fonts)
    if (checked) {
      setIsReady(true)
      setIsInvisible(false)
    }
  }, [state, fonts])

  return [isReady, fontClassName, isInvisible]
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
  ...props
}: TInput) {
  const text = processor
    ? processors[processor](value!)
    : (value ?? children)!

  const [isReady, fontClassName, hiding] = useText(font, script)
  const [startedReady] = useState(!hiding)
  const [isRendered, setIsRendered] = useState(!hiding)
  const [transitionState, setTransitionState] = useState<string>()
  const [animated, setAnimated] = useState(false)

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
