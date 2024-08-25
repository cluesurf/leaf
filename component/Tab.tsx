import React, { useEffect, useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import cx from 'classnames'

export function TabsRoot({
  className,
  defaultValue,
  values,
  cycle,
  ...props
}: Tabs.TabsProps & { cycle?: boolean; values: Array<string> }) {
  const [newValue, setNewValue] = useState(defaultValue)
  const [newCycle, setNewCycle] = useState(cycle)
  const [timer, setTimer] = useState<NodeJS.Timeout>()

  useEffect(() => {
    if (!newCycle) {
      return
    }
    if (timer) {
      return
    }

    const t = setTimeout(() => {
      setTimer(undefined)
      const i = values.indexOf(newValue as string)

      if (i === values.length - 1) {
        const next = values[0]
        setNewValue(next)
        setNewCycle(false)
      } else {
        const next = values[i + 1]
        setNewValue(next)
      }
    }, 5000)

    setTimer(t)
  }, [newCycle, timer, newValue, values])

  const handleChange = (val: string) => {
    clearTimeout(timer)
    setTimer(undefined)
    setNewCycle(false)
    setNewValue(val)
  }

  return (
    <Tabs.Root
      onValueChange={handleChange}
      {...props}
      value={newValue}
      className={cx(className)}
    />
  )
}

export function TabsList({ className, ...props }: Tabs.TabsListProps) {
  return (
    <Tabs.List
      {...props}
      className={cx(
        className,
        'p-12',
        'bg-gray-100',
        'dark:bg-gray-700',
        'inline-block',
        'rounded-sm',
      )}
    />
  )
}

export function TabsTrigger({
  className,
  ...props
}: Tabs.TabsTriggerProps) {
  return (
    <Tabs.Trigger
      {...props}
      className={[
        'p-16',
        'py-12',
        'radix-state-active:bg-violet-400',
        'radix-state-active:text-white',
        'radix-state-active:font-bold',
        'rounded-sm',
      ].join(' ')}
    />
  )
}

export function TabsContent({
  className,
  ...props
}: Tabs.TabsContentProps) {
  return (
    <Tabs.Content
      {...props}
      className={cx(className)}
    />
  )
}
