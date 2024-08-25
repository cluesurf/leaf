'use client';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { createContext, useContext, useEffect, useState, } from 'react';
import Layout from '../../component/Layout';
import { useNavigation } from '../../hook/useNavigation';
import { NavigationOverlay } from '../../component/navigation';
import useAppFonts from '../../hook/useAppFont';
export const NavigationContext = createContext({
    topIsVisible: false,
    setTopIsVisible: (val) => { },
    bottomIsVisible: false,
    setBottomIsVisible: (val) => { },
});
export function NavigationProvider({ children, }) {
    const [topIsVisible, setTopIsVisible] = useState(true);
    const [bottomIsVisible, setBottomIsVisible] = useState(false);
    return (<NavigationContext.Provider value={{
            topIsVisible,
            setTopIsVisible,
            bottomIsVisible,
            setBottomIsVisible,
        }}>
      {children}
    </NavigationContext.Provider>);
}
export default function AppLayout(_a) {
    var { children, bottom, showBottom = false, state, top, onOpenSettings, up, scrollerRef, menuContent, contactLink, logo, bottomNavigationClassName } = _a, meta = __rest(_a, ["children", "bottom", "showBottom", "state", "top", "onOpenSettings", "up", "scrollerRef", "menuContent", "contactLink", "logo", "bottomNavigationClassName"]);
    const isFontLoaded = useAppFonts();
    const [menu, setMenu] = useState();
    const navigationContext = useContext(NavigationContext);
    const handleMenuOpen = () => {
        setMenu(<div className="p-16 bg-white dark:bg-gray-950 h-full w-full">
        {menuContent}
      </div>);
    };
    const navigation = useNavigation({
        bottom,
        up,
        top: state.width === 0 ? undefined : top,
        logo,
        onMenuOpen: handleMenuOpen,
        bottomNavigationClassName,
    });
    const showNavigationTop = Boolean(navigation === null || navigation === void 0 ? void 0 : navigation.top);
    const showNavigationBottom = Boolean(onOpenSettings && showBottom);
    useEffect(() => {
        navigationContext.setTopIsVisible(showNavigationTop);
        navigationContext.setBottomIsVisible(showNavigationBottom);
    }, [showNavigationTop, showNavigationBottom]);
    return (<>
      {navigation === null || navigation === void 0 ? void 0 : navigation.top}
      <Layout {...meta}>{children}</Layout>
      {showBottom && (navigation === null || navigation === void 0 ? void 0 : navigation.bottom)}
      {menu && (<NavigationOverlay onClose={() => setMenu(undefined)} triggerPosition="top">
          {menu}
        </NavigationOverlay>)}
    </>);
}
//# sourceMappingURL=AppLayout.jsx.map