import React, { CSSProperties } from 'react';
import { InputColor } from './Input';
export type ItemViewInput = {
    isActive?: boolean;
    isSelected?: boolean;
    item: ItemInput;
    list: Array<ItemInput>;
    style?: CSSProperties;
};
export type ItemInput = {
    height?: number;
    value: string;
    search: string;
};
export default function Autocomplete({ value, onChange, labelled, placeholder, items, itemRenderer, listHeight, overscanRowCount, useDynamicItemHeight, itemHeight, showScrollingPlaceholder, clearable, id, className, renderItemToString, size, color, }: {
    color?: InputColor;
    className?: string;
    labelled?: boolean;
    size?: 'small' | 'large';
    renderItemToString: (item: ItemInput | null) => string;
    id?: string;
    value?: string;
    placeholder?: string;
    onChange: (val?: string) => void;
    items: Array<ItemInput>;
    itemRenderer: React.ComponentType<ItemViewInput>;
    listHeight?: number | string;
    overscanRowCount?: number;
    useDynamicItemHeight?: boolean;
    itemHeight?: number;
    showScrollingPlaceholder?: boolean;
    clearable?: boolean;
}): React.JSX.Element;
