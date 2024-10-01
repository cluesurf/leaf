import * as RadixToast from '@radix-ui/react-toast'
import clsx from 'clsx'
import { createContext, useCallback, useContext, useState } from 'react'
import { NavigationContext } from './navigation'

export type ToastContext = {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  color: string
  setColor: (val: string) => void
  content: React.ReactNode
  setContent: (val: string) => void
  duration: number
  setDuration: (val: number) => void
  open: (input: ToastOpen) => void
}

export const ToastContext = createContext<ToastContext>({
  isOpen: false,
  setIsOpen: (val: boolean) => {},
  color: 'base',
  setColor: (val: string) => {},
  content: null,
  setContent: (val: string) => {},
  duration: 2000,
  setDuration: (val: number) => {},
  open: (input: ToastOpen) => {},
})

export type ToastOpen = {
  color?: string
  duration?: number
  content: React.ReactNode
}

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [color, setColor] = useState('base')
  const [duration, setDuration] = useState(2000)
  const [content, setContent] = useState<React.ReactNode>()

  const open = useCallback(
    ({ color = 'base', duration = 2000, content }: ToastOpen) => {
      if (color) {
        setColor(color)
      }

      if (duration) {
        setDuration(duration)
      }

      setContent(content)

      setIsOpen(true)
    },
    [],
  )

  return (
    <ToastContext.Provider
      value={{
        isOpen,
        setIsOpen,
        color,
        setColor,
        content,
        setContent,
        duration,
        setDuration,
        open,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

const COLOR: Record<string, string> = {
  green: 'bg-emerald-500 text-slate-50',
  red: 'bg-rose-400 text-slate-50',
  base: 'bg-gray-600 text-slate-50',
  blue: 'bg-blue-400 text-slate-50',
}

export function useToast() {
  return useContext(ToastContext)
}

export default function Toast() {
  const { isOpen, setIsOpen, color, content, duration } = useToast()
  const navigationContext = useContext(NavigationContext)

  return (
    <RadixToast.Provider swipeDirection="right">
      <RadixToast.Root
        duration={duration}
        className={clsx(
          COLOR[color],
          'transform shadow-3xl rounded-sm z-10000',
          `p-16`,
          'radix-state-open:animate-fade-in',
          'radix-state-closed:animate-toast-hide',
          'radix-swipe-direction-right:radix-swipe-end:animate-toast-swipe-out-x',
          'radix-swipe-direction-right:translate-x-radix-toast-swipe-move-x',
          'radix-swipe-direction-down:radix-swipe-end:animate-toast-swipe-out-y',
          'radix-swipe-direction-down:translate-y-radix-toast-swipe-move-y',
          'radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]',
        )}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <RadixToast.Description>{content}</RadixToast.Description>
      </RadixToast.Root>
      <RadixToast.Viewport
        className={clsx(
          'fixed right-0 bottom-0',
          `p-16`,
          navigationContext.bottomIsVisible && `pb-64`,
        )}
      />
    </RadixToast.Provider>
  )
}
