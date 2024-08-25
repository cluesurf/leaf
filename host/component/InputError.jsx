import React from 'react';
export default function InputError({ children, errorRef, }) {
    return (<div ref={errorRef} className="rounded-b-sm bg-rose-400 px-16 py-8 text-gray-50 whitespace-pre-wrap">
      {children}
    </div>);
}
//# sourceMappingURL=InputError.jsx.map