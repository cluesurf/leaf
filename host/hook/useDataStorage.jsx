/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState, } from 'react';
import * as storage from '../utility/storage';
export const DataStorageContext = createContext({
    get: () => {
        return {};
    },
    set: () => { },
});
const DEFAULT = {};
const STORED = [undefined, undefined];
export function useDataStorage(key, def) {
    const stored = useContext(DataStorageContext);
    const [state, setState] = useState(def);
    useLayoutEffect(() => {
        const saved = stored.get(key);
        if (saved) {
            setState(saved);
        }
    }, [stored]);
    STORED[0] = stored;
    STORED[1] = state;
    return STORED;
}
export function DataStorageContextProvider({ children, }) {
    const [stored, setStored] = useState(DEFAULT);
    const get = useCallback((key) => {
        if (key in stored) {
            return stored[key];
        }
        return storage.get(key);
    }, [stored]);
    const set = useCallback((key, data) => {
        storage.set(key, data);
        setStored(s => (Object.assign(Object.assign({}, s), { [key]: data })));
    }, [stored]);
    const state = useMemo(() => ({
        get: get,
        set: set,
    }), [set, get]);
    return (<DataStorageContext.Provider value={state}>
      {children}
    </DataStorageContext.Provider>);
}
//# sourceMappingURL=useDataStorage.jsx.map