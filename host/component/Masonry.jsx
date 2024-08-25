/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSize } from '../hook/useSize';
import shuffle from 'lodash/shuffle';
export function Column({ children, gap, className }) {
    const list = ['flex', 'flex-col', 'w-full', className].filter(x => x);
    return (<div style={{ gap }} className={list.join(' ')}>
      {children}
    </div>);
}
export const MasonryGrid = React.forwardRef(MasonryGridBase);
export function MasonryGridBase({ children, gap, className }, ref) {
    const list = ['flex', 'w-full', className].filter(x => x);
    return (<div style={{ gap, padding: gap }} className={list.join(' ')} ref={ref}>
      {children}
    </div>);
}
// Sort the images by aspect ratio descending.
function aspectRatioDescending(a, b) {
    return b.h / b.w - a.h / a.w;
}
export default function Masonry({ columnBreakpoints, columnClassName, items, className, gap = 0, fixedAspectRatio = false, }) {
    const [columnCount, setColumnCount] = useState(columnBreakpoints.default);
    const grid = useRef(null);
    const size = useSize(grid);
    const [inputItems, setInputItems] = useState(items);
    useEffect(() => {
        if (!size) {
            return;
        }
        let matchedBreakpoint = Infinity;
        let newColumnCount = columnBreakpoints.default;
        for (let breakpoint in columnBreakpoints) {
            const optBreakpoint = parseInt(breakpoint);
            const isCurrentBreakpoint = optBreakpoint > 0 && size.width <= optBreakpoint;
            if (isCurrentBreakpoint && optBreakpoint < matchedBreakpoint) {
                matchedBreakpoint = optBreakpoint;
                newColumnCount = columnBreakpoints[breakpoint];
            }
        }
        newColumnCount = Math.max(1, newColumnCount !== null && newColumnCount !== void 0 ? newColumnCount : 1);
        setColumnCount(newColumnCount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnCount, size === null || size === void 0 ? void 0 : size.width, columnBreakpoints]);
    const columns = useMemo(() => {
        var _a;
        const columns = [];
        if (!size) {
            return columns;
        }
        let isSizing = false;
        for (const item of inputItems) {
            if (!item.w || !item.h) {
                isSizing = true;
                break;
            }
        }
        if (isSizing) {
            const handleSizeReady = (i) => {
                return (el) => {
                    if (el) {
                        const box = el.getBoundingClientRect();
                        const items = [...inputItems];
                        items[i].w = box.width;
                        items[i].h = box.height;
                        setInputItems(items);
                    }
                };
            };
            let i = 0;
            columns[0] = [];
            for (const item of inputItems) {
                const newEl = React.cloneElement(item.element, {
                    key: i,
                    ref: handleSizeReady(i),
                });
                columns[0].push(newEl);
                i++;
            }
            return columns;
        }
        const currentColumnCount = columnCount;
        const columnHeights = new Array(currentColumnCount).fill(0);
        const thumbnailWidth = (size.width - gap) / currentColumnCount - gap;
        inputItems.sort(aspectRatioDescending);
        // Assign each image to a column.
        for (const item of inputItems) {
            // Find the shortest column.
            let shortest = 0;
            for (let j = 1; j < currentColumnCount; ++j) {
                if (columnHeights[j] < columnHeights[shortest]) {
                    shortest = j;
                }
            }
            // Put the image there.
            columnHeights[shortest] +=
                gap +
                    (fixedAspectRatio ? thumbnailWidth * (item.h / item.w) : item.h);
            columns[shortest] = (_a = columns[shortest]) !== null && _a !== void 0 ? _a : [];
            columns[shortest].push(item.element);
        }
        columns.forEach(column => shuffle(column));
        shuffle(columns);
        return columns;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnCount, inputItems, gap, size === null || size === void 0 ? void 0 : size.width]);
    return (<MasonryGrid gap={gap} ref={grid} className={className}>
      {columns.map((elements, i) => (<Column gap={gap} key={`${columnCount}-${i}`} className={columnClassName}>
          {elements}
        </Column>))}
    </MasonryGrid>);
}
//# sourceMappingURL=Masonry.jsx.map