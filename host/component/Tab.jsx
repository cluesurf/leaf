var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useEffect, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import cx from 'classnames';
export function TabsRoot(_a) {
    var { className, defaultValue, values, cycle } = _a, props = __rest(_a, ["className", "defaultValue", "values", "cycle"]);
    const [newValue, setNewValue] = useState(defaultValue);
    const [newCycle, setNewCycle] = useState(cycle);
    const [timer, setTimer] = useState();
    useEffect(() => {
        if (!newCycle) {
            return;
        }
        if (timer) {
            return;
        }
        const t = setTimeout(() => {
            setTimer(undefined);
            const i = values.indexOf(newValue);
            if (i === values.length - 1) {
                const next = values[0];
                setNewValue(next);
                setNewCycle(false);
            }
            else {
                const next = values[i + 1];
                setNewValue(next);
            }
        }, 5000);
        setTimer(t);
    }, [newCycle, timer, newValue, values]);
    const handleChange = (val) => {
        clearTimeout(timer);
        setTimer(undefined);
        setNewCycle(false);
        setNewValue(val);
    };
    return (<Tabs.Root onValueChange={handleChange} {...props} value={newValue} className={cx(className)}/>);
}
export function TabsList(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (<Tabs.List {...props} className={cx(className, 'p-12', 'bg-gray-100', 'dark:bg-gray-700', 'inline-block', 'rounded-sm')}/>);
}
export function TabsTrigger(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (<Tabs.Trigger {...props} className={[
            'p-16',
            'py-12',
            'radix-state-active:bg-violet-400',
            'radix-state-active:text-white',
            'radix-state-active:font-bold',
            'rounded-sm',
        ].join(' ')}/>);
}
export function TabsContent(_a) {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (<Tabs.Content {...props} className={cx(className)}/>);
}
//# sourceMappingURL=Tab.jsx.map