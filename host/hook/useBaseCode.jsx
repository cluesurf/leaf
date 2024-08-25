import React, { useState, createContext, useContext, useEffect, } from 'react';
import Cookies from 'js-cookie';
export const BaseCodeContext = createContext(undefined);
export function BaseCodeProvider({ path, children, }) {
    const [code, setBaseCode] = useState(Cookies.get('code'));
    useEffect(() => {
        if (code) {
            return;
        }
        fetch(path)
            .then(res => res.json())
            .then(json => {
            if (json.code) {
                setBaseCode(json.code);
            }
        });
    }, [path, code]);
    return (<BaseCodeContext.Provider value={code}>
      {children}
    </BaseCodeContext.Provider>);
}
export function useBaseCode() {
    return useContext(BaseCodeContext);
}
//# sourceMappingURL=useBaseCode.jsx.map