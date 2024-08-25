import { InputColor } from '../component/Input';
import { DateTime } from 'luxon';
export type TimeInputInput = {
    labelled?: boolean;
    bottomed?: boolean;
    color?: InputColor;
    value?: DateTime | null | undefined;
    is24Hour?: boolean;
    onChange?: (date: DateTime) => void;
    id?: string;
};
declare const MONTH: Record<string, string>;
export type Month = keyof typeof MONTH;
export default function TimeInput(props: TimeInputInput): import("react").JSX.Element;
export {};
