import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { addDays, compareAsc, eachDayOfInterval, format, isToday } from 'date-fns'
import React from 'react'
import { toast } from 'react-toastify'
import { useCalendarContext } from './calendarContext'

interface DateCellProps {
  day: Date
  panelMonth: number
}

const DateCell: React.FC<DateCellProps> = ({ day, panelMonth }) => {
  const {
    isSelected,
    selected,
    getDateInfo,
    isDateSelectable,
    isDragging,
    draggingStartDate,
    hoveredDate,
    setIsDragging,
    setDraggingStartDate,
    setHoveredDate,
    select,
    selectRange,
    clearTime,
    deselect,
    deselectRange,
    maxRangeDays,
    timezone,
  } = useCalendarContext()

  // Render an empty cell if the day is not in the current panel's month.
  if (day.getMonth() !== panelMonth) {
    return <div className="p-2" />
  }

  const info = getDateInfo(day)
  const disabled = info?.disabled

  // Determine if this day is in the preview range.
  let inPreviewRange = false
  if (isDragging && draggingStartDate && hoveredDate) {
    const [start, end] = [draggingStartDate, hoveredDate].sort(compareAsc)
    const interval = eachDayOfInterval({ start: clearTime(start), end: clearTime(end) })
    inPreviewRange = interval.some((d) => d.getTime() === clearTime(day).getTime() && isDateSelectable(d))
  }

  // Base styling.
  const baseClasses = 'p-2 text-center rounded cursor-pointer transition-colors'
  const disabledClasses = disabled ? 'opacity-30 cursor-not-allowed text-gray-400' : 'hover:bg-gray-100'
  const todayClasses = isToday(day) ? 'border border-blue-500' : ''
  const selectedClasses = isSelected(day) && !disabled ? 'bg-blue-500 text-white' : ''
  // Apply preview styling if in drag range and not already selected.
  const previewClasses = inPreviewRange && !isSelected(day) ? 'border border-dotted border-blue-400 bg-blue-400/20' : ''

  const classes = `${baseClasses} ${disabledClasses} ${todayClasses} ${selectedClasses} ${previewClasses}`

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault() // Prevent the default browser behavior (e.g., form submission)
    if (disabled || !isDateSelectable(day)) return // Check if the day is disabled or not selectable

    // const localDay = toZonedTime(day, timezone);
    const localDay = day
    switch (selected.length) {
      case 0:
        // Start a new range with the clicked day
        select(localDay)
        break
      case 1:
        // One day is already selected
        if (isSelected(localDay)) {
          // If the same day is clicked again, deselect it
          deselect(localDay)
        } else {
          // If the clicked day is before the currently selected date
          if (compareAsc(localDay, selected[0]) < 0) {
            // Set the clicked day as the new start, and the previously selected day as the end
            selectRange(localDay, selected[0], true)
          } else {
            // Complete the range by selecting the end day
            selectRange(selected[0], localDay, true)
          }
        }
        break
      case 2:
        // Two dates are already selected
        if (compareAsc(localDay, selected[0]) < 0) {
          // Clicked day is before the first selected date
          if (compareAsc(addDays(selected[0], maxRangeDays - 1), day) < 0) {
            toast(`Cannot select more than ${maxRangeDays} days.`)
            return
          }
          deselectRange()
          selectRange(localDay, selected[1], true)
        } else if (compareAsc(localDay, selected[1]) > 0) {
          // Clicked day is after the last selected date
          if (compareAsc(localDay, addDays(selected[0], maxRangeDays - 1)) > 0) {
            toast(`Cannot select more than ${maxRangeDays} days.`)
            return
          }
          deselectRange()
          selectRange(selected[0], localDay, true)
        }
        break
      default:
        // More than two dates somehow selected, or an error state—reset
        deselectRange()
        select(localDay)
        break
    }
  }

  const cellContent = (
    <div onClick={handleClick} className={classes}>
      <span className="text-sm">{format(day, 'dd')}</span>
    </div>
  )

  if (disabled && info?.message) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{cellContent}</TooltipTrigger>
        <TooltipContent side="top" className="px-2 py-1 bg-black text-white text-xs rounded">
          {info.message}
        </TooltipContent>
      </Tooltip>
    )
  }

  return cellContent
}

export default DateCell
