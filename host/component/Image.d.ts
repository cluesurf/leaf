import React from 'react';
export type ImageInput = {
    alt?: string;
    h: number;
    host?: string;
    onClick?: () => void;
    preview: string;
    src: string;
    w: number;
};
export default function Image({ src, preview, w, h, alt, onClick, }: ImageInput): React.JSX.Element;
