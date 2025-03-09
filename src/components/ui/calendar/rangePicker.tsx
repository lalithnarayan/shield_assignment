// RangeSelect.tsx
import * as Popover from "@radix-ui/react-popover";
import { compareAsc, eachDayOfInterval, format } from "date-fns";
import React, { useEffect } from "react";
import { IoArrowForwardSharp, IoCalendarClearSharp } from "react-icons/io5";
import { useCalendarContext } from "./calendarContext";
import CalendarNavigation from "./calendarNavigation";
import MonthPanel from "./monthPanel";
import { toast, ToastContainer } from "react-toastify";


// Inner component that consumes the CalendarContext
export const RangeSelectContent: React.FC = ({onRangeSelect}: {onRangeSelect?: (start: Date, end: Date) => void;}) => {
  const { calendar, select, deselect, isSelected, selectRange, selected, viewToday, error, } = useCalendarContext();
  const [open, setOpen] = React.useState(false);

  const handleSelect = (day: Date) => {
    const sorted = [...selected].sort((a, b) => compareAsc(a, b));
    if (sorted.length === 0) {
      select(day);
    } else if (isSelected(day)) {
      if (selected.length === 1) {
        deselect(day);
      } else {
        const range = eachDayOfInterval({ start: sorted[0], end: day });
        const diff = sorted.filter((d) => range.map((a) => a.getTime()).includes(d.getTime()));
        selectRange(diff[0], diff[diff.length - 1], true);
      }
    } else {
      selectRange(sorted[0], day, true);
    }
  };

  useEffect(() => {
    if(error) {
      console.log(error, selected);
      toast(error);
    }
  },[error])

  return (
    <div className="w-72">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <div className="flex items-center justify-between rounded border border-gray-300 p-2 cursor-pointer">
            <div className="flex items-center">
              {selected.length === 0 ? (
                <span className="pl-2 text-gray-500">Select a Date Range</span>
              ) : (
                <>
                  <span>{format(selected[0], "dd-MMM-yyyy")}</span>
                  <IoArrowForwardSharp className="mx-2 text-blue-400" />
                </>
              )}
              {selected.length > 1 && <span>{format(selected[selected.length - 1], "dd-MMM-yyy")}</span>}
            </div>
            <button aria-label="Open Calendar" onClick={() => setOpen(!open)} className="p-1 focus:outline-none">
              <IoCalendarClearSharp />
            </button>
          </div>
        </Popover.Trigger>
        <Popover.Content className="w-[400px] bg-white shadow-lg rounded p-4">
          {/* Navigation */}
          <CalendarNavigation />
          {/* Calendar Grid */}
          <div className="flex">
            {calendar.map((monthData, idx) => (
              <MonthPanel key={idx} monthData={monthData} monthOffset={idx} onSelect={handleSelect} selected={selected} />
            ))}
          </div>
         
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};



