import React from 'react';
export type FieldInput = React.ComponentPropsWithoutRef<'div'> & {
    children: React.ReactNode;
    className?: string;
};
export default function Field({ children, className, ...props }: FieldInput): React.JSX.Element;
