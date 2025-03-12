import React, { createContext, useContext, useState } from 'react'
import { useCalendar } from './useCalendar'

export type CalendarContextType = ReturnType<typeof useCalendar> & {
  hoveredDate: Date | null
  maxRangeDays: number // Added to support range limitation
  setHoveredDate: React.Dispatch<React.SetStateAction<Date | null>>
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export const CalendarProvider: React.FC<{
  children: React.ReactNode
  options?: Parameters<typeof useCalendar>[0] & { maxRangeDays?: number }
}> = ({ children, options }) => {
  const calendarProps = useCalendar(options)

  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

  const value: CalendarContextType = {
    ...calendarProps,
    hoveredDate,
    setHoveredDate,
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
