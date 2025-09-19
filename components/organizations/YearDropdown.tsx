import React, { useState, useRef, useEffect } from "react";

const YearDropdown = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const years = Array.from(
    { length: new Date().getFullYear() - 1900 + 1 },
    (_, i) => (new Date().getFullYear() - i).toString()
  );

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium mb-2">Founded Year</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-10 px-3 border rounded-md dark:bg-gray-700 dark:text-white text-left"
      >
        {value || "Select year"}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-[150px] overflow-y-auto border rounded-md bg-white dark:bg-gray-700 shadow">
          {years.map((year) => (
            <div
              key={year}
              onClick={() => {
                onChange(year);
                setOpen(false);
              }}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${
                value === year ? "bg-gray-200 dark:bg-gray-600 font-medium" : ""
              }`}
            >
              {year}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YearDropdown;
