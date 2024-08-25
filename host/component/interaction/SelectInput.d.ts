import { NativeSelectInput } from '../NativeSelect';
export default function ISelectInput<T extends string>({ onFocus, onBlur, onChange, id, ...input }: NativeSelectInput<T> & {
    id: string;
}): import("react").JSX.Element;
