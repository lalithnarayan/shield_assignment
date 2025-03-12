import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../select'
import { useCalendarContext } from './calendarContext'

function TimezoneSelect() {
  const { timezones, timezone, setTimezone } = useCalendarContext()

  const handleTimezoneChange = (selectedTimeZone: string) => {
    setTimezone(selectedTimeZone)
  }

  return (
    <Select onValueChange={handleTimezoneChange} defaultValue={timezone}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a timeZone" />
      </SelectTrigger>
      <SelectContent className="my-2">
        <SelectGroup>
          {timezones?.map((tz: { offset: string; name: string }) => (
            <SelectItem value={tz.name} key={`${tz.name}${tz.offset}`}>
              {tz.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default TimezoneSelect
