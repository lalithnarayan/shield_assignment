import React from 'react'
import { format } from 'date-fns'
import { IoChevronBackSharp, IoChevronForwardSharp } from 'react-icons/io5'
import { useCalendarContext } from './calendarContext'

const CalendarNavigation: React.FC = () => {
  const { viewing, viewPreviousMonth, viewNextMonth } = useCalendarContext()

  return (
    <div className="flex items-center justify-between mb-4">
      <button aria-label="Previous Month" onClick={viewPreviousMonth} className="p-2 rounded hover:bg-gray-200">
        <IoChevronBackSharp />
      </button>
      <span className="text-lg font-medium">{format(viewing, 'MMMM yyyy')}</span>
      <button aria-label="Next Month" onClick={viewNextMonth} className="p-2 rounded hover:bg-gray-200">
        <IoChevronForwardSharp />
      </button>
    </div>
  )
}

export default CalendarNavigation
