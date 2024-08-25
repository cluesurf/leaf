import React from 'react';
export type NavigationBindingInput = {
    form?: 'action' | 'panel';
    trigger: React.ReactNode;
    element?: () => React.ReactNode;
};
export type NavigationInput = {
    backgroundClassName?: string;
    forceShadow?: boolean;
    a?: NavigationBindingInput;
    b?: NavigationBindingInput;
    c?: NavigationBindingInput;
    d?: NavigationBindingInput;
    e?: NavigationBindingInput;
};
export declare const NavigationContext: React.Context<(data?: NavigationInput) => void>;
export declare function checkScrollDirectionIsUp(event: WheelEvent): boolean;
type NavigationOverlayInput = {
    children: React.ReactNode;
    triggerPosition: 'top' | 'bottom';
    onClose: () => void;
};
export declare function NavigationOverlay({ triggerPosition, children, onClose, }: NavigationOverlayInput): React.JSX.Element;
export declare function bindTrigger(form: string, trigger: React.ReactNode, showPanel: (el: React.ReactNode) => void, element?: () => React.ReactNode): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | React.JSX.Element | null | undefined;
export {};
