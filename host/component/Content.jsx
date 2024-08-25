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
import React, { useEffect, useRef } from 'react';
import cx from 'classnames';
import T from './Text';
export function BlockQuote(_a) {
    var { children, className } = _a, props = __rest(_a, ["children", "className"]);
    return (<T {...props} tag="blockquote" className={cx(className, 'mt-16 mb-24 w-full p-16')}>
      {children}
    </T>);
}
export function Ul(_a) {
    var { children, className } = _a, props = __rest(_a, ["children", "className"]);
    const list = [
        "list-['*_'] list-inside relative m-0 p-0",
        'w-full ml-4',
        'mb-32 [&>li>ul]:mb-0 [&>li>ol]:mb-0',
    ];
    return (<ul {...props} className={cx(className, list.join(' '))}>
      {children}
    </ul>);
}
export function Li(_a) {
    var { children, className } = _a, props = __rest(_a, ["children", "className"]);
    return (<T tag="li" className={cx(className, 'font-medium text-base relative m-0 ml-24 p-0 list-item mb-8 [&>ul]:pl-24 [&>ol]:pl-24 [&>ul>li]:ml-0 [&>ol>li]:ml-0 text-gray-700 dark:text-gray-400 [&&>p]:inline-block [&&>p]:pointer-events-auto [&&>p]:mb-0 [&&>p]:px-0')}>
      {children}
    </T>);
}
export function Ol({ children }) {
    const list = [
        'relative list-decimal',
        'mt-4 ml-8',
        'w-full',
        'list-inside',
        'mb-32 [&>li>ul]:mb-0 [&>li>ol]:mb-0',
    ];
    return <ol className={list.join(' ')}>{children}</ol>;
}
export function Em(_a) {
    var { children, className } = _a, props = __rest(_a, ["children", "className"]);
    return (<T {...props} tag="em" className={cx(className, 'italic')}>
      {children}
    </T>);
}
export function Code(_a) {
    var { children, className } = _a, props = __rest(_a, ["children", "className"]);
    return (<T {...props} tag="code" className={cx(className, 'inline-block bg-inherit text-inherit relative px-8 py-2 font-medium text-base')}>
      <span className="bg-gray-100 rounded-sm absolute left-0 right-0 top-0 bottom-0"/>
      <T className="relative font-medium text-base text-gray-700">
        {children}
      </T>
    </T>);
}
export function Strong(_a) {
    var { children, className } = _a, props = __rest(_a, ["children", "className"]);
    return (<T {...props} tag="strong" className={cx(className, 'font-bold')}>
      {children}
    </T>);
}
export function Pre(_a) {
    var { children, className } = _a, props = __rest(_a, ["children", "className"]);
    return (<T {...props} tag="pre" className={cx(className, 'shadow-normal p-16 block [&>code]:bg-none [&>code]:p-0 bg-gray-100 whitespace-pre w-full mb-48 overflow-auto font-medium text-base')}>
      {children}
    </T>);
}
export function Sup(_a) {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (<T {...props} tag="sup" className={cx(className, 'leading-base text-sm -top-6')}>
      {children}
    </T>);
}
export function HR({ className }) {
    return (<hr className={cx(className, 'relative h-16 bg-gray-100 dark:bg-gray-900 my-16')}></hr>);
}
export function Column({ children, fixed = false, width, }) {
    const list = [];
    if (fixed) {
        list.push('fixed-column-cue');
    }
    if (width) {
        list.push('block');
    }
    return (<span style={{ width }} className={list.join(' ')}>
      {children}
    </span>);
}
export function P(_a) {
    var { children, className, align = 'left', type = 'primary' } = _a, props = __rest(_a, ["children", "className", "align", "type"]);
    return (<T {...props} tag="p" className={cx(className, 'text-base', 'leading-content', 'mb-32 px-16', 'font-medium', align === 'center'
            ? `text-center`
            : align === 'right'
                ? 'text-right'
                : undefined, type === 'secondary'
            ? 'text-gray-500 dark:text-gray-600'
            : 'text-gray-700 dark:text-gray-400')}>
      {children}
    </T>);
}
export function Content({ children }) {
    return <div className="[&>ol]:px-16 [&>ul]:px-16">{children}</div>;
}
export function TH(_a) {
    var { children, className } = _a, props = __rest(_a, ["children", "className"]);
    const list = [
        'shadow-thead bg-gray-200 dark:bg-gray-600 border-0 border-r-4 last:border-r-0 border-solid border-gray-300 dark:border-gray-600 text-gray-700 font-bold text-base h-full px-16 py-8',
    ];
    return (<th {...props} className={cx(className, list.join(' '))}>
      <T>{children}</T>
    </th>);
}
export function Table({ children }) {
    const ref = useRef(null);
    useEffect(() => {
        if (!ref.current) {
            return;
        }
        const columnList = ref.current.querySelectorAll('.fixed-column-cue');
        for (const column of columnList) {
            const th = column.closest('th');
            if (th) {
                const index = th.cellIndex;
                const tdList = ref.current.querySelectorAll(`tbody tr td:nth-child(${index + 1})`);
                const rect = th.getBoundingClientRect();
                th.style.width = `${rect.width}px`;
                th.style.height = `${rect.height}px`;
                th.classList.add('left-0', 'top-auto', 'sticky', 'z-100');
                for (const td of tdList) {
                    const rect = td.getBoundingClientRect();
                    td.style.width = `${rect.width}px`;
                    td.style.height = `${rect.height}px`;
                    td.classList.add('left-0', 'top-auto', 'sticky', 'z-100');
                }
            }
        }
    }, [ref]);
    return (<table ref={ref} className="border-collapse h-1 overflow-y-auto w-full table-fixed-header no-scrollbar">
      {children}
    </table>);
}
export function TBody(_a) {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (<tbody {...props} className={cx(className, `h-full [&>tr:nth-child(odd)]:bg-gray-50 [&>tr:nth-child(even)]:bg-gray-200 [&>tr:nth-child(odd)]:dark:bg-gray-900 [&>tr]:dark:text-gray-300 [&>tr:nth-child(even)]:dark:bg-gray-800`)}>
      {children}
    </tbody>);
}
export function THead(_a) {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (<thead {...props} className={cx(className)}>
      {children}
    </thead>);
}
export function Whole({ children }) {
    return <span className="whitespace-pre">{children}</span>;
}
export function TableScroller({ children, borderless = false, framed = false, }) {
    const list = [
        'shadow-normal mb-48 mt-16 max-h-screen w-full overflow-x-auto sticky-table-header',
    ];
    return <div className={list.join(' ')}>{children}</div>;
}
export function TR(_a) {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (<tr {...props} className={cx(className, `h-full border-r-0 last-child:border-r-0 border-0 border-solid border-gray-300 dark:border-gray-600 dark:text-gray-300`)}>
      {children}
    </tr>);
}
export function TD(_a) {
    var { wrap = false, padded = true, children, className } = _a, props = __rest(_a, ["wrap", "padded", "children", "className"]);
    const list = [
        'border-b-0 border-t-0 last:border-r-0 border-l-0 border-r-4 border-solid border-gray-300 dark:border-gray-600 h-full font-medium text-base text-gray-700 bg-inherit',
        wrap ? undefined : `whitespace-pre`,
        className,
    ];
    if (padded) {
        list.push('py-12', 'px-16');
    }
    return (<td {...props} className={list.join(' ')}>
      <T>{children}</T>
    </td>);
}
export function A(_a) {
    var { children, href, rel, target } = _a, props = __rest(_a, ["children", "href", "rel", "target"]);
    const list = [
        'cursor-pointer',
        'text-violet-400',
        'hover:opacity-70',
        'active:text-blue-500',
        'active:hover:opacity-70',
        'transition-opacity',
        'duration-200',
        // X.borderBottomDotted,
        // X.borderColorviolet,
        // X.borderWidth1,
    ];
    if (props.className) {
        list.push(...props.className.split(/\s+/));
    }
    return (<T tag="a" rel={rel} target={target} href={href} className={list.join(' ')}>
      {children}
    </T>);
}
export function H1(_a) {
    var { className, fontSizeClassName = 'text-h1', children, align = 'center' } = _a, props = __rest(_a, ["className", "fontSizeClassName", "children", "align"]);
    return (<T {...props} tag="h1" className={cx(fontSizeClassName, 'mb-32 w-full font-bold text-gray-800 dark:text-gray-400 px-16 leading-mid', className, align === 'center'
            ? `text-center`
            : align === 'right'
                ? 'text-right'
                : undefined)}>
      {children}
    </T>);
}
export function H2(_a) {
    var { children, fontSizeClassName = 'text-h2', className, align = 'left', contrast = false } = _a, props = __rest(_a, ["children", "fontSizeClassName", "className", "align", "contrast"]);
    return (<T {...props} tag="h2" className={cx(className, fontSizeClassName, 'font-bold mb-24 border-0 border-b-4 border-solid border-gray-100 pt-8 mx-16 text-gray-700 dark:text-gray-300 leading-mid', align === 'center'
            ? `text-center`
            : align === 'right'
                ? 'text-right'
                : undefined)}>
      {children}
    </T>);
}
export function H3(_a) {
    var { className, fontSizeClassName = 'text-h3', children, link, align = 'left', border = true } = _a, props = __rest(_a, ["className", "fontSizeClassName", "children", "link", "align", "border"]);
    return (<T {...props} tag="h3" id={link} className={cx(className, fontSizeClassName, align === 'center'
            ? `text-center`
            : align === 'right'
                ? 'text-right'
                : undefined, 'font-bold mb-24 border-0 border-solid border-gray-100 pt-8 mx-16 text-gray-700 dark:text-gray-400 leading-content', border ? `border-b-4` : undefined)}>
      {children}
    </T>);
}
export function H4(_a) {
    var { className, fontSizeClassName = 'text-h4', children, link } = _a, props = __rest(_a, ["className", "fontSizeClassName", "children", "link"]);
    return (<T {...props} tag="h4" id={link} className={cx(className, fontSizeClassName, 'font-bold mb-16 px-16 text-gray-950 dark:text-gray-400')}>
      {children}
    </T>);
}
export function H5(_a) {
    var { className, fontSizeClassName = 'text-h5', children, link } = _a, props = __rest(_a, ["className", "fontSizeClassName", "children", "link"]);
    return (<T {...props} tag="h5" id={link} className={cx(fontSizeClassName, className, 'font-bold w-full mb-16 px-16 text-gray-950 dark:text-gray-400')}>
      {children}
    </T>);
}
export function H6(_a) {
    var { className, fontSizeClassName = 'text-h6', children, link } = _a, props = __rest(_a, ["className", "fontSizeClassName", "children", "link"]);
    return (<T {...props} tag="h6" id={link} className={cx(fontSizeClassName, className, 'font-bold w-full mb-16 px-16 text-gray-950 dark:text-gray-400')}>
      {children}
    </T>);
}
export function PageBreak() {
    return <div className="break-inside-page"/>;
}
export function PageBlock({ children, }) {
    return <div className="break-inside-avoid-page">{children}</div>;
}
//# sourceMappingURL=Content.jsx.map