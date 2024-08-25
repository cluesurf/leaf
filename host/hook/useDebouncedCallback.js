import { useEffect, useRef } from 'react';
export function useDebouncedCallback(wait) {
    // track args & timeout handle between calls
    const argsRef = useRef();
    const timeout = useRef();
    function cleanup() {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    }
    // make sure our timeout gets cleared if
    // our consuming component gets unmounted
    useEffect(() => cleanup, []);
    return function debouncedCallback(callback, ...args) {
        // capture latest args
        argsRef.current = args;
        // clear debounce timer
        cleanup();
        // start waiting again
        timeout.current = setTimeout(() => {
            if (argsRef.current) {
                callback(...argsRef.current);
            }
        }, wait);
    };
}
//# sourceMappingURL=useDebouncedCallback.js.map