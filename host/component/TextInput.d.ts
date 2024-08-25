import React from 'react';
import { InputInput } from './Input';
export type TextInputInput = Omit<InputInput, 'onChange' | 'accept'> & {
    accept?: RegExp;
    onChange?: (text?: string) => void;
};
export default function TextInput({ accept, onChange, ...props }: TextInputInput): React.JSX.Element;
