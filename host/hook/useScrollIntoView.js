/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
export default function useScrollIntoView(dependencies = []) {
    const localRef = useCallback((node) => {
        const timeout = window.setTimeout(() => node === null || node === void 0 ? void 0 : node.scrollIntoView(), 16);
        return () => {
            window.clearTimeout(timeout);
        };
    }, dependencies);
    return localRef;
}
//# sourceMappingURL=useScrollIntoView.js.map