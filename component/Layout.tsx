import React, {
  RefObject,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useNavigation } from '~/hook/useNavigation'
import { NavigationContext } from '~/component/navigation'
import cx from 'classnames'
import GearIcon from '~/component/icon/Gear'
import { useViewportLayout3Section } from '~/hook/useViewportLayout'
import { ViewportLayout3Section } from '~/component/ViewportGrid'
import MessageIcon from '~/component/icon/Message'
import Loading from '~/component/Loading'
import NavigationOverlay from './navigation/Overlay'
import useFonts from '~/hook/useFonts'
import { FontName } from '~/constant/font'
import HomeIcon from './icon/Home'

export type LayoutInput = {
  fonts?: Array<FontName>
  children: React.ReactNode
  logo?: React.ReactNode
  up?: string
  top?: React.ReactNode
  right?: React.ReactNode
  left?: React.ReactNode
  menu?: React.ReactNode
  configuration?: React.ReactNode
  scrollerRef?: RefObject<HTMLDivElement>
}

export default function Layout({
  children,
  scrollerRef,
  up,
  top: topContent,
  left: leftContent,
  right: rightContent,
  menu: menuContent,
  configuration: configurationContent,
  logo = <HomeIcon />,
  fonts = ['Noto Sans Mono'],
}: LayoutInput) {
  const isFontLoaded = useFonts(fonts)
  const [menu, setMenu] = useState<React.ReactNode>()
  const [configuration, setConfiguration] = useState<React.ReactNode>()
  const navigationContext = useContext(NavigationContext)
  const layout = useViewportLayout3Section()
  const [middleOverlay, setMiddleOverlay] = useState<React.ReactNode>()

  const right = rightContent ?? (
    <div className="h-full w-full overflow-y-auto pb-64">
      {rightContent}
    </div>
  )

  const onOpenConfiguration = () => {
    // setConfiguration(configurationContent)
    setMiddleOverlay(configurationContent)
  }

  const leftIsHidden = layout.width < 804
  const rightIsHidden = layout.width < 1056

  const bottomNavigationClassName = rightIsHidden
    ? configurationContent
      ? layout.width === 0
        ? `hidden`
        : `!z-3000 bg-white !dark:bg-gray-950 h-48`
      : `!z-3000 !bg-transparent !shadow-none`
    : `!z-3000 !bg-transparent !shadow-none`

  // const messageButtonContainerClassName = rightIsHidden
  //   ? configurationContent
  //     ? undefined
  //     : `p-12 [&>a]:shadow-xl [&>a]:hover:shadow-medium`
  //   : `p-12 [&>a]:shadow-xl [&>a]:hover:shadow-medium`

  // TODO: intercom
  // const messageButton = contactLink && (
  //   <span
  //     className={cx(
  //       'block pointer-events-auto',
  //       messageButtonContainerClassName,
  //     )}
  //   >
  //     <a
  //       className={cx(
  //         '[&_svg]:hover:fill-violet-500 cursor-pointer block p-12 w-48 h-48 transition-all bg-white dark:bg-gray-600 rounded-large-circle',
  //       )}
  //       target="_blank"
  //       rel="nofollow"
  //       href={contactLink}
  //     >
  //       <span className="inline-block w-24 h-24">
  //         <MessageIcon />
  //       </span>
  //     </a>
  //   </span>
  // )

  // const handleOpenMessage = () => {

  // }

  const bottom = (
    <ViewportLayout3Section
      state={layout}
      left={
        leftIsHidden ? undefined : <div className="h-full w-full" />
      }
      right={
        rightIsHidden ? undefined : (
          <div className="relative h-full w-full flex items-center justify-end">
            {/* {messageButton} */}
          </div>
        )
      }
      middle={
        !middleOverlay && (
          <div
            className={cx(
              'relative flex w-full justify-between items-center',
            )}
          >
            <div className="w-48 h-48" />
            {rightIsHidden && configurationContent ? (
              <span
                className="block p-12 [&_path]:hover:fill-violet-500 [&_path]:transition-all cursor-pointer w-48 h-48 transition-all pointer-events-auto"
                onClick={onOpenConfiguration}
              >
                <span className="inline-block w-24 h-24">
                  <GearIcon />
                </span>
              </span>
            ) : (
              <div />
            )}
            {/* {rightIsHidden ? messageButton : <div />} */}
          </div>
        )
      }
    />
  )

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
    top: topContent,
    logo,
    onMenuOpen: handleMenuOpen,
    bottomNavigationClassName,
  })

  const showNavigationTop = Boolean(navigation?.top)
  const showNavigationBottom = Boolean(configuration && rightIsHidden)

  useEffect(() => {
    navigationContext.setTopIsVisible(showNavigationTop)
    navigationContext.setBottomIsVisible(showNavigationBottom)
  }, [showNavigationTop, showNavigationBottom, navigationContext])

  return (
    <>
      {navigation?.top}
      <div className="bg-gray-100 dark:text-gray-200 dark:bg-gray-900 w-full h-full min-w-screen min-h-screen">
        <ViewportLayout3Section
          className="!top-48"
          state={layout}
          scrollerRef={scrollerRef}
          middleClassName="bg-white dark:bg-gray-950"
          left={
            leftIsHidden || !isFontLoaded ? undefined : (
              <div className="h-full w-full bg-gray-50 dark:bg-gray-900">
                {leftContent}
              </div>
            )
          }
          right={
            rightIsHidden || !isFontLoaded ? undefined : (
              <div className="h-full w-full bg-gray-50 dark:bg-gray-900">
                {right}
              </div>
            )
          }
          middle={
            isFontLoaded ? (
              <div className="relative pt-32 min-h-screen-minus-nav flex flex-col justify-between">
                <main className="relative flex-1">{children}</main>
                {/* {!hideFooter && <Footer />} */}
              </div>
            ) : (
              <Loading />
            )
          }
          middleOverlay={middleOverlay}
        />
      </div>
      {navigation?.bottom}
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
