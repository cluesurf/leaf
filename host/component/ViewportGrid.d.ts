import React, { RefObject } from 'react';
import { ViewportLayout3SectionStateInput, ViewportLayoutFillStateInput, ViewportLayoutSplitStateInput } from '../hook/useViewportLayout';
export type ViewportLayout3SectionInput = {
    className?: string;
    scrollerRef?: RefObject<HTMLDivElement>;
    middleClassName?: string;
    left: React.ReactNode;
    leftClassName?: string;
    middle: React.ReactNode;
    right: React.ReactNode;
    rightClassName?: string;
    state: ViewportLayout3SectionStateInput;
    middleOverlay?: React.ReactNode;
};
export declare function ViewportLayout3Section({ className, left, leftClassName, middle, middleClassName, right, rightClassName, state, middleOverlay, scrollerRef, }: ViewportLayout3SectionInput): React.JSX.Element;
export declare function ViewportLayoutSplit({ className, left, right, state, leftBackgroundClassName, rightBackgroundClassName, }: {
    className?: string;
    leftBackgroundClassName?: string;
    rightBackgroundClassName?: string;
    left: React.ReactNode;
    right: React.ReactNode;
    state: ViewportLayoutSplitStateInput;
}): React.JSX.Element;
export declare function ViewportLayoutBase({ children, className, }: {
    className?: string;
    children: React.ReactNode;
}): React.JSX.Element;
export declare function ViewportLayoutFill({ children, className, backgroundClassName, state, }: {
    children: React.ReactNode;
    className?: string;
    backgroundClassName?: string;
    state: ViewportLayoutFillStateInput;
}): React.JSX.Element;
