import React from 'react';
import { Extension } from '@uiw/react-codemirror';
import { LRLanguage, Language, LanguageSupport, StreamLanguage } from '@codemirror/language';
import { TextEditorInput, TextEditorLanguage, TextEditorTheme } from './TextEditor.types';
export declare const TEXT_EDITOR_LANGUAGE: Record<TextEditorLanguage, LanguageSupport | StreamLanguage<any> | LRLanguage | Language>;
export declare const TEXT_EDITOR_THEME: Record<TextEditorTheme, (options: any) => Extension>;
export default function TextEditor({ editorRef, value, language, onChange, height, theme, className, readOnly, style, }: TextEditorInput): React.JSX.Element;
