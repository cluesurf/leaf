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

function checkFonts(state: FontsContextInput, fonts: Array<FontName>) {
  for (const font of fonts) {
    if (!state.fonts[font]) {
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

    console.log('scriptConfig', scriptConfig)

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
  const [hasWaited, setHasWaited] = useState(checked)
  const [isReady, setIsReady] = useState(checked)
  const [isStarting, setIsStarting] = useState(true)
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  const fontClassName = getFontClassNames(fonts).join(' ')

  useLayoutEffect(() => {
    setIsStarting(false)
  }, [isStarting])

  useEffect(() => {
    let t: NodeJS.Timeout

    const removeTimer = () => clearTimeout(t)

    if (hasWaited) {
      return removeTimer
    }

    t = setTimeout(() => setHasWaited(true), 1000)

    setTimer(t)

    return removeTimer
  }, [hasWaited])

  useLayoutEffect(() => {
    const checked = checkFonts(state, fonts)
    if (checked && !isReady) {
      setIsReady(true)
      setHasWaited(true)
      clearTimeout(timer)
      setTimer(undefined)
    }
  }, [state, fonts, isReady, timer])

  return [isStarting, isReady, hasWaited, fontClassName]
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

  const [isStarting, isReady, hasWaited, fontClassName] = useText(
    font,
    script,
  )

  const actualStyles = {
    ...style,
    fontSize: size,
  }

  const Tag = tag as keyof JSX.IntrinsicElements

  if (isStarting || (isReady && hasWaited)) {
    return (
      <Tag
        {...props}
        style={actualStyles}
        className={cx(
          className,
          fontClassName,
          bold ? 'font-bold' : undefined,
        )}
      >
        {text}
      </Tag>
    )
  }

  if (hasWaited) {
    return (
      <Tag
        {...props}
        style={actualStyles}
        className={cx(
          `font-loading font-loading-${theme}-${background}`,
          bold ? 'font-bold' : undefined,
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
      className={`text-transparent`}
    >
      {text}
    </Tag>
  )
}
