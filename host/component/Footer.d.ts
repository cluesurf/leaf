import React from 'react';
type FooterInput = {
    children: React.ReactNode;
};
type FooterItemInput = React.ComponentPropsWithoutRef<'a'> & {
    link: string;
    text: string;
};
declare function FooterItem({ link, text, ...props }: FooterItemInput): React.JSX.Element;
declare function Footer({ children }: FooterInput): React.JSX.Element;
declare namespace Footer {
    var Item: typeof FooterItem;
}
export default Footer;
