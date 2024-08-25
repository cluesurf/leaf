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
import React from 'react';
import cx from 'classnames';
export const INPUT_COLOR = {
    purple: 'bg-violet-50',
    blue: 'bg-blue-50',
    base: 'bg-gray-50',
};
export default function Value(_a) {
    var { className, labelled, bottomed, color } = _a, props = __rest(_a, ["className", "labelled", "bottomed", "color"]);
    const { value, children } = props, rest = __rest(props, ["value", "children"]);
    const rounded = getRoundedClass(labelled, bottomed);
    const colorClass = color && INPUT_COLOR[color];
    return (<div className={cx(className, 'relative w-full px-16', rounded, colorClass)} {...rest}>
      {value !== null && value !== void 0 ? value : children}
    </div>);
}
export function getRoundedClass(labelled, bottomed) {
    if (labelled && bottomed) {
        return;
    }
    else if (labelled && !bottomed) {
        return `rounded-b-sm`;
    }
    else if (bottomed && !labelled) {
        return `rounded-t-sm`;
    }
    else {
        return `rounded-sm`;
    }
}
//# sourceMappingURL=Value.jsx.map