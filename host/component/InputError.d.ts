import React, { MutableRefObject } from 'react';
export default function InputError({ children, errorRef, }: {
    children: React.ReactNode;
    errorRef?: MutableRefObject<HTMLDivElement | null>;
}): React.JSX.Element;
