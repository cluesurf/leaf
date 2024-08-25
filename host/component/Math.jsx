import React, { useEffect, useState } from 'react';
import KaTeX from 'katex';
import cx from 'classnames';
export default function Math({ className, children }) {
    const [formula, setFormula] = useState('');
    useEffect(() => {
        try {
            const output = KaTeX.renderToString(children, {
                displayMode: true,
                throwOnError: true,
            });
            if (output) {
                setFormula(output);
            }
        }
        catch (e) { }
    }, [children]);
    return (<InternalBlockMath className={className} html={formula}/>);
}
const InternalBlockMath = ({ className, html, }) => {
    return (<div className={cx('py-16', className)} role="math" dangerouslySetInnerHTML={{ __html: html }}/>);
};
Math.Inline = InlineMath;
export function InlineMath({ className, children }) {
    const [formula, setFormula] = useState('');
    useEffect(() => {
        try {
            const output = KaTeX.renderToString(children, {
                displayMode: false,
                throwOnError: true,
            });
            if (output) {
                setFormula(output);
            }
        }
        catch (e) { }
    }, [children]);
    return (<InternalInlineMath className={className} html={formula}/>);
}
const InternalInlineMath = ({ className, html, }) => {
    return (<span role="math" className={cx(`katex-inline`, className)} dangerouslySetInnerHTML={{ __html: html }}/>);
};
//# sourceMappingURL=Math.jsx.map