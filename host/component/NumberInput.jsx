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
import React, { useEffect, useRef, useState, } from 'react';
import Input from './Input';
export default function NumberInput(_a) {
    var { min, max, step = 1, value, onChange, onFormat } = _a, props = __rest(_a, ["min", "max", "step", "value", "onChange", "onFormat"]);
    const minNumber = min != null ? parseFloat(min) : undefined;
    const maxNumber = max != null ? parseFloat(max) : undefined;
    const valueNumber = value != null ? value : undefined;
    const inputRef = useRef(null);
    const [text, setText] = useState(value != null
        ? String(onFormat && value != null ? onFormat(value) : value)
        : '');
    const [candidate, setCandidate] = useState(valueNumber);
    useEffect(() => {
        setText(valueNumber != null ? String(valueNumber) : '');
    }, [valueNumber, value]);
    const handleKeyDown = (event) => {
        // if (manager.mode !== 'delegate') {
        //   return
        // }
        let newN = valueNumber ? valueNumber : 0;
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            event.stopPropagation();
            newN = newN - Number(step);
        }
        else if (event.key === 'ArrowUp') {
            event.preventDefault();
            event.stopPropagation();
            newN = newN + Number(step);
        }
        else if (event.key === 'a' && event.metaKey) {
            event.preventDefault();
            event.stopPropagation();
            document.execCommand('selectAll');
            return;
        }
        else if (event.key === 'ArrowLeft' &&
            event.altKey &&
            event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            if (inputRef.current &&
                inputRef.current.selectionStart != null &&
                inputRef.current.selectionEnd != null &&
                inputRef.current.selectionDirection != null) {
                createSelection(inputRef.current, inputRef.current.selectionStart - 1, inputRef.current.selectionEnd);
            }
            // document.execCommand('selectAll')
            return;
        }
        else if (event.key === 'ArrowRight' &&
            event.altKey &&
            event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            if (inputRef.current &&
                inputRef.current.selectionStart != null &&
                inputRef.current.selectionEnd != null &&
                inputRef.current.selectionDirection != null) {
                createSelection(inputRef.current, inputRef.current.selectionStart - 1, inputRef.current.selectionEnd);
            }
            // document.execCommand('selectAll')
            return;
        }
        else if (event.key === 'ArrowLeft' &&
            event.metaKey &&
            event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            if (inputRef.current &&
                inputRef.current.selectionStart != null &&
                inputRef.current.selectionEnd != null &&
                inputRef.current.selectionDirection != null) {
                createSelection(inputRef.current, 0, inputRef.current.selectionEnd);
            }
            // document.execCommand('selectAll')
            return;
        }
        else if (event.key === 'ArrowRight' &&
            event.metaKey &&
            event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            if (inputRef.current &&
                inputRef.current.selectionStart != null &&
                inputRef.current.selectionEnd != null &&
                inputRef.current.selectionDirection != null) {
                createSelection(inputRef.current, inputRef.current.selectionStart - 1, inputRef.current.value.length);
            }
            // document.execCommand('selectAll')
            return;
        }
        else if (event.key === 'ArrowLeft' && event.metaKey) {
            event.preventDefault();
            event.stopPropagation();
            if (inputRef.current &&
                inputRef.current.selectionStart != null &&
                inputRef.current.selectionEnd != null &&
                inputRef.current.selectionDirection != null) {
                createSelection(inputRef.current, 0, 0);
            }
            // document.execCommand('selectAll')
            return;
        }
        else if (event.key === 'ArrowRight' && event.metaKey) {
            event.preventDefault();
            event.stopPropagation();
            if (inputRef.current &&
                inputRef.current.selectionStart != null &&
                inputRef.current.selectionEnd != null &&
                inputRef.current.selectionDirection != null) {
                createSelection(inputRef.current, inputRef.current.value.length, inputRef.current.value.length);
            }
            // document.execCommand('selectAll')
            return;
        }
        else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            event.stopPropagation();
            if (inputRef.current &&
                inputRef.current.selectionStart != null &&
                inputRef.current.selectionEnd != null &&
                inputRef.current.selectionDirection != null) {
                createSelection(inputRef.current, Math.max(inputRef.current.selectionStart - 1, 0), Math.max(inputRef.current.selectionStart - 1, 0));
            }
            // document.execCommand('selectAll')
            return;
        }
        else if (event.key === 'ArrowRight') {
            event.preventDefault();
            event.stopPropagation();
            if (inputRef.current &&
                inputRef.current.selectionStart != null &&
                inputRef.current.selectionEnd != null &&
                inputRef.current.selectionDirection != null) {
                createSelection(inputRef.current, Math.min(inputRef.current.selectionEnd + 1, inputRef.current.value.length), Math.min(inputRef.current.selectionEnd + 1, inputRef.current.value.length));
            }
            // document.execCommand('selectAll')
            return;
        }
        else if (!event.key.match(/^([-\.]|[0-9]|Tab|Escape|Backspace)$/)) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        else {
            return;
        }
        if (maxNumber != null && newN > maxNumber && newN !== valueNumber) {
            newN = maxNumber;
        }
        else if (minNumber != null &&
            newN < minNumber &&
            newN !== valueNumber) {
            newN = minNumber;
        }
        if (newN !== valueNumber) {
            document.execCommand('selectAll');
            document.execCommand('insertText', false, String(onFormat ? onFormat(newN) : newN));
        }
    };
    const handleChange = (event) => {
        const input = event.target.value;
        if (!input) {
            setText(input);
            if (minNumber != null) {
                setCandidate(minNumber);
            }
            return;
        }
        else if (!input.match(/^-?\d+(.(?:\d+)?)?$/)) {
            return;
        }
        let newN = roundToFractionOfPercent(parseFloat(input), parseFloat(String(step)));
        if (maxNumber && newN > maxNumber && newN !== valueNumber) {
            // return
            newN = maxNumber;
            setCandidate(newN);
            setText(input);
        }
        else if (minNumber && newN < minNumber && newN !== valueNumber) {
            // return
            newN = minNumber;
            setCandidate(newN);
            setText(input);
        }
        else {
            setCandidate(undefined);
            setText(input);
            onChange === null || onChange === void 0 ? void 0 : onChange(newN);
        }
    };
    const handleBlur = () => {
        const inputNumber = text ? parseFloat(text) : undefined;
        if (candidate != null && inputNumber !== candidate) {
            onChange === null || onChange === void 0 ? void 0 : onChange(candidate !== null && candidate !== void 0 ? candidate : 0);
            setText(String(candidate !== null && candidate !== void 0 ? candidate : 0));
        }
        else if (inputNumber !== valueNumber) {
            onChange === null || onChange === void 0 ? void 0 : onChange(valueNumber !== null && valueNumber !== void 0 ? valueNumber : 0);
            setText(String(valueNumber !== null && valueNumber !== void 0 ? valueNumber : 0));
        }
        else if (onFormat && valueNumber != null) {
            const formatted = onFormat(valueNumber);
            const string = String(valueNumber);
            if (string !== formatted) {
                setText(formatted);
            }
        }
        setCandidate(undefined);
    };
    return (<Input value={text} onKeyDown={handleKeyDown} onChange={handleChange} onBlur={handleBlur} inputMode="decimal" {...props} ref={inputRef}/>);
}
function roundToFractionOfPercent(value, step) {
    const scalingFactor = 1e10; // 10 to the power of 10
    const scaledValue = value * scalingFactor;
    const scaledStep = step * scalingFactor;
    return ((Math.round(scaledValue / scaledStep) * scaledStep) / scalingFactor);
}
function createSelection(field, start, end, direction = 'none') {
    if (field.setSelectionRange) {
        field.focus();
        field.setSelectionRange(start, end, direction);
    }
    else if (typeof field.selectionStart != 'undefined') {
        field.selectionStart = start;
        field.selectionEnd = end;
        field.focus();
    }
}
//# sourceMappingURL=NumberInput.jsx.map