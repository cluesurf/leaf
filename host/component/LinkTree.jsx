import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import cx from 'classnames';
export function LinkTreeHead({ text }) {
    return (<h5 className="mt-24 mb-16 px-16 text-xs opacity-70 first:mt-0 first:pt-16">
      {text}
    </h5>);
}
export function LinkTreeLink({ text, link, lead, show, nest, side, }) {
    const ref = useRef(null);
    useEffect(() => {
        var _a;
        if (show) {
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({
                behavior: 'auto',
                block: 'center',
                inline: 'center',
            });
        }
    }, [show, ref]);
    return (<>
      <Link href={link} ref={ref} className={cx(lead ? 'text-violet-400' : undefined, `block text-xs font-bold hover:bg-gray-200 hover:text-violet-400 dark:hover:bg-gray-800 transition-all duration-200 px-16 py-8 first:pt-16`)}>
        <span className="text-xs" style={{ marginLeft: (side - 1) * 16 }}>
          {text}
        </span>
      </Link>
      {nest && (<LinkTree show={show} nest={nest} side={side + 1}/>)}
    </>);
}
export default function LinkTree({ nest, show, side = 1, }) {
    const [leadLink, setLeadLink] = useState();
    useEffect(() => {
        const lead = typeof window !== 'undefined' && window.location.pathname;
        if (lead) {
            setLeadLink(lead);
        }
    }, []);
    if (!nest) {
        return null;
    }
    return (<>
      {nest.map((tree, i) => {
            var _a;
            if (tree.form === 'head' && tree.text) {
                return (<React.Fragment key={i}>
              <LinkTreeHead text={tree.text}/>
              {Boolean((_a = tree.nest) === null || _a === void 0 ? void 0 : _a.length) && (<LinkTree nest={tree.nest} show={show}/>)}
            </React.Fragment>);
            }
            else if (tree.link && tree.text) {
                return (<LinkTreeLink key={i} lead={tree.link === leadLink} link={tree.link} text={tree.text} show={show && tree.link === leadLink} nest={tree.nest} side={side}/>);
            }
        })}
    </>);
}
//# sourceMappingURL=LinkTree.jsx.map