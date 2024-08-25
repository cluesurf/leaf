import { useEffect } from 'react';
import SingletonRouter from 'next/router';
function saveScrollPos(url) {
    const scrollPos = { x: window.scrollX, y: window.scrollY };
    sessionStorage.setItem(url, JSON.stringify(scrollPos));
}
function restoreScrollPos(url) {
    var _a;
    const scrollPos = JSON.parse((_a = sessionStorage.getItem(url)) !== null && _a !== void 0 ? _a : '{ "x": 0, "y": 0 }');
    if (scrollPos) {
        window.scrollTo(scrollPos.x, scrollPos.y);
    }
}
export default function useScrollRestoration(router) {
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            let shouldScrollRestore = false;
            window.history.scrollRestoration = 'manual';
            restoreScrollPos(router.asPath);
            const onRouteChangeStart = () => {
                saveScrollPos(router.asPath);
            };
            const onRouteChangeComplete = (url) => {
                if (shouldScrollRestore) {
                    shouldScrollRestore = false;
                    restoreScrollPos(url);
                }
            };
            SingletonRouter.events.on('routeChangeStart', onRouteChangeStart);
            SingletonRouter.events.on('routeChangeComplete', onRouteChangeComplete);
            SingletonRouter.beforePopState(() => {
                shouldScrollRestore = true;
                return true;
            });
            return () => {
                SingletonRouter.events.off('routeChangeStart', onRouteChangeStart);
                SingletonRouter.events.off('routeChangeComplete', onRouteChangeComplete);
                SingletonRouter.beforePopState(() => true);
            };
        }
    }, [router]);
}
//# sourceMappingURL=useScrollRestoration.js.map