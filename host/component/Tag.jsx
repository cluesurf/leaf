import React from 'react';
import cx from 'classnames';
import T from '../component/Text';
export const TAG_COLOR = {
    blue: 'bg-blue-500 text-white dark:bg-blue-800 dark:text-blue-200',
    green: 'bg-emerald-500 text-white dark:bg-emerald-800 dark:text-emerald-200',
    gray: 'bg-gray-500 text-white dark:bg-gray-800 dark:text-gray-200',
};
export default function Tag({ children, className, color }) {
    return (<T className={cx(className, color && TAG_COLOR[color], 'relative inline-block text-xs leading-1-2 rounded-large-circle py-2 px-8 h-fit font-normal text-nowrap')}>
      {children}
    </T>);
}
//# sourceMappingURL=Tag.jsx.map