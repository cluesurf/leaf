import { createContext, useContext, useEffect, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import InteractionManager from '~/manager/InteractionManager'

export const InteractionContext = createContext<InteractionManager>(
  new InteractionManager(),
)

export function useInteractionManager() {
  return useContext(InteractionContext)
}

export default function InteractionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const manager = useMemo(() => new InteractionManager(), [])

  return (
    <InteractionContext.Provider value={manager}>
      {children}
    </InteractionContext.Provider>
  )
}

export type IShortcut = () => void

export type UseInteractionManagerShortcuts = {
  onSave?: IShortcut
  onSubmit?: IShortcut
  onCopy?: IShortcut
  onPaste?: IShortcut
  onSelectAll?: IShortcut
  onFullscreen?: IShortcut
  onSettings?: IShortcut
  onEscape?: IShortcut
  onSearch?: IShortcut
}

export function useInteractionShortcuts({
  onSave,
  onSubmit,
  onCopy,
  onPaste,
  onSelectAll,
  onFullscreen,
  onSettings,
  onEscape,
  onSearch,
}: UseInteractionManagerShortcuts = {}) {
  const manager = useInteractionManager()

  useHotkeys('mod+i', () => {
    manager.setMode('input')
  })

  useHotkeys('mod+z', (e: KeyboardEvent) => {
    e.stopImmediatePropagation()
    e.preventDefault()
    manager.setMode('command')
    manager.undo()
  })

  useHotkeys('mod+s', (e: KeyboardEvent) => {
    if (!onSave) {
      return
    }

    e.stopImmediatePropagation()
    e.preventDefault()

    onSave()
  })

  useHotkeys('mod+c', (e: KeyboardEvent) => {
    if (!onCopy) {
      return
    }

    e.stopImmediatePropagation()
    e.preventDefault()

    onCopy()
  })

  useHotkeys('mod+enter', (e: KeyboardEvent) => {
    if (!onSubmit) {
      return
    }

    e.stopImmediatePropagation()
    e.preventDefault()

    onSubmit()
  })

  useHotkeys('mod+,', (e: KeyboardEvent) => {
    if (!onSettings) {
      return
    }

    e.stopImmediatePropagation()
    e.preventDefault()

    onSettings()
  })

  useHotkeys('mod+shift+f', (e: KeyboardEvent) => {
    if (!onSearch) {
      return
    }

    e.stopImmediatePropagation()
    e.preventDefault()

    onSearch()
  })

  // mod+s onSave
  // mod+enter onSubmit
  // mod+c copy
  // mod+v paste
  // mod+a selectAll
  // mod+0 fullscreen
  // mod+, settings
  // ESC defocus
  // mod+shift+f search
  useHotkeys('mod+shift+z', (e: KeyboardEvent) => {
    e.stopImmediatePropagation()
    e.preventDefault()
    manager.setMode('command')
    manager.redo()
  })
}

export function useInteractionManagerInitializer(
  isLoaded: boolean,
  load: () => Record<string, any>,
) {
  const manager = useInteractionManager()

  useEffect(() => {
    if (isLoaded) {
      manager.load(load())
    }
  }, [isLoaded])
}
