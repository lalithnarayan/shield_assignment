import {
  addDays,
  addMonths,
  addYears,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  isAfter,
  isBefore,
  isEqual,
  set,
  setMonth,
  setYear,
  startOfMonth,
  startOfToday,
  startOfWeek,
  subMonths,
  subYears,
} from 'date-fns'
import { useCallback, useEffect, useMemo, useState } from 'react'

export enum Month {
  JANUARY,
  FEBRUARY,
  MARCH,
  APRIL,
  MAY,
  JUNE,
  JULY,
  AUGUST,
  SEPTEMBER,
  OCTOBER,
  NOVEMBER,
  DECEMBER,
}

export enum Day {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}

export interface DateInfo {
  date: Date
  message?: string
  disabled?: boolean
}

const popularTimeZones = [
  { name: 'UTC', offset: 'UTC+0' },
  { name: 'America/New_York', offset: 'UTC-5' }, // Eastern Time (US & Canada)
  { name: 'America/Los_Angeles', offset: 'UTC-8' }, // Pacific Time (US & Canada)
  { name: 'America/Chicago', offset: 'UTC-6' }, // Central Time (US & Canada)
  { name: 'America/Denver', offset: 'UTC-7' }, // Mountain Time (US & Canada)
  { name: 'Europe/London', offset: 'UTC+0' }, // Greenwich Mean Time
  { name: 'Europe/Paris', offset: 'UTC+1' }, // Central European Time
  { name: 'Europe/Berlin', offset: 'UTC+1' }, // Central European Time
  { name: 'Asia/Tokyo', offset: 'UTC+9' }, // Japan Standard Time
  { name: 'Asia/Calcutta', offset: 'UTC+5:30' }, // India Standard Time
  { name: 'Asia/Dubai', offset: 'UTC+4' }, // Gulf Standard Time
  { name: 'Australia/Sydney', offset: 'UTC+10' }, // Australian Eastern Standard Time
  { name: 'America/Toronto', offset: 'UTC-5' }, // Eastern Time (Canada)
  { name: 'America/Sao_Paulo', offset: 'UTC-3' }, // Brasilia Standard Time
  { name: 'Asia/Singapore', offset: 'UTC+8' }, // Singapore Standard Time
]

export interface Options {
  weekStartsOn?: Day
  viewing?: Date
  selected?: Date[]
  numberOfMonths?: number
  timezone?: string
  minSelectableDate?: Date
  maxSelectableDate?: Date
  maxRangeDays?: number
  dateInfo?: DateInfo[]
  disableWeekends?: boolean
  onChange?: (selected: Date[], tz: string) => void
  timezones?: { name: string; offset: string }[]
}

export interface Returns {
  clearTime: (date: Date) => Date
  inRange: (date: Date, min: Date, max: Date) => boolean
  viewing: Date
  setViewing: React.Dispatch<React.SetStateAction<Date>>
  viewToday: () => void
  viewMonth: (month: Month) => void
  viewPreviousMonth: () => void
  viewNextMonth: () => void
  viewYear: (year: number) => void
  viewPreviousYear: () => void
  viewNextYear: () => void
  selected: Date[]
  setSelected: React.Dispatch<React.SetStateAction<Date[]>>
  clearSelected: () => void
  isSelected: (date: Date) => boolean
  select: (date: Date | Date[], replaceExisting?: boolean) => void
  deselect: (date: Date | Date[]) => void
  toggle: (date: Date, replaceExisting?: boolean) => void
  selectRange: (start: Date, end: Date, replaceExisting?: boolean) => void
  deselectRange: () => void
  calendar: Date[][][]
  timezone: string
  setTimezone: React.Dispatch<React.SetStateAction<string>>
  formatDate: (date: Date) => string
  error: string | null
  getDateInfo: (date: Date) => { message?: string; disabled: boolean } | undefined
  isDateSelectable: (date: Date) => boolean
  maxRangeDays: number
  timezones?: { name: string; offset: string }[]
}

const clearTime = (date: Date) => set(date, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })

const inRange = (date: Date, min: Date, max: Date) =>
  (isEqual(date, min) || isAfter(date, min)) && (isEqual(date, max) || isBefore(date, max))

export const useCalendar = ({
  weekStartsOn = Day.SUNDAY,
  viewing: initialViewing = new Date(),
  selected: initialSelected = [],
  numberOfMonths = 1,
  timezone: initialTimezone = 'Europe/Moscow',
  minSelectableDate,
  maxSelectableDate = addDays(startOfToday(), 90),
  maxRangeDays = 10,
  dateInfo = [],
  disableWeekends = false,
  onChange,
  timezones,
}: // maxRangeDays = 10
Options = {}): Returns => {
  // State declarations.
  const [viewing, setViewing] = useState<Date>(initialViewing)
  const [selected, setSelectedInternal] = useState<Date[]>(initialSelected.map(clearTime))
  const [timezone, setTimezone] = useState<string>(initialTimezone)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setTimezone(timeZone)
  }, [])

  // isDateSelectable: returns a boolean indicating if the date can be selected.
  const isDateSelectable = useCallback(
    (date: Date): boolean => {
      const d = clearTime(date)
      if (minSelectableDate && isBefore(d, clearTime(minSelectableDate))) return false
      if (maxSelectableDate && isAfter(d, clearTime(maxSelectableDate))) return false
      if (disableWeekends && (d.getDay() === 0 || d.getDay() === 6)) return false
      const customInfo = dateInfo.find((i) => isEqual(clearTime(i.date), d))
      if (customInfo && customInfo.disabled) return false
      return true
    },
    [minSelectableDate, maxSelectableDate, disableWeekends, dateInfo],
  )

  // isSelected: returns true if the date is in the selection.
  const isSelected = (day: Date) => {
    if (selected.length === 2) {
      // Sort to ensure correct order.
      const [start, end] = selected.sort((a, b) => a.getTime() - b.getTime())
      return (
        clearTime(day).getTime() >= clearTime(start).getTime() && clearTime(day).getTime() <= clearTime(end).getTime()
      )
    }
    // If only one date is selected, check for equality.
    return selected.some((d) => clearTime(d).getTime() === clearTime(day).getTime())
  }

  // updateSelected helper calls onChange if provided.
  const updateSelected = (newSelection: Date[] | ((prev: Date[]) => Date[])) => {
    setSelectedInternal(newSelection)
    if (typeof newSelection !== 'function' && onChange) {
      onChange(newSelection, timezone)
    }
  }

  const select = useCallback(
    (date: Date | Date[], replaceExisting?: boolean) => {
      const dates = (Array.isArray(date) ? date : [date]).map(clearTime)
      if (!dates.every(isDateSelectable)) {
        setError('One or more selected dates are out of range or disabled.')
        return
      }
      setError(null)
      if (replaceExisting) {
        updateSelected(dates)
      } else {
        updateSelected((prev) => prev.concat(dates))
      }
    },
    [isDateSelectable],
  )

  const deselect = useCallback(
    (date: Date | Date[]) =>
      updateSelected((prev) =>
        Array.isArray(date)
          ? prev.filter((s) => !date.map((d) => d.getTime()).includes(s.getTime()))
          : prev.filter((s) => !isEqual(s, date)),
      ),
    [],
  )

  const toggle = useCallback(
    (date: Date, replaceExisting?: boolean) => (isSelected(date) ? deselect(date) : select(date, replaceExisting)),
    [isSelected, deselect, select],
  )

  const selectRange = useCallback(
    (start: Date, end: Date, replaceExisting?: boolean) => {
      // First, ensure that start is always before end
      const [sortedStart, sortedEnd] = start <= end ? [start, end] : [end, start]
      // Check if the first and last date are selectable
      if (!isDateSelectable(clearTime(sortedStart)) || !isDateSelectable(clearTime(sortedEnd))) {
        setError('Either the start or end date is not selectable.')
        return
      }

      const fullRange = eachDayOfInterval({ start: clearTime(sortedStart), end: clearTime(sortedEnd) })
      const filteredRange = fullRange.filter(isDateSelectable)

      // Check if any date in the range is selectable
      if (filteredRange.length === 0) {
        setError('No selectable dates in the selected range.')
        return
      }

      // Check the maximum range limit
      if (maxRangeDays !== undefined && filteredRange.length > maxRangeDays) {
        setError(`Cannot select more than ${maxRangeDays} days.`)
        return
      }
      console.log(error)
      setError(null)
      updateSelected([sortedStart, sortedEnd])
    },
    [isDateSelectable, maxRangeDays, updateSelected],
  )

  const deselectRange = useCallback(() => {
    updateSelected([])
  }, [])

  const calendar = useMemo<Date[][][]>(
    () =>
      eachMonthOfInterval({
        start: startOfMonth(viewing),
        end: endOfMonth(addMonths(viewing, numberOfMonths - 1)),
      }).map((month) =>
        eachWeekOfInterval(
          {
            start: startOfMonth(month),
            end: endOfMonth(month),
          },
          { weekStartsOn },
        ).map((week) =>
          eachDayOfInterval({
            start: startOfWeek(week, { weekStartsOn }),
            end: endOfWeek(week, { weekStartsOn }),
          }),
        ),
      ),
    [viewing, weekStartsOn, numberOfMonths],
  )

  const formatDate = useCallback(
    (date: Date) =>
      new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(date),
    [timezone],
  )

  const getDateInfo = useCallback(
    (date: Date) => {
      const normalized = clearTime(date)
      const customInfo = dateInfo.find((i) => isEqual(clearTime(i.date), normalized))
      if (customInfo) {
        return { message: customInfo.message, disabled: !!customInfo.disabled }
      }
      if (disableWeekends && (normalized.getDay() === 0 || normalized.getDay() === 6)) {
        return { message: 'Weekends are disabled', disabled: true }
      }

      // if (selected.length > 0 && maxRangeDays !== undefined) {
      //   const startDate = clearTime(selected[0]);
      //   const maxDate = addDays(startDate, maxRangeDays); // Include start day in count
      //   if (normalized > maxDate) {
      //     return { message: `Cannot select date beyond ${maxRangeDays} days from the start date`, disabled: true };
      //   }
      // }
      return undefined
    },
    [dateInfo, disableWeekends, selected],
  )

  const getAllTimeZones = () => {
    return Array.isArray(timezones) ? timezones : popularTimeZones
  }

  return {
    clearTime,
    inRange,
    viewing,
    setViewing,
    viewToday: useCallback(() => setViewing(startOfToday()), [setViewing]),
    viewMonth: useCallback((month: Month) => setViewing((v) => setMonth(v, month)), []),
    viewPreviousMonth: useCallback(() => setViewing((v) => subMonths(v, 1)), []),
    viewNextMonth: useCallback(() => setViewing((v) => addMonths(v, 1)), []),
    viewYear: useCallback((year: number) => setViewing((v) => setYear(v, year)), []),
    viewPreviousYear: useCallback(() => setViewing((v) => subYears(v, 1)), []),
    viewNextYear: useCallback(() => setViewing((v) => addYears(v, 1)), []),
    selected,
    setSelected: setSelectedInternal,
    clearSelected: () => updateSelected([]),
    isSelected,
    select,
    deselect,
    toggle,
    selectRange,
    deselectRange,
    calendar,
    timezone,
    setTimezone,
    formatDate,
    error,
    getDateInfo,
    isDateSelectable,
    maxRangeDays,
    timezones: getAllTimeZones(),
  }
}
