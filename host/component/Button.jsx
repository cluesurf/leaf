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
import Link from 'next/link';
import React from 'react';
import cx from 'classnames';
import { useDarkMode } from '../hook/useDarkMode';
import T from './Text';
export const COLOR = {
    purple: 'bg-violet-500 text-gray-100 dark:bg-violet-900 dark:text-violet-200 hover:opacity-70',
    green: 'bg-emerald-500 text-gray-100 dark:bg-emerald-900 dark:text-emerald-200 hover:opacity-70',
    red: 'bg-rose-500 text-gray-100 dark:bg-rose-900 dark:text-rose-200 hover:opacity-70',
    blue: 'bg-blue-500 dark:bg-blue-900 dark:text-blue-200 hover:opacity-70',
    black: 'bg-gray-800 text-gray-100 dark:bg-gray-200 bg-gray-700 hover:opacity-70 hover:dark:bg-gray-300',
    black2: 'bg-gray-800 text-gray-100 dark:bg-gray-200 bg-gray-700 hover:opacity-70 hover:dark:bg-gray-300',
    white: 'bg-gray-100 dark:bg-gray-800 dark:text-gray-200 hover:opacity-70 hover:dark:bg-gray-700',
    white2: 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:opacity-70 hover:dark:bg-gray-600',
};
export const TEXT_COLOR = {
    purple: 'text-gray-100',
    green: 'text-gray-800',
    red: 'text-gray-100',
    blue: 'text-gray-100',
    black: 'text-gray-100',
    white: 'text-gray-800',
};
export const GHOST_COLOR = {
    purple: 'border-4 border-solid dark:border-violet-900 border-violet-400 dark:border-violet-900 text-violet-400 hover:opacity-70',
    green: 'border-4 border-solid dark:border-emerald-900 border-emerald-400 dark:border-emerald-900 text-emerald-400 hover:opacity-70',
    blue: 'border-4 border-solid dark:border-blue-900 border-blue-400 dark:border-blue-900 text-blue-400 hover:opacity-70',
    red: 'border-4 border-solid border-rose-700 text-rose-700 hover:opacity-70',
    black: 'border-4 border-solid border-gray-800 text-gray-800 hover:opacity-70',
    white: 'border-4 border-solid border-gray-400 text-gray-400 hover:opacity-70',
};
function getColorClassName(color, isDark, ghost, variant) {
    const name = color === 'contrast'
        ? isDark
            ? `white${variant === 1 ? '' : variant}`
            : `black${variant === 1 ? '' : variant}`
        : color;
    const colorClassName = COLOR[name];
    const textColorClassName = TEXT_COLOR[name];
    const className = ghost
        ? GHOST_COLOR[name]
        : `${colorClassName} ${textColorClassName}`;
    return className;
}
function getSizeClassNames(size, ghost) {
    switch (size) {
        case 'small':
            return [
                'text-xs h-24',
                ghost ? 'py-4' : 'py-2',
                ghost ? 'px-4' : 'px-8',
            ].join(' ');
        case 'medium':
            return ['text-sm h-32 py-4', ghost ? 'px-8' : 'px-12'].join(' ');
        case 'large':
            return [
                'font-bold text-base h-48',
                ghost ? 'px-16' : 'px-24',
            ].join(' ');
    }
}
export function Button(_a) {
    var { children, size = 'medium', touching = false, fill, className, align, color = 'contrast', ghost, font, bold, variant = 1 } = _a, props = __rest(_a, ["children", "size", "touching", "fill", "className", "align", "color", "ghost", "font", "bold", "variant"]);
    const isDark = useDarkMode() === 'dark';
    const colorClassName = getColorClassName(color, isDark, ghost, variant);
    const sizeClassName = getSizeClassNames(size, ghost);
    return (<T className={cx(className, sizeClassName, colorClassName, 'flex', bold ? 'font-bold' : undefined, 'items-center', 'gap-8', touching ? undefined : 'rounded-sm', 'leading-content', 'text-center', fill ? 'w-full' : 'w-fit', 'transition-color', 'cursor-pointer', 'duration-200', align === 'right' ? 'justify-end' : undefined)} {...props} tag="button" font={font}>
      {children}
    </T>);
}
export default Button;
export function IconButton(_a) {
    var { children, className, font, size } = _a, props = __rest(_a, ["children", "className", "font", "size"]);
    return (<button className={cx(className, 'flex', 'items-center', 'text-center', 'w-fit', 'cursor-pointer', 
        // fill ? C.flexAll : undefined,
        'transition-colors transition-color', 'duration-200')} {...props}>
      {children}
    </button>);
}
export function LabelButton(_a) {
    var { children, size = 'medium', touching, className, fill, align, color = 'contrast', ghost, font } = _a, props = __rest(_a, ["children", "size", "touching", "className", "fill", "align", "color", "ghost", "font"]);
    const sizeClassName = getSizeClassNames(size, ghost);
    const isDark = useDarkMode() === 'dark';
    const colorClassName = getColorClassName(color, isDark, ghost);
    return (<T tag="label" className={cx(className, colorClassName, sizeClassName, 'flex', 'items-center', 'gap-8', touching ? undefined : 'rounded-sm', 'leading-content', 'text-center', fill ? 'w-full' : 'w-fit', 'transition-colors transition-color', 'duration-200', align === 'right' ? 'justify-end' : undefined)} {...props} font={font}>
      {children}
    </T>);
}
export function LinkButton(_a) {
    var { children, variant = 1, size = 'medium', touching, fill, title, shadow, align = 'left', className, color = 'contrast', ghost, target, font } = _a, props = __rest(_a, ["children", "variant", "size", "touching", "fill", "title", "shadow", "align", "className", "color", "ghost", "target", "font"]);
    const sizeClassName = getSizeClassNames(size, ghost);
    const isDark = useDarkMode() === 'dark';
    const colorClassName = getColorClassName(color, isDark, ghost, variant);
    return (<Link {...props} title={title} scroll={false} target={target} className={cx(colorClassName, className, sizeClassName, 'flex', 'items-center', 'gap-8', touching ? undefined : 'rounded-sm', 'leading-content', 'text-center', fill ? 'w-full' : 'w-fit', 
        // fill ? C.flexAll : undefined,
        'transition-colors transition-color', 'duration-200', align === 'right' ? 'justify-end' : undefined)}>
      <T className="-top-1" font={font}>
        {children}
      </T>
    </Link>);
}
//# sourceMappingURL=Button.jsx.map