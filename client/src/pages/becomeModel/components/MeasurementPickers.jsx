import { useEffect, useRef, useState } from "react";

const quarterFractions = [
  { label: "1/4", value: ".25" },
  { label: "1/2", value: ".5" },
  { label: "3/4", value: ".75" },
];

export const QuarterMeasurementPicker = ({ label, value, onSelect, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-lg px-4 py-3 border border-gray-300 bg-white text-sm font-medium text-left flex items-center justify-between transition-all duration-200 hover:border-gray-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10"
      >
        <span
          className={
            value ? "text-gray-700 text-sm font-medium" : "text-gray-400 uppercase tracking-wide text-sm font-medium"
          }
        >
          {value || label}
        </span>

        <svg
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[330px] max-h-[520px] overflow-y-auto bg-white border border-gray-300 shadow-xl rounded-lg p-3">
          <div className="space-y-1.5">
            {options.map((num) => (
              <div
                key={num}
                className="grid grid-cols-[56px_14px_1fr] gap-2 items-center"
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelect(String(num));
                    setOpen(false);
                  }}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-sm font-medium min-w-[56px] leading-none hover:bg-gray-100 transition-colors text-gray-700"
                >
                  {num}
                </button>

                <div className="text-sm text-center">+</div>

                <div className="flex gap-1 flex-nowrap overflow-x-auto">
                  {quarterFractions.map((fraction) => (
                    <button
                      key={fraction.label}
                      type="button"
                      onClick={() => {
                        onSelect(`${num}${fraction.value}`);
                        setOpen(false);
                      }}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-xs font-medium min-w-[42px] whitespace-nowrap leading-none hover:bg-gray-100 transition-colors text-gray-700"
                    >
                      {fraction.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const HalfMeasurementPicker = ({ label, value, onSelect, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-lg px-4 py-3 border border-gray-300 bg-white text-sm font-medium text-left flex items-center justify-between transition-all duration-200 hover:border-gray-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10"
      >
        <span
          className={
            value ? "text-gray-700 text-sm font-medium" : "text-gray-400 uppercase tracking-wide text-sm font-medium"
          }
        >
          {value || label}
        </span>

        <svg
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[220px] max-h-[520px] overflow-y-auto bg-white border border-gray-300 shadow-xl rounded-lg p-3">
          <div className="space-y-1.5">
            {options.map((num) => (
              <div
                key={num}
                className="grid grid-cols-[1fr_56px] gap-2 items-center"
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelect(String(num));
                    setOpen(false);
                  }}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-sm font-medium leading-none hover:bg-gray-100 transition-colors text-gray-700"
                >
                  {num}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelect(`${num}.5`);
                    setOpen(false);
                  }}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-sm font-medium leading-none hover:bg-gray-100 transition-colors text-gray-700"
                >
                  0.5
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const SimplePopupSelect = ({ label, value, options, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-lg px-4 py-3 border border-gray-300 bg-white text-sm font-medium text-left flex items-center justify-between transition-all duration-200 hover:border-gray-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10"
      >
        <span
          className={
            value ? "text-gray-700 text-sm font-medium" : "text-gray-400 uppercase tracking-wide text-sm font-medium"
          }
        >
          {value || label}
        </span>

        <svg
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[300px] max-h-[520px] overflow-y-auto bg-white border border-gray-300 shadow-xl rounded-lg p-3">
          <div className="space-y-1.5">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onSelect(option);
                  setOpen(false);
                }}
                className="w-full border rounded-lg px-3 py-1.5 text-sm font-medium text-left transition-colors hover:bg-gray-100 border-gray-300 text-gray-700"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
