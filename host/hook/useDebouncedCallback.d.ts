export declare function useDebouncedCallback<A extends Array<any>>(wait: number): (callback: (...args: A) => void, ...args: A) => void;
