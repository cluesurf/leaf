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
import React, { useEffect, useLayoutEffect, useRef, useState, } from 'react';
import { useResizeObserver } from 'usehooks-ts';
const SVG = (_a) => {
    var _b, _c;
    var { className, width, height, children, style: divStyle = {} } = _a, props = __rest(_a, ["className", "width", "height", "children", "style"]);
    const [aspectRatio, setAspectRatio] = useState(1);
    const ref = useRef(null);
    const svgRef = useRef(null);
    const [svgBBox, setSvgBBox] = useState();
    const { width: divWidth = 0, height: divHeight = 0 } = useResizeObserver({
        ref,
    });
    const [actualWidth, setWidth] = useState(width);
    const [actualHeight, setHeight] = useState(height);
    useLayoutEffect(() => {
        const typeW = typeof width;
        const typeH = typeof height;
        if (typeH === 'undefined') {
            if (typeW === 'number') {
                setHeight(width / aspectRatio);
            }
            else if (typeW === 'string') {
                setHeight(divWidth / aspectRatio);
            }
            else if (svgBBox) {
                setHeight(svgBBox.height);
            }
        }
        else {
            setHeight(height);
        }
        if (typeW === 'undefined') {
            if (typeH === 'number') {
                setWidth(height * aspectRatio);
            }
            else if (typeH === 'string') {
                setWidth(divHeight * aspectRatio);
            }
            else if (svgBBox) {
                setWidth(svgBBox.width);
            }
        }
        else {
            setWidth(width);
        }
    }, [width, height, aspectRatio, divWidth, divHeight, svgBBox]);
    useEffect(() => {
        if (svgRef.current) {
            const bbox = svgRef.current.getBBox();
            setAspectRatio(bbox.width / bbox.height);
            setSvgBBox(bbox);
        }
    }, [svgRef]);
    return (<div ref={ref} className="relative" style={Object.assign(Object.assign({}, divStyle), { width: actualWidth, height: actualHeight })} {...props}>
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${(_b = svgBBox === null || svgBBox === void 0 ? void 0 : svgBBox.width) !== null && _b !== void 0 ? _b : 0} ${(_c = svgBBox === null || svgBBox === void 0 ? void 0 : svgBBox.height) !== null && _c !== void 0 ? _c : 0}`}>
        <g 
    // transform={`translate=${}`}
    ref={svgRef}>
          {children}
        </g>
      </svg>
    </div>);
};
export default SVG;
//# sourceMappingURL=SVG.jsx.map