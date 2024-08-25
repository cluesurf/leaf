import { LinkProps } from 'next/link';
import React, { ButtonHTMLAttributes, DetailedHTMLProps, HTMLProps } from 'react';
export declare const COLOR: Record<string, string>;
export type ButtonColor = keyof typeof COLOR;
export declare const TEXT_COLOR: Record<string, string>;
export declare const GHOST_COLOR: Record<string, string>;
export type ButtonInput = {
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    touching?: boolean;
    children: React.ReactNode;
    fill?: boolean;
    align?: 'left' | 'right';
    color?: 'purple' | 'blue' | 'red' | 'contrast' | 'green';
    ghost?: boolean;
    bold?: boolean;
    variant?: 1 | 2;
    font?: string | Array<string>;
} & Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'value' | 'size'>;
export declare function Button({ children, size, touching, fill, className, align, color, ghost, font, bold, variant, ...props }: ButtonInput): React.JSX.Element;
export default Button;
export declare function IconButton({ children, className, font, size, ...props }: ButtonInput): React.JSX.Element;
export type LabelButtonInput = {
    size?: 'small' | 'medium' | 'large';
    children: React.ReactNode;
    touching?: boolean;
    fill?: boolean;
    align?: 'left' | 'right';
    color?: 'purple' | 'green' | 'red' | 'contrast';
    ghost?: boolean;
    font?: string | Array<string>;
} & Omit<HTMLProps<HTMLLabelElement>, 'size' | 'value'>;
export declare function LabelButton({ children, size, touching, className, fill, align, color, ghost, font, ...props }: LabelButtonInput): React.JSX.Element;
export type LinkButtonInput = {
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    children?: React.ReactNode;
    download?: boolean;
    touching?: boolean;
    fill?: boolean;
    title?: string;
    align?: 'left' | 'right';
    shadow?: boolean;
    className?: string;
    color?: 'purple' | 'green' | 'red' | 'contrast';
    ghost?: boolean;
    target?: '_blank';
    font?: string | Array<string>;
    variant?: 1 | 1;
} & LinkProps;
export declare function LinkButton({ children, variant, size, touching, fill, title, shadow, align, className, color, ghost, target, font, ...props }: LinkButtonInput): React.JSX.Element;
