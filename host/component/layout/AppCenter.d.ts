import React, { RefObject } from 'react';
import { LayoutInput } from '../../component/Layout';
import { ViewportLayout3SectionStateInput } from '../../hook/useViewportLayout';
export type AppCenterLayoutInput = LayoutInput & {
    left?: React.ReactNode;
    right?: React.ReactNode;
    logo?: React.ReactNode;
    up?: string;
    top?: React.ReactNode;
    middleOverlay?: React.ReactNode;
    state: ViewportLayout3SectionStateInput;
    scrollerRef?: RefObject<HTMLDivElement>;
    menuContent?: React.ReactNode;
    contactLink?: string;
    onOpenSettings?: () => void;
};
export default function AppCenterLayout({ children, left, right, middleOverlay, state, top, onOpenSettings, up, scrollerRef, menuContent, contactLink, logo, ...meta }: AppCenterLayoutInput): React.JSX.Element;
