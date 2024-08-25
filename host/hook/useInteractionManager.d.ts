import InteractionManager from '../manager/InteractionManager';
export declare const InteractionContext: import("react").Context<InteractionManager>;
export declare function useInteractionManager(): InteractionManager;
export default function InteractionProvider({ children, }: {
    children: React.ReactNode;
}): import("react").JSX.Element;
export type IShortcut = () => void;
export type UseInteractionManagerShortcuts = {
    onSave?: IShortcut;
    onSubmit?: IShortcut;
    onCopy?: IShortcut;
    onPaste?: IShortcut;
    onSelectAll?: IShortcut;
    onFullscreen?: IShortcut;
    onSettings?: IShortcut;
    onEscape?: IShortcut;
    onSearch?: IShortcut;
};
export declare function useInteractionShortcuts({ onSave, onSubmit, onCopy, onPaste, onSelectAll, onFullscreen, onSettings, onEscape, onSearch, }?: UseInteractionManagerShortcuts): void;
export declare function useInteractionManagerInitializer(isLoaded: boolean, load: () => Record<string, any>): void;
