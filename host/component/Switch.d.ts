import React from 'react';
export type SwitchInput = {
    id?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    size?: 'large' | 'small';
};
export default function Switch({ id, checked, onChange, size, }: SwitchInput): React.JSX.Element;
