import React, { createContext, useContext } from 'react'
import { useCalendar } from './useCalendar'

export type CalendarContextType = ReturnType<typeof useCalendar> & {
  maxRangeDays: number // Added to support range limitation
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export const CalendarProvider: React.FC<{
  children: React.ReactNode
  options?: Parameters<typeof useCalendar>[0] & { maxRangeDays?: number }
}> = ({ children, options }) => {
  const calendarProps = useCalendar(options)

  const value: CalendarContextType = {
    ...calendarProps,
  }

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
}

export const useCalendarContext = () => {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('useCalendarContext must be used within a CalendarProvider')
  }
  return context
}
