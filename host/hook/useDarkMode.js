import { useLayoutEffect, useState } from 'react';
export function useDarkMode() {
    const [mode, setMode] = useState('light');
    useLayoutEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (event) => {
            const newColorScheme = event.matches ? 'dark' : 'light';
            setMode(newColorScheme);
        };
        media.addEventListener('change', handleChange);
        setMode(media.matches ? 'dark' : 'light');
        return () => media.removeEventListener('change', handleChange);
    }, [setMode]);
    return mode;
}
//# sourceMappingURL=useDarkMode.js.map