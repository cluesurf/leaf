'use client'

import React from 'react'
import Script from 'next/script'

import clsx from 'clsx'

export default function Container({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={clsx(`w-full min-w-screen min-h-screen bg-gray-50`)}
      >
        <Script id="disable-scroll-restoration">{`window.history.scrollRestoration = "manual"`}</Script>
        {children}
        <div id="overlay" />
      </body>
    </html>
  )
}
