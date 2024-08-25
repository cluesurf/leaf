import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
export declare function TabsRoot({ className, defaultValue, values, cycle, ...props }: Tabs.TabsProps & {
    cycle?: boolean;
    values: Array<string>;
}): React.JSX.Element;
export declare function TabsList({ className, ...props }: Tabs.TabsListProps): React.JSX.Element;
export declare function TabsTrigger({ className, ...props }: Tabs.TabsTriggerProps): React.JSX.Element;
export declare function TabsContent({ className, ...props }: Tabs.TabsContentProps): React.JSX.Element;
