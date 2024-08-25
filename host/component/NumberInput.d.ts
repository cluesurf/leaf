import React from 'react';
import { InputInput } from './Input';
export type NumberInputInput = Omit<InputInput, 'onChange' | 'value'> & {
    onChange?: (n: number) => void;
    onFormat?: (n: number) => string;
    value?: number;
};
export default function NumberInput({ min, max, step, value, onChange, onFormat, ...props }: NumberInputInput): React.JSX.Element;
