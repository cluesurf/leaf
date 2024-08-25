import React from 'react';
type ItemType = {
    element: React.ReactElement;
    h: number;
    w: number;
};
type MasonryInput = {
    className?: string;
    columnBreakpoints: {
        [key: number]: number;
        default: number;
    };
    columnClassName?: string;
    gap?: number;
    items: Array<ItemType>;
    fixedAspectRatio?: boolean;
};
export declare function Column({ children, gap, className }: ColumnInput): React.JSX.Element;
export type ColumnInput = {
    children: React.ReactNode;
    className?: string;
    gap: number;
};
export declare const MasonryGrid: React.ForwardRefExoticComponent<MasonryGridInput & React.RefAttributes<HTMLDivElement>>;
export declare function MasonryGridBase({ children, gap, className }: MasonryGridInput, ref: React.ForwardedRef<HTMLDivElement>): React.JSX.Element;
export type MasonryGridInput = {
    children: React.ReactNode;
    className?: string;
    gap: number;
};
export default function Masonry({ columnBreakpoints, columnClassName, items, className, gap, fixedAspectRatio, }: MasonryInput): React.JSX.Element;
export {};
