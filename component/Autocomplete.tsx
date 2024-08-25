/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Downshift, { StateChangeOptions } from 'downshift'
import Input, { InputColor } from './Input'
import { matchSorter } from 'match-sorter'
import { IconButton } from './Button'
import CloseIcon from './icon/Close'
import { useSize } from '~/hook/useSize'
import TriangleDownIcon from './icon/TriangleDown'
import List from '@lancejpollard/react-virtualized/dist/commonjs/List'
import cx from 'classnames'

export type ItemViewInput = {
  isActive?: boolean
  isSelected?: boolean
  item: ItemInput
  list: Array<ItemInput>
  style?: CSSProperties
}

export type ItemInput = {
  height?: number
  value: string
  search: string
}

export default function Autocomplete({
  value,
  onChange,
  labelled,
  placeholder,
  items,
  itemRenderer,
  listHeight,
  overscanRowCount = 10,
  useDynamicItemHeight,
  itemHeight = 128,
  showScrollingPlaceholder,
  clearable,
  id,
  className,
  renderItemToString,
  size = 'small',
  color = 'base',
}: {
  color?: InputColor
  className?: string
  labelled?: boolean
  size?: 'small' | 'large'
  renderItemToString: (item: ItemInput | null) => string
  id?: string
  value?: string
  placeholder?: string
  onChange: (val?: string) => void
  items: Array<ItemInput>
  itemRenderer: React.ComponentType<ItemViewInput>
  listHeight?: number | string
  overscanRowCount?: number
  useDynamicItemHeight?: boolean
  itemHeight?: number
  showScrollingPlaceholder?: boolean
  clearable?: boolean
}) {
  const map = useMemo(() => {
    return items.reduce<Record<string, number>>((m, x, i) => {
      if (x.value) {
        m[x.value] = i
      }
      return m
    }, {})
  }, [items])

  const inputRef = useRef<HTMLInputElement>(null)

  const DEFAULT_OPEN = false //id === 'output-format'

  const [open, setOpen] = useState<boolean>(DEFAULT_OPEN)

  const selectedIndex = value ? map[value] : undefined
  const selectedItem =
    selectedIndex != null ? items[selectedIndex] : undefined
  const [input, setInput] = useState(
    selectedItem ? renderItemToString(selectedItem) : value,
  )

  useEffect(() => {
    setInput(selectedItem ? renderItemToString(selectedItem) : value)
  }, [value, selectedItem, renderItemToString])

  const handleStateChange = useCallback(
    (changes: StateChangeOptions<ItemInput>) => {
      // console.log('changes', changes)

      if (changes.hasOwnProperty('selectedItem')) {
        const selected = changes.selectedItem
        // console.log('selected', selected)
        if (selected) {
          onChange(selected.value ?? undefined)
        } else {
          onChange(undefined)
        }
      } else if (changes.hasOwnProperty('inputValue')) {
        setInput(changes.inputValue ?? undefined)
      } else if (
        changes.type === Downshift.stateChangeTypes.blurInput
      ) {
        setInput(
          selectedItem ? renderItemToString(selectedItem) : value,
        )
      }

      if (changes.isOpen === false) {
        setOpen(DEFAULT_OPEN)
      }
      if (changes.isOpen === true) {
        setOpen(true)
      }
    },
    [DEFAULT_OPEN, value, onChange, renderItemToString, selectedItem],
  )

  // const clearSelection = () => {
  //   if (clearable) {
  //     onChange(undefined)
  //   }
  // }

  const getItemHeight = useCallback(
    ({ index }: { index: number }) => {
      return items[index]?.height ?? itemHeight
    },
    [items, itemHeight],
  )

  const stateReducer = (state: any, actionAndChanges: any) => {
    const { type, ...changes } = actionAndChanges
    switch (type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          isOpen: false, // keep menu open after selection.
          type,
        }
      case Downshift.stateChangeTypes.blurInput:
        return {
          ...changes,
          type,
        }
      case Downshift.stateChangeTypes.clickButton:
        return {
          ...changes,
          type,
          // isOpen: false,
        }
      default:
        return { ...changes, type }
    }
  }

  return (
    <Downshift
      id={id ? `autocomplete-${id}` : undefined}
      inputValue={input ?? ''}
      stateReducer={stateReducer}
      onStateChange={handleStateChange}
      onUserAction={handleStateChange}
      itemToString={renderItemToString}
      isOpen={open}
    >
      {({
        getLabelProps,
        getInputProps,
        getToggleButtonProps,
        getMenuProps,
        getItemProps,
        getRootProps,
        isOpen,
        selectedItem,
        inputValue,
        highlightedIndex,
        clearSelection,
      }) => {
        return (
          <div className="w-full relative">
            <div className="w-full relative">
              <div className="w-full relative z-100">
                <Input
                  size={size}
                  color={color}
                  className={cx(className)}
                  labelled={labelled}
                  inputRef={inputRef}
                  bottomed={open}
                  {...getInputProps({
                    placeholder,
                    onKeyDown: e => {
                      if (
                        e.key === 'Enter' &&
                        (e.target as HTMLInputElement).value === ''
                      ) {
                        clearSelection()
                        setOpen(false)
                        setInput('')
                      }
                    },
                    // onTouchStart: () => alert('touchstart'),
                    // onFocus={() => alert('focus')}
                    // onBlur={() => alert('focus')}
                    onClick: () => {
                      // inputRef.current.focus()
                      setOpen(true)
                      setInput('')
                    },
                  })}
                />
                <div className="absolute right-8 top-0 h-full">
                  <div className="flex items-center h-full">
                    {selectedItem && clearable ? (
                      <IconButton
                        onClick={() => clearSelection()}
                        aria-label="clear selection"
                        className={
                          size === 'small' ? `w-16 h-16` : 'w-24 h-24'
                        }
                      >
                        <CloseIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        className={
                          size === 'small' ? `w-16 h-16` : 'w-24 h-24'
                        }
                        {...getToggleButtonProps()}
                      >
                        <TriangleDownIcon />
                      </IconButton>
                    )}
                  </div>
                </div>
              </div>
              {open && (
                // <Portal>
                <Menu
                  id={id}
                  itemRenderer={itemRenderer}
                  overscanRowCount={overscanRowCount}
                  listHeight={listHeight}
                  getMenuProps={getMenuProps}
                  items={items}
                  inputValue={inputValue ?? undefined}
                  value={value}
                  highlightedIndex={highlightedIndex ?? undefined}
                  useDynamicItemHeight={useDynamicItemHeight}
                  getItemHeight={getItemHeight}
                  itemHeight={itemHeight}
                  showScrollingPlaceholder={showScrollingPlaceholder}
                  getItemProps={getItemProps}
                />
                // </Portal>
              )}
            </div>
          </div>
        )
      }}
    </Downshift>
  )
}

function Menu({
  getMenuProps,
  listHeight,
  overscanRowCount,
  items,
  inputValue,
  value,
  highlightedIndex,
  useDynamicItemHeight,
  getItemHeight,
  itemHeight,
  showScrollingPlaceholder,
  itemRenderer,
  getItemProps,
  id,
}: {
  id?: string
  items: Array<ItemInput>
  listHeight?: number | string
  value?: string
  overscanRowCount: number
  highlightedIndex?: number
  useDynamicItemHeight?: boolean
  itemHeight: number
  getItemHeight: ({ index }: { index: number }) => number
  inputValue?: string
  getMenuProps: () => Record<string, any>
  getItemProps: (opts: any) => Record<string, any>
  showScrollingPlaceholder?: boolean
  itemRenderer: React.ComponentType<ItemViewInput>
}) {
  const listRef = useRef(null)
  const filteredItems = useMemo(() => {
    if (!inputValue) {
      return items
    }
    return matchSorter(items, inputValue, { keys: ['search'] })
  }, [items, inputValue])
  const filteredMap = useMemo(() => {
    return filteredItems.reduce<Record<string, number>>((m, x, i) => {
      if (x.value) {
        m[x.value] = i
      }
      return m
    }, {})
  }, [filteredItems])

  const rowCount = filteredItems.length
  const selectedIndex = value ? filteredMap[value] : undefined

  const Item = itemRenderer
  // const selectedItem =
  //   selectedIndex != null ? filteredItems[selectedIndex] : undefined

  const rowRenderer = ({
    index,
    isScrolling,
    key,
    style,
    getItemProps,
    highlightedIndex,
  }: any & {
    getItemProps: (opts: any) => Record<string, any>
    highlightedIndex?: number
  }) => {
    if (showScrollingPlaceholder && isScrolling) {
      return (
        <div
          // className={cx(styles.row, styles.isScrollingPlaceholder)}
          key={key}
          style={style}
        >
          Scrolling...
        </div>
      )
    }

    const item = filteredItems[index]

    if (useDynamicItemHeight) {
      // switch (item.size) {
      //   case 75:
      //     additionalContent = <div>It is medium-sized.</div>
      //     break
      //   case 100:
      //     additionalContent = (
      //       <div>
      //         It is large-sized.
      //         <br />
      //         It has a 3rd row.
      //       </div>
      //     )
      //     break
      // }
    }

    return (
      <Item
        key={item.value}
        item={item}
        list={filteredItems}
        style={style}
        {...getItemProps({
          item,
          index,
          isActive: highlightedIndex === index,
          isSelected: selectedIndex === index,
        })}
      />
    )
  }

  const ref = useRef(null)
  const size = useSize(ref)
  const totalRowHeight = useDynamicItemHeight
    ? undefined
    : rowCount * itemHeight
  const measuredHeight = window.innerHeight / 2 //size?.height ?? 0
  const actualListHeight =
    totalRowHeight && totalRowHeight > measuredHeight
      ? measuredHeight
      : totalRowHeight
        ? totalRowHeight
        : rowCount
          ? measuredHeight
          : 0

  return (
    <div
      className="w-full absolute bg-gray-50 z-200 shadow-medium rounded-b-sm"
      ref={ref}
    >
      <List
        id={id ? `autocomplete-list-${id}` : undefined}
        className="w-full"
        ref={listRef}
        height={actualListHeight}
        // style={{ height: actualListHeight }}
        overscanRowCount={overscanRowCount}
        // noRowsRenderer={this._noRowsRenderer}
        rowCount={rowCount}
        rowHeight={useDynamicItemHeight ? getItemHeight : itemHeight}
        scrollerProps={actualListHeight ? getMenuProps() : {}}
        rowRenderer={(props: any) => {
          return rowRenderer({
            ...props,
            getItemProps,
            highlightedIndex: highlightedIndex ?? undefined,
          })
        }}
        // scrollToIndex={scrollToIndex}
        width={size?.width ?? 128}
      />
      {/* // </AutoSizer> */}
    </div>
  )
}
