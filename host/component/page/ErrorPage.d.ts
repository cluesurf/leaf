import React from 'react';
export type ErrorPageInput = {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
    children?: React.ReactNode;
};
export default function ErrorPage({ error, reset, children, }: ErrorPageInput): React.JSX.Element;
