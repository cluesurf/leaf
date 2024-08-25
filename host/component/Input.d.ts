import React from 'react';
export type InputColor = 'purple' | 'blue' | 'base' | 'green' | 'red' | 'base2';
export declare const INPUT_COLOR: Record<InputColor, string>;
export declare const INPUT_WAITING: Record<InputColor, string>;
export type InputInput = Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> & {
    size?: 'large' | 'small';
    labelled?: boolean;
    bottomed?: boolean;
    inputRef?: React.MutableRefObject<HTMLInputElement | null>;
    before?: React.ReactNode;
    after?: React.ReactNode;
    color?: InputColor;
    font?: string | Array<string>;
};
declare const _default: React.ForwardRefExoticComponent<Omit<Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, "size"> & {
    size?: "large" | "small";
    labelled?: boolean;
    bottomed?: boolean;
    inputRef?: React.MutableRefObject<HTMLInputElement | null>;
    before?: React.ReactNode;
    after?: React.ReactNode;
    color?: InputColor;
    font?: string | Array<string>;
} & React.RefAttributes<HTMLInputElement>>;
export default _default;
export declare function getRoundedClass(labelled?: boolean, bottomed?: boolean): "rounded-b-sm" | "rounded-t-sm" | "rounded-sm" | undefined;
