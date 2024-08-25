import React from 'react';
export type InputColor = 'purple' | 'blue' | 'base';
export declare const INPUT_COLOR: Record<InputColor, string>;
export type ValueInput = React.ComponentPropsWithoutRef<'div'> & {
    labelled?: boolean;
    bottomed?: boolean;
    color?: InputColor;
    value?: React.ReactNode;
    children?: React.ReactNode;
};
export default function Value({ className, labelled, bottomed, color, ...props }: ValueInput): React.JSX.Element;
export declare function getRoundedClass(labelled?: boolean, bottomed?: boolean): "rounded-b-sm" | "rounded-t-sm" | "rounded-sm" | undefined;
