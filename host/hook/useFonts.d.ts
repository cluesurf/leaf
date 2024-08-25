import React, { Dispatch, SetStateAction } from 'react';
import { FontDataType, GoogleFontDeclaration } from '../constant/font';
export type FontContextInput = {
    fonts: Record<string, boolean>;
    update: Dispatch<SetStateAction<Record<string, boolean>>>;
};
export declare const FontContext: React.Context<FontContextInput>;
export declare function FontProvider({ children, }: {
    children: React.ReactNode;
}): React.JSX.Element;
export default function useFonts(list?: Array<FontDataType | GoogleFontDeclaration>): boolean;
