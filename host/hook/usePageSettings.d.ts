export type Base = Record<string, any>;
export type PageSettingsContext<S = Base, C = Base> = {
    stored: S;
    setStored: (stored: S) => void;
    cached: C;
    setCached: (cached: C) => void;
    isLoaded: boolean;
};
export declare const PageSettingsContext: import("react").Context<PageSettingsContext<Base, Base>>;
export declare function usePageSettings<S = Base, C = Base>(): PageSettingsContext<S, C>;
export type QueryMap = Record<string, {
    key?: string;
    to?: (val?: any | null) => string | undefined;
    from?: (val?: string | null) => any;
}>;
export declare const QueryFunction: {
    Boolean: {
        from: (val?: string | null) => val is "yes";
        to: (val?: boolean | null) => "yes" | "no";
    };
    Integer: {
        from: (val?: string | null) => number;
        to: (val?: number | null) => string;
    };
};
export type PageSettingsInput = {
    path: string;
    base?: Base;
    cached?: Base;
    queryMap?: QueryMap;
};
export declare function PageSettings({ path, base, cached: c, children, queryMap, }: {
    children: React.ReactNode;
} & PageSettingsInput): import("react").JSX.Element;
