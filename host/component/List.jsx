'use client';
import Link from 'next/link';
import React from 'react';
import TriangleRightIcon from './icon/TriangleRight';
const List = ({ children }) => {
    return (<ul className="shadow-normal mt-16 mb-32 list-none flex flex-col">
      {children}
    </ul>);
};
export default List;
List.Item = Item;
export function Item({ href, target, children, }) {
    return href ? (<li className="font-medium list-none block even:bg-gray-100 bg-gray-200 font-NotoSansMono hover:opacity-70 transition-all text-lg">
      <Link className="flex w-full justify-between p-16 no-underline" href={href} target={target}>
        <span>{children}</span>
        <span className="w-32 h-32 p-4">
          <TriangleRightIcon />
        </span>
      </Link>
    </li>) : (<li className="font-medium list-none block even:bg-gray-100 bg-gray-200 p-16 font-NotoSansMono text-lg">
      {children}
    </li>);
}
//# sourceMappingURL=List.jsx.map