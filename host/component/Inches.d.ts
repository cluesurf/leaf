import React from 'react';
export declare const InchesContext: React.Context<number>;
export declare function usePPI(): number;
export default function InchesProvider({ children, }: {
    children: React.ReactNode;
}): React.JSX.Element;
