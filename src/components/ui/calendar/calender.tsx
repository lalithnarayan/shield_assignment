import { CalendarProvider } from './calendarContext'
import { RangeSelectContent } from './rangePicker'
import { Options as CalendarOptions } from './useCalendar'

type RangeSelectProps = CalendarOptions

const RangeSelect: React.FC<RangeSelectProps> = (props) => {
  return (
    <CalendarProvider options={props}>
      <RangeSelectContent />
    </CalendarProvider>
  )
}

export default RangeSelect
