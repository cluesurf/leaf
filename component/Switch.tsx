import React from 'react'
import * as RadixSwitch from '@radix-ui/react-switch'
import clsx from 'clsx'

export type SwitchInput = {
  id?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  size?: 'large' | 'small'
}

export default function Switch({
  id,
  checked,
  onChange,
  size = 'small',
}: SwitchInput) {
  return (
    <div
      className={clsx(
        size === 'small' ? 'px-12 h-32' : 'px-12 h-48',
        'flex items-center w-full',
      )}
    >
      <RadixSwitch.Root
        onCheckedChange={onChange}
        checked={checked}
        id={id}
        className={clsx(
          size === 'small' ? 'w-48 h-20' : 'w-64 h-32',
          'bg-gray-200 dark:bg-gray-700 transition-all rounded-large-circle relative radix-state-checked:bg-emerald-400 dark:radix-state-checked:bg-emerald-700',
        )}
      >
        <RadixSwitch.Thumb
          className={clsx(
            size === 'small'
              ? `w-14 h-14 radix-state-checked:translate-x-30 translate-x-4`
              : `w-24 h-24 radix-state-checked:translate-x-36 translate-x-4`,
            'radix-state-checked:transform block bg-white dark:bg-gray-400 radix-state-checked:bg-white rounded-large-circle transition-all duration-100 transform will-change-transform',
          )}
        />
      </RadixSwitch.Root>
    </div>
  )
}
