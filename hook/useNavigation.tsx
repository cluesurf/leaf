import React from 'react'
import Link from 'next/link'
import MenuIcon from '~/component/icon/Menu'
import TriangleUpIcon from '~/component/icon/TriangleUp'
import NavigationTop from '~/component/navigation/Top'
import NavigationBottom from '~/component/navigation/Bottom'

export function useNavigation({
  onMenuOpen,
  bottom,
  top,
  up,
  logo,
  bottomNavigationClassName,
}: {
  bottom?: React.ReactNode
  onMenuOpen?: () => void
  top?: React.ReactNode
  up?: string
  logo?: React.ReactNode
  bottomNavigationClassName?: string
} = {}) {
  const navigation: Record<string, any> = {
    top: {
      forceShadow: true,
      a: {
        form: 'action' as const,
        trigger: (
          <Link
            href="/"
            className="p-12 block w-48 h-48 transition-all [&_path]:hover:fill-violet-500 [&_path]:transition-all"
          >
            <span className="block w-24 h-24">{logo}</span>
          </Link>
        ),
      },
      e: {
        form: 'action',
        trigger: (
          <div
            className="flex [&_path]:stroke-gray-500 items-center cursor-pointer justify-center p-12 w-48 h-48 [&_path]:hover:stroke-violet-500 [&_path]:transition-all transition-all"
            onClick={onMenuOpen}
          >
            <span className="inline-block w-24 h-24">
              <MenuIcon />
            </span>
          </div>
        ),
        // element,
      },
    },
  }

  if (up) {
    navigation.top.c = {
      form: 'action' as const,
      trigger: (
        <Link
          href={up}
          className="p-12 block w-48 h-48 transition-all [&_path]:hover:fill-violet-500 [&_path]:transition-all"
        >
          <span className="block w-24 h-24">
            <TriangleUpIcon />
          </span>
        </Link>
      ),
    }
  } else if (top) {
    navigation.top.c = {
      form: 'action' as const,
      trigger: top,
    }
  }

  if (bottom) {
    navigation.bottom = {
      forceShadow: true,
      x: {
        form: 'action' as const,
        trigger: bottom,
      },
    }
  }

  return {
    top: (
      <NavigationTop
        backgroundClassName="px-4 bg-white dark:bg-gray-950 !z-3000"
        {...navigation.top}
      />
    ),
    bottom: (
      <NavigationBottom
        {...navigation.bottom}
        backgroundClassName={`${bottomNavigationClassName} px-4 bg-gray-500 !dark:bg-gray-950 pointer-events-none`}
      />
    ),
  }
}
