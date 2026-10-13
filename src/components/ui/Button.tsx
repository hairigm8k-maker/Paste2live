import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "dark" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "bg-[#006bff] text-white hover:opacity-90 disabled:opacity-50",
  dark: "bg-[#0b3558] text-white hover:opacity-90 disabled:opacity-50",
  ghost: "bg-transparent text-[#0b3558] hover:bg-[#f0f3f8]",
  danger: "bg-[#d92d20] text-white hover:opacity-90 disabled:opacity-50",
  outline: "border border-[#d4e0ed] bg-white text-[#0b3558] hover:bg-[#f0f3f8]",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-[15px]",
  lg: "px-6 py-3 text-[18px]",
};

export function Button({ variant = "primary", size = "md", loading, children, className = "", disabled, ...rest }: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={
        "inline-flex items-center justify-center gap-2 rounded-[8px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bff] focus-visible:ring-offset-2 " +
        variants[variant] + " " + sizes[size] + " " + className
      }
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
