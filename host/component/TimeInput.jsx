import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import NumberInput from '../component/NumberInput';
import Field from '../component/Field';
import Label from '../component/Label';
import NativeSelect from '../component/NativeSelect';
const MONTH = {
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
};
const MONTH_LIST = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
];
export default function TimeInput(props) {
    var _a, _b, _c, _d, _e, _f, _g;
    const [atMaxDay, setAtMaxDay] = useState(false);
    const [meridium, setMeridium] = useState((_a = props.value) === null || _a === void 0 ? void 0 : _a.toFormat('a').toLowerCase());
    useEffect(() => {
        var _a;
        const atMax = Boolean(props.value && props.value.daysInMonth === props.value.get('day'));
        setAtMaxDay(atMax);
        setMeridium((_a = props.value) === null || _a === void 0 ? void 0 : _a.toFormat('a').toLowerCase());
    }, [props.value]);
    const handleChangeHour = (h) => {
        var _a;
        let l = props.value || DateTime.now();
        l = l.set({ hour: h });
        (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, l);
    };
    const handleChangeMinute = (m) => {
        var _a;
        let l = props.value || DateTime.now();
        l = l.set({ minute: m });
        (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, l);
    };
    const handleChangeDay = (d) => {
        var _a;
        let l = props.value || DateTime.now();
        l = l.set({ day: d });
        (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, l);
    };
    const handleChangeMonth = (m) => {
        var _a;
        let l = props.value || DateTime.now();
        l = l.set({ month: parseInt(m, 10) });
        (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, l);
    };
    const handleChangeMeridium = (v) => {
        var _a;
        let l = props.value || DateTime.now();
        if (v === 'am') {
            l = l.set({
                hour: l.get('hour') > 12 ? (l.get('hour') % 12) + 1 : l.get('hour'),
            });
        }
        else {
            l = l.set({
                hour: 12 + l.get('hour'),
            });
        }
        (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, l);
    };
    let hour = (_b = props.value) === null || _b === void 0 ? void 0 : _b.get('hour');
    if (props.is24Hour) {
        // hour = props.value?.get('hour')
    }
    else if (hour != null) {
        if (meridium === 'pm') {
            if (hour > 12) {
                hour = hour % 12;
            }
        }
        else if (hour === 0 || hour > 12) {
            hour = 12;
        }
    }
    return (<div id={props.id} className="flex flex-col gap-16">
      <div className="flex gap-16">
        <Field className="flex-1">
          <Label color={props.color}>Month</Label>
          <NativeSelect noArrow color={props.color} value={(_c = props.value) === null || _c === void 0 ? void 0 : _c.get('month')} onChange={handleChangeMonth}>
            {Object.keys(MONTH).map((month, i) => (<option key={month} value={i + 1}>
                {MONTH[month]}
              </option>))}
          </NativeSelect>
        </Field>
        <Field>
          <Label color={props.color}>Day</Label>
          <NumberInput className="!w-80" color={props.color} onChange={handleChangeDay} value={atMaxDay
            ? (_d = props.value) === null || _d === void 0 ? void 0 : _d.get('daysInMonth')
            : (_e = props.value) === null || _e === void 0 ? void 0 : _e.get('day')} step={1} min={1} max={(_f = props.value) === null || _f === void 0 ? void 0 : _f.get('daysInMonth')}/>
        </Field>
      </div>
      <div className="flex gap-16">
        <Field>
          <Label color={props.color}>Hour</Label>
          <NumberInput className="!w-80" color={props.color} value={hour} step={1} min={props.is24Hour ? 0 : 1} max={props.is24Hour ? 23 : 12} onChange={handleChangeHour}/>
        </Field>

        <Field>
          <Label color={props.color}>Minute</Label>
          <NumberInput className="!w-80" color={props.color} value={(_g = props.value) === null || _g === void 0 ? void 0 : _g.get('minute')} step={1} min={0} max={59} onFormat={n => String(n).padStart(2, '0')} onChange={handleChangeMinute}/>
        </Field>
        {!props.is24Hour && (<Field className="flex-1">
            <Label color={props.color}>Half</Label>
            <NativeSelect noArrow value={meridium} onChange={handleChangeMeridium} color={props.color}>
              <option value="am">am</option>
              <option value="pm">pm</option>
            </NativeSelect>
          </Field>)}
      </div>
    </div>);
}
//# sourceMappingURL=TimeInput.jsx.map