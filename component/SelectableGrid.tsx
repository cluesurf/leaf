import {
  RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useOnClickOutside } from 'usehooks-ts'

export const SelectableGridContext = createContext<
  SelectableGridManager | undefined
>(undefined)

export function SelectableGrid({
  children,
  onSelect,
  onSubmit,
  closeRef,
  multiple = false,
  listenOnWindow = false,
}: {
  onSelect?: (data: any) => void
  onSubmit?: (data: any) => void
  multiple?: boolean
  listenOnWindow?: boolean
  closeRef?: RefObject<any>
  children: ({
    onKeyDown,
    gridRef,
  }: {
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void
    gridRef: RefObject<any>
  }) => React.ReactNode
}) {
  const grid = useMemo(
    () =>
      new SelectableGridManager({
        multiple,
        onSelect,
        onSubmit,
      }),
    [multiple, onSelect, onSubmit],
  )
  const gridRef = useRef<any>(null)

  useEffect(() => {
    if (!closeRef) {
      return
    }

    const handleClickClose = () => {
      grid.blur()
    }

    const el = closeRef.current

    el.addEventListener('click', handleClickClose)

    return () => {
      el.removeEventListener('click', handleClickClose)
    }
  }, [closeRef, grid])

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      switch (event.key) {
        case 'Enter':
          event.preventDefault()
          event.stopPropagation()
          grid.submit()
          break
        case 'Tab':
          event.preventDefault()
          event.stopPropagation()
          grid.navigateRight()
          break
        case 'Escape':
          event.preventDefault()
          event.stopPropagation()
          // stop editing
          grid.blur()
          break
        case 'ArrowLeft':
          event.preventDefault()
          event.stopPropagation()
          grid.navigateLeft()
          break
        case 'ArrowRight':
          event.preventDefault()
          event.stopPropagation()
          grid.navigateRight()
          break
        case 'ArrowUp':
          event.preventDefault()
          event.stopPropagation()
          grid.navigateUp()
          break
        case 'ArrowDown':
          event.preventDefault()
          event.stopPropagation()
          grid.navigateDown()
          break
        default:
          break
      }
    },
    [grid],
  )

  useEffect(() => {
    if (!listenOnWindow) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          event.preventDefault()
          event.stopPropagation()
          grid.submit()
          break
        case 'Tab':
          event.preventDefault()
          event.stopPropagation()
          grid.navigateRight()
          break
        case 'Escape':
          event.preventDefault()
          event.stopPropagation()
          // stop editing
          grid.blur()
          break
        case 'ArrowLeft':
          event.preventDefault()
          event.stopPropagation()
          grid.navigateLeft()
          break
        case 'ArrowRight':
          event.preventDefault()
          event.stopPropagation()
          grid.navigateRight()
          break
        case 'ArrowUp':
          event.preventDefault()
          event.stopPropagation()
          grid.navigateUp()
          break
        case 'ArrowDown':
          event.preventDefault()
          event.stopPropagation()
          grid.navigateDown()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [listenOnWindow, onKeyDown])

  return (
    <SelectableGridContext.Provider value={grid}>
      {children({ onKeyDown, gridRef })}
    </SelectableGridContext.Provider>
  )
}

export function useSelectableGrid() {
  return useContext(SelectableGridContext)
}

export class SelectableGridManager {
  bindings: Record<
    string,
    { data: any; hook: (data: Record<string, any>) => void }
  >

  isFocused: boolean

  focused?: { r: number; c: number }

  selected: Record<string, boolean>

  layout: Array<Array<{ r: number; c: number } | undefined> | undefined>

  multiple: boolean

  onSelect?: (data: any) => void

  onSubmit?: (data: any) => void

  constructor({
    multiple = false,
    onSelect,
    onSubmit,
  }: {
    onSelect?: (data: any) => void
    onSubmit?: (data: any) => void
    multiple?: boolean
  }) {
    this.onSelect = onSelect
    this.onSubmit = onSubmit
    this.multiple = multiple
    this.bindings = {}
    this.isFocused = false
    this.focused = undefined
    this.selected = {}
    this.layout = []
  }

  focus(r: number, c: number) {
    this.isFocused = true
    this.focused = { r, c }
  }

  blur() {
    this.isFocused = true
    for (const key in this.selected) {
      const [r, c] = key.split(':').map(x => parseInt(x, 10))
      this.deselect(r, c)
    }

    if (this.focused) {
      const binding =
        this.bindings[`${this.focused.r}:${this.focused.c}`]
      binding.hook({
        focused: false,
      })
      this.focused = undefined
      this.onSelect?.(undefined)
    }
  }

  navigateLeft() {
    if (!this.focused) {
      return
    }

    const oldFocus = this.focused
    const newFocus = {
      r: oldFocus.r,
      c: oldFocus.c - 1,
    }

    if (newFocus.c === -1) {
      if (newFocus.r > 0) {
        newFocus.r--
        const row = this.layout[newFocus.r]
        const col = (row?.length ?? 0) - 1
        newFocus.c = col
      }
    }

    this.select(newFocus.r, newFocus.c)
  }

  navigateRight() {
    if (!this.focused) {
      return
    }

    const oldFocus = this.focused
    const maxCol = (this.layout[oldFocus.r]?.length ?? 0) - 1
    const newFocus = {
      r: oldFocus.r,
      c: oldFocus.c + 1,
    }

    if (newFocus.c === maxCol + 1) {
      if (newFocus.r < this.layout.length - 1) {
        newFocus.r++
        const col = 0
        newFocus.c = col
      }
    }

    this.select(newFocus.r, newFocus.c)
  }

  navigateUp() {
    if (!this.focused) {
      return
    }

    const oldFocus = this.focused
    const newFocus = {
      r: oldFocus.r - 1,
      c: oldFocus.c,
    }

    if (newFocus.r === -1) {
      return
    }

    this.select(newFocus.r, newFocus.c)
  }

  navigateDown() {
    if (!this.focused) {
      return
    }

    const oldFocus = this.focused
    const newFocus = {
      r: oldFocus.r + 1,
      c: oldFocus.c,
    }

    if (newFocus.r === this.layout.length) {
      return
    }

    this.select(newFocus.r, newFocus.c)
  }

  submit() {
    if (this.focused) {
      const binding =
        this.bindings[`${this.focused.r}:${this.focused.c}`]
      this.onSubmit?.(binding.data)
    }
  }

  select(r: number, c: number) {
    if (r >= this.layout.length || r < 0) {
      return
    }

    const row = this.layout[r]

    if (!row?.[c]) {
      return
    }

    if (this.multiple) {
      this.selected[`${r}:${c}`] = true
      if (this.focused) {
        const binding =
          this.bindings[`${this.focused.r}:${this.focused.c}`]
        binding.hook({
          focused: false,
        })
        binding.data
      }
      const binding = this.bindings[`${r}:${c}`]
      binding.hook({
        focused: true,
        selected: true,
      })
      this.onSelect?.(binding.data)
      this.focus(r, c)
    } else {
      if (this.selected[`${r}:${c}`]) {
        this.deselect(r, c)
      } else {
        for (const key in this.selected) {
          const [r, c] = key.split(':').map(x => parseInt(x, 10))
          this.deselect(r, c)
        }
        this.selected = {
          [`${r}:${c}`]: true,
        }
        const binding = this.bindings[`${r}:${c}`]
        binding.hook({
          focused: true,
          selected: true,
        })
        this.onSelect?.(binding.data)

        this.focus(r, c)
      }
    }
  }

  deselect(r: number, c: number) {
    const binding = this.bindings[`${r}:${c}`]
    delete this.selected[`${r}:${c}`]
    binding.hook({
      selected: false,
      focused: false,
    })
    this.onSelect?.(undefined)
  }

  attach(
    r: number,
    c: number,
    data: any,
    hook: (data: Record<string, any>) => void,
  ) {
    const row = (this.layout[r] ??= [])
    row[c] = { r, c }
    this.bindings[`${r}:${c}`] = { data, hook }
  }

  detach(r: number, c: number) {
    const row = (this.layout[r] ??= [])
    row[c] = undefined
    if (!row.filter(x => x).length) {
      this.layout[r] = undefined
    }
    delete this.bindings[`${r}:${c}`]
  }
}
