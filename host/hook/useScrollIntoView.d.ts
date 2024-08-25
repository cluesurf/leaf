import React from 'react';
export default function useScrollIntoView(dependencies?: React.DependencyList): (node: HTMLElement) => () => void;
