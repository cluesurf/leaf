import React, { Dispatch, SetStateAction } from 'react';
import { FontDataType, GoogleFontDeclaration } from '../constant/font';
export type NestedObjectType = {
    [key: string]: NestedObjectValueType;
};
export type NestedObjectValueType = NestedObjectType | string | boolean | number | null | undefined | Array<NestedObjectType | string | boolean | number | null | undefined>;
type ConfigurationContextType = {
    data: AppConfiguration;
    set: (updates: NestedObjectType) => void;
};
export declare const ConfigurationContext: React.Context<ConfigurationContextType | undefined>;
export declare function ConfigurationProvider({ config, children }: PropsType): React.JSX.Element;
type PropsType = {
    children: React.ReactNode;
    config: AppConfiguration;
};
export declare function useConfiguration(): ConfigurationContextType;
export declare function useConfigurationScope(scope: string): void;
export declare function useConfigurationSettings(updates: NestedObjectType): void;
export type FontContextInput = {
    fonts: Record<string, boolean>;
    update: Dispatch<SetStateAction<Record<string, boolean>>>;
};
export declare const FontContext: React.Context<FontContextInput>;
export declare function FontProvider({ children, }: {
    children: React.ReactNode;
}): React.JSX.Element;
export declare function useFonts(list?: Array<FontDataType | GoogleFontDeclaration>): boolean;
export declare const SCRIPT: string[];
export declare const remoteFonts: {
    'Noto Kufi Arabic': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Armenian': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Bengali': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Canadian': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Cuneiform': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Devanagari': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Egyptian': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Ethiopic': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Georgian': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Gujarati': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Gurmukhi': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Hebrew': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans JP': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans KR': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Kannada': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Khmer': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Malayalam': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Mono': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Oriya': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Runic': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans SC': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Sinhala': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Syriac': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Tamil': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Telugu': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Sans Thai': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
    'Noto Serif Tibetan': {
        loaded: boolean;
        path: string | string[] | undefined;
    };
};
export declare const fonts: Record<string, FontLoadedType>;
export declare const FONT: string[];
export type FontNameType = keyof typeof fonts;
export type FontLoadedType = {
    loaded: boolean;
    path?: string | Array<string>;
};
export type ScriptDataType = {
    [key: string]: NestedObjectValueType;
    font: string;
    fonts: Record<string, FontNameType>;
};
export declare function getScriptFontData(theme: AppConfiguration, script: string): {
    name: string;
    loaded: boolean;
    path?: string | Array<string>;
};
export declare function getScriptFont(theme: AppConfiguration, script: string, type: string): string;
declare const config: {
    fonts: {
        families: Record<string, FontLoadedType>;
        scale: number;
    };
    scripts: Record<string, ScriptDataType>;
};
export type ScriptNameType = (typeof SCRIPT)[number];
export { config };
export type AppConfiguration = typeof config;
