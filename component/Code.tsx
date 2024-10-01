import { common, createStarryNight } from '@wooorm/starry-night'
import clsx from 'clsx'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import React, { useEffect, useState } from 'react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'

let starryNight: any

export type CodeVibe = 'formal' | 'calm' | 'elemental' | 'pleasant'

export type CodeTint =
  | 'gray'
  | 'amber'
  | 'emerald'
  | 'blue'
  | 'violet'
  | 'pink'
  | 'rose'

export default function Code({
  scope = 'source.ts',
  vibe = 'formal',
  tint = 'gray',
  children,
  className,
  preClassName,
}: {
  className?: string
  preClassName?: string
  scope?: string
  vibe?: CodeVibe
  tint?: CodeTint
  children: string
}) {
  const [sn, setStarryNight] = useState<any>(starryNight)
  const [code, setCode] = useState<React.ReactNode>(children)

  useEffect(() => {
    createStarryNight(common).then(sn => {
      starryNight = sn
      setStarryNight(sn)
    })
  }, [])

  useEffect(() => {
    if (!sn) {
      return
    }

    const tree = sn.highlight(children, scope)
    const reactNode = toJsxRuntime(tree, {
      Fragment,
      jsx: jsx as any,
      jsxs: jsxs as any,
    })
    setCode(reactNode)
  }, [sn, scope, children])

  return (
    <pre
      className={clsx(
        preClassName,
        `code`,
        `code-vibe-${vibe}`,
        `overflow-x-auto`,
        `code-tint-${tint}`,
      )}
    >
      <code className={clsx(`block relative p-16`, className)}>
        {code}
      </code>
    </pre>
  )
}
