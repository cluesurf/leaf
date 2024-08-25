import React, { ForwardedRef } from 'react';
import { InputColor } from './Input';
export type NativeSelectInput<T extends string> = Omit<React.ComponentPropsWithoutRef<'select'>, 'onChange' | 'size'> & {
    size?: 'large' | 'small';
    children: React.ReactNode;
    className?: string;
    topped?: boolean;
    bottomed?: boolean;
    onChangePossiblyUndefined?: (val?: T) => void;
    onChange?: (val: T) => void;
    color?: InputColor;
    noArrow?: boolean;
    font?: string | Array<string>;
};
declare function NativeSelect<T extends string = string>({ children, className, onChange, onChangePossiblyUndefined, topped, bottomed, color, noArrow, size, font, ...props }: NativeSelectInput<T>, ref: ForwardedRef<HTMLSelectElement>): React.JSX.Element;
declare const _default: <T extends string = string>(props: NativeSelectInput<T> & {
    ref?: ForwardedRef<HTMLSelectElement>;
}) => ReturnType<typeof NativeSelect>;
export default _default;
