import React from 'react';
import cx from 'classnames';
export default function Dots({ className }) {
    return (<div className={cx(className, 'lds-ellipsis')}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>);
}
//# sourceMappingURL=Dots.jsx.map