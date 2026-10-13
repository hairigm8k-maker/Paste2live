import { forwardRef, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, className = "", id, ...rest },
  ref
) {
  const inputId = id || rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#0b3558]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        {...rest}
        className={
          "w-full rounded-[8px] border bg-white px-3 py-2.5 text-[15px] text-[#0b3558] placeholder:text-[#a6bbd1] focus:outline-none focus:ring-2 focus:ring-[#006bff] focus:border-[#006bff] transition " +
          (error ? "border-[#d92d20] " : "border-[#d4e0ed] ") + className
        }
      />
      {error && <span className="text-xs text-[#d92d20]">{error}</span>}
    </div>
  );
});
