import React from 'react';
declare function Copy({ text }: {
    text?: any;
}): React.JSX.Element;
declare namespace Copy {
    var Area: ({ text, children, }: {
        children: React.ReactNode;
        text?: string;
    }) => React.JSX.Element;
}
export default Copy;
