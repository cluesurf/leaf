import { useEffect } from 'react';
export default function useScrollToHash() {
    useEffect(() => {
        if (window.location.hash) {
            const el = document.querySelector(window.location.hash);
            if (el) {
                const main = document.querySelector('main');
                main.scrollTop = el.offsetTop;
                setTimeout(() => {
                    main.scrollTo({
                        top: el.offsetTop,
                    });
                }, 250);
            }
        }
    }, []);
}
//# sourceMappingURL=useScrollToHash.js.map