import React, { MouseEvent, useState } from 'react'
import cx from 'classnames'
import { IconButton } from './Button'
import CopyIcon from './icon/Copy'
import CheckIcon from './icon/Check'
import copyToClipboard from 'copy-to-clipboard'

Copy.Area = function Area({
  text,
  children,
}: {
  children: React.ReactNode
  text?: string
}) {
  const [showCopy, setShowCopy] = useState(true)
  const [animationState, setAnimationState] = useState('none')

  const checkAnimation =
    animationState === 'transition-check'
      ? 'animate-fade-in-out'
      : undefined

  const copyAnimation =
    animationState === 'transition-in-copy'
      ? 'animate-fade-in-medium'
      : animationState === 'transition-out-copy'
        ? 'animate-fade-out-fast'
        : 'animate-fade-in-medium'

  const isAnimating = animationState !== 'none'

  const handleClick = (e: MouseEvent) => {
    if (isAnimating) {
      return
    }

    e.preventDefault()
    e.stopPropagation()

    setAnimationState('transition-out-copy')

    if (text) {
      copyToClipboard(text, { format: 'text/plain' })
    }
  }

  const handleAnimationEnd = () => {
    if (animationState === 'transition-out-copy') {
      setShowCopy(false)
      setAnimationState('transition-check')
    } else if (animationState === 'transition-in-copy') {
      setAnimationState('none')
    } else if (animationState === 'transition-check') {
      setShowCopy(true)
      setAnimationState('transition-in-copy')
    }
  }

  return (
    <div
      className="flex gap-8"
      onClick={handleClick}
    >
      {children}
      <div>
        <span
          className={`${showCopy ? copyAnimation : checkAnimation}`}
          onAnimationEnd={handleAnimationEnd}
          title="Copy"
        >
          {!showCopy ? (
            <IconButton disabled={isAnimating}>
              <span
                className={cx(
                  'inline-block',
                  'w-24',
                  'h-24',
                  'opacity-50',
                )}
              >
                <CheckIcon />
              </span>
            </IconButton>
          ) : (
            <IconButton disabled={isAnimating}>
              <span
                className={cx(
                  'inline-block',
                  'w-24',
                  'h-24',
                  'opacity-50',
                )}
              >
                <CopyIcon />
              </span>
            </IconButton>
          )}
        </span>
      </div>
    </div>
  )
}

export default function Copy({ text }: { text?: any }) {
  const [showCopy, setShowCopy] = useState(true)
  const [animationState, setAnimationState] = useState('none')
  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setAnimationState('transition-out-copy')

    if (text) {
      copyToClipboard(text, { format: 'text/plain' })
    }
  }

  const handleAnimationEnd = () => {
    if (animationState === 'transition-out-copy') {
      setShowCopy(false)
      setAnimationState('transition-check')
    } else if (animationState === 'transition-in-copy') {
      setAnimationState('none')
    } else if (animationState === 'transition-check') {
      setShowCopy(true)
      setAnimationState('transition-in-copy')
    }
  }

  const checkAnimation =
    animationState === 'transition-check'
      ? 'animate-fade-in-out'
      : undefined

  const copyAnimation =
    animationState === 'transition-in-copy'
      ? 'animate-fade-in-medium'
      : animationState === 'transition-out-copy'
        ? 'animate-fade-out-fast'
        : 'animate-fade-in-medium'

  const isAnimating = animationState !== 'none'

  return (
    <span
      className={showCopy ? copyAnimation : checkAnimation}
      onAnimationEnd={handleAnimationEnd}
      title="Copy"
    >
      {!showCopy ? (
        <IconButton disabled={isAnimating}>
          <span
            className={cx('inline-block', 'w-24', 'h-24', 'opacity-50')}
          >
            <CheckIcon />
          </span>
        </IconButton>
      ) : (
        <IconButton
          onClick={handleClick}
          disabled={isAnimating}
        >
          <span
            className={cx('inline-block', 'w-24', 'h-24', 'opacity-50')}
          >
            <CopyIcon />
          </span>
        </IconButton>
      )}
    </span>
  )
}
