import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import {
  NavigationInput,
  bindTrigger,
  checkScrollDirectionIsUp,
} from '.'
import NavigationOverlay from './Overlay'
import { ViewportLayoutFill } from '~/component/ViewportGrid'
import { useViewportLayoutFill } from '~/hook/useViewportLayout'

type NavInput = {
  children: React.ReactNode
}

function Nav({ children }: NavInput) {
  return (
    <div className="items-center justify-between w-full h-full z-1000 flex">
      {children}
    </div>
  )
}

type ContainerInput = {
  children: React.ReactNode
  drop?: boolean
  backgroundClassName?: string
  forceShadow?: boolean
}

function Container({
  backgroundClassName = `bg-white dark:bg-gray-900`,
  forceShadow,
  children,
  drop,
}: ContainerInput) {
  const layout = useViewportLayoutFill()
  return (
    <ViewportLayoutFill
      className={`h-48 appearance-none flex justify-between items-center w-full`}
      state={layout}
      backgroundClassName={clsx(
        backgroundClassName,
        `fixed top-0 z-1000 w-full ${
          !drop || forceShadow
            ? `dark:shadow-3xl-dark shadow-metal`
            : ''
        }`,
      )}
    >
      {children}
    </ViewportLayoutFill>
  )
}

export default function NavigationTop(props: NavigationInput) {
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

  return (
    <Container
      backgroundClassName={props.backgroundClassName}
      forceShadow={props.forceShadow}
      drop={dropMenu}
    >
      <Nav>
        {trigger.a ?? <div />}
        {trigger.b ?? <div />}
        {trigger.c ?? <div />}
        {trigger.d ?? <div />}
        {trigger.e ?? <div />}
      </Nav>
      {panel && (
        <NavigationOverlay
          onClose={() => setPanel(undefined)}
          triggerPosition="top"
        >
          {panel}
        </NavigationOverlay>
      )}
    </Container>
  )
}
