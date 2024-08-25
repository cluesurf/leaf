import { DateTime } from 'luxon';
export type TimeInput = {
    value?: DateTime;
    autoUpdate?: boolean;
    formatVerbose?: (date: DateTime) => string;
    format?: (date: DateTime) => string;
};
export default function Time({ value, autoUpdate, formatVerbose, format, }: TimeInput): import("react").JSX.Element;
