import React from 'react';
import { InputColor } from './Input';
export type LabelColor = 'dark-purple' | 'dark-blue' | 'dark-green' | 'dark-red' | InputColor;
export declare const LABEL_COLOR: Record<LabelColor, string>;
export default function Label({ children, className, htmlFor, color, bottomless, font, }: {
    children: React.ReactNode;
    className?: string;
    htmlFor?: string;
    color?: LabelColor;
    bottomless?: boolean;
    font?: string | Array<string>;
}): React.JSX.Element;
