var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { useCallback, useEffect, useMemo, useRef, useState, } from 'react';
import Downshift from 'downshift';
import Input from './Input';
import { matchSorter } from 'match-sorter';
import { IconButton } from './Button';
import CloseIcon from './icon/Close';
import { useSize } from '../hook/useSize';
import TriangleDownIcon from './icon/TriangleDown';
import List from '@lancejpollard/react-virtualized/dist/commonjs/List';
import cx from 'classnames';
export default function Autocomplete({ value, onChange, labelled, placeholder, items, itemRenderer, listHeight, overscanRowCount = 10, useDynamicItemHeight, itemHeight = 128, showScrollingPlaceholder, clearable, id, className, renderItemToString, size = 'small', color = 'base', }) {
    const map = useMemo(() => {
        return items.reduce((m, x, i) => {
            if (x.value) {
                m[x.value] = i;
            }
            return m;
        }, {});
    }, [items]);
    const inputRef = useRef(null);
    const DEFAULT_OPEN = false; //id === 'output-format'
    const [open, setOpen] = useState(DEFAULT_OPEN);
    const selectedIndex = value ? map[value] : undefined;
    const selectedItem = selectedIndex != null ? items[selectedIndex] : undefined;
    const [input, setInput] = useState(selectedItem ? renderItemToString(selectedItem) : value);
    useEffect(() => {
        setInput(selectedItem ? renderItemToString(selectedItem) : value);
    }, [value, selectedItem, renderItemToString]);
    const handleStateChange = useCallback((changes) => {
        // console.log('changes', changes)
        var _a, _b;
        if (changes.hasOwnProperty('selectedItem')) {
            const selected = changes.selectedItem;
            // console.log('selected', selected)
            if (selected) {
                onChange((_a = selected.value) !== null && _a !== void 0 ? _a : undefined);
            }
            else {
                onChange(undefined);
            }
        }
        else if (changes.hasOwnProperty('inputValue')) {
            setInput((_b = changes.inputValue) !== null && _b !== void 0 ? _b : undefined);
        }
        else if (changes.type === Downshift.stateChangeTypes.blurInput) {
            setInput(selectedItem ? renderItemToString(selectedItem) : value);
        }
        if (changes.isOpen === false) {
            setOpen(DEFAULT_OPEN);
        }
        if (changes.isOpen === true) {
            setOpen(true);
        }
    }, [DEFAULT_OPEN, value, onChange, renderItemToString, selectedItem]);
    // const clearSelection = () => {
    //   if (clearable) {
    //     onChange(undefined)
    //   }
    // }
    const getItemHeight = useCallback(({ index }) => {
        var _a, _b;
        return (_b = (_a = items[index]) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : itemHeight;
    }, [items, itemHeight]);
    const stateReducer = (state, actionAndChanges) => {
        const { type } = actionAndChanges, changes = __rest(actionAndChanges, ["type"]);
        switch (type) {
            case Downshift.stateChangeTypes.keyDownEnter:
            case Downshift.stateChangeTypes.clickItem:
                return Object.assign(Object.assign({}, changes), { isOpen: false, // keep menu open after selection.
                    type });
            case Downshift.stateChangeTypes.blurInput:
                return Object.assign(Object.assign({}, changes), { type });
            case Downshift.stateChangeTypes.clickButton:
                return Object.assign(Object.assign({}, changes), { type });
            default:
                return Object.assign(Object.assign({}, changes), { type });
        }
    };
    return (<Downshift id={id ? `autocomplete-${id}` : undefined} inputValue={input !== null && input !== void 0 ? input : ''} stateReducer={stateReducer} onStateChange={handleStateChange} onUserAction={handleStateChange} itemToString={renderItemToString} isOpen={open}>
      {({ getLabelProps, getInputProps, getToggleButtonProps, getMenuProps, getItemProps, getRootProps, isOpen, selectedItem, inputValue, highlightedIndex, clearSelection, }) => {
            return (<div className="w-full relative">
            <div className="w-full relative">
              <div className="w-full relative z-100">
                <Input size={size} color={color} className={cx(className)} labelled={labelled} inputRef={inputRef} bottomed={open} {...getInputProps({
                placeholder,
                onKeyDown: e => {
                    if (e.key === 'Enter' &&
                        e.target.value === '') {
                        clearSelection();
                        setOpen(false);
                        setInput('');
                    }
                },
                // onTouchStart: () => alert('touchstart'),
                // onFocus={() => alert('focus')}
                // onBlur={() => alert('focus')}
                onClick: () => {
                    // inputRef.current.focus()
                    setOpen(true);
                    setInput('');
                },
            })}/>
                <div className="absolute right-8 top-0 h-full">
                  <div className="flex items-center h-full">
                    {selectedItem && clearable ? (<IconButton onClick={() => clearSelection()} aria-label="clear selection" className={size === 'small' ? `w-16 h-16` : 'w-24 h-24'}>
                        <CloseIcon />
                      </IconButton>) : (<IconButton className={size === 'small' ? `w-16 h-16` : 'w-24 h-24'} {...getToggleButtonProps()}>
                        <TriangleDownIcon />
                      </IconButton>)}
                  </div>
                </div>
              </div>
              {open && (
                // <Portal>
                <Menu id={id} itemRenderer={itemRenderer} overscanRowCount={overscanRowCount} listHeight={listHeight} getMenuProps={getMenuProps} items={items} inputValue={inputValue !== null && inputValue !== void 0 ? inputValue : undefined} value={value} highlightedIndex={highlightedIndex !== null && highlightedIndex !== void 0 ? highlightedIndex : undefined} useDynamicItemHeight={useDynamicItemHeight} getItemHeight={getItemHeight} itemHeight={itemHeight} showScrollingPlaceholder={showScrollingPlaceholder} getItemProps={getItemProps}/>
                // </Portal>
                )}
            </div>
          </div>);
        }}
    </Downshift>);
}
function Menu({ getMenuProps, listHeight, overscanRowCount, items, inputValue, value, highlightedIndex, useDynamicItemHeight, getItemHeight, itemHeight, showScrollingPlaceholder, itemRenderer, getItemProps, id, }) {
    var _a;
    const listRef = useRef(null);
    const filteredItems = useMemo(() => {
        if (!inputValue) {
            return items;
        }
        return matchSorter(items, inputValue, { keys: ['search'] });
    }, [items, inputValue]);
    const filteredMap = useMemo(() => {
        return filteredItems.reduce((m, x, i) => {
            if (x.value) {
                m[x.value] = i;
            }
            return m;
        }, {});
    }, [filteredItems]);
    const rowCount = filteredItems.length;
    const selectedIndex = value ? filteredMap[value] : undefined;
    const Item = itemRenderer;
    // const selectedItem =
    //   selectedIndex != null ? filteredItems[selectedIndex] : undefined
    const rowRenderer = ({ index, isScrolling, key, style, getItemProps, highlightedIndex, }) => {
        if (showScrollingPlaceholder && isScrolling) {
            return (<div 
            // className={cx(styles.row, styles.isScrollingPlaceholder)}
            key={key} style={style}>
          Scrolling...
        </div>);
        }
        const item = filteredItems[index];
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
        return (<Item key={item.value} item={item} list={filteredItems} style={style} {...getItemProps({
            item,
            index,
            isActive: highlightedIndex === index,
            isSelected: selectedIndex === index,
        })}/>);
    };
    const ref = useRef(null);
    const size = useSize(ref);
    const totalRowHeight = useDynamicItemHeight
        ? undefined
        : rowCount * itemHeight;
    const measuredHeight = window.innerHeight / 2; //size?.height ?? 0
    const actualListHeight = totalRowHeight && totalRowHeight > measuredHeight
        ? measuredHeight
        : totalRowHeight
            ? totalRowHeight
            : rowCount
                ? measuredHeight
                : 0;
    return (<div className="w-full absolute bg-gray-50 z-200 shadow-medium rounded-b-sm" ref={ref}>
      <List id={id ? `autocomplete-list-${id}` : undefined} className="w-full" ref={listRef} height={actualListHeight} 
    // style={{ height: actualListHeight }}
    overscanRowCount={overscanRowCount} 
    // noRowsRenderer={this._noRowsRenderer}
    rowCount={rowCount} rowHeight={useDynamicItemHeight ? getItemHeight : itemHeight} scrollerProps={actualListHeight ? getMenuProps() : {}} rowRenderer={(props) => {
            return rowRenderer(Object.assign(Object.assign({}, props), { getItemProps, highlightedIndex: highlightedIndex !== null && highlightedIndex !== void 0 ? highlightedIndex : undefined }));
        }} 
    // scrollToIndex={scrollToIndex}
    width={(_a = size === null || size === void 0 ? void 0 : size.width) !== null && _a !== void 0 ? _a : 128}/>
      {/* // </AutoSizer> */}
    </div>);
}
//# sourceMappingURL=Autocomplete.jsx.map