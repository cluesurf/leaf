import React from 'react';
export declare const BaseCodeContext: React.Context<string | undefined>;
export declare function BaseCodeProvider({ path, children, }: {
    path: string;
    children: React.ReactNode;
}): React.JSX.Element;
export declare function useBaseCode(): string | undefined;
