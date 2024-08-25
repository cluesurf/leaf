import React from 'react';
import CloseIcon from '../icon/Close';
export const NavigationContext = React.createContext((data) => {
    return;
});
export function checkScrollDirectionIsUp(event) {
    return event.deltaY < 0;
}
export function NavigationOverlay({ triggerPosition, children, onClose, }) {
    return (<div className={`bg-gray-100 dark:bg-gray-700 overflow-auto fixed w-full z-4000 ${triggerPosition === 'bottom'
            ? 'top-0 bottom-0'
            : 'top-0 bottom-0'}`}>
      <div onClick={onClose} className="p-12 absolute right-0 top-0 cursor-pointer z-4200 [&_path]:hover:fill-violet-500 [&_path]:transition-all">
        <span className="inline-block w-24 h-24">
          <CloseIcon />
        </span>
      </div>
      {children}
    </div>);
}
export function bindTrigger(form, trigger, showPanel, element) {
    if (form === 'action') {
        return trigger;
    }
    if (!element) {
        return trigger;
    }
    const handle = (e) => {
        e.stopPropagation();
        e.preventDefault();
        showPanel(element());
    };
    return (<button onClick={handle} className="w-fit cursor-pointer inline-block">
      {trigger}
    </button>);
}
//# sourceMappingURL=utility.jsx.map