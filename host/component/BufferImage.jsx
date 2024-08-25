var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from 'react';
export const PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
export default function BufferImage(_a) {
    var { content, maxWidth, maxHeight, naturalWidth } = _a, props = __rest(_a, ["content", "maxWidth", "maxHeight", "naturalWidth"]);
    const [string, setString] = useState(PIXEL);
    const ref = useRef(null);
    useEffect(() => {
        if (!ref.current) {
            return;
        }
        if (naturalWidth) {
            ref.current.width = ref.current.naturalWidth * naturalWidth;
        }
    }, [ref, naturalWidth]);
    useEffect(() => {
        let blob;
        const c = content;
        if (c instanceof ArrayBuffer) {
            blob = new Blob([c]);
        }
        else {
            blob = c;
        }
        const r = new FileReader();
        r.onload = () => {
            setString(r.result);
        };
        if (blob) {
            r.readAsDataURL(blob);
        }
        // blob?.arrayBuffer().then(buffer => {
        //   const psdFile = Psd.parse(buffer)
        //   const context = canvasElement.getContext('2d')
        //   const compositeBuffer = await psdFile.composite()
        //   const imageData = new ImageData(
        //     compositeBuffer as Uint8ClampedArray,
        //     psdFile.width as number,
        //     psdFile.height as number,
        //   )
        //   setShowCanvas(true)
        //   canvasElement.width = psdFile.width
        //   canvasElement.height = psdFile.height
        //   context?.putImageData(imageData, 0, 0)
        // })
    }, [content]);
    return (<img {...props} src={string} ref={ref}/>);
}
//# sourceMappingURL=BufferImage.jsx.map