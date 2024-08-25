import { BlockQuote } from './Content';
import React from 'react';
import Info from './icon/Info';
import Alert from './icon/Alert';
import Check from './icon/Check';
const COLOR_BG = {
    error: 'bg-rose-500',
    info: 'bg-blue-400',
    try: 'bg-emerald-400',
    warn: 'bg-yellow-200',
};
const COLOR_FG = {
    error: 'text-gray-50',
    info: 'text-gray-50',
    try: 'text-gray-900',
    warn: 'text-gray-900',
};
const ICON = {
    error: Alert,
    info: Info,
    warn: Alert,
    try: Check,
};
function Container({ children, form }) {
    // const Icon = ICON[form]
    return (<BlockQuote className={`${COLOR_BG[form]} rounded-sm`} style={{ fontStyle: 'normal' }}>
      <span className={`flex gap-8 items-center ${COLOR_FG[form]}`}>
        {/* {Icon && (
          <span className="w-24 h-24 inline-block">
            <Icon />
          </span>
        )} */}
        <span className="bg-inherit text-inherit">{children}</span>
      </span>
    </BlockQuote>);
}
export default function Note({ children, form = 'info' }) {
    return <Container form={form}>{children}</Container>;
}
//# sourceMappingURL=Note.jsx.map