import type { ReactNode } from "react";

type Variant = "info" | "success" | "warning" | "danger" | "neutral";

const variants: Record<Variant, string> = {
  info: "bg-[#e6f0ff] text-[#004eba]",
  success: "bg-[#e6f7ee] text-[#067647]",
  warning: "bg-[#fff5e6] text-[#b25e09]",
  danger: "bg-[#fee4e2] text-[#b42318]",
  neutral: "bg-[#f0f3f8] text-[#476788]",
};

export function Badge({ children, variant = "neutral" }: { children: ReactNode; variant?: Variant }) {
  return (
    <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " + variants[variant]}>
      {children}
    </span>
  );
}
