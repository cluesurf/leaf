import { CSSProperties } from 'react';
export type ViewportLayout3SectionStateInput = {
    container: CSSProperties;
    grid: CSSProperties;
    middle: CSSProperties;
    left: CSSProperties;
    right: CSSProperties;
    width: number;
};
export declare function useViewportLayout3Section(): ViewportLayout3SectionStateInput;
export type ViewportLayoutSplitStateInput = {
    width: number;
    container: CSSProperties;
    grid: CSSProperties;
    left: CSSProperties;
    right: CSSProperties;
};
export declare function useViewportLayoutSplit(): ViewportLayoutSplitStateInput;
export type ViewportLayoutFillStateInput = {
    width: number;
    container: CSSProperties;
    grid: CSSProperties;
};
export declare function useViewportLayoutFill(): ViewportLayoutFillStateInput;
