'use client'

import React, { HTMLProps, useEffect, useRef } from 'react'
import clsx from 'clsx'
import T from './Text'

export type BlockQuoteInput =
  React.ComponentPropsWithoutRef<'blockquote'> & {
    children?: React.ReactNode
  }

export function BlockQuote({
  children,
  className,
  ...props
}: BlockQuoteInput) {
  return (
    <T
      {...props}
      tag="blockquote"
      className={clsx(className, 'mt-16 mb-24 w-full p-16')}
    >
      {children}
    </T>
  )
}

export type UlInput = React.ComponentPropsWithoutRef<'ul'> & {
  children?: React.ReactNode
}

export function Ul({ children, className, ...props }: UlInput) {
  const list = [
    "list-['*_'] list-inside relative m-0 p-0",
    'w-full ml-4',
    'mb-32 [&>li>ul]:mb-0 [&>li>ol]:mb-0',
  ]
  return (
    <ul
      {...props}
      className={clsx(className, list.join(' '))}
    >
      {children}
    </ul>
  )
}

export type LiInput = React.ComponentPropsWithoutRef<'li'> & {
  children?: React.ReactNode
}

export function Li({ children, className, ...props }: LiInput) {
  return (
    <T
      tag="li"
      className={clsx(
        className,
        'font-medium text-base sm:text-base-large relative m-0 ml-24 p-0 list-item mb-8 [&>ul]:pl-24 [&>ol]:pl-24 [&>ul>li]:ml-0 [&>ol>li]:ml-0 text-gray-700 dark:text-gray-400 [&&>p]:inline-block [&&>p]:pointer-events-auto [&&>p]:mb-0 [&&>p]:px-0',
      )}
    >
      {children}
    </T>
  )
}

export type OlInput = React.ComponentPropsWithoutRef<'ol'> & {
  children?: React.ReactNode
}

export function Ol({ children }: OlInput) {
  const list = [
    'relative list-decimal',
    'mt-4 ml-8',
    'w-full',
    'list-inside',
    'mb-32 [&>li>ul]:mb-0 [&>li>ol]:mb-0',
  ]
  return <ol className={list.join(' ')}>{children}</ol>
}

export type EmInput = React.ComponentPropsWithoutRef<'em'> & {
  children?: React.ReactNode
}

export function Em({ children, className, ...props }: EmInput) {
  return (
    <T
      {...props}
      tag="em"
      className={clsx(className, 'italic')}
    >
      {children}
    </T>
  )
}

export type CodeInput = React.ComponentPropsWithoutRef<'code'> & {
  children?: React.ReactNode
}

export function Code({ children, className, ...props }: CodeInput) {
  return (
    <T
      {...props}
      tag="code"
      className={clsx(
        className,
        'inline-block bg-inherit text-inherit relative px-8 py-2 font-medium text-base sm:text-base-large',
      )}
    >
      <span className="bg-gray-100 rounded-sm absolute left-0 right-0 top-0 bottom-0" />
      <T className="relative font-medium text-base sm:text-base-large text-gray-700">
        {children}
      </T>
    </T>
  )
}

export type StrongInput = React.ComponentPropsWithoutRef<'strong'> & {
  children?: React.ReactNode
}

export function Strong({ children, className, ...props }: StrongInput) {
  return (
    <T
      {...props}
      tag="strong"
      className={clsx(className, 'font-bold')}
    >
      {children}
    </T>
  )
}

type PreInput = React.ComponentPropsWithoutRef<'pre'> & {
  children?: React.ReactNode
}

export function Pre({ children, className, ...props }: PreInput) {
  return (
    <T
      {...props}
      tag="pre"
      className={clsx(
        className,
        'shadow-normal p-16 block [&>code]:bg-none [&>code]:p-0 bg-gray-100 whitespace-pre w-full mb-48 overflow-auto font-medium text-base sm:text-base-large',
      )}
    >
      {children}
    </T>
  )
}

export type SupInput = React.ComponentPropsWithoutRef<'sup'> & {
  children?: React.ReactNode
}

export function Sup({ className, children, ...props }: SupInput) {
  return (
    <T
      {...props}
      tag="sup"
      leading="base"
      className={clsx(className, 'text-sm -top-6')}
    >
      {children}
    </T>
  )
}

export function HR({ className }: { className?: string }) {
  return (
    <hr
      className={clsx(
        className,
        'relative h-16 bg-gray-50 dark:bg-gray-900',
      )}
    ></hr>
  )
}

export type ColumnInput = {
  children?: React.ReactNode
  fixed?: boolean
  width?: number | string
}

export function Column({
  children,
  fixed = false,
  width,
}: ColumnInput) {
  const list: Array<string> = []
  if (fixed) {
    list.push('fixed-column-cue')
  }

  if (width) {
    list.push('block')
  }

  return (
    <span
      style={{ width }}
      className={list.join(' ')}
    >
      {children}
    </span>
  )
}

export type PInput = React.ComponentPropsWithoutRef<'p'> & {
  children?: React.ReactNode
  align?: 'left' | 'center' | 'right'
  type?: 'primary' | 'secondary'
}

export function P({
  children,
  className,
  align = 'left',
  type = 'primary',
  ...props
}: PInput) {
  return (
    <T
      {...props}
      tag="p"
      className={clsx(
        className,
        'text-base sm:text-base-large',
        'mb-32 px-16',
        'font-medium',
        align === 'center'
          ? `text-center`
          : align === 'right'
            ? 'text-right'
            : undefined,
        type === 'secondary'
          ? 'text-gray-500 dark:text-gray-600'
          : 'text-gray-700 dark:text-gray-400',
      )}
    >
      {children}
    </T>
  )
}

export function Content({ children }: { children?: React.ReactNode }) {
  return <div className="[&>ol]:px-16 [&>ul]:px-16">{children}</div>
}

export type THInput = React.ComponentPropsWithoutRef<'th'> & {
  children?: React.ReactNode
}

export function TH({ children, className, ...props }: THInput) {
  const list = [
    'shadow-thead bg-gray-200 dark:bg-gray-600 border-0 border-r-4 last:border-r-0 border-solid border-gray-300 dark:border-gray-600 text-gray-700 font-bold text-base sm:text-base-large h-full px-16 py-8',
  ]
  return (
    <th
      {...props}
      className={clsx(className, list.join(' '))}
    >
      <T>{children}</T>
    </th>
  )
}

export type TableInput = {
  children?: React.ReactNode
}

export function Table({ children }: TableInput) {
  const ref = useRef<HTMLTableElement>(null)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const columnList = Array.prototype.slice.call(
      ref.current.querySelectorAll('.fixed-column-cue'),
    )

    for (const column of columnList) {
      const th = column.closest('th')
      if (th) {
        const index = th.cellIndex
        const tdList = Array.prototype.slice.call(
          ref.current.querySelectorAll(
            `tbody tr td:nth-child(${index + 1})`,
          ),
        )

        const rect = th.getBoundingClientRect()
        th.style.width = `${rect.width}px`
        th.style.height = `${rect.height}px`
        th.classList.add('left-0', 'top-auto', 'sticky', 'z-100')

        for (const td of tdList) {
          const rect = td.getBoundingClientRect()
          td.style.width = `${rect.width}px`
          td.style.height = `${rect.height}px`
          td.classList.add('left-0', 'top-auto', 'sticky', 'z-100')
        }
      }
    }
  }, [ref])

  return (
    <table
      ref={ref}
      className="border-collapse h-1 overflow-y-auto w-full table-fixed-header no-scrollbar"
    >
      {children}
    </table>
  )
}

export type TBodyInput = React.ComponentPropsWithoutRef<'tbody'> & {
  children?: React.ReactNode
}

export function TBody({ className, children, ...props }: TBodyInput) {
  return (
    <tbody
      {...props}
      className={clsx(
        className,
        `h-full [&>tr:nth-child(odd)]:bg-gray-50 [&>tr:nth-child(even)]:bg-gray-200 [&>tr:nth-child(odd)]:dark:bg-gray-900 [&>tr]:dark:text-gray-300 [&>tr:nth-child(even)]:dark:bg-gray-800`,
      )}
    >
      {children}
    </tbody>
  )
}

export type THeadInput = React.ComponentPropsWithoutRef<'thead'> & {
  children?: React.ReactNode
}

export function THead({ className, children, ...props }: TBodyInput) {
  return (
    <thead
      {...props}
      className={clsx(className)}
    >
      {children}
    </thead>
  )
}

export function Whole({ children }: { children: React.ReactNode }) {
  return <span className="whitespace-pre">{children}</span>
}

export type TableScrollerInput = {
  borderless?: boolean
  children?: React.ReactNode
  framed?: boolean
}

export function TableScroller({
  children,
  borderless = false,
  framed = false,
}: TableScrollerInput) {
  const list = [
    'shadow-normal mb-48 mt-16 max-h-screen w-full overflow-x-auto sticky-table-header',
  ]

  return <div className={list.join(' ')}>{children}</div>
}

export type TRInput = React.ComponentPropsWithoutRef<'tr'> & {
  children?: React.ReactNode
}

export function TR({ className, children, ...props }: TRInput) {
  return (
    <tr
      {...props}
      className={clsx(
        className,
        `h-full border-r-0 last-child:border-r-0 border-0 border-solid border-gray-300 dark:border-gray-600 dark:text-gray-300`,
      )}
    >
      {children}
    </tr>
  )
}

export type TDInput = React.ComponentPropsWithoutRef<'td'> & {
  children?: React.ReactNode
  padded?: boolean
  wrap?: boolean
}

export function TD({
  wrap = false,
  padded = true,
  children,
  className,
  ...props
}: TDInput) {
  const list = [
    'border-b-0 border-t-0 last:border-r-0 border-l-0 border-r-4 border-solid border-gray-300 dark:border-gray-600 h-full font-medium text-base sm:text-base-large text-gray-700 bg-inherit',
    wrap ? undefined : `whitespace-pre`,
    className,
  ]

  if (padded) {
    list.push('py-12', 'px-16')
  }

  return (
    <td
      {...props}
      className={list.join(' ')}
    >
      <T>{children}</T>
    </td>
  )
}

export type AInput = {
  children?: React.ReactNode
  href?: string
  rel?: string
  target?: string
} & HTMLProps<HTMLAnchorElement>

export function A({ children, href, rel, target, ...props }: AInput) {
  const list = [
    'cursor-pointer',
    'text-violet-400',
    'hover:opacity-70',
    'active:text-blue-500',
    'active:hover:opacity-70',
    'transition-opacity',
    'duration-200',
    // X.borderBottomDotted,
    // X.borderColorviolet,
    // X.borderWidth1,
  ]

  if (props.className) {
    list.push(...(props.className.split(/\s+/) as Array<string>))
  }

  return (
    <T
      tag="a"
      rel={rel}
      target={target}
      href={href}
      className={list.join(' ')}
    >
      {children}
    </T>
  )
}

export type H1Input = React.ComponentPropsWithoutRef<'h1'> & {
  children?: React.ReactNode
  fontSizeClassName?: string
  align?: 'left' | 'center' | 'right'
}

export function H1({
  className,
  fontSizeClassName = 'text-h1 sm:text-h1-large',
  children,
  align = 'center',
  ...props
}: H1Input) {
  return (
    <T
      {...props}
      tag="h1"
      leading="heading"
      className={clsx(
        fontSizeClassName,
        'mb-32 w-full font-bold text-gray-800 dark:text-gray-400 px-16',
        className,
        align === 'center'
          ? `text-center`
          : align === 'right'
            ? 'text-right'
            : undefined,
      )}
    >
      {children}
    </T>
  )
}

export type H2Input = React.ComponentPropsWithoutRef<'h2'> & {
  children?: React.ReactNode
  fontSizeClassName?: string
  link?: string
  align?: 'left' | 'center' | 'right'
  contrast?: boolean
}

export function H2({
  children,
  fontSizeClassName = 'text-h2 sm:text-h2-large',
  className,
  align = 'left',
  contrast = false,
  ...props
}: H2Input) {
  return (
    <T
      {...props}
      tag="h2"
      leading="heading"
      className={clsx(
        className,
        fontSizeClassName,
        'font-bold mb-24 border-0 border-b-4 border-solid border-gray-100 pt-8 mx-16 text-gray-700 dark:text-gray-300',
        align === 'center'
          ? `text-center`
          : align === 'right'
            ? 'text-right'
            : undefined,
      )}
    >
      {children}
    </T>
  )
}

export type H3Input = React.ComponentPropsWithoutRef<'h3'> & {
  children?: React.ReactNode
  fontSizeClassName?: string
  link?: string
  align?: 'left' | 'center' | 'right'
  border?: boolean
}

export function H3({
  className,
  fontSizeClassName = 'text-h3 sm:text-h3-large',
  children,
  link,
  align = 'left',
  border = true,
  ...props
}: H3Input) {
  return (
    <T
      {...props}
      tag="h3"
      id={link}
      className={clsx(
        className,
        fontSizeClassName,
        align === 'center'
          ? `text-center`
          : align === 'right'
            ? 'text-right'
            : undefined,
        'font-bold mb-24 border-0 border-solid border-gray-100 pt-8 mx-16 text-gray-700 dark:text-gray-400',
        border ? `border-b-4` : undefined,
      )}
    >
      {children}
    </T>
  )
}

export type H4Input = React.ComponentPropsWithoutRef<'h4'> & {
  children?: React.ReactNode
  fontSizeClassName?: string
  link?: string
}

export function H4({
  className,
  fontSizeClassName = 'text-h4 sm:text-h4-large',
  children,
  link,
  ...props
}: H4Input) {
  return (
    <T
      {...props}
      tag="h4"
      id={link}
      className={clsx(
        className,
        fontSizeClassName,
        'font-bold mb-16 px-16 text-gray-950 dark:text-gray-400',
      )}
    >
      {children}
    </T>
  )
}

export type H5Input = React.ComponentPropsWithoutRef<'h5'> & {
  children?: React.ReactNode
  fontSizeClassName?: string
  link?: string
}

export function H5({
  className,
  fontSizeClassName = 'text-h5 sm:text-h5-large',
  children,
  link,
  ...props
}: H5Input) {
  return (
    <T
      {...props}
      tag="h5"
      id={link}
      className={clsx(
        fontSizeClassName,
        className,
        'font-bold w-full mb-16 px-16 text-gray-950 dark:text-gray-400',
      )}
    >
      {children}
    </T>
  )
}

export type H6Input = React.ComponentPropsWithoutRef<'h6'> & {
  children?: React.ReactNode
  fontSizeClassName?: string
  link?: string
}

export function H6({
  className,
  fontSizeClassName = 'text-h6 sm:text-h6-large',
  children,
  link,
  ...props
}: H6Input) {
  return (
    <T
      {...props}
      tag="h6"
      id={link}
      className={clsx(
        fontSizeClassName,
        className,
        'font-bold w-full mb-16 px-16 text-gray-950 dark:text-gray-400',
      )}
    >
      {children}
    </T>
  )
}

export function PageBreak() {
  return <div className="break-inside-page" />
}

export function PageBlock({
  children,
}: {
  children?: React.ReactNode
}) {
  return <div className="break-inside-avoid-page">{children}</div>
}
