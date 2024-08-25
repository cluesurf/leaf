import React from 'react';
export type DataStorageContextInput = {
    get: (key: string, isTemporary?: boolean) => object;
    set: (key: string, value: object, isTemporary?: boolean) => void;
};
export declare const DataStorageContext: React.Context<DataStorageContextInput>;
export type DataStorageContextProviderInput = {
    children: React.ReactNode;
};
export declare function useDataStorage<T>(key: string, def: any): [any, any];
export declare function DataStorageContextProvider({ children, }: DataStorageContextProviderInput): React.JSX.Element;
