import React from 'react';
export type CodeVibe = 'formal' | 'calm' | 'elemental' | 'pleasant';
export type CodeTint = 'gray' | 'amber' | 'emerald' | 'blue' | 'violet' | 'pink' | 'rose';
export default function Code({ scope, vibe, tint, children, className, preClassName, }: {
    className?: string;
    preClassName?: string;
    scope?: string;
    vibe?: CodeVibe;
    tint?: CodeTint;
    children: string;
}): React.JSX.Element;
