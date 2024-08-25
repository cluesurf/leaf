export type ToastContext = {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
    color: string;
    setColor: (val: string) => void;
    content: React.ReactNode;
    setContent: (val: string) => void;
    duration: number;
    setDuration: (val: number) => void;
    open: (input: ToastOpen) => void;
};
export declare const ToastContext: import("react").Context<ToastContext>;
export type ToastOpen = {
    color?: string;
    duration?: number;
    content: React.ReactNode;
};
export declare function ToastProvider({ children, }: {
    children: React.ReactNode;
}): import("react").JSX.Element;
export declare function useToast(): ToastContext;
export default function Toast(): import("react").JSX.Element;
