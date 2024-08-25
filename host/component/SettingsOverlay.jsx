import React, { useEffect, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import SwipeListener from 'swipe-listener';
export default function SettingsOverlay({ onHide, children, }) {
    const ref = useRef(null);
    const handleClickOutside = () => {
        onHide === null || onHide === void 0 ? void 0 : onHide();
    };
    useEffect(() => {
        const closeOnEscapePressed = (e) => {
            if (e.key === 'Escape') {
                onHide === null || onHide === void 0 ? void 0 : onHide();
            }
        };
        window.addEventListener('keydown', closeOnEscapePressed);
        window.addEventListener('resize', handleClickOutside);
        return () => {
            window.removeEventListener('keydown', closeOnEscapePressed);
            window.removeEventListener('resize', handleClickOutside);
        };
    }, []);
    useEffect(() => {
        if (!ref.current) {
            return;
        }
        const handleSwipe = (e) => {
            const directions = e.detail.directions;
            if (directions.bottom) {
                onHide === null || onHide === void 0 ? void 0 : onHide();
            }
        };
        const swipe = SwipeListener(ref.current);
        const el = ref.current;
        el.addEventListener('swipe', handleSwipe);
        return () => {
            el.removeEventListener('swipe', handleSwipe);
            swipe.off();
        };
    }, []);
    useOnClickOutside(ref, handleClickOutside);
    return (<div ref={ref} className="absolute shadow-3xl animate-fade-in-medium top-128 bottom-48 left-0 right-0">
      <div className="absolute bg-white dark:bg-gray-950 top-0 bottom-0 left-0 right-0"></div>
      <div className="h-full w-full overflow-y-auto pb-128">
        {children}
      </div>
    </div>);
}
//# sourceMappingURL=SettingsOverlay.jsx.map