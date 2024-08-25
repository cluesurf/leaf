'use client';
import React from 'react';
import Script from 'next/script';
import cx from 'classnames';
export default function Container({ children, }) {
    return (<html lang="en">
      <body className={cx(`w-full h-full min-w-screen min-h-screen`)}>
        <Script id="disable-scroll-restoration">{`window.history.scrollRestoration = "manual"`}</Script>
        {children}
        <div id="overlay"/>
      </body>
    </html>);
}
//# sourceMappingURL=Container.jsx.map