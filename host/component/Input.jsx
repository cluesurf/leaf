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
import React, { useRef, } from 'react';
import cx from 'classnames';
import { useText } from './Text';
import composeRefs from '@seznam/compose-react-refs';
export const INPUT_COLOR = {
    purple: 'bg-violet-100 text-violet-700 [&>input]:placeholder:text-violet-400 dark:bg-violet-950 dark:text-violet-300',
    blue: 'bg-blue-100 text-blue-700 [&>input]:placeholder:text-blue-300 dark:bg-blue-950 dark:text-blue-300',
    base: 'bg-gray-100 text-gray-950 [&>input]:placeholder:text-gray-400 dark:bg-gray-900 dark:text-gray-300',
    base2: 'bg-white dark:bg-gray-800 dark:text-gray-300',
    green: 'bg-emerald-100 text-emerald-700 [&>input]:placeholder:text-emerald-400 dark:bg-emerald-950 dark:text-emerald-300',
    red: 'bg-rose-100 text-rose-700 [&>input]:placeholder:text-rose-300 dark:bg-rose-950 dark:text-rose-300',
};
export const INPUT_WAITING = {
    purple: 'font-loading-base-input',
    blue: 'font-loading-base-input',
    base: 'font-loading-base-input',
    base2: 'font-loading-base-input',
    green: 'font-loading-base-input',
    red: 'font-loading-base-input',
};
function Input(_a, passedRef) {
    var { className, labelled, bottomed, inputRef, autoComplete = 'off', spellCheck = false, before, after, color = 'base', size = 'small', font = 'Noto Sans Mono' } = _a, props = __rest(_a, ["className", "labelled", "bottomed", "inputRef", "autoComplete", "spellCheck", "before", "after", "color", "size", "font"]);
    const { value, onChange } = props, rest = __rest(props, ["value", "onChange"]);
    const ref = useRef(null);
    const [isStarting, isFontReady, hasFontWaited, fontClassName] = useText(font);
    const handleChange = (e) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(e);
    };
    const rounded = getRoundedClass(labelled, bottomed);
    const colorClass = color && INPUT_COLOR[color];
    const waitingColorClass = color && INPUT_WAITING[color];
    let backgroundColorClass;
    let textColorClass;
    if (isStarting || (isFontReady && hasFontWaited)) {
        backgroundColorClass = colorClass;
        textColorClass = `${fontClassName} placeholder:italic`;
    }
    else if (hasFontWaited) {
        backgroundColorClass = waitingColorClass;
        textColorClass = `text-transparent placeholder:text-transparent`;
    }
    else {
        textColorClass = `text-transparent placeholder:text-transparent`;
    }
    return (<div className={cx(className, size === 'small' ? 'px-16 h-32' : 'px-16 h-48', 'relative w-full items-center justify-center flex', size === 'small' ? 'text-sm' : undefined, rounded, backgroundColorClass)}>
      {before}
      <input ref={composeRefs(ref, inputRef, passedRef)} value={value == null ? '' : value} onChange={handleChange} autoComplete={autoComplete} spellCheck={spellCheck} className={cx(textColorClass, size === 'small' ? 'text-sm' : undefined, size === 'small' ? 'h-32' : 'h-48', 'bg-transparent block w-full py-8')} {...rest}/>
      {after}
    </div>);
}
export default React.forwardRef(Input);
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
//# sourceMappingURL=Input.jsx.map