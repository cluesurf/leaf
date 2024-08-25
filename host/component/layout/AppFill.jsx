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
import React from 'react';
import { ViewportLayoutFill } from '../../component/ViewportGrid';
import useAppFonts from '../../hook/useAppFont';
import AppLayout from './AppLayout';
export default function AppFillLayout(_a) {
    var { children, left, right, middleOverlay, state, top, onOpenSettings, up, scrollerRef, menuContent, contactLink, logo } = _a, meta = __rest(_a, ["children", "left", "right", "middleOverlay", "state", "top", "onOpenSettings", "up", "scrollerRef", "menuContent", "contactLink", "logo"]);
    const isFontLoaded = useAppFonts();
    console.log('state', state);
    return (<AppLayout state={state} {...meta}>
      <ViewportLayoutFill className="!top-48" state={state}>
        {children}
      </ViewportLayoutFill>
    </AppLayout>);
}
//# sourceMappingURL=AppFill.jsx.map