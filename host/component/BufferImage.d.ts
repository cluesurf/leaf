import React from 'react';
export declare const PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
export type BufferImageInput = Omit<React.ComponentPropsWithoutRef<'img'>, 'content'> & {
    content: ArrayBuffer | Blob | undefined;
    maxWidth?: number;
    maxHeight?: number;
    naturalWidth?: number;
};
export default function BufferImage({ content, maxWidth, maxHeight, naturalWidth, ...props }: BufferImageInput): React.JSX.Element;
