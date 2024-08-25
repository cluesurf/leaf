import { TextInputInput } from '../TextInput';
export default function ITextInput({ onChange, onFocus, onBlur, id, ...input }: TextInputInput & {
    id: string;
}): import("react").JSX.Element;
