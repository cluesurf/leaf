import React, { useLayoutEffect, useRef } from 'react';
import Dots from './Dots';
export default function Loading() {
    const ref = useRef(null);
    useLayoutEffect(() => {
        const div = ref.current;
        if (!div) {
            return;
        }
        const timer = setTimeout(() => {
            div.style.opacity = '1';
        }, 1200);
        return () => {
            clearTimeout(timer);
        };
    }, [ref]);
    return (<div className="flex h-full w-full justify-center items-center">
      <div ref={ref} className="scale-[2.0] transition-all duration-200 opacity-0">
        <Dots className="invert"/>
      </div>
    </div>);
}
//# sourceMappingURL=Loading.jsx.map