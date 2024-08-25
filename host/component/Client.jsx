import React from 'react';
import { AppSettingsContext } from '../hook/useAppSettings';
import { DataStorageContextProvider } from '../hook/useDataStorage';
import { FontProvider } from '../hook/useConfiguration';
export default function Client({ settings, children, }) {
    return (<AppSettingsContext.Provider value={settings}>
      <FontProvider>
        <DataStorageContextProvider>
          {children}
        </DataStorageContextProvider>
      </FontProvider>
    </AppSettingsContext.Provider>);
}
//# sourceMappingURL=Client.jsx.map