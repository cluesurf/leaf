import { Suspense, lazy } from 'react';
import cx from 'classnames';
import { useDarkMode } from '../hook/useDarkMode';
const TextEditorInternal = lazy(() => import('./TextEditorInternal'));
const THEME = {
    base: {
        dark: `bg-violet-950`,
        light: `bg-violet-50`,
    },
    purple: {
        dark: `bg-violet-950`,
        light: `bg-violet-50`,
    },
    blue: {
        dark: `bg-blue-950`,
        light: `bg-blue-50`,
    },
};
export default function TextEditor({ editorRef, value, language, onChange, height, theme = 'purple', className, readOnly, style, }) {
    const mode = useDarkMode();
    return (<Suspense fallback={<div style={style} className={cx(className, THEME[theme][mode])}/>}>
      <TextEditorInternal editorRef={editorRef} value={value} language={language} onChange={onChange} height={height} theme={theme} className={className} readOnly={readOnly} style={style}/>
    </Suspense>);
}
//# sourceMappingURL=TextEditor.jsx.map