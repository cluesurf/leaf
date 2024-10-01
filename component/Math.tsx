import React, { useEffect, useState } from 'react'
import KaTeX from 'katex'
import clsx from 'clsx'

// https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.css

export type MathInput = {
  children: string
  className?: string
}

export default function Math({ className, children }: MathInput) {
  const [formula, setFormula] = useState<string>('')

  useEffect(() => {
    try {
      const output = KaTeX.renderToString(children, {
        displayMode: true,
        throwOnError: true,
      }) as string

      if (output) {
        setFormula(output)
      }
    } catch (e) {}
  }, [children])

  return (
    <InternalBlockMath
      className={className}
      html={formula}
    />
  )
}

export type InternalBlockMathInput = {
  html: string
  className?: string
}

const InternalBlockMath = ({
  className,
  html,
}: InternalBlockMathInput) => {
  return (
    <div
      className={clsx('py-16', className)}
      role="math"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

Math.Inline = InlineMath

export function InlineMath({ className, children }: MathInput) {
  const [formula, setFormula] = useState<string>('')

  useEffect(() => {
    try {
      const output = KaTeX.renderToString(children, {
        displayMode: false,
        throwOnError: true,
      }) as string

      if (output) {
        setFormula(output)
      }
    } catch (e) {}
  }, [children])

  return (
    <InternalInlineMath
      className={className}
      html={formula}
    />
  )
}

const InternalInlineMath = ({
  className,
  html,
}: InternalBlockMathInput) => {
  return (
    <span
      role="math"
      className={clsx(`katex-inline`, className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
