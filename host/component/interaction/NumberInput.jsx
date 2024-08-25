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
import { useEffect, useRef } from 'react';
import { useInteractionManager } from '../../hook/useInteractionManager';
import NumberInput from '../NumberInput';
export default function INumberInput(_a) {
    var { onChange, onFocus, onBlur, id } = _a, input = __rest(_a, ["onChange", "onFocus", "onBlur", "id"]);
    const manager = useInteractionManager();
    const ref = useRef(null);
    const handleFocus = (e) => {
        manager.setMode('delegate');
        onFocus === null || onFocus === void 0 ? void 0 : onFocus(e);
    };
    const handleBlur = (e) => {
        manager.setMode('default');
        onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
    };
    useEffect(() => {
        const undo = (value) => {
            ref.current.value = String(value);
            // const event = new Event('change')
            // ref.current!.dispatchEvent(event)
            onChange === null || onChange === void 0 ? void 0 : onChange(value);
        };
        const redo = (value) => {
            ref.current.value = String(value);
            // const event = new Event('change')
            // ref.current!.dispatchEvent(event)
            onChange === null || onChange === void 0 ? void 0 : onChange(value);
        };
        const capture = () => parseInt(ref.current.value);
        manager.attach(id, { undo, redo, capture });
        return () => {
            manager.detach(id);
        };
    }, [ref]);
    const handleChange = (n) => {
        manager.push({ [id]: n });
        onChange === null || onChange === void 0 ? void 0 : onChange(n);
    };
    return (<NumberInput inputRef={ref} id={id} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} {...input}/>);
}
//# sourceMappingURL=NumberInput.jsx.map