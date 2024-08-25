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
import React from 'react';
function Nav({ children }) {
    return (<div className="items-center flex-col gap-32 justify-center py-32 px-16">
      {children}
    </div>);
}
function Container({ children }) {
    return <footer className="h-128 text-center">{children}</footer>;
}
function FooterLink(_a) {
    var { children } = _a, props = __rest(_a, ["children"]);
    return (<a {...props} className={`hover:opacity-70 text-base transition-all`}>
      {children}
    </a>);
}
function Ul({ children }) {
    return (<ul className="items-center flex flex-wrap gap-16 text-base justify-center list-none">
      {children}
    </ul>);
}
function FooterItem(_a) {
    var { link, text } = _a, props = __rest(_a, ["link", "text"]);
    return (<li>
      <FooterLink href={link} {...props}>
        {text}
      </FooterLink>
    </li>);
}
Footer.Item = FooterItem;
export default function Footer({ children }) {
    return (<Container>
      <Nav>
        <Ul>{children}</Ul>
      </Nav>
    </Container>);
}
//# sourceMappingURL=Footer.jsx.map