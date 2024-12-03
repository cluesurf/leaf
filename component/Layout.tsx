'use client'

import React, { RefObject, useEffect, useLayoutEffect } from 'react'
import { useViewportLayout3Section } from '~/hook/useViewportLayout'
import { ViewportLayout3Section } from '~/component/ViewportGrid'

export type LayoutSideState = {
  left?: 'missing' | 'present'
  right?: 'missing' | 'present'
}

export type LayoutState = 'right' | 'left' | 'center'

export type LayoutInput = {
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
  onShift?: (state: LayoutState) => void
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
  onShift,
}: LayoutInput) {
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

  useLayoutEffect(() => {
    if (leftIsHidden) {
      onShift?.('center')
    } else if (rightIsHidden) {
      onShift?.('left')
    } else {
      onShift?.('right')
    }
  }, [leftIsHidden, rightIsHidden])

  return (
    <>
      <div className="px-4 bg-zinc-50 dark:bg-zinc-950 !z-3000 w-full fixed top-0 dark:shadow-3xl-dark shadow-metal dark:shadow-metal-dark">
        {top}
      </div>
      <ViewportLayout3Section
        state={layout}
        scrollerRef={scrollerRef}
        middleClassName="bg-white dark:bg-black"
        minHeightClass="min-h-screen"
        left={
          leftIsHidden ? undefined : (
            <div className="h-full w-full bg-zinc-100 dark:bg-zinc-900">
              {leftContent}
            </div>
          )
        }
        right={
          rightIsHidden ? undefined : (
            <div className="h-full w-full bg-zinc-100 dark:bg-zinc-900">
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
      <div className="px-4 bg-zinc-50 dark:bg-zinc-950 !z-3000 w-full fixed bottom-0 dark:shadow-3xl-dark shadow-metal-bottom dark:shadow-metal-bottom-dark">
        {bottom}
      </div>
    </>
  )
}
