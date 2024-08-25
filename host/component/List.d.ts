import React from 'react';
declare const List: {
    ({ children }: {
        children: React.ReactNode;
    }): React.JSX.Element;
    Item: typeof Item;
};
export default List;
export declare function Item({ href, target, children, }: {
    href?: string;
    target?: string;
    children: React.ReactNode;
}): React.JSX.Element;
