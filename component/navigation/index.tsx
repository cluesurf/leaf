import React, {
  createContext,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useState,
} from 'react'

export type NavigationBindingInput = {
  form?: 'action' | 'panel'
  trigger: React.ReactNode
  element?: () => React.ReactNode
}

export type NavigationInput = {
  backgroundClassName?: string
  forceShadow?: boolean
  a?: NavigationBindingInput
  b?: NavigationBindingInput
  c?: NavigationBindingInput
  d?: NavigationBindingInput
  e?: NavigationBindingInput
}

export function checkScrollDirectionIsUp(event: WheelEvent) {
  return event.deltaY < 0
}

export type NavigationContextValues = {
  topIsVisible: boolean
  setTopIsVisible: Dispatch<SetStateAction<boolean>>
  bottomIsVisible: boolean
  setBottomIsVisible: Dispatch<SetStateAction<boolean>>
}

export const NavigationContext = createContext<NavigationContextValues>(
  {
    topIsVisible: true,
    setTopIsVisible: (val: boolean | SetStateAction<boolean>) => {},
    bottomIsVisible: false,
    setBottomIsVisible: (val: boolean | SetStateAction<boolean>) => {},
  },
)

export default function Navigation({
  children,
}: {
  children: React.ReactNode
}) {
  const [topIsVisible, setTopIsVisible] = useState(true)
  const [bottomIsVisible, setBottomIsVisible] = useState(false)

  return (
    <NavigationContext.Provider
      value={{
        topIsVisible,
        setTopIsVisible,
        bottomIsVisible,
        setBottomIsVisible,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function bindTrigger(
  form: string,
  trigger: React.ReactNode,
  showPanel: (el: React.ReactNode) => void,
  element?: () => React.ReactNode,
) {
  if (form === 'action') {
    return trigger
  }

  if (!element) {
    return trigger
  }

  const handle = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    showPanel(element())
  }

  return (
    <button
      onClick={handle}
      className="w-fit cursor-pointer inline-block"
    >
      {trigger}
    </button>
  )
}
