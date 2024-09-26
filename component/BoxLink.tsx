import cx from 'classnames'
import T from './Text'
import React, { useState } from 'react'
import Dots from './Dots'
import { useDarkMode } from '~/hook/useDarkMode'
import Link from 'next/link'

export type BoxLinkInput = {
  call: React.ReactNode
  note?: React.ReactNode
  link?: string
  className?: string
  tooltipId?: string
}

export default function BoxLink({
  call,
  note,
  link,
  className,
  tooltipId,
}: BoxLinkInput) {
  const [loading, setLoading] = useState<React.ReactNode>()
  const isDark = useDarkMode() === 'dark'

  const handleClick = () => {
    // setLoading(
    //   <Dots
    //     className={cx(isDark ? undefined : 'invert', 'opacity-70')}
    //   />,
    // )
  }

  if (!link) {
    return (
      <span
        data-tooltip-id={tooltipId}
        data-tooltip-delay-show={1000}
        className={cx(
          'shadow-xl flex flex-col gap-16 transition-all duration-200 text-left px-16 py-8 bg-gray-100 dark:bg-gray-900 h-full rounded-sm w-full',
          className,
        )}
      >
        <T className="font-bold inline-block w-full break-all">
          {call}
        </T>
        {note && <T className="mb-4 inline-block">{note}</T>}
      </span>
    )
  }

  return (
    <Link
      data-tooltip-id={tooltipId}
      data-tooltip-delay-show={1000}
      className={cx(
        'shadow-xl flex gap-16 hover:shadow-medium transition-all duration-200 text-left px-16 py-8 bg-gray-100 dark:bg-gray-900 h-full leading-content items-center rounded-sm w-full',
        className,
      )}
      href={`${link}`}
      onClick={handleClick}
    >
      <T className="font-bold inline-block w-full break-all">{call}</T>
      {loading
        ? loading
        : note && <T className="mb-4 inline-block">{note}</T>}
    </Link>
  )
}
