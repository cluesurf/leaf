import { createContext, useContext } from 'react';
export const AppSettingsContext = createContext({
    MIME_TYPE: {},
    FONT: {},
});
export function useAppSettings() {
    return useContext(AppSettingsContext);
}
//# sourceMappingURL=useAppSettings.jsx.map