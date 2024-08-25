import { useCallback, useEffect, useState } from 'react';
import pick from 'lodash/pick';
import { usePageSettings } from './usePageSettings';
export default function useSettingsYaml(base) {
    const [YAML, setYAML] = useState();
    const [code, setCode] = useState();
    const [keys, setKeys] = useState([]);
    const { stored, setStored } = usePageSettings();
    const onChange = useCallback((code) => {
        if (code) {
            setStored(pick(YAML.load(code), keys));
        }
    }, [YAML]);
    useEffect(() => {
        setKeys(Object.keys(base));
        import('js-yaml').then(mod => setYAML(mod.default));
    }, []);
    useEffect(() => {
        if (!YAML) {
            return;
        }
        setCode(YAML.dump(pick(stored, keys)));
    }, [YAML, stored]);
    return [code, onChange];
}
//# sourceMappingURL=useSettingsYaml.js.map