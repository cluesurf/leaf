import React from 'react';
export type MathInput = {
    children: string;
    className?: string;
};
declare function Math({ className, children }: MathInput): React.JSX.Element;
declare namespace Math {
    var Inline: typeof InlineMath;
}
export default Math;
export type InternalBlockMathInput = {
    html: string;
    className?: string;
};
export declare function InlineMath({ className, children }: MathInput): React.JSX.Element;
