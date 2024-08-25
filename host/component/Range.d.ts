import { InputColor } from './Input';
import React from 'react';
export type RangeInputInput = {
    value: number;
    min?: number;
    max: number;
    step?: number;
    color?: InputColor;
    size?: 'small' | 'medium' | 'large';
    onChange?: (n: number) => void;
    className?: string;
};
export declare const INPUT_COLOR: Record<InputColor, string>;
export default function RangeInput({ value, min, max, size, color, step, onChange, className, }: RangeInputInput): React.JSX.Element;
