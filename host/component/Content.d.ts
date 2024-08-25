import React, { HTMLProps } from 'react';
export type BlockQuoteInput = React.ComponentPropsWithoutRef<'blockquote'> & {
    children?: React.ReactNode;
};
export declare function BlockQuote({ children, className, ...props }: BlockQuoteInput): React.JSX.Element;
export type UlInput = React.ComponentPropsWithoutRef<'ul'> & {
    children?: React.ReactNode;
};
export declare function Ul({ children, className, ...props }: UlInput): React.JSX.Element;
export type LiInput = React.ComponentPropsWithoutRef<'li'> & {
    children?: React.ReactNode;
};
export declare function Li({ children, className, ...props }: LiInput): React.JSX.Element;
export type OlInput = React.ComponentPropsWithoutRef<'ol'> & {
    children?: React.ReactNode;
};
export declare function Ol({ children }: OlInput): React.JSX.Element;
export type EmInput = React.ComponentPropsWithoutRef<'em'> & {
    children?: React.ReactNode;
};
export declare function Em({ children, className, ...props }: EmInput): React.JSX.Element;
export type CodeInput = React.ComponentPropsWithoutRef<'code'> & {
    children?: React.ReactNode;
};
export declare function Code({ children, className, ...props }: CodeInput): React.JSX.Element;
export type StrongInput = React.ComponentPropsWithoutRef<'strong'> & {
    children?: React.ReactNode;
};
export declare function Strong({ children, className, ...props }: StrongInput): React.JSX.Element;
type PreInput = React.ComponentPropsWithoutRef<'pre'> & {
    children?: React.ReactNode;
};
export declare function Pre({ children, className, ...props }: PreInput): React.JSX.Element;
export type SupInput = React.ComponentPropsWithoutRef<'sup'> & {
    children?: React.ReactNode;
};
export declare function Sup({ className, children, ...props }: SupInput): React.JSX.Element;
export declare function HR({ className }: {
    className?: string;
}): React.JSX.Element;
export type ColumnInput = {
    children?: React.ReactNode;
    fixed?: boolean;
    width?: number | string;
};
export declare function Column({ children, fixed, width, }: ColumnInput): React.JSX.Element;
export type PInput = React.ComponentPropsWithoutRef<'p'> & {
    children?: React.ReactNode;
    align?: 'left' | 'center' | 'right';
    type?: 'primary' | 'secondary';
};
export declare function P({ children, className, align, type, ...props }: PInput): React.JSX.Element;
export declare function Content({ children }: {
    children?: React.ReactNode;
}): React.JSX.Element;
export type THInput = React.ComponentPropsWithoutRef<'th'> & {
    children?: React.ReactNode;
};
export declare function TH({ children, className, ...props }: THInput): React.JSX.Element;
export type TableInput = {
    children?: React.ReactNode;
};
export declare function Table({ children }: TableInput): React.JSX.Element;
export type TBodyInput = React.ComponentPropsWithoutRef<'tbody'> & {
    children?: React.ReactNode;
};
export declare function TBody({ className, children, ...props }: TBodyInput): React.JSX.Element;
export type THeadInput = React.ComponentPropsWithoutRef<'thead'> & {
    children?: React.ReactNode;
};
export declare function THead({ className, children, ...props }: TBodyInput): React.JSX.Element;
export declare function Whole({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
export type TableScrollerInput = {
    borderless?: boolean;
    children?: React.ReactNode;
    framed?: boolean;
};
export declare function TableScroller({ children, borderless, framed, }: TableScrollerInput): React.JSX.Element;
export type TRInput = React.ComponentPropsWithoutRef<'tr'> & {
    children?: React.ReactNode;
};
export declare function TR({ className, children, ...props }: TRInput): React.JSX.Element;
export type TDInput = React.ComponentPropsWithoutRef<'td'> & {
    children?: React.ReactNode;
    padded?: boolean;
    wrap?: boolean;
};
export declare function TD({ wrap, padded, children, className, ...props }: TDInput): React.JSX.Element;
export type AInput = {
    children?: React.ReactNode;
    href?: string;
    rel?: string;
    target?: string;
} & HTMLProps<HTMLAnchorElement>;
export declare function A({ children, href, rel, target, ...props }: AInput): React.JSX.Element;
export type H1Input = React.ComponentPropsWithoutRef<'h1'> & {
    children?: React.ReactNode;
    fontSizeClassName?: string;
    align?: 'left' | 'center' | 'right';
};
export declare function H1({ className, fontSizeClassName, children, align, ...props }: H1Input): React.JSX.Element;
export type H2Input = React.ComponentPropsWithoutRef<'h2'> & {
    children?: React.ReactNode;
    fontSizeClassName?: string;
    link?: string;
    align?: 'left' | 'center' | 'right';
    contrast?: boolean;
};
export declare function H2({ children, fontSizeClassName, className, align, contrast, ...props }: H2Input): React.JSX.Element;
export type H3Input = React.ComponentPropsWithoutRef<'h3'> & {
    children?: React.ReactNode;
    fontSizeClassName?: string;
    link?: string;
    align?: 'left' | 'center' | 'right';
    border?: boolean;
};
export declare function H3({ className, fontSizeClassName, children, link, align, border, ...props }: H3Input): React.JSX.Element;
export type H4Input = React.ComponentPropsWithoutRef<'h4'> & {
    children?: React.ReactNode;
    fontSizeClassName?: string;
    link?: string;
};
export declare function H4({ className, fontSizeClassName, children, link, ...props }: H4Input): React.JSX.Element;
export type H5Input = React.ComponentPropsWithoutRef<'h5'> & {
    children?: React.ReactNode;
    fontSizeClassName?: string;
    link?: string;
};
export declare function H5({ className, fontSizeClassName, children, link, ...props }: H5Input): React.JSX.Element;
export type H6Input = React.ComponentPropsWithoutRef<'h6'> & {
    children?: React.ReactNode;
    fontSizeClassName?: string;
    link?: string;
};
export declare function H6({ className, fontSizeClassName, children, link, ...props }: H6Input): React.JSX.Element;
export declare function PageBreak(): React.JSX.Element;
export declare function PageBlock({ children, }: {
    children?: React.ReactNode;
}): React.JSX.Element;
export {};
