import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import {
  NavigationBindingInput,
  NavigationInput,
  bindTrigger,
  checkScrollDirectionIsUp,
} from '~/component/navigation'
import NavigationOverlay from './Overlay'
import { ViewportLayoutFill } from '~/component/ViewportGrid'
import { useViewportLayoutFill } from '~/hook/useViewportLayout'

type NavInput = {
  children: React.ReactNode
}

function Nav({ children }: NavInput) {
  return (
    <div className="items-center justify-between w-full z-1000 flex h-full">
      {children}
    </div>
  )
}

type ContainerInput = {
  backgroundClassName?: string
  children: React.ReactNode
  drop?: boolean
  forceShadow?: boolean
}

function Container({
  backgroundClassName,
  children,
  forceShadow,
  drop,
}: ContainerInput) {
  const layout = useViewportLayoutFill()
  return (
    <ViewportLayoutFill
      className={`appearance-none w-full`}
      state={layout}
      backgroundClassName={clsx(
        backgroundClassName,
        `bg-gray-50 w-full dark:bg-gray-900 fixed bottom-0 z-1000 ${
          !drop || forceShadow
            ? `dark:shadow-3xl-dark shadow-metal-bottom`
            : ''
        }`,
      )}
    >
      {children}
    </ViewportLayoutFill>
  )
}

export default function NavigationBottom(
  props: NavigationInput & {
    x?: NavigationBindingInput
  },
) {
  const [showMenu, setShowMenu] = useState(false)
  const [fadeMenu, setFadeMenu] = useState(false)
  const [dropMenu, setDropMenu] = useState(true)
  const [panel, setPanel] = useState<React.ReactNode>()

  useEffect(() => {
    const handleScroll = (event: Event) => {
      if (window.scrollY === 0) {
        setDropMenu(true)
        setFadeMenu(false)
      } else if (dropMenu) {
        setDropMenu(false)
      }

      if (checkScrollDirectionIsUp(event as WheelEvent)) {
        setFadeMenu(false)
      } else {
        setFadeMenu(true)
      }
    }

    window.addEventListener('wheel', handleScroll)

    return () => {
      window.removeEventListener('wheel', handleScroll)
    }
  }, [dropMenu, setDropMenu, setFadeMenu])

  useEffect(() => {
    if (showMenu) {
      document.body.classList.add('stop-scrolling')
    } else {
      document.body.classList.remove('stop-scrolling')
    }

    return () => {
      document.body.classList.remove('stop-scrolling')
    }
  }, [showMenu])

  const trigger: Record<string, React.ReactNode> = {}

  if (props.x) {
    trigger.x = bindTrigger(
      props.x.form ?? 'panel',
      props.x.trigger,
      setPanel,
      props.x.element,
    )
  } else {
    if (props.a) {
      trigger.a = bindTrigger(
        props.a.form ?? 'panel',
        props.a.trigger,
        setPanel,
        props.a.element,
      )
    }
    if (props.b) {
      trigger.b = bindTrigger(
        props.b.form ?? 'panel',
        props.b.trigger,
        setPanel,
        props.b.element,
      )
    }
    if (props.c) {
      trigger.c = bindTrigger(
        props.c.form ?? 'panel',
        props.c.trigger,
        setPanel,
        props.c.element,
      )
    }
    if (props.d) {
      trigger.d = bindTrigger(
        props.d.form ?? 'panel',
        props.d.trigger,
        setPanel,
        props.d.element,
      )
    }
    if (props.e) {
      trigger.e = bindTrigger(
        props.e.form ?? 'panel',
        props.e.trigger,
        setPanel,
        props.e.element,
      )
    }
  }

  return (
    <Container
      backgroundClassName={props.backgroundClassName}
      forceShadow={props.forceShadow}
      drop={dropMenu}
    >
      <Nav>
        {trigger.x ? (
          trigger.x
        ) : (
          <>
            {trigger.a ?? <div />}
            {trigger.b ?? <div />}
            {trigger.c ?? <div />}
            {trigger.d ?? <div />}
            {trigger.e ?? <div />}
          </>
        )}
      </Nav>
      {panel && (
        <NavigationOverlay
          onClose={() => setPanel(undefined)}
          triggerPosition="bottom"
        >
          {panel}
        </NavigationOverlay>
      )}
    </Container>
  )
}
