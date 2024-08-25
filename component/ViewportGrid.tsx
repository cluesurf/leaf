import React, { RefObject } from 'react'
import {
  ViewportLayout3SectionStateInput,
  ViewportLayoutFillStateInput,
  ViewportLayoutSplitStateInput,
} from '~/hook/useViewportLayout'
import cx from 'classnames'

export type ViewportLayout3SectionInput = {
  className?: string
  scrollerRef?: RefObject<HTMLDivElement>
  middleClassName?: string
  left: React.ReactNode
  leftClassName?: string
  middle: React.ReactNode
  right: React.ReactNode
  rightClassName?: string
  state: ViewportLayout3SectionStateInput
  middleOverlay?: React.ReactNode
}

export function ViewportLayout3Section({
  className,
  left,
  leftClassName,
  middle,
  middleClassName,
  right,
  rightClassName,
  state,
  middleOverlay,
  scrollerRef,
}: ViewportLayout3SectionInput) {
  return (
    <div
      className={cx(
        `absolute top-0 left-0 right-0 bottom-0`,
        className,
      )}
      style={{ ...state.container }}
    >
      <div
        className="overflow-hidden"
        style={{ ...state.grid }}
      >
        <div
          className={leftClassName}
          style={{
            height: '100%',
            ...state.left,
          }}
        >
          {left}
        </div>
        <div
          className={['z-2000 relative h-full flex flex-1'].join(' ')}
        >
          <div
            ref={scrollerRef}
            className={cx(
              'max-w-888',
              middleOverlay ? 'overflow-y-hidden' : 'overflow-y-auto',
              middleClassName,
            )}
            style={{
              ...state.middle,
            }}
          >
            {middle}
          </div>
          {middleOverlay && (
            <div
              className={cx(
                'max-w-888',
                'absolute left-0 z-1000 right-0 top-0 bottom-0',
              )}
              style={{
                ...state.middle,
              }}
            >
              {middleOverlay}
            </div>
          )}
        </div>
        <div
          className={rightClassName}
          style={{
            height: '100%',
            ...state.right,
          }}
        >
          {right}
        </div>
      </div>
    </div>
  )
}

export function ViewportLayoutSplit({
  className,
  left,
  right,
  state,
  leftBackgroundClassName,
  rightBackgroundClassName,
}: {
  className?: string
  leftBackgroundClassName?: string
  rightBackgroundClassName?: string
  left: React.ReactNode
  right: React.ReactNode
  state: ViewportLayoutSplitStateInput
}) {
  return (
    <div className="flex justify-center">
      <div
        style={{ ...state.container }}
        className={['w-full', className].filter(x => x).join(' ')}
      >
        <div
          className={[
            'flex',
            state.container.flexDirection === 'column'
              ? 'w-full'
              : 'w-2/4',
            'justify-center',
            'items-center',
            leftBackgroundClassName,
          ].join(' ')}
        >
          <div
            className={['w-full'].join(' ')}
            style={{
              minHeight: 'calc(100vh - 64px)',
              ...state.left,
            }}
          >
            {left}
          </div>
        </div>
        <div
          className={[
            'flex',
            state.container.flexDirection === 'column'
              ? 'w-full'
              : 'w-2/4',
            'justify-center',
            'items-center',
            rightBackgroundClassName,
          ].join(' ')}
        >
          <div
            className={['w-full'].join(' ')}
            style={{
              minHeight: 'calc(100vh - 64px)',
              ...state.right,
            }}
          >
            {right}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ViewportLayoutBase({
  children,
  className,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={['flex justify-center'].join(' ')}>
      <div
        className={[className, 'max-w-888', 'w-full', 'p-16'].join(' ')}
      >
        {children}
      </div>
    </div>
  )
}

export function ViewportLayoutFill({
  children,
  className,
  backgroundClassName,
  state,
}: {
  children: React.ReactNode
  className?: string
  backgroundClassName?: string
  state: ViewportLayoutFillStateInput
}) {
  return (
    <div
      className={[backgroundClassName].join(' ')}
      style={state.container}
    >
      <div
        className={[className].join(' ')}
        style={state.grid}
      >
        {children}
      </div>
    </div>
  )
}
