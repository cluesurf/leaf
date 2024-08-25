import React, { RefObject } from 'react';
import { LayoutInput } from '../../component/Layout';
export type AppLayoutInput = LayoutInput & {
    logo?: React.ReactNode;
    up?: string;
    top?: React.ReactNode;
    bottom?: React.ReactNode;
    showBottom?: boolean;
    state: {
        width: number;
    };
    scrollerRef?: RefObject<HTMLDivElement>;
    menuContent?: React.ReactNode;
    contactLink?: string;
    onOpenSettings?: () => void;
    bottomNavigationClassName?: string;
};
export declare const NavigationContext: React.Context<{
    topIsVisible: boolean;
    setTopIsVisible: (val: boolean) => void;
    bottomIsVisible: boolean;
    setBottomIsVisible: (val: boolean) => void;
}>;
export declare function NavigationProvider({ children, }: {
    children: React.ReactNode;
}): React.JSX.Element;
export default function AppLayout({ children, bottom, showBottom, state, top, onOpenSettings, up, scrollerRef, menuContent, contactLink, logo, bottomNavigationClassName, ...meta }: AppLayoutInput): React.JSX.Element;
