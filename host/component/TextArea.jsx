import cx from 'classnames';
import React, { useEffect, useRef } from 'react';
import { getRoundedClass } from './Input';
export default function TextArea({ value, loading, labelled, className, onChange, autocomplete, autocorrect, spellCheck, bottomed, id, readOnly, autosize, }) {
    const rounded = getRoundedClass(labelled, bottomed);
    const ref = useRef(null);
    useEffect(() => {
        function textAreaAdjust(element) {
            element.style.height = '1px';
            element.style.height = 16 + element.scrollHeight + 'px';
        }
        if (autosize && ref.current) {
            textAreaAdjust(ref.current);
        }
    }, [autosize, ref]);
    return (<textarea id={id} ref={ref} readOnly={readOnly} autoComplete={autocomplete === false ? 'off' : undefined} autoCorrect="off" spellCheck={spellCheck === false ? false : undefined} onChange={onChange} className={cx(className, rounded, 'resize-none p-16 bg-gray-50 h-20vh w-full', loading ? 'opacity-50' : undefined)} value={value}/>);
}
//# sourceMappingURL=TextArea.jsx.map