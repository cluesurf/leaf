import React from 'react';
type SVGInput = {
    className?: string;
    width?: number | string;
    height?: number | string;
    children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'children'>;
declare const SVG: React.FC<SVGInput>;
export default SVG;
