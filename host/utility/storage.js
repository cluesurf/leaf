/* eslint-disable @typescript-eslint/no-unsafe-return */
export function get(key) {
    if (typeof window === 'undefined') {
        return;
    }
    const value = localStorage.getItem(key);
    if (value) {
        return JSON.parse(value);
    }
}
export function set(key, val) {
    if (typeof window === 'undefined') {
        return;
    }
    localStorage.setItem(key, JSON.stringify(val));
}
//# sourceMappingURL=storage.js.map