'use client'

import React from 'react'
import Script from 'next/script'

import cx from 'classnames'

export default function Container({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cx(`w-full min-w-screen min-h-screen bg-gray-50`)}
      >
        <Script id="disable-scroll-restoration">{`window.history.scrollRestoration = "manual"`}</Script>
        {children}
        <div id="overlay" />
      </body>
    </html>
  )
}
