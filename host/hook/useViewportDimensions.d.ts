import React from 'react';
export declare const ViewportDimensionsContext: React.Context<{
    width: number;
    height: number;
}>;
export declare function ViewportDimensions({ children, }: {
    children: React.ReactNode;
}): React.JSX.Element;
export default function useViewportDimensions(): {
    width: number;
    height: number;
};
