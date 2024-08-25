import { NumberInputInput } from '../NumberInput';
export default function INumberInput({ onChange, onFocus, onBlur, id, ...input }: NumberInputInput & {
    id: string;
}): import("react").JSX.Element;
