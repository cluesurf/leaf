import React from 'react';
import { InputColor } from './Input';
export default function FileDropzone({ color, children, className, accept, multiple, onDrop, topped, bottomed, borderClassName, font, }: {
    font?: string | Array<string>;
    color?: InputColor;
    topped?: boolean;
    bottomed?: boolean;
    children: React.ReactNode;
    className?: string;
    accept?: Array<string>;
    multiple?: boolean;
    onDrop?: (files: Array<File>) => void;
    borderClassName?: string;
}): React.JSX.Element;
