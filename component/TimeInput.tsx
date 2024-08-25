import { useEffect, useState } from 'react'
import { InputColor } from '~/component/Input'
import { DateTime } from 'luxon'
import NumberInput from '~/component/NumberInput'
import Field from '~/component/Field'
import Label from '~/component/Label'
import NativeSelect from '~/component/NativeSelect'

export type TimeInputInput = {
  labelled?: boolean
  bottomed?: boolean
  color?: InputColor
  value?: DateTime | null | undefined
  is24Hour?: boolean
  onChange?: (date: DateTime) => void
  id?: string
}

const MONTH: Record<string, string> = {
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
}

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
]

export type Month = keyof typeof MONTH

export default function TimeInput(props: TimeInputInput) {
  const [atMaxDay, setAtMaxDay] = useState<boolean>(false)
  const [meridium, setMeridium] = useState<string | undefined>(
    props.value?.toFormat('a').toLowerCase(),
  )

  useEffect(() => {
    const atMax = Boolean(
      props.value && props.value.daysInMonth === props.value.get('day'),
    )
    setAtMaxDay(atMax)
    setMeridium(props.value?.toFormat('a').toLowerCase())
  }, [props.value])

  const handleChangeHour = (h: number) => {
    let l = props.value || DateTime.now()
    l = l.set({ hour: h })
    props.onChange?.(l)
  }

  const handleChangeMinute = (m: number) => {
    let l = props.value || DateTime.now()
    l = l.set({ minute: m })
    props.onChange?.(l)
  }

  const handleChangeDay = (d: number) => {
    let l = props.value || DateTime.now()
    l = l.set({ day: d })
    props.onChange?.(l)
  }

  const handleChangeMonth = (m: string) => {
    let l = props.value || DateTime.now()
    l = l.set({ month: parseInt(m, 10) })
    props.onChange?.(l)
  }

  const handleChangeMeridium = (v: string) => {
    let l = props.value || DateTime.now()
    if (v === 'am') {
      l = l.set({
        hour:
          l.get('hour') > 12 ? (l.get('hour') % 12) + 1 : l.get('hour'),
      })
    } else {
      l = l.set({
        hour: 12 + l.get('hour'),
      })
    }
    props.onChange?.(l)
  }

  let hour = props.value?.get('hour')
  if (props.is24Hour) {
    // hour = props.value?.get('hour')
  } else if (hour != null) {
    if (meridium === 'pm') {
      if (hour > 12) {
        hour = hour % 12
      }
    } else if (hour === 0 || hour > 12) {
      hour = 12
    }
  }

  return (
    <div
      id={props.id}
      className="flex flex-col gap-16"
    >
      <div className="flex gap-16">
        <Field className="flex-1">
          <Label color={props.color}>Month</Label>
          <NativeSelect
            noArrow
            color={props.color}
            value={props.value?.get('month')}
            onChange={handleChangeMonth}
          >
            {Object.keys(MONTH).map((month, i) => (
              <option
                key={month}
                value={i + 1}
              >
                {MONTH[month]}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field>
          <Label color={props.color}>Day</Label>
          <NumberInput
            className="!w-80"
            color={props.color}
            onChange={handleChangeDay}
            value={
              atMaxDay
                ? props.value?.get('daysInMonth')
                : props.value?.get('day')
            }
            step={1}
            min={1}
            max={props.value?.get('daysInMonth')}
          />
        </Field>
      </div>
      <div className="flex gap-16">
        <Field>
          <Label color={props.color}>Hour</Label>
          <NumberInput
            className="!w-80"
            color={props.color}
            value={hour}
            step={1}
            min={props.is24Hour ? 0 : 1}
            max={props.is24Hour ? 23 : 12}
            onChange={handleChangeHour}
          />
        </Field>

        <Field>
          <Label color={props.color}>Minute</Label>
          <NumberInput
            className="!w-80"
            color={props.color}
            value={props.value?.get('minute')}
            step={1}
            min={0}
            max={59}
            onFormat={n => String(n).padStart(2, '0')}
            onChange={handleChangeMinute}
          />
        </Field>
        {!props.is24Hour && (
          <Field className="flex-1">
            <Label color={props.color}>Half</Label>
            <NativeSelect
              noArrow
              value={meridium}
              onChange={handleChangeMeridium}
              color={props.color}
            >
              <option value="am">am</option>
              <option value="pm">pm</option>
            </NativeSelect>
          </Field>
        )}
      </div>
    </div>
  )
}
