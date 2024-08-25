'use client';
import React from 'react';
import T from '../component/Text';
import List from '../component/List';
export default function Gloss({ script = 'latin', original, native, literal, english, }) {
    return (<List.Item>
      {native && (<T tag="div" className="font-bold text-lg">
          {native}
        </T>)}
      <T tag="div" className="font-bold text-lg">
        {original}
      </T>
      {literal && (<T tag="div" className="text-base">
          {literal}
        </T>)}
      <T tag="div" className="text-base text-gray-600 italic">
        {english}
      </T>
    </List.Item>);
}
//# sourceMappingURL=Gloss.jsx.map