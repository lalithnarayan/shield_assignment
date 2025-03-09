import React, { createContext, useContext, useState } from "react";
import { useCalendar } from "./useCalendar"; 

export type CalendarContextType = ReturnType<typeof useCalendar> & {
  isDragging: boolean;
  draggingStartDate: Date | null;
  hoveredDate: Date | null;
  maxRangeDays: number; // Added to support range limitation
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  setDraggingStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setHoveredDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{
  children: React.ReactNode;
  options?: Parameters<typeof useCalendar>[0] & { maxRangeDays?: number };
}> = ({ children, options }) => {
  const calendarProps = useCalendar(options);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [draggingStartDate, setDraggingStartDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const value: CalendarContextType = {
    ...calendarProps,
    isDragging,
    draggingStartDate,
    hoveredDate,
    maxRangeDays: options?.maxRangeDays,
    setIsDragging,
    setDraggingStartDate,
    setHoveredDate,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendarContext must be used within a CalendarProvider");
  }
  return context;
};