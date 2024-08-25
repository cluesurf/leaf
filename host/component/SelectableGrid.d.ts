import { RefObject } from 'react';
export declare const SelectableGridContext: import("react").Context<SelectableGridManager | undefined>;
export declare function SelectableGrid({ children, onSelect, onSubmit, closeRef, multiple, listenOnWindow, }: {
    onSelect?: (data: any) => void;
    onSubmit?: (data: any) => void;
    multiple?: boolean;
    listenOnWindow?: boolean;
    closeRef?: RefObject<any>;
    children: ({ onKeyDown, gridRef, }: {
        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
        gridRef: RefObject<any>;
    }) => React.ReactNode;
}): import("react").JSX.Element;
export declare function useSelectableGrid(): SelectableGridManager | undefined;
export declare class SelectableGridManager {
    bindings: Record<string, {
        data: any;
        hook: (data: Record<string, any>) => void;
    }>;
    isFocused: boolean;
    focused?: {
        r: number;
        c: number;
    };
    selected: Record<string, boolean>;
    layout: Array<Array<{
        r: number;
        c: number;
    } | undefined> | undefined>;
    multiple: boolean;
    onSelect?: (data: any) => void;
    onSubmit?: (data: any) => void;
    constructor({ multiple, onSelect, onSubmit, }: {
        onSelect?: (data: any) => void;
        onSubmit?: (data: any) => void;
        multiple?: boolean;
    });
    focus(r: number, c: number): void;
    blur(): void;
    navigateLeft(): void;
    navigateRight(): void;
    navigateUp(): void;
    navigateDown(): void;
    submit(): void;
    select(r: number, c: number): void;
    deselect(r: number, c: number): void;
    attach(r: number, c: number, data: any, hook: (data: Record<string, any>) => void): void;
    detach(r: number, c: number): void;
}
