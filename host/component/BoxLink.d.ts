import React from 'react';
export type BoxLinkInput = {
    call: React.ReactNode;
    note?: React.ReactNode;
    link?: string;
    className?: string;
    tooltipId?: string;
};
export default function BoxLink({ call, note, link, className, tooltipId, }: BoxLinkInput): React.JSX.Element;
