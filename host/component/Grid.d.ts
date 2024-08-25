import React, { ReactElement } from 'react';
type Align = 'center' | 'left';
type ContainerInput = {
    gap: number;
    align: Align;
    children: Array<ReactElement<any>>;
    className?: string;
};
export declare function Container({ gap, align, children, className }: ContainerInput, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement;
export declare const ContainerWithRef: React.ForwardRefExoticComponent<ContainerInput & React.RefAttributes<HTMLDivElement>>;
export declare function Row({ gap, align, children, className, }: ContainerInput): React.JSX.Element;
type ItemInput = {
    width: number;
    marginLeft?: number;
    marginRight?: number;
    children: ReactElement<any>;
};
export declare function Item({ width, marginLeft, marginRight, children, }: ItemInput): React.JSX.Element;
type GridInput = {
    className?: string;
    rowClassName?: string;
    maxColumns: number;
    minWidth: number;
    gap: number;
    rowGap?: number;
    children: React.ReactNode;
    align?: Align;
    breakpoints?: Array<number>;
    stretchLast?: boolean;
};
export default function Grid({ className, rowClassName, maxColumns, minWidth, gap, children, rowGap, align, breakpoints, stretchLast, }: GridInput): React.JSX.Element | null;
export {};
