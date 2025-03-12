import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { compareAsc, eachDayOfInterval, format, isToday } from 'date-fns'
import React, { useMemo } from 'react'
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
    setHoveredDate,
    select,
    selectRange,
    clearTime,
    deselect,
    deselectRange,
    maxRangeDays,
  } = useCalendarContext()

  const info = getDateInfo(day)
  const disabled = info?.disabled
  const inPreviewRange = useMemo(() => {
    if (!isDragging || !draggingStartDate || !hoveredDate) return false
    const [start, end] = [draggingStartDate, hoveredDate].sort(compareAsc)
    return eachDayOfInterval({ start: clearTime(start), end: clearTime(end) }).some(
      (d) => d.getTime() === clearTime(day).getTime() && isDateSelectable(d),
    )
  }, [isDragging, draggingStartDate, hoveredDate, day, isDateSelectable])

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

  if (day.getMonth() !== panelMonth) return <div className="p-2" />

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault()
    if (disabled || !isDateSelectable(day)) return

    if (selected.length === 0) {
      select(day)
    } else if (selected.length === 1) {
      handleRangeSelection(day)
    } else {
      // 🔥 Fix: Reset selection properly before selecting a new date
      deselectRange()
      select(day)
    }
  }

  const handleRangeSelection = (localDay: Date) => {
    if (selected.length === 2) {
      // 🔥 Fix: Instead of selecting a new range, first reset selection
      deselectRange()
      select(localDay)
      return
    }

    if (selected.length === 1) {
      const start = selected[0]

      if (compareAsc(localDay, start) < 0) {
        selectRange(localDay, start, true)
      } else {
        selectRange(start, localDay, true)
      }
    }
  }

  const handleDateHover = () => !disabled && selected.length === 1 && setHoveredDate(day)

  const cellContent = (
    <div
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-disabled={disabled}
      aria-label={`Date: ${format(day, 'PPP')} ${disabled ? '(Disabled)' : ''}`}
      onClick={handleClick}
      // onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
      className={classes}
      // onMouseDown={handleClick}
      // onMouseOver={handleDateHover}
    >
      <span className="text-sm">{format(day, 'dd')}</span>
    </div>
  )
  console.log(selected)
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
