import React from 'react';
export declare function useNavigation({ onMenuOpen, bottom, top, up, logo, bottomNavigationClassName, }?: {
    bottom?: React.ReactNode;
    onMenuOpen?: () => void;
    top?: React.ReactNode;
    up?: string;
    logo?: React.ReactNode;
    bottomNavigationClassName?: string;
}): {
    top: React.JSX.Element;
    bottom: React.JSX.Element;
};
