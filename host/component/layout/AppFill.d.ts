import React, { RefObject } from 'react';
import { LayoutInput } from '../../component/Layout';
import { ViewportLayoutFillStateInput } from '../../hook/useViewportLayout';
export type AppFillLayoutInput = LayoutInput & {
    left?: React.ReactNode;
    right?: React.ReactNode;
    logo?: React.ReactNode;
    up?: string;
    top?: React.ReactNode;
    middleOverlay?: React.ReactNode;
    state: ViewportLayoutFillStateInput;
    scrollerRef?: RefObject<HTMLDivElement>;
    menuContent?: React.ReactNode;
    contactLink?: string;
    onOpenSettings?: () => void;
};
export default function AppFillLayout({ children, left, right, middleOverlay, state, top, onOpenSettings, up, scrollerRef, menuContent, contactLink, logo, ...meta }: AppFillLayoutInput): React.JSX.Element;
