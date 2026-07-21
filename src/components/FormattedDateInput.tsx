import React from "react";
import { formatDateForDisplay } from "../utils/nutritionCalculator";

interface FormattedDateInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  ariaLabel?: string;
}

export const FormattedDateInput: React.FC<FormattedDateInputProps> = ({
  value,
  onChange,
  className = "",
  ariaLabel = "Select date",
}) => (
  <label
    className={`relative block cursor-pointer focus-within:ring-2 focus-within:ring-blue-500/20 ${className}`}
  >
    <span aria-hidden="true">{formatDateForDisplay(value)}</span>
    <input
      type="date"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={ariaLabel}
      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
    />
  </label>
);
