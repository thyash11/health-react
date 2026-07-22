import React, { useEffect, useRef, useState } from "react";
import { Check, Clock3 } from "lucide-react";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const HOURS = Array.from({ length: 12 }, (_, index) => String(index + 1));
const MINUTES = Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, "0"));

const parseTime = (value: string) => {
  const match = /^(1[0-2]|[1-9]):([0-5]\d)\s?(AM|PM)$/i.exec(value.trim());
  return match
    ? { hour: match[1], minute: match[2], period: match[3].toUpperCase() }
    : { hour: "10", minute: "30", period: "AM" };
};

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const parsed = parseTime(value);

  const update = (part: Partial<typeof parsed>) => {
    const next = { ...parsed, ...part };
    onChange(`${next.hour}:${next.minute} ${next.period}`);
  };

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-left text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <span>{value}</span>
        <Clock3 className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <div role="dialog" aria-label="Choose time" className="absolute left-0 z-30 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-2">
            <label className="text-[11px] font-medium text-slate-500">
              Hour
              <select value={parsed.hour} onChange={(event) => update({ hour: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-900">
                {HOURS.map((hour) => <option key={hour}>{hour}</option>)}
              </select>
            </label>
            <label className="text-[11px] font-medium text-slate-500">
              Minute
              <select value={parsed.minute} onChange={(event) => update({ minute: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-900">
                {MINUTES.map((minute) => <option key={minute}>{minute}</option>)}
              </select>
            </label>
            <label className="text-[11px] font-medium text-slate-500">
              Period
              <select value={parsed.period} onChange={(event) => update({ period: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-900">
                <option>AM</option>
                <option>PM</option>
              </select>
            </label>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">
            <Check className="h-3.5 w-3.5" /> Done
          </button>
        </div>
      )}
    </div>
  );
};
