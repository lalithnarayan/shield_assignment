import React from "react";
import { addMonths, startOfMonth, getDay, format } from "date-fns";
import WeekRow from "./weekRow";
import { useCalendarContext } from "./calendarContext";

interface MonthPanelProps {
  monthData: Date[][];
  monthOffset: number;
  onSelect: (date: Date) => void;
  selected: Date[];
}

const MonthPanel: React.FC<MonthPanelProps> = ({ monthData, monthOffset, onSelect }) => {
  const { viewing } = useCalendarContext();

  const panelDate = addMonths(startOfMonth(viewing), monthOffset);
  const panelMonth = panelDate.getMonth();

  return (
    <div className="w-full">
      {/* Day Labels */}
      <div className="grid grid-cols-7 text-center mb-1">
        {monthData[0].map((day, idx) => (
          <div key={idx} className="text-sm font-semibold">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][getDay(day)]}
          </div>
        ))}
      </div>
      {/* Weeks */}
      {monthData.map((week, idx) => (
        <WeekRow key={idx} week={week} panelMonth={panelMonth} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default MonthPanel;
