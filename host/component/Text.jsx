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
import React, { useContext, useEffect, useLayoutEffect, useMemo, useState, } from 'react';
import { ConfigurationContext, FontContext, getScriptFont, } from '../hook/useConfiguration';
import cx from 'classnames';
import tone from '@termsurf/tone';
const processors = {
    tone: (text) => tone.make(text),
};
function checkFonts(state, fonts) {
    for (const font of fonts) {
        if (!state.fonts[font]) {
            return false;
        }
    }
    return true;
}
function getFontClassNames(fonts) {
    const classNames = [];
    for (const font of fonts) {
        classNames.push(`font-${font.replace(/\s+/g, '')}`);
    }
    return classNames;
}
export function useText(font, script) {
    const state = useContext(FontContext);
    const config = useContext(ConfigurationContext);
    const fonts = useMemo(() => {
        if (Array.isArray(font)) {
            return font;
        }
        if (font) {
            return [font];
        }
        if (script && config) {
            const scripts = Array.isArray(script) ? script : [script];
            const scriptFonts = scripts.map(script => getScriptFont(config.data, script, 'modern'));
            return scriptFonts;
        }
        return ['Noto Sans Mono'];
    }, [font, script, config]);
    const checked = checkFonts(state, fonts);
    const [hasWaited, setHasWaited] = useState(checked);
    const [isReady, setIsReady] = useState(checked);
    const [isStarting, setIsStarting] = useState(true);
    const [timer, setTimer] = useState();
    const fontClassName = getFontClassNames(fonts).join(' ');
    useLayoutEffect(() => {
        setIsStarting(false);
    }, [isStarting]);
    useEffect(() => {
        let t;
        const removeTimer = () => clearTimeout(t);
        if (hasWaited) {
            return removeTimer;
        }
        t = setTimeout(() => setHasWaited(true), 1000);
        setTimer(t);
        return removeTimer;
    }, [hasWaited]);
    useLayoutEffect(() => {
        const checked = checkFonts(state, fonts);
        if (checked && !isReady) {
            setIsReady(true);
            setHasWaited(true);
            clearTimeout(timer);
            setTimer(undefined);
        }
    }, [state, fonts, isReady, timer]);
    return [isStarting, isReady, hasWaited, fontClassName];
}
export default function Text(_a) {
    var { className, value, children, font, script, processor, theme = 'base', background = 'light', style = {}, size, bold, tag = 'span' } = _a, props = __rest(_a, ["className", "value", "children", "font", "script", "processor", "theme", "background", "style", "size", "bold", "tag"]);
    const text = processor
        ? processors[processor](value)
        : (value !== null && value !== void 0 ? value : children);
    const [isStarting, isReady, hasWaited, fontClassName] = useText(font, script);
    const actualStyles = Object.assign(Object.assign({}, style), { fontSize: size });
    const Tag = tag;
    if (isStarting || (isReady && hasWaited)) {
        return (<Tag {...props} style={actualStyles} className={cx(className, fontClassName, bold ? 'font-bold' : undefined)}>
        {text}
      </Tag>);
    }
    if (hasWaited) {
        return (<Tag {...props} style={actualStyles} className={cx(`font-loading font-loading-${theme}-${background}`, bold ? 'font-bold' : undefined)}>
        {text}
      </Tag>);
    }
    return (<Tag {...props} style={actualStyles} className={`text-transparent`}>
      {text}
    </Tag>);
}
//# sourceMappingURL=Text.jsx.map