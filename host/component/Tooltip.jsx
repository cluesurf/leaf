import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
export default function Tooltip({ children, place, id, }) {
    return (<ReactTooltip id={id} place={place} className="will-change-transform-opacity bg-gray-50 rounded-sm p-16">
      {children}
    </ReactTooltip>);
}
//# sourceMappingURL=Tooltip.jsx.map