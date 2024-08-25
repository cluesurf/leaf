import React from 'react';
export type LinkTreeInput = {
    form?: 'head' | 'link';
    text?: string;
    link?: string;
    nest?: Array<LinkTreeInput>;
    show?: boolean;
    side?: number;
};
export type LinkTreeHeadInput = {
    text: string;
};
export declare function LinkTreeHead({ text }: LinkTreeHeadInput): React.JSX.Element;
export type LinkTreeLinkInput = {
    text: string;
    link: string;
    lead?: boolean;
    show?: boolean;
    nest?: Array<LinkTreeInput>;
    side: number;
};
export declare function LinkTreeLink({ text, link, lead, show, nest, side, }: LinkTreeLinkInput): React.JSX.Element;
export default function LinkTree({ nest, show, side, }: LinkTreeInput): React.JSX.Element | null;
