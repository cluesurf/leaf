import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting, } from '@codemirror/language';
export const createTheme = ({ theme, settings = {}, styles = [], }) => {
    const themeOptions = {
        '.cm-gutters': {},
    };
    const baseStyle = {};
    if (settings.background) {
        baseStyle.backgroundColor = settings.background;
    }
    if (settings.backgroundImage) {
        baseStyle.backgroundImage = settings.backgroundImage;
    }
    if (settings.foreground) {
        baseStyle.color = settings.foreground;
    }
    if (settings.foregroundFontWeight) {
        baseStyle.fontWeight = settings.foregroundFontWeight;
    }
    if (settings.background || settings.foreground) {
        themeOptions['&'] = baseStyle;
    }
    if (settings.fontFamily) {
        themeOptions['&.cm-editor .cm-scroller'] = {
            fontFamily: settings.fontFamily,
        };
    }
    themeOptions['.cm-scroller'] = {
        padding: '16px',
    };
    if (settings.gutterBackground) {
        themeOptions['.cm-gutters'].backgroundColor =
            settings.gutterBackground;
    }
    if (settings.gutterForeground) {
        themeOptions['.cm-gutters'].color = settings.gutterForeground;
    }
    if (settings.gutterBorder) {
        themeOptions['.cm-gutters'].borderRightColor = settings.gutterBorder;
    }
    if (settings.caret) {
        themeOptions['.cm-content'] = {
            caretColor: settings.caret,
        };
        themeOptions['.cm-cursor, .cm-dropCursor'] = {
            borderLeftColor: settings.caret,
            borderLeftWidth: '3px',
        };
    }
    let activeLineGutterStyle = {};
    if (settings.gutterActiveForeground) {
        activeLineGutterStyle.color = settings.gutterActiveForeground;
    }
    if (settings.lineHighlight) {
        themeOptions['.cm-activeLine'] = {
            backgroundColor: settings.lineHighlight,
        };
        activeLineGutterStyle.backgroundColor = settings.lineHighlight;
    }
    themeOptions['.cm-activeLineGutter'] = activeLineGutterStyle;
    // themeOptions['.cm-line'] = {
    //   marginLeft: '16px',
    //   marginRight: '16px',
    // }
    themeOptions['.cm-selectionLayer'] = {
        pointerEvents: 'none',
        zIndex: '1 !important',
    };
    if (settings.selection) {
        themeOptions['&.cm-focused .cm-selectionBackground, & .cm-line::selection, & .cm-selectionLayer .cm-selectionBackground'] = {
            background: settings.selection + ' !important',
        };
    }
    themeOptions['.cm-foldGutter'] = {
        display: 'none !important',
    };
    if (settings.selectionBackground) {
        themeOptions['&.cm-focused .cm-selectionBackground, .cm-content ::selection, & .cm-line::selection, & .cm-selectionLayer .cm-selectionBackground'] = {
            background: settings.selectionBackground + ' !important',
        };
    }
    themeOptions['.cm-content ::selection'] = {
        color: 'inherit',
    };
    themeOptions['.cm-content span[data-color]'] = {
        display: 'none',
    };
    if (settings.selectionMatch) {
        themeOptions['& .cm-selectionMatch'] = {
            backgroundColor: settings.selectionMatch,
        };
    }
    themeOptions['&.cm-focused'] = {
        outline: 'none',
    };
    const themeExtension = EditorView.theme(themeOptions, {
        dark: theme === 'dark',
    });
    const highlightStyle = HighlightStyle.define(styles);
    const extension = [themeExtension, syntaxHighlighting(highlightStyle)];
    return extension;
};
export default createTheme;
//# sourceMappingURL=theme.js.map