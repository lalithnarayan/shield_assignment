import React from 'react'
import DayCell from './dayCell'

interface WeekRowProps {
  week: Date[]
  panelMonth: number
  onSelect: (date: Date) => void
}

const WeekRow: React.FC<WeekRowProps> = ({ week, panelMonth, onSelect }) => {
  return (
    <div className="grid grid-cols-7 mb-1">
      {week.map((day, idx) => (
        <DayCell key={idx} day={day} panelMonth={panelMonth} />
      ))}
    </div>
  )
}

export default WeekRow
