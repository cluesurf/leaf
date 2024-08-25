import cx from 'classnames';
import React from 'react';
export const INPUT_COLOR = {
    purple: '[&::-webkit-slider-thumb]:bg-violet-400 [&::-webkit-slider-thumb]:dark:bg-violet-700 [&::-webkit-slider-runnable-track]:bg-violet-200 [&::-webkit-slider-runnable-track]:dark:bg-violet-900',
    blue: '[&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:dark:bg-blue-700 [&::-webkit-slider-runnable-track]:bg-blue-200 [&::-webkit-slider-runnable-track]:dark:bg-blue-900',
    base: '[&::-webkit-slider-thumb]:bg-gray-600 [&::-webkit-slider-thumb]:dark:bg-gray-400 [&::-webkit-slider-runnable-track]:bg-gray-300 [&::-webkit-slider-runnable-track]:dark:bg-gray-900',
    base2: '[&::-webkit-slider-thumb]:bg-gray-400 [&::-webkit-slider-thumb]:dark:bg-gray-700 [&::-webkit-slider-runnable-track]:bg-gray-200 [&::-webkit-slider-runnable-track]:dark:bg-gray-900',
    green: '[&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:dark:bg-emerald-700 [&::-webkit-slider-runnable-track]:bg-green-200 [&::-webkit-slider-runnable-track]:dark:bg-green-900',
    red: '[&::-webkit-slider-thumb]:bg-rose-400 [&::-webkit-slider-thumb]:dark:bg-rose-700 [&::-webkit-slider-runnable-track]:bg-rose-200 [&::-webkit-slider-runnable-track]:dark:bg-rose-900',
};
export default function RangeInput({ value, min = 0, max, size = 'medium', color = 'base', step = 1, onChange, className, }) {
    const inputBackgroundClassName = INPUT_COLOR[color];
    const handleChange = (e) => {
        const n = parseFloat(e.target.value);
        onChange === null || onChange === void 0 ? void 0 : onChange(n);
    };
    return (<input type="range" value={value} min={min} max={max} step={step} onChange={handleChange} className={cx(inputBackgroundClassName, className, '[&::-webkit-slider-runnable-track]:relative', size === 'small'
            ? `[&::-webkit-slider-thumb]:w-12 [&::-webkit-slider-thumb]:-mt-4 [&::-webkit-slider-thumb]:h-12`
            : size === 'medium'
                ? `[&::-webkit-slider-thumb]:w-18 [&::-webkit-slider-thumb]:-mt-6 [&::-webkit-slider-thumb]:h-18`
                : `[&::-webkit-slider-thumb]:w-24 [&::-webkit-slider-thumb]:-mt-8 [&::-webkit-slider-thumb]:h-24`, size === 'small'
            ? `[&::-webkit-slider-runnable-track]:w-4 [&::-webkit-slider-runnable-track]:h-4`
            : size === 'medium'
                ? `[&::-webkit-slider-runnable-track]:w-6 [&::-webkit-slider-runnable-track]:h-6`
                : `[&::-webkit-slider-runnable-track]:w-10 [&::-webkit-slider-runnable-track]:h-10`, `[&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full`, 'w-full h-8 rounded-large-circle appearance-none cursor-pointer')}/>);
}
//# sourceMappingURL=Range.jsx.map