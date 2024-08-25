'use client'

import React, {
  RefObject,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import Layout, { LayoutInput } from '~/component/Layout'
import { useNavigation } from '~/hook/useNavigation'
import { NavigationOverlay } from '~/component/navigation'
import useAppFonts from '~/hook/useAppFont'

export type AppLayoutInput = LayoutInput & {
  logo?: React.ReactNode
  up?: string
  top?: React.ReactNode
  bottom?: React.ReactNode
  showBottom?: boolean
  state: { width: number }
  scrollerRef?: RefObject<HTMLDivElement>
  menuContent?: React.ReactNode
  contactLink?: string
  onOpenSettings?: () => void
  bottomNavigationClassName?: string
}

export const NavigationContext = createContext({
  topIsVisible: false,
  setTopIsVisible: (val: boolean) => {},
  bottomIsVisible: false,
  setBottomIsVisible: (val: boolean) => {},
})

export function NavigationProvider({
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

export default function AppLayout({
  children,
  bottom,
  showBottom = false,
  state,
  top,
  onOpenSettings,
  up,
  scrollerRef,
  menuContent,
  contactLink,
  logo,
  bottomNavigationClassName,
  ...meta
}: AppLayoutInput) {
  const isFontLoaded = useAppFonts()

  const [menu, setMenu] = useState<React.ReactNode>()
  const navigationContext = useContext(NavigationContext)

  const handleMenuOpen = () => {
    setMenu(
      <div className="p-16 bg-white dark:bg-gray-950 h-full w-full">
        {menuContent}
      </div>,
    )
  }

  const navigation = useNavigation({
    bottom,
    up,
    top: state.width === 0 ? undefined : top,
    logo,
    onMenuOpen: handleMenuOpen,
    bottomNavigationClassName,
  })

  const showNavigationTop = Boolean(navigation?.top)
  const showNavigationBottom = Boolean(onOpenSettings && showBottom)

  useEffect(() => {
    navigationContext.setTopIsVisible(showNavigationTop)
    navigationContext.setBottomIsVisible(showNavigationBottom)
  }, [showNavigationTop, showNavigationBottom])

  return (
    <>
      {navigation?.top}
      <Layout {...meta}>{children}</Layout>
      {showBottom && navigation?.bottom}
      {menu && (
        <NavigationOverlay
          onClose={() => setMenu(undefined)}
          triggerPosition="top"
        >
          {menu}
        </NavigationOverlay>
      )}
    </>
  )
}
