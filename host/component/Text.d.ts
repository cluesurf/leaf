import React, { CSSProperties } from 'react';
export type TInput = {
    className?: string;
    processor?: 'tone';
    children?: React.ReactNode;
    value?: string;
    font?: string | Array<string>;
    script?: string | Array<string>;
    theme?: 'base';
    style?: CSSProperties;
    background?: 'light' | 'medium' | 'heavy';
    bold?: boolean;
    size?: number;
    tag?: keyof JSX.IntrinsicElements;
} & React.ComponentPropsWithoutRef<any>;
export declare function useText(font: string | Array<string> | undefined, script?: string | Array<string> | undefined): (string | boolean)[];
export default function Text({ className, value, children, font, script, processor, theme, background, style, size, bold, tag, ...props }: TInput): React.JSX.Element;
