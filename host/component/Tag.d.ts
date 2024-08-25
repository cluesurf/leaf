import React from 'react';
export declare const TAG_COLOR: {
    blue: string;
    green: string;
    gray: string;
};
export type TagColor = keyof typeof TAG_COLOR;
type TagInput = {
    className?: string;
    color?: TagColor;
    children: React.ReactNode;
};
export default function Tag({ children, className, color }: TagInput): React.JSX.Element;
export {};
