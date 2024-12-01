'use client'

import React, { RefObject, useState } from 'react'
import clsx from 'clsx'
import { useViewportLayout3Section } from '~/hook/useViewportLayout'
import { ViewportLayout3Section } from '~/component/ViewportGrid'
import useFonts from '~/hook/useFonts'
import { FontName } from '~/constant/font'
import HomeIcon from './icon/Home'

export type LayoutSideState = {
  left?: 'missing' | 'present'
  right?: 'missing' | 'present'
}

export type LayoutInput = {
  fonts?: Array<FontName>
  children: React.ReactNode
  right?: React.ReactNode
  left?: React.ReactNode
  topRight?: React.ReactNode
  bottomRight?: React.ReactNode
  topLeft?: React.ReactNode
  bottomLeft?: React.ReactNode
  bottomCenter?: React.ReactNode
  showBottomCenterIf?: LayoutSideState
  topCenter?: React.ReactNode
  showTopCenterIf?: LayoutSideState
  scrollerRef?: RefObject<HTMLDivElement | null>
}

export default function Layout({
  children,
  scrollerRef,
  left: leftContent,
  right: rightContent,
  topRight: topRightContent,
  bottomRight: bottomRightContent,
  topLeft: topLeftContent,
  bottomLeft: bottomLeftContent,
  bottomCenter: bottomCenterContent,
  showBottomCenterIf,
  topCenter: topCenterContent,
  showTopCenterIf,
  fonts = ['Noto Sans Mono'],
}: LayoutInput) {
  useFonts(fonts)

  const [menu, setMenu] = useState<React.ReactNode>()
  const layout = useViewportLayout3Section()

  const right = rightContent ?? (
    <div className="h-full w-full overflow-y-auto pb-64">
      {rightContent}
    </div>
  )

  const leftIsHidden = layout.width < 804
  const rightIsHidden = layout.width < 1056

  let showBottomCenter = true

  if (showBottomCenterIf?.right) {
    if (showBottomCenterIf.right === 'missing') {
      if (!rightIsHidden) {
        showBottomCenter = false
      }
    } else if (showBottomCenterIf.right === 'present') {
      if (rightIsHidden) {
        showBottomCenter = false
      }
    }
  }

  if (showBottomCenterIf?.left) {
    if (showBottomCenterIf.left === 'missing') {
      if (!leftIsHidden) {
        showBottomCenter = false
      }
    } else if (showBottomCenterIf.left === 'present') {
      if (leftIsHidden) {
        showBottomCenter = false
      }
    }
  }

  let showTopCenter = true

  if (showTopCenterIf?.right) {
    if (showTopCenterIf.right === 'missing') {
      if (!rightIsHidden) {
        showTopCenter = false
      }
    } else if (showTopCenterIf.right === 'present') {
      if (rightIsHidden) {
        showTopCenter = false
      }
    }
  }

  if (showTopCenterIf?.left) {
    if (showTopCenterIf.left === 'missing') {
      if (!leftIsHidden) {
        showTopCenter = false
      }
    } else if (showTopCenterIf.left === 'present') {
      if (leftIsHidden) {
        showTopCenter = false
      }
    }
  }

  const bottom = (
    <ViewportLayout3Section
      state={layout}
      left={leftIsHidden ? undefined : bottomLeftContent}
      right={rightIsHidden ? undefined : bottomRightContent}
      middle={showBottomCenter ? bottomCenterContent : undefined}
    />
  )

  const top = (
    <ViewportLayout3Section
      state={layout}
      left={leftIsHidden ? undefined : topLeftContent}
      right={rightIsHidden ? undefined : topRightContent}
      middle={showTopCenter ? topCenterContent : undefined}
    />
  )

  // const showNavigationTop = Boolean(showTopCenter)
  // const showNavigationBottom = Boolean(showBottomCenter)

  // useEffect(() => {
  //   navigationContext.setTopIsVisible(showNavigationTop)
  //   navigationContext.setBottomIsVisible(showNavigationBottom)
  // }, [showNavigationTop, showNavigationBottom, navigationContext])

  return (
    <>
      <div className="px-4 bg-gray-50 !dark:bg-gray-950 !z-3000 w-full dark:bg-gray-900 fixed top-0 dark:shadow-3xl-dark shadow-metal">
        {top}
      </div>
      <ViewportLayout3Section
        state={layout}
        scrollerRef={scrollerRef}
        middleClassName="bg-white dark:bg-gray-950"
        minHeightClass="min-h-screen"
        left={
          leftIsHidden ? undefined : (
            <div className="h-full w-full bg-gray-50 dark:bg-gray-900">
              {leftContent}
            </div>
          )
        }
        right={
          rightIsHidden ? undefined : (
            <div className="h-full w-full bg-gray-50 dark:bg-gray-900">
              {right}
            </div>
          )
        }
        middle={
          <main className="flex flex-col relative flex-1">
            {children}
          </main>
        }
      />
      <div className="px-4 bg-gray-50 !dark:bg-gray-950 !z-3000 w-full dark:bg-gray-900 fixed bottom-0 dark:shadow-3xl-dark shadow-metal-bottom">
        {bottom}
      </div>
    </>
  )
}
