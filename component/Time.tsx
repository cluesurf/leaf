import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'

export type TimeInput = {
  value?: DateTime
  autoUpdate?: boolean
  formatVerbose?: (date: DateTime) => string
  format?: (date: DateTime) => string
}

export default function Time({
  value,
  autoUpdate,
  formatVerbose,
  format,
}: TimeInput) {
  const [date, setDate] = useState<DateTime | undefined>(value)

  useEffect(() => {
    const update = () => {
      setDate(DateTime.fromJSDate(new Date()))
    }

    const timer = autoUpdate ? setInterval(update, 5 * 1000) : undefined

    if (autoUpdate) {
      update()
    }

    return () => {
      clearInterval(timer)
    }
  }, [autoUpdate])

  return (
    <time
      dateTime={
        date && formatVerbose
          ? formatVerbose(date)
          : date?.toISODate() ?? undefined
      }
    >
      {date && format
        ? format(date)
        : date?.toLocaleString(DateTime.DATETIME_FULL)}
    </time>
  )
}
