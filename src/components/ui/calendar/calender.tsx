import { CalendarProvider } from "./calendarContext";
import { RangeSelectContent } from "./rangePicker";
import { Options as CalendarOptions } from "./useCalendar";

interface RangeSelectProps extends CalendarOptions {
    onRangeSelect?: (start: Date, end: Date) => void;
}

const RangeSelect: React.FC<RangeSelectProps> = ({onRangeSelect, ...props}) => {
  return (
    <CalendarProvider options={props}>
      <RangeSelectContent onRangeSelect={onRangeSelect} />
    </CalendarProvider>
  );
};

export default RangeSelect;
