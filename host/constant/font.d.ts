export declare const FONT_OBSERVER_TIMEOUT = 30000;
export declare function addStylesheetURL(url: string): void;
export type GoogleFontStyleDeclaration = {
    italic?: boolean;
    weight: number;
};
export type GoogleFontDeclaration = {
    google: true;
    family: string;
    string?: string;
    styles: Array<GoogleFontStyleDeclaration>;
};
export type FontDataType = {
    family: string;
    string: string;
};
export declare function loadFonts(fonts: Array<FontDataType | GoogleFontDeclaration>): Promise<void>;
export declare function loadLocalFonts(fonts: Array<FontDataType>): Promise<void>;
export declare function loadGoogleFonts(fonts: Array<GoogleFontDeclaration>): Promise<void>;
export type FontFaceObserverResult = FontFaceObserverRise | FontFaceObserverFall;
export type FontFaceObserverRise = {
    form: 'rise';
    font: GoogleFontDeclaration | FontDataType;
};
export type FontFaceObserverFall = {
    form: 'kink';
    kink: any;
    font: GoogleFontDeclaration | FontDataType;
};
export declare function loadGoogleFontCss(fonts: Array<GoogleFontDeclaration>): Promise<boolean>;
