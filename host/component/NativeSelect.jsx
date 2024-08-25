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
import cx from 'classnames';
import TriangleDownIcon from './icon/TriangleDown';
import React from 'react';
import { INPUT_COLOR, getRoundedClass } from './Input';
import { useText } from './Text';
function NativeSelect(_a, ref) {
    var { children, className, onChange, onChangePossiblyUndefined, topped, bottomed, color, noArrow, size = 'small', font = 'Noto Sans Mono' } = _a, props = __rest(_a, ["children", "className", "onChange", "onChangePossiblyUndefined", "topped", "bottomed", "color", "noArrow", "size", "font"]);
    const [isStarting, isFontReady, hasFontWaited, fontClassName] = useText(font);
    const handleChange = (event) => {
        const value = event.target.value;
        if (onChangePossiblyUndefined) {
            onChangePossiblyUndefined === null || onChangePossiblyUndefined === void 0 ? void 0 : onChangePossiblyUndefined(value ? value : undefined);
        }
        else if (value) {
            onChange === null || onChange === void 0 ? void 0 : onChange(value);
        }
    };
    const rounded = getRoundedClass(topped, bottomed);
    const waitingColorClass = color && INPUT_COLOR[color];
    let backgroundColorClass;
    let textColorClass;
    if (isStarting || (isFontReady && hasFontWaited)) {
        backgroundColorClass = waitingColorClass;
        textColorClass = `text-gray-950 ${fontClassName} placeholder:text-gray-500 placeholder:italic`;
    }
    else if (hasFontWaited) {
        backgroundColorClass = waitingColorClass;
        textColorClass = `text-transparent placeholder:text-transparent`;
    }
    else {
        textColorClass = `text-transparent placeholder:text-transparent`;
    }
    return (<div className={cx(className, rounded, size === 'small' ? 'h-32' : 'h-48', 'relative w-full min-w-128', backgroundColorClass, textColorClass)}>
      <div className={cx(size === 'small' ? `text-sm` : undefined, 'absolute cursor-pointer left-0 right-0 top-0 bottom-0')}>
        <select {...props} ref={ref} onChange={handleChange} className={cx(size === 'small' ? 'text-sm h-32' : 'h-48', 'appearance-none bg-transparent px-12 leading-content w-full', 'overflow-hidden whitespace-nowrap text-ellipsis', 'pr-24')}>
          {children}
        </select>
        {!noArrow && (<div className={cx(size === 'small' ? 'w-16' : 'w-24', 'absolute p-8 right-16 top-0 bottom-0 pointer-events-none')}>
            <span className={cx(size === 'small' ? 'w-16 h-16' : 'w-24 h-24', 'inline-block absolute')}>
              <TriangleDownIcon />
            </span>
          </div>)}
      </div>
    </div>);
}
export default React.forwardRef(NativeSelect);
//# sourceMappingURL=NativeSelect.jsx.map