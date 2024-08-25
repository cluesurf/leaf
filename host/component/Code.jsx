import { common, createStarryNight } from '@wooorm/starry-night';
import cx from 'classnames';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import React, { useEffect, useState } from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
let starryNight;
export default function Code({ scope = 'source.ts', vibe = 'formal', tint = 'gray', children, className, preClassName, }) {
    const [sn, setStarryNight] = useState(starryNight);
    const [code, setCode] = useState(children);
    useEffect(() => {
        createStarryNight(common).then(sn => {
            starryNight = sn;
            setStarryNight(sn);
        });
    }, []);
    useEffect(() => {
        if (!sn) {
            return;
        }
        const tree = sn.highlight(children, scope);
        const reactNode = toJsxRuntime(tree, {
            Fragment,
            jsx: jsx,
            jsxs: jsxs,
        });
        setCode(reactNode);
    }, [sn, scope, children]);
    return (<pre className={cx(preClassName, `code`, `code-vibe-${vibe}`, `overflow-x-auto`, `code-tint-${tint}`)}>
      <code className={cx(`block relative p-16`, className)}>
        {code}
      </code>
    </pre>);
}
//# sourceMappingURL=Code.jsx.map