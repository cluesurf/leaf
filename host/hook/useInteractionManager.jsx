import { createContext, useContext, useEffect, useMemo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import InteractionManager from '../manager/InteractionManager';
export const InteractionContext = createContext(new InteractionManager());
export function useInteractionManager() {
    return useContext(InteractionContext);
}
export default function InteractionProvider({ children, }) {
    const manager = useMemo(() => new InteractionManager(), []);
    return (<InteractionContext.Provider value={manager}>
      {children}
    </InteractionContext.Provider>);
}
export function useInteractionShortcuts({ onSave, onSubmit, onCopy, onPaste, onSelectAll, onFullscreen, onSettings, onEscape, onSearch, } = {}) {
    const manager = useInteractionManager();
    useHotkeys('mod+i', () => {
        manager.setMode('input');
    });
    useHotkeys('mod+z', (e) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        manager.setMode('command');
        manager.undo();
    });
    useHotkeys('mod+s', (e) => {
        if (!onSave) {
            return;
        }
        e.stopImmediatePropagation();
        e.preventDefault();
        onSave();
    });
    useHotkeys('mod+c', (e) => {
        if (!onCopy) {
            return;
        }
        e.stopImmediatePropagation();
        e.preventDefault();
        onCopy();
    });
    useHotkeys('mod+enter', (e) => {
        if (!onSubmit) {
            return;
        }
        e.stopImmediatePropagation();
        e.preventDefault();
        onSubmit();
    });
    useHotkeys('mod+,', (e) => {
        if (!onSettings) {
            return;
        }
        e.stopImmediatePropagation();
        e.preventDefault();
        onSettings();
    });
    useHotkeys('mod+shift+f', (e) => {
        if (!onSearch) {
            return;
        }
        e.stopImmediatePropagation();
        e.preventDefault();
        onSearch();
    });
    // mod+s onSave
    // mod+enter onSubmit
    // mod+c copy
    // mod+v paste
    // mod+a selectAll
    // mod+0 fullscreen
    // mod+, settings
    // ESC defocus
    // mod+shift+f search
    useHotkeys('mod+shift+z', (e) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        manager.setMode('command');
        manager.redo();
    });
}
export function useInteractionManagerInitializer(isLoaded, load) {
    const manager = useInteractionManager();
    useEffect(() => {
        if (isLoaded) {
            manager.load(load());
        }
    }, [isLoaded]);
}
//# sourceMappingURL=useInteractionManager.jsx.map