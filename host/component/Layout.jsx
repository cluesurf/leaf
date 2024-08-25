import React from 'react';
export default function Layout({ children }) {
    return (<div className="bg-gray-100 dark:text-gray-200 dark:bg-gray-900 w-full h-full min-w-screen min-h-screen">
      {/* <FontProvider fonts={fonts}> */}
      {children}
      {/* </FontProvider> */}
    </div>);
}
//# sourceMappingURL=Layout.jsx.map