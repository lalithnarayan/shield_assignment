import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { compareAsc, eachDayOfInterval, format, isToday } from 'date-fns'
import React, { useMemo } from 'react'
import { useCalendarContext } from './calendarContext'

interface DateCellProps {
  day: Date
  panelMonth: number
}

const DateCell: React.FC<DateCellProps> = ({ day, panelMonth }) => {
  const isOutsideMonth = day.getMonth() !== panelMonth

  const {
    isSelected,
    selected,
    getDateInfo,
    isDateSelectable,
    hoveredDate,
    setHoveredDate,
    select,
    selectRange,
    clearTime,
    deselectRange,
    maxRangeDays,
  } = useCalendarContext()

  const info = getDateInfo(day)
  const disabled = info?.disabled

  // Compute whether the cell is part of a preview range during dragging.
  const inPreviewRange = useMemo(() => {
    if ( !hoveredDate) return false
    const [startDate] = selected;
    const [start, end] = [startDate, hoveredDate].sort(compareAsc)
    return eachDayOfInterval({ start: clearTime(start), end: clearTime(end) }).some(
      (d) => d.getTime() === clearTime(day).getTime() && isDateSelectable(d),
    )
  }, [hoveredDate, day, isDateSelectable])


  const rangeExceedsMax = useMemo(() => {
    if (selected.length !== 1) return false
    const start = selected[0]
    // Determine the range in order (from earlier to later).
    const [startDate, endDate] = compareAsc(day, start) < 0 ? [day, start] : [start, day]
    const daysInRange = eachDayOfInterval({
      start: clearTime(startDate),
      end: clearTime(endDate),
    }).filter((d) => isDateSelectable(d))
    return daysInRange.length > maxRangeDays
  }, [selected, day, maxRangeDays, clearTime, isDateSelectable])

  // Compute dynamic CSS classes for the cell.
  const classes = useMemo(
    () =>
      [
        'p-2 text-center rounded cursor-pointer transition-colors',
        disabled ? 'opacity-30 cursor-not-allowed text-gray-400' : 'hover:bg-gray-100',
        isToday(day) ? 'border border-blue-500' : '',
        isSelected(day) && !disabled ? 'bg-blue-500 text-white' : '',
        inPreviewRange && !isSelected(day) ? 'bg-blue-400/20' : '',
      ].join(' '),
    [day, disabled, isSelected, inPreviewRange],
  )

  const selectCell = () => {
    if (disabled || !isDateSelectable(day)) return

    if (selected.length === 0) {
      // Single selection: select the clicked day.
      select(day)
    } else if (selected.length === 1) {
      // Range selection: first, check if adding this day exceeds the allowed range.
      if (rangeExceedsMax) return
      const start = selected[0]
      if (compareAsc(day, start) < 0) {
        selectRange(day, start, true)
      } else {
        selectRange(start, day, true)
      }
    } else {
      // More than one date selected: reset and start over.
      deselectRange()
      select(day)
    }
  }

  // Mouse click event for selection.
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    selectCell()
  }

  // Keyboard event (Enter key) for accessibility.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      selectCell()
    }
  }
  
  // Update hovered date to trigger the preview highlighting.
  const handleDateHover = () => {
    if (!disabled && selected.length === 1) {
      setHoveredDate(day)
    }
  }

  // Render an empty placeholder for out-of-month cells.
  if (isOutsideMonth) {
    return <div className="p-2" />
  }

  const cellContent = (
    <div
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-disabled={disabled}
      aria-label={`Date: ${format(day, 'PPP')} ${disabled ? '(Disabled)' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseOver={handleDateHover}
      className={classes}
    >
      <span className="text-sm">{format(day, 'dd')}</span>
    </div>
  )
  const tooltipMessage = rangeExceedsMax ? `Cannot select beyond ${maxRangeDays} days` : info?.message
  return tooltipMessage ? (
    <Tooltip>
      <TooltipTrigger asChild>{cellContent}</TooltipTrigger>
      <TooltipContent side="top" className="px-2 py-1 bg-black text-white text-xs rounded">
        {tooltipMessage}
      </TooltipContent>
    </Tooltip>
  ) : (
    cellContent
  )
}

export default DateCell
