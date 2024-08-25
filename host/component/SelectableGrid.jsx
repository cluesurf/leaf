import { createContext, useCallback, useContext, useEffect, useMemo, useRef, } from 'react';
export const SelectableGridContext = createContext(undefined);
export function SelectableGrid({ children, onSelect, onSubmit, closeRef, multiple = false, listenOnWindow = false, }) {
    const grid = useMemo(() => new SelectableGridManager({
        multiple,
        onSelect,
        onSubmit,
    }), [multiple, onSelect, onSubmit]);
    const gridRef = useRef(null);
    useEffect(() => {
        if (!closeRef) {
            return;
        }
        const handleClickClose = () => {
            grid.blur();
        };
        const el = closeRef.current;
        el.addEventListener('click', handleClickClose);
        return () => {
            el.removeEventListener('click', handleClickClose);
        };
    }, [closeRef, grid]);
    const onKeyDown = useCallback((event) => {
        console.log(event);
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                event.stopPropagation();
                grid.submit();
                break;
            case 'Tab':
                event.preventDefault();
                event.stopPropagation();
                grid.navigateRight();
                break;
            case 'Escape':
                event.preventDefault();
                event.stopPropagation();
                // stop editing
                grid.blur();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                event.stopPropagation();
                grid.navigateLeft();
                break;
            case 'ArrowRight':
                event.preventDefault();
                event.stopPropagation();
                grid.navigateRight();
                break;
            case 'ArrowUp':
                event.preventDefault();
                event.stopPropagation();
                grid.navigateUp();
                break;
            case 'ArrowDown':
                event.preventDefault();
                event.stopPropagation();
                grid.navigateDown();
                break;
            default:
                break;
        }
    }, [grid]);
    useEffect(() => {
        if (!listenOnWindow) {
            return;
        }
        const onKeyDown = (event) => {
            switch (event.key) {
                case 'Enter':
                    event.preventDefault();
                    event.stopPropagation();
                    grid.submit();
                    break;
                case 'Tab':
                    event.preventDefault();
                    event.stopPropagation();
                    grid.navigateRight();
                    break;
                case 'Escape':
                    event.preventDefault();
                    event.stopPropagation();
                    // stop editing
                    grid.blur();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    event.stopPropagation();
                    grid.navigateLeft();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    event.stopPropagation();
                    grid.navigateRight();
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    event.stopPropagation();
                    grid.navigateUp();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    event.stopPropagation();
                    grid.navigateDown();
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [listenOnWindow, onKeyDown]);
    return (<SelectableGridContext.Provider value={grid}>
      {children({ onKeyDown, gridRef })}
    </SelectableGridContext.Provider>);
}
export function useSelectableGrid() {
    return useContext(SelectableGridContext);
}
export class SelectableGridManager {
    constructor({ multiple = false, onSelect, onSubmit, }) {
        this.onSelect = onSelect;
        this.onSubmit = onSubmit;
        this.multiple = multiple;
        this.bindings = {};
        this.isFocused = false;
        this.focused = undefined;
        this.selected = {};
        this.layout = [];
    }
    focus(r, c) {
        this.isFocused = true;
        this.focused = { r, c };
    }
    blur() {
        var _a;
        this.isFocused = true;
        for (const key in this.selected) {
            const [r, c] = key.split(':').map(x => parseInt(x, 10));
            this.deselect(r, c);
        }
        if (this.focused) {
            const binding = this.bindings[`${this.focused.r}:${this.focused.c}`];
            binding.hook({
                focused: false,
            });
            this.focused = undefined;
            (_a = this.onSelect) === null || _a === void 0 ? void 0 : _a.call(this, undefined);
        }
    }
    navigateLeft() {
        var _a;
        if (!this.focused) {
            return;
        }
        const oldFocus = this.focused;
        const newFocus = {
            r: oldFocus.r,
            c: oldFocus.c - 1,
        };
        if (newFocus.c === -1) {
            if (newFocus.r > 0) {
                newFocus.r--;
                const row = this.layout[newFocus.r];
                const col = ((_a = row === null || row === void 0 ? void 0 : row.length) !== null && _a !== void 0 ? _a : 0) - 1;
                newFocus.c = col;
            }
        }
        this.select(newFocus.r, newFocus.c);
    }
    navigateRight() {
        var _a, _b;
        if (!this.focused) {
            return;
        }
        const oldFocus = this.focused;
        const maxCol = ((_b = (_a = this.layout[oldFocus.r]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) - 1;
        const newFocus = {
            r: oldFocus.r,
            c: oldFocus.c + 1,
        };
        if (newFocus.c === maxCol + 1) {
            if (newFocus.r < this.layout.length - 1) {
                newFocus.r++;
                const col = 0;
                newFocus.c = col;
            }
        }
        this.select(newFocus.r, newFocus.c);
    }
    navigateUp() {
        if (!this.focused) {
            return;
        }
        const oldFocus = this.focused;
        const newFocus = {
            r: oldFocus.r - 1,
            c: oldFocus.c,
        };
        if (newFocus.r === -1) {
            return;
        }
        this.select(newFocus.r, newFocus.c);
    }
    navigateDown() {
        if (!this.focused) {
            return;
        }
        const oldFocus = this.focused;
        const newFocus = {
            r: oldFocus.r + 1,
            c: oldFocus.c,
        };
        if (newFocus.r === this.layout.length) {
            return;
        }
        this.select(newFocus.r, newFocus.c);
    }
    submit() {
        var _a;
        if (this.focused) {
            const binding = this.bindings[`${this.focused.r}:${this.focused.c}`];
            (_a = this.onSubmit) === null || _a === void 0 ? void 0 : _a.call(this, binding.data);
        }
    }
    select(r, c) {
        var _a, _b;
        if (r >= this.layout.length || r < 0) {
            return;
        }
        const row = this.layout[r];
        if (!(row === null || row === void 0 ? void 0 : row[c])) {
            return;
        }
        console.log(this.multiple, this.selected, r, c);
        if (this.multiple) {
            this.selected[`${r}:${c}`] = true;
            if (this.focused) {
                const binding = this.bindings[`${this.focused.r}:${this.focused.c}`];
                binding.hook({
                    focused: false,
                });
                binding.data;
            }
            const binding = this.bindings[`${r}:${c}`];
            binding.hook({
                focused: true,
                selected: true,
            });
            (_a = this.onSelect) === null || _a === void 0 ? void 0 : _a.call(this, binding.data);
            this.focus(r, c);
        }
        else {
            if (this.selected[`${r}:${c}`]) {
                this.deselect(r, c);
            }
            else {
                for (const key in this.selected) {
                    const [r, c] = key.split(':').map(x => parseInt(x, 10));
                    this.deselect(r, c);
                }
                this.selected = {
                    [`${r}:${c}`]: true,
                };
                const binding = this.bindings[`${r}:${c}`];
                binding.hook({
                    focused: true,
                    selected: true,
                });
                (_b = this.onSelect) === null || _b === void 0 ? void 0 : _b.call(this, binding.data);
                this.focus(r, c);
            }
        }
    }
    deselect(r, c) {
        var _a;
        const binding = this.bindings[`${r}:${c}`];
        delete this.selected[`${r}:${c}`];
        binding.hook({
            selected: false,
            focused: false,
        });
        (_a = this.onSelect) === null || _a === void 0 ? void 0 : _a.call(this, undefined);
    }
    attach(r, c, data, hook) {
        var _a;
        var _b;
        const row = ((_a = (_b = this.layout)[r]) !== null && _a !== void 0 ? _a : (_b[r] = []));
        row[c] = { r, c };
        this.bindings[`${r}:${c}`] = { data, hook };
    }
    detach(r, c) {
        var _a;
        var _b;
        const row = ((_a = (_b = this.layout)[r]) !== null && _a !== void 0 ? _a : (_b[r] = []));
        row[c] = undefined;
        if (!row.filter(x => x).length) {
            this.layout[r] = undefined;
        }
        delete this.bindings[`${r}:${c}`];
    }
}
//# sourceMappingURL=SelectableGrid.jsx.map