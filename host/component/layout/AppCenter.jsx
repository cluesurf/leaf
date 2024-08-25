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
import cx from 'classnames';
import React from 'react';
import GearIcon from '../../component/icon/Gear';
import { ViewportLayout3Section } from '../../component/ViewportGrid';
import MessageIcon from '../../component/icon/Message';
import useAppFonts from '../../hook/useAppFont';
import Loading from '../Loading';
import AppLayout from './AppLayout';
export default function AppCenterLayout(_a) {
    var { children, left, right, middleOverlay, state, top, onOpenSettings, up, scrollerRef, menuContent, contactLink, logo } = _a, meta = __rest(_a, ["children", "left", "right", "middleOverlay", "state", "top", "onOpenSettings", "up", "scrollerRef", "menuContent", "contactLink", "logo"]);
    const isFontLoaded = useAppFonts();
    const leftIsHidden = state.width < 804;
    const rightIsHidden = state.width < 1056;
    const bottomNavigationClassName = rightIsHidden
        ? onOpenSettings
            ? state.width === 0
                ? `hidden`
                : `!z-3000 bg-white !dark:bg-gray-950 h-48`
            : `!z-3000 !bg-transparent !shadow-none`
        : `!z-3000 !bg-transparent !shadow-none`;
    const messageButtonContainerClassName = rightIsHidden
        ? onOpenSettings
            ? undefined
            : `p-12 [&>a]:shadow-xl [&>a]:hover:shadow-medium`
        : `p-12 [&>a]:shadow-xl [&>a]:hover:shadow-medium`;
    const messageButton = contactLink && (<span className={cx('block pointer-events-auto', messageButtonContainerClassName)}>
      <a className={cx('[&_svg]:hover:fill-violet-500 cursor-pointer block p-12 w-48 h-48 transition-all bg-white dark:bg-gray-600 rounded-large-circle')} target="_blank" rel="nofollow" href={contactLink}>
        <span className="inline-block w-24 h-24">
          <MessageIcon />
        </span>
      </a>
    </span>);
    // const handleOpenMessage = () => {
    // }
    const bottom = (<ViewportLayout3Section state={state} left={leftIsHidden ? undefined : <div className="h-full w-full"/>} right={rightIsHidden ? undefined : (<div className="relative h-full w-full flex items-center justify-end">
            {messageButton}
          </div>)} middle={!middleOverlay && (<div className={cx('relative flex w-full justify-between items-center')}>
            <div className="w-48 h-48"/>
            {onOpenSettings && rightIsHidden ? (<span className="block p-12 [&_path]:hover:fill-violet-500 [&_path]:transition-all cursor-pointer w-48 h-48 transition-all pointer-events-auto" onClick={onOpenSettings}>
                <span className="inline-block w-24 h-24">
                  <GearIcon />
                </span>
              </span>) : (<div />)}
            {rightIsHidden ? messageButton : <div />}
          </div>)}/>);
    return (<AppLayout state={state} bottom={bottom} showBottom={rightIsHidden} bottomNavigationClassName={bottomNavigationClassName} {...meta}>
      <ViewportLayout3Section className="!top-48" state={state} scrollerRef={scrollerRef} middleClassName="bg-white dark:bg-gray-950" left={leftIsHidden || !isFontLoaded ? undefined : (<div className="h-full w-full bg-gray-100 dark:bg-gray-900">
              {left}
            </div>)} right={rightIsHidden || !isFontLoaded ? undefined : (<div className="h-full w-full bg-gray-100 dark:bg-gray-900">
              {right}
            </div>)} middle={isFontLoaded ? children : <Loading />} middleOverlay={middleOverlay}/>
    </AppLayout>);
}
//# sourceMappingURL=AppCenter.jsx.map