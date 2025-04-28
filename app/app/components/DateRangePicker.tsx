import { Calendar } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function DateRangePicker() {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1">
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <button
        onClick={() => setOpen(!open)}
        className="border border-gray-300 px-4 py-2 rounded-lg pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
      >
        {`${formatDate(dateRange[0].startDate)} - ${formatDate(dateRange[0].endDate)}`}
      </button>

      {open && (
        <div className="absolute z-50 mt-2" ref={calendarRef}>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            minDate={new Date()}
            rangeColors={["#2563eb"]}
            direction="horizontal"
          />
        </div>
      )}
    </div>
  );
}

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses empiezan en 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};