import React, { MouseEvent } from 'react'
import CloseIcon from '../icon/Close'

type NavigationOverlayInput = {
  children: React.ReactNode
  triggerPosition: 'top' | 'bottom'
  onClose: () => void
}

export default function NavigationOverlay({
  triggerPosition,
  children,
  onClose,
}: NavigationOverlayInput) {
  return (
    <div
      className={`bg-gray-100 dark:bg-gray-700 overflow-auto fixed w-full z-4000 ${
        triggerPosition === 'bottom'
          ? 'top-0 bottom-0'
          : 'top-0 bottom-0'
      }`}
    >
      <div
        onClick={onClose}
        className="p-12 absolute right-0 top-0 cursor-pointer z-4200 [&_path]:hover:fill-violet-500 [&_path]:transition-all"
      >
        <span className="inline-block w-24 h-24">
          <CloseIcon />
        </span>
      </div>
      {children}
    </div>
  )
}
