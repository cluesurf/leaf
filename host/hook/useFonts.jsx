import React, { useContext, useState, createContext, useMemo, useLayoutEffect, } from 'react';
import { loadFonts, } from '../constant/font';
export const FontContext = createContext({
    fonts: {},
    update: (fonts) => { },
});
export function FontProvider({ children, }) {
    const [fonts, setFonts] = useState({});
    const state = useMemo(() => ({
        fonts,
        update: setFonts,
    }), [fonts]);
    return (<FontContext.Provider value={state}>
      {children}
    </FontContext.Provider>);
}
export default function useFonts(list = []) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasWaited, setHasWaited] = useState(false);
    const state = useContext(FontContext);
    useLayoutEffect(() => {
        const fonts = list.reduce((m, x) => {
            m[x.family] = false;
            return m;
        }, {});
        state.update(f => (Object.assign(Object.assign({}, f), fonts)));
        loadFonts(list)
            .then(() => {
            setIsLoaded(true);
            const fonts = list.reduce((m, x) => {
                m[x.family] = true;
                return m;
            }, {});
            state.update(f => (Object.assign(Object.assign({}, f), fonts)));
        })
            .catch(e => {
            console.error(e);
            setIsLoaded(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list.map(x => x.family).join(':')]);
    return isLoaded;
}
//# sourceMappingURL=useFonts.jsx.map