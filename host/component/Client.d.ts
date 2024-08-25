import React from 'react';
import { AppSettings } from '../hook/useAppSettings';
export default function Client({ settings, children, }: {
    children: React.ReactNode;
    settings: AppSettings;
}): React.JSX.Element;
