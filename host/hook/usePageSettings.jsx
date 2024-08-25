import kebabCase from 'lodash/kebabcase';
import defaults from 'lodash/defaults';
import { createContext, useCallback, useContext, useEffect, useState, } from 'react';
import { get, set } from '../utility/storage';
import { useSearchParams } from './useSearchParams';
export const PageSettingsContext = createContext({
    stored: {},
    setStored: () => { },
    cached: {},
    setCached: () => { },
    isLoaded: false,
});
export function usePageSettings() {
    return useContext(PageSettingsContext);
}
function updateQueryParams(stored, queryMap) {
    var _a, _b, _c, _d;
    const query = [];
    let hasKey = false;
    for (const name in stored) {
        hasKey = true;
        const transform = (_b = (_a = queryMap[name]) === null || _a === void 0 ? void 0 : _a.to) !== null && _b !== void 0 ? _b : ((val) => String(val));
        if (stored[name] != null) {
            const value = transform(stored[name]);
            if (value != null) {
                query.push(`${(_d = (_c = queryMap[name]) === null || _c === void 0 ? void 0 : _c.key) !== null && _d !== void 0 ? _d : kebabCase(name)}=${value}`);
            }
        }
    }
    if (hasKey) {
        query.sort();
        window.history.replaceState({}, '', `${window.location.pathname}?${query.join('&')}`);
    }
}
function getQueryParams(base, queryMap, query) {
    var _a, _b, _c, _d;
    const queried = {};
    for (const name in base) {
        const transform = (_b = (_a = queryMap[name]) === null || _a === void 0 ? void 0 : _a.from) !== null && _b !== void 0 ? _b : ((val) => val);
        const value = transform(query.get((_d = (_c = queryMap[name]) === null || _c === void 0 ? void 0 : _c.key) !== null && _d !== void 0 ? _d : kebabCase(name)));
        if (value) {
            queried[name] = value;
        }
    }
    return queried;
}
export const QueryFunction = {
    Boolean: {
        from: (val) => val === 'yes',
        to: (val) => (val === true ? 'yes' : 'no'),
    },
    Integer: {
        from: (val) => parseInt(String(val !== null && val !== void 0 ? val : 0), 10),
        to: (val) => String(val),
    },
};
export function PageSettings({ path, base, cached: c = {}, children, queryMap = {}, }) {
    const [stored, _setStored] = useState({});
    const query = useSearchParams();
    const [cached, setCached] = useState(c);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        const stored = get(path);
        const queried = getQueryParams(base !== null && base !== void 0 ? base : {}, queryMap, query);
        const next = defaults({}, queried, stored, base);
        updateQueryParams(next, queryMap);
        _setStored(next);
        setIsLoaded(true);
    }, []);
    const setStored = useCallback((stored) => {
        set(path, stored);
        const next = defaults({}, stored, base);
        updateQueryParams(next, queryMap);
        _setStored(stored);
    }, [path, base]);
    return (<PageSettingsContext.Provider value={{ stored, setStored, cached, setCached, isLoaded }}>
      {children}
    </PageSettingsContext.Provider>);
}
//# sourceMappingURL=usePageSettings.jsx.map