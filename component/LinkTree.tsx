import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import cx from 'classnames'

export type LinkTreeInput = {
  form?: 'head' | 'link'
  text?: string
  link?: string
  nest?: Array<LinkTreeInput>
  // whether or not to scroll into view.
  show?: boolean
  side?: number
}

export type LinkTreeHeadInput = {
  text: string
}

export function LinkTreeHead({ text }: LinkTreeHeadInput) {
  return (
    <h5 className="mt-24 mb-16 px-16 text-xs opacity-70 first:mt-0 first:pt-16">
      {text}
    </h5>
  )
}

export type LinkTreeLinkInput = {
  text: string
  link: string
  lead?: boolean
  show?: boolean
  nest?: Array<LinkTreeInput>
  side: number
}

export function LinkTreeLink({
  text,
  link,
  lead,
  show,
  nest,
  side,
}: LinkTreeLinkInput) {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (show) {
      ref.current?.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center',
      })
    }
  }, [show, ref])

  return (
    <>
      <Link
        href={link}
        ref={ref}
        className={cx(
          lead ? 'text-violet-400' : undefined,
          `block text-xs font-bold hover:bg-gray-200 hover:text-violet-400 dark:hover:bg-gray-800 transition-all duration-200 px-16 py-8 first:pt-16`,
        )}
      >
        <span
          className="text-xs"
          style={{ marginLeft: (side - 1) * 16 }}
        >
          {text}
        </span>
      </Link>
      {nest && (
        <LinkTree
          show={show}
          nest={nest}
          side={side + 1}
        />
      )}
    </>
  )
}

export default function LinkTree({
  nest,
  show,
  side = 1,
}: LinkTreeInput) {
  const [leadLink, setLeadLink] = useState<string>()

  useEffect(() => {
    const lead =
      typeof window !== 'undefined' && window.location.pathname
    if (lead) {
      setLeadLink(lead)
    }
  }, [])

  if (!nest) {
    return null
  }

  return (
    <>
      {nest.map((tree, i) => {
        if (tree.form === 'head' && tree.text) {
          return (
            <React.Fragment key={i}>
              <LinkTreeHead text={tree.text} />
              {Boolean(tree.nest?.length) && (
                <LinkTree
                  nest={tree.nest}
                  show={show}
                />
              )}
            </React.Fragment>
          )
        } else if (tree.link && tree.text) {
          return (
            <LinkTreeLink
              key={i}
              lead={tree.link === leadLink}
              link={tree.link}
              text={tree.text}
              show={show && tree.link === leadLink}
              nest={tree.nest}
              side={side}
            />
          )
        }
      })}
    </>
  )
}
