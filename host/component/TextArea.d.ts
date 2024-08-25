import React, { ChangeEvent } from 'react';
export default function TextArea({ value, loading, labelled, className, onChange, autocomplete, autocorrect, spellCheck, bottomed, id, readOnly, autosize, }: {
    autosize?: boolean;
    id?: string;
    readOnly?: boolean;
    className?: string;
    value?: string;
    loading?: boolean;
    labelled?: boolean;
    onChange?: (e: ChangeEvent) => void;
    autocomplete?: boolean;
    autocorrect?: boolean;
    spellCheck?: boolean;
    bottomed?: boolean;
}): React.JSX.Element;
