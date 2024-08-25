import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
export default function Time({ value, autoUpdate, formatVerbose, format, }) {
    var _a;
    const [date, setDate] = useState(value);
    useEffect(() => {
        const update = () => {
            setDate(DateTime.fromJSDate(new Date()));
        };
        const timer = autoUpdate ? setInterval(update, 5 * 1000) : undefined;
        if (autoUpdate) {
            update();
        }
        return () => {
            clearInterval(timer);
        };
    }, [autoUpdate]);
    return (<time dateTime={date && formatVerbose
            ? formatVerbose(date)
            : (_a = date === null || date === void 0 ? void 0 : date.toISODate()) !== null && _a !== void 0 ? _a : undefined}>
      {date && format
            ? format(date)
            : date === null || date === void 0 ? void 0 : date.toLocaleString(DateTime.DATETIME_FULL)}
    </time>);
}
//# sourceMappingURL=Time.jsx.map