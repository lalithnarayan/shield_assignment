import { act, renderHook } from '@testing-library/react-hooks'
import { addDays, addYears, getYear, set, startOfToday, subYears } from 'date-fns'

import { Month, useCalendar } from './useCalendar'
import { describe, it, expect } from 'vitest'

const getDate = ({
  year = 1999,
  month = Month.NOVEMBER,
  date = 24,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}: {
  year?: number
  month?: number
  date?: number
  hours?: number
  minutes?: number
  seconds?: number
  milliseconds?: number
} = {}) => {
  return set(new Date(), { year, month, date, hours, minutes, seconds, milliseconds })
}

describe('helpers', () => {
  describe('clearTime', () => {
    it('returns a copy of the given date with the time set to 00:00:00:00', () => {
      const { result } = renderHook(() => useCalendar())

      const date = getDate({ hours: 7, minutes: 30 })

      expect(result.current.clearTime(date)).toStrictEqual(
        set(date, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }),
      )
    })
  })

  describe('inRange', () => {
    it('returns whether or not a date is between 2 other dates (inclusive)', () => {
      const { result } = renderHook(() => useCalendar())

      const date = getDate()
      const min = subYears(date, 1)
      const max = addYears(date, 1)

      expect(result.current.inRange(date, min, max)).toBe(true)
      expect(result.current.inRange(addYears(date, 10), min, max)).toBe(false)
    })
  })
})

describe('viewing', () => {
  describe('viewing', () => {
    it('returns the date represented in the calendar matrix', () => {
      const date = getDate()

      const { result } = renderHook(() => useCalendar({ viewing: date }))

      expect(result.current.viewing).toStrictEqual(date)
    })
  })

  describe('setViewing', () => {
    it('sets the date represented in the calendar matrix', () => {
      const { result } = renderHook(() => useCalendar())

      const date = getDate()

      act(() => result.current.setViewing(date))
      expect(result.current.viewing).toStrictEqual(date)
    })
  })

  describe('viewToday', () => {
    it('sets the viewing date to today', () => {
      const { result } = renderHook(() => useCalendar({ viewing: getDate({ year: 1999 }) }))

      act(() => result.current.viewToday())
      expect(result.current.viewing).toStrictEqual(startOfToday())
    })
  })

  describe('viewMonth', () => {
    it('sets the viewing date to the given month', () => {
      const date = getDate({ month: Month.JANUARY })

      const { result } = renderHook(() => useCalendar({ viewing: date }))

      act(() => result.current.viewMonth(Month.FEBRUARY))
      expect(result.current.viewing).toStrictEqual(set(date, { month: Month.FEBRUARY }))
    })
  })

  describe('viewPreviousMonth', () => {
    it('sets the viewing date to the month before the current', () => {
      const { result } = renderHook(() => useCalendar())

      const date = getDate({ month: Month.OCTOBER })

      act(() => result.current.setViewing(date))
      act(() => result.current.viewPreviousMonth())
      expect(result.current.viewing).toStrictEqual(set(date, { month: Month.SEPTEMBER }))
    })

    it('wraps to december of the previous year if the current month is january', () => {
      const { result } = renderHook(() => useCalendar())

      const date = getDate({ month: Month.JANUARY })

      act(() => result.current.setViewing(date))
      act(() => result.current.viewPreviousMonth())
      expect(result.current.viewing).toStrictEqual(set(date, { month: Month.DECEMBER, year: getYear(date) - 1 }))
    })
  })

  describe('viewNextMonth', () => {
    it('sets the viewing date to the month after the current', () => {
      const { result } = renderHook(() => useCalendar())

      const date = getDate({ month: Month.OCTOBER })

      act(() => result.current.setViewing(date))
      act(() => result.current.viewNextMonth())
      expect(result.current.viewing).toStrictEqual(set(date, { month: Month.NOVEMBER }))
    })

    it('wraps to january of the next year if the current month is december', () => {
      const { result } = renderHook(() => useCalendar())

      const date = getDate({ month: Month.DECEMBER })

      act(() => result.current.setViewing(date))
      act(() => result.current.viewNextMonth())
      expect(result.current.viewing).toStrictEqual(set(date, { month: Month.JANUARY, year: getYear(date) + 1 }))
    })
  })

  describe('viewYear', () => {
    it('sets the viewing date to the given year', () => {
      const date = getDate({ year: 1999 })

      const { result } = renderHook(() => useCalendar({ viewing: date }))

      act(() => result.current.viewYear(1997))
      expect(result.current.viewing).toStrictEqual(set(date, { year: 1997 }))
    })
  })

  describe('viewPreviousYear', () => {
    it('sets the viewing date to the year before the current', () => {
      const date = getDate({ year: 1999 })

      const { result } = renderHook(() => useCalendar({ viewing: date }))

      act(() => result.current.viewPreviousYear())
      expect(result.current.viewing).toStrictEqual(set(date, { year: 1998 }))
    })
  })

  describe('viewNextYear', () => {
    it('sets the viewing date to the year after the current', () => {
      const date = getDate({ year: 1999 })

      const { result } = renderHook(() => useCalendar({ viewing: date }))

      act(() => result.current.viewNextYear())
      expect(result.current.viewing).toStrictEqual(set(date, { year: 2000 }))
    })
  })
})

describe('selected', () => {
  describe('selected', () => {
    it('returns the dates currently selected', () => {
      const date = getDate()

      const { result } = renderHook(() =>
        useCalendar({
          selected: [date],
        }),
      )

      expect(result.current.selected).toStrictEqual([date])
    })
  })

  describe('clearSelected', () => {
    it('resets the selected dates to []', () => {
      const { result } = renderHook(() => useCalendar())

      const date = getDate()

      act(() => result.current.selectRange(set(date, { date: 1 }), set(date, { date: 5 })))
      expect(result.current.selected.length).toBe(5)

      act(() => result.current.clearSelected())
      expect(result.current.selected.length).toBe(0)
    })
  })

  describe('isSelected', () => {
    it('returns whether or not a date has been selected', () => {
      const date = getDate()

      const { result } = renderHook(() =>
        useCalendar({
          selected: [date],
        }),
      )

      expect(result.current.isSelected(date)).toBe(true)
    })
  })

  describe('select', () => {
    it('selects a date', () => {
      const { result } = renderHook(() => useCalendar())

      const date = getDate()

      act(() => result.current.select(date))
      expect(result.current.isSelected(date)).toBe(true)
    })

    it('selects multiple dates', () => {
      const { result } = renderHook(() => useCalendar())

      const dateOne = getDate({ date: 1 })
      const dateTwo = getDate({ date: 2 })

      act(() => result.current.select([dateOne, dateTwo]))
      expect(result.current.isSelected(dateOne)).toBe(true)
      expect(result.current.isSelected(dateTwo)).toBe(true)
    })
  })

  describe('deselect', () => {
    it('deselects a date', () => {
      const { result } = renderHook(() => useCalendar())

      const date = getDate()

      act(() => result.current.select(date))
      act(() => result.current.deselect(date))
      expect(result.current.isSelected(date)).toBe(false)
    })

    it('deselects multiple dates', () => {
      const { result } = renderHook(() => useCalendar())

      const dateOne = getDate({ date: 1 })
      const dateTwo = getDate({ date: 2 })

      act(() => result.current.select([dateOne, dateTwo]))
      act(() => result.current.deselect([dateOne, dateTwo]))
      expect(result.current.isSelected(dateOne)).toBe(false)
      expect(result.current.isSelected(dateTwo)).toBe(false)
    })
  })

  describe('toggle', () => {
    it('toggles the selection of a date', () => {
      const { result } = renderHook(() => useCalendar())

      const date = getDate()

      act(() => result.current.toggle(date))
      expect(result.current.isSelected(date)).toBe(true)

      act(() => result.current.toggle(date))
      expect(result.current.isSelected(date)).toBe(false)
    })
  })

  describe('selectRange', () => {
    it('selects a range of dates (inclusive)', () => {
      const { result } = renderHook(() => useCalendar())

      const date = getDate()

      const first = set(date, { date: 1 })
      const second = set(date, { date: 2 })
      const third = set(date, { date: 3 })

      act(() => result.current.selectRange(first, third))

      expect(result.current.selected.length).toBe(3)
      expect(result.current.isSelected(first)).toBe(true)
      expect(result.current.isSelected(second)).toBe(true)
      expect(result.current.isSelected(third)).toBe(true)
    })
  })

  describe('deselectRange', () => {
    it('deselects a range of dates (inclusive)', () => {
      const { result } = renderHook(() => useCalendar())

      const date = getDate()

      act(() => result.current.selectRange(set(date, { date: 1 }), set(date, { date: 3 })))
      act(() => result.current.deselectRange(set(date, { date: 1 }), set(date, { date: 3 })))

      expect(result.current.selected.length).toBe(0)
      expect(result.current.isSelected(set(date, { date: 1 }))).toBe(false)
      expect(result.current.isSelected(set(date, { date: 2 }))).toBe(false)
      expect(result.current.isSelected(set(date, { date: 3 }))).toBe(false)
    })
  })
})

describe('calendar', () => {
  it('returns a matrix of days based on the current viewing date', () => {
    const { result } = renderHook(() => useCalendar({ viewing: new Date(1582, Month.OCTOBER, 1) }))

    expect(result.current.calendar![0][0][0]).toStrictEqual(new Date(1582, Month.SEPTEMBER, 26))
    expect(result.current.calendar![0][0][5]).toStrictEqual(new Date(1582, Month.OCTOBER, 1))
    expect(result.current.calendar![0][5][6]).toStrictEqual(new Date(1582, Month.NOVEMBER, 6))
  })

  it('supports returning multiple months', () => {
    const { result } = renderHook(() => useCalendar({ viewing: new Date(1582, Month.OCTOBER, 1), numberOfMonths: 2 }))

    expect(result.current.calendar![0][0][0]).toStrictEqual(new Date(1582, Month.SEPTEMBER, 26))
    expect(result.current.calendar![1][0][0]).toStrictEqual(new Date(1582, Month.OCTOBER, 31))
  })
})

it('should format a date using the provided timezone', () => {
  const sampleDate = new Date('2020-01-01T12:00:00Z')
  // Initialize the hook with a specific timezone.
  const { result } = renderHook(() => useCalendar({ timezone: 'Asia/Dubai' }))
  const formattedDate = result.current.formatDate(sampleDate)
  // Check that the formatted string contains expected parts.
  expect(formattedDate).toContain('2020')
  expect(formattedDate).toContain('Jan')
})

it('should allow updating the timezone', () => {
  const { result } = renderHook(() => useCalendar({ timezone: 'Europe/Moscow' }))
  // Update the timezone.
  act(() => {
    result.current.setTimezone('America/New_York')
  })
  expect(result.current.timezone).toBe('America/New_York')
})

it('should not allow selecting a date earlier than minSelectableDate', () => {
  const minSelectable = getDate({ year: 2020, month: Month.JANUARY, date: 10 })
  const { result } = renderHook(() => useCalendar({ minSelectableDate: minSelectable }))
  const dateTooEarly = getDate({ year: 2020, month: Month.JANUARY, date: 5 })

  act(() => {
    result.current.select(dateTooEarly)
  })
  // The date should not be selected and an error message must be set.
  expect(result.current.isSelected(dateTooEarly)).toBe(false)
  expect(result.current.error).toBe('One or more selected dates are out of range or disabled.')
})

it('should not allow selecting a date later than maxSelectableDate', () => {
  // Set maximum selectable date to 10 days from today.
  const maxSelectable = addDays(startOfToday(), 10)
  const { result } = renderHook(() => useCalendar({ maxSelectableDate: maxSelectable }))
  const dateTooLate = addDays(startOfToday(), 15)

  act(() => {
    result.current.select(dateTooLate)
  })
  // The date should be rejected.
  expect(result.current.isSelected(dateTooLate)).toBe(false)
  expect(result.current.error).toBe('One or more selected dates are out of range or disabled.')
})

it('should block selection of a range longer than maxRangeDays', () => {
  const maxRangeDays = 5
  const { result } = renderHook(() => useCalendar({ maxRangeDays }))
  const rangeStart = getDate({ year: 2020, month: Month.FEBRUARY, date: 1 })
  const rangeEnd = getDate({ year: 2020, month: Month.FEBRUARY, date: 10 }) // 10 days range

  act(() => {
    result.current.selectRange(rangeStart, rangeEnd)
  })
  // No dates should be selected and an error must be set.
  expect(result.current.selected.length).toBe(0)
  expect(result.current.error).toBe('Cannot select more than 5 days.')
})

it('should allow selection of a range within maxRangeDays', () => {
  const maxRangeDays = 10
  const { result } = renderHook(() => useCalendar({ maxRangeDays }))
  const rangeStart = getDate({ year: 2020, month: Month.MARCH, date: 1 })
  const rangeEnd = getDate({ year: 2020, month: Month.MARCH, date: 5 }) // 5-day range

  act(() => {
    result.current.selectRange(rangeStart, rangeEnd)
  })
  // The range should be accepted.
  expect(result.current.selected.length).toBe(5)
  expect(result.current.error).toBeNull()
})

it('should return predefined info for a given date', () => {
  const infoDate = getDate({ year: 2020, month: Month.APRIL, date: 15 })
  const dateInfo = [{ date: infoDate, message: 'Holiday', disabled: true }]
  const { result } = renderHook(() => useCalendar({ dateInfo }))
  const info = result.current.getDateInfo(infoDate)
  expect(info).toEqual({ message: 'Holiday', disabled: true })
})

it('should not allow selecting a date marked as disabled', () => {
  const disabledDate = getDate({ year: 2020, month: Month.MAY, date: 20 })
  const dateInfo = [{ date: disabledDate, message: 'Disabled Date', disabled: true }]
  const { result } = renderHook(() => useCalendar({ dateInfo }))

  act(() => {
    result.current.select(disabledDate)
  })
  // The disabled date should not be selected.
  expect(result.current.isSelected(disabledDate)).toBe(false)
  expect(result.current.error).toBe('One or more selected dates are out of range or disabled.')
})

describe("Weekend Disabling Feature", () => {
  it("should mark a Saturday as disabled", () => {
    // June 6, 2020 was a Saturday.
    const saturday = set(new Date(), { year: 2020, month: Month.JUNE, date: 6, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    const { result } = renderHook(() => useCalendar({ disableWeekends: true }));
    const info = result.current.getDateInfo(saturday);
    expect(info).toEqual({ message: "Weekends are disabled", disabled: true });
  });

  it("should mark a Sunday as disabled", () => {
    // June 7, 2020 was a Sunday.
    const sunday = set(new Date(), { year: 2020, month: Month.JUNE, date: 7, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    const { result } = renderHook(() => useCalendar({ disableWeekends: true }));
    const info = result.current.getDateInfo(sunday);
    expect(info).toEqual({ message: "Weekends are disabled", disabled: true });
  });

  it("should allow selection of a weekday", () => {
    // June 3, 2020 was a Wednesday.
    const wednesday = set(new Date(), { year: 2020, month: Month.JUNE, date: 3, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    const { result } = renderHook(() => useCalendar({ disableWeekends: true }));
    const info = result.current.getDateInfo(wednesday);
    // No info is returned for a weekday (i.e. undefined means not disabled)
    expect(info).toBeUndefined();

    // Try selecting the weekday.
    act(() => {
      result.current.select(wednesday);
    });
    expect(result.current.isSelected(wednesday)).toBe(true);
  });

  it("should prevent selection of a weekend day", () => {
    // Use a Saturday date.
    const saturday = set(new Date(), { year: 2020, month: Month.JUNE, date: 6, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    const { result } = renderHook(() => useCalendar({ disableWeekends: true }));
    act(() => {
      result.current.select(saturday);
    });
    // The Saturday should not be selected.
    expect(result.current.isSelected(saturday)).toBe(false);
    // An appropriate error message should be set.
    expect(result.current.error).toBe("One or more selected dates are out of range or disabled.");
  });
});