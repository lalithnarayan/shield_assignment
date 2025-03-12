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
    isDragging,
    draggingStartDate,
    hoveredDate,
    setHoveredDate,
    select,
    selectRange,
    clearTime,
    deselectRange,
  } = useCalendarContext()

  const info = getDateInfo(day)
  const disabled = info?.disabled

  // Compute whether the cell is part of a preview range during dragging.
  const inPreviewRange = useMemo(() => {
    if (!isDragging || !draggingStartDate || !hoveredDate) return false
    const [start, end] = [draggingStartDate, hoveredDate].sort(compareAsc)
    return eachDayOfInterval({ start: clearTime(start), end: clearTime(end) }).some(
      (d) => d.getTime() === clearTime(day).getTime() && isDateSelectable(d),
    )
  }, [isDragging, draggingStartDate, hoveredDate, day, isDateSelectable])

  // Compute dynamic CSS classes for the cell.
  const classes = useMemo(
    () =>
      [
        'p-2 text-center rounded cursor-pointer transition-colors',
        disabled ? 'opacity-30 cursor-not-allowed text-gray-400' : 'hover:bg-gray-100',
        isToday(day) ? 'border border-blue-500' : '',
        isSelected(day) && !disabled ? 'bg-blue-500 text-white' : '',
        inPreviewRange && !isSelected(day) ? 'border border-dotted border-blue-400 bg-blue-400/20' : '',
      ].join(' '),
    [day, disabled, isSelected, inPreviewRange],
  )

  // Handle click events to select dates or ranges.
  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault()
    if (disabled || !isDateSelectable(day)) return

    if (selected.length === 0) {
      select(day)
    } else if (selected.length === 1) {
      // Range selection: compare the new day with the already selected day.
      const start = selected[0]
      if (compareAsc(day, start) < 0) {
        selectRange(day, start, true)
      } else {
        selectRange(start, day, true)
      }
    } else {
      // Reset selection if more than one date is selected.
      deselectRange()
      select(day)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (disabled || !isDateSelectable(day)) return

      if (selected.length === 0) {
        select(day)
      } else if (selected.length === 1) {
        // Range selection: compare the new day with the already selected day.
        const start = selected[0]
        if (compareAsc(day, start) < 0) {
          selectRange(day, start, true)
        } else {
          selectRange(start, day, true)
        }
      } else {
        // Reset selection if more than one date is selected.
        deselectRange()
        select(day)
      }
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

  return info?.message ? (
    <Tooltip>
      <TooltipTrigger asChild>{cellContent}</TooltipTrigger>
      <TooltipContent side="top" className="px-2 py-1 bg-black text-white text-xs rounded">
        {info.message}
      </TooltipContent>
    </Tooltip>
  ) : (
    cellContent
  )
}

export default DateCell
