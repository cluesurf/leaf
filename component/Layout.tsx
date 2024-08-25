import React from 'react'

export type LayoutInput = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutInput) {
  return (
    <div className="bg-gray-100 dark:text-gray-200 dark:bg-gray-900 w-full h-full min-w-screen min-h-screen">
      {/* <FontProvider fonts={fonts}> */}
      {children}
      {/* </FontProvider> */}
    </div>
  )
}
