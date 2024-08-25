import React, { useContext, useEffect, useState } from 'react';
const DEFAULT_PPI = 96;
export const InchesContext = React.createContext(DEFAULT_PPI);
export function usePPI() {
    return useContext(InchesContext);
}
export default function InchesProvider({ children, }) {
    const [pixelsPerInch, setPixelsPerInch] = useState(DEFAULT_PPI);
    useEffect(() => {
        const div = document.createElement('div');
        div.style.height = '1in';
        div.style.width = '1in';
        div.style.left = '100%';
        div.style.top = '100%';
        div.style.position = 'fixed';
        document.body.appendChild(div);
        const pixels = div.offsetWidth || 96;
        document.body.removeChild(div);
        setPixelsPerInch(pixels);
    }, []);
    return (<InchesContext.Provider value={pixelsPerInch}>
      {children}
    </InchesContext.Provider>);
}
//# sourceMappingURL=Inches.jsx.map